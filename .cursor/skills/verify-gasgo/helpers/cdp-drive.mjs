#!/usr/bin/env node
/**
 * Isolated Chrome CDP driver for GasGo verification.
 * No extra npm deps — Node 22 WebSocket + system Chrome.
 *
 * Usage:
 *   node .cursor/skills/verify-gasgo/helpers/cdp-drive.mjs marketing-landing
 *
 * Env: GASGO_VERIFY_BASE_URL, GASGO_VERIFY_EVIDENCE_DIR, GASGO_VERIFY_RUN_DIR,
 *      GASGO_VERIFY_CDP_PORT, GASGO_VERIFY_CHROME
 */

import { spawn } from "node:child_process";
import { createConnection } from "node:net";
import {
  mkdirSync,
  writeFileSync,
  readFileSync,
  existsSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const skillDir = join(here, "..");
const runDir = process.env.GASGO_VERIFY_RUN_DIR || join(skillDir, ".run");
const evidenceDir =
  process.env.GASGO_VERIFY_EVIDENCE_DIR || join(skillDir, "evidence");
const baseUrl =
  process.env.GASGO_VERIFY_BASE_URL ||
  (existsSync(join(runDir, "base-url"))
    ? readFileSync(join(runDir, "base-url"), "utf8").trim()
    : "http://127.0.0.1:3100");
const cdpPort = Number(
  process.env.GASGO_VERIFY_CDP_PORT ||
    (existsSync(join(runDir, "cdp-port"))
      ? readFileSync(join(runDir, "cdp-port"), "utf8").trim()
      : 33100),
);
const chromeBin =
  process.env.GASGO_VERIFY_CHROME ||
  ["/usr/local/bin/google-chrome", "/usr/bin/google-chrome-stable", "/usr/bin/google-chrome"].find(
    (p) => existsSync(p),
  );

const HEADLINE = "A full cylinder back at the door, before the pot needs it.";
const FILL_TITLE = "What should we fill?";
const PLANT_LINE =
  "We collect your empty, refill it at the plant, and return it filled. Nothing is filled at your door.";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function portOpen(port) {
  return new Promise((resolve) => {
    const sock = createConnection({ host: "127.0.0.1", port }, () => {
      sock.end();
      resolve(true);
    });
    sock.on("error", () => resolve(false));
  });
}

class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.ws.addEventListener("message", (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(JSON.stringify(msg.error)));
        else resolve(msg.result);
      }
    });
  }

  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
}

async function waitForCdp(port, tries = 40) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) return await res.json();
    } catch {
      // still booting
    }
    await sleep(250);
  }
  throw new Error(`Chrome CDP did not answer on ${port}`);
}

async function launchChrome(userDataDir, port) {
  if (!chromeBin) throw new Error("google-chrome not found; set GASGO_VERIFY_CHROME");
  mkdirSync(userDataDir, { recursive: true });
  const child = spawn(
    chromeBin,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--disable-extensions",
      "--disable-background-networking",
      "--disable-sync",
      "--no-first-run",
      "--no-default-browser-check",
      `--remote-debugging-address=127.0.0.1`,
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${userDataDir}`,
      "--window-size=1280,800",
      "about:blank",
    ],
    { stdio: "ignore", detached: true },
  );
  child.unref();
  writeFileSync(join(runDir, "chrome.pid"), String(child.pid));
  writeFileSync(join(runDir, "cdp-port"), String(port));
  return child;
}

async function connectPage(port) {
  const version = await waitForCdp(port);
  const ws = new WebSocket(version.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve);
    ws.addEventListener("error", () => reject(new Error("CDP websocket failed")));
  });
  const cdp = new Cdp(ws);
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  return { cdp, ws };
}

async function evaluate(cdp, expression) {
  const result = await cdp.send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || "evaluate failed");
  }
  return result.result?.value;
}

async function waitForText(cdp, text, timeoutMs = 15000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const found = await evaluate(
      cdp,
      `document.body && document.body.innerText.includes(${JSON.stringify(text)})`,
    );
    if (found) return true;
    await sleep(200);
  }
  throw new Error(`Timed out waiting for text: ${text}`);
}

async function screenshot(cdp, filePath) {
  const { data } = await cdp.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
  });
  writeFileSync(filePath, Buffer.from(data, "base64"));
}

async function clickByText(cdp, text, { exact = false, tag = null } = {}) {
  const clicked = await evaluate(
    cdp,
    `(() => {
      const want = ${JSON.stringify(text)};
      const exact = ${exact ? "true" : "false"};
      const tag = ${JSON.stringify(tag)};
      const nodes = Array.from(document.querySelectorAll("a,button,[role='link'],[role='button']"));
      const el = nodes.find((node) => {
        if (tag && node.tagName.toLowerCase() !== tag) return false;
        const label = (node.innerText || node.getAttribute("aria-label") || "").replace(/\\s+/g, " ").trim();
        return exact ? label === want : label.includes(want);
      });
      if (!el) return false;
      el.click();
      return true;
    })()`,
  );
  if (!clicked) throw new Error(`No clickable control with text "${text}"`);
}

async function dumpState(cdp) {
  return evaluate(
    cdp,
    `({
      href: location.href,
      title: document.title,
      text: document.body ? document.body.innerText.slice(0, 4000) : "",
      session: localStorage.getItem("gasgo-session"),
      draft: localStorage.getItem("gasgo-order-draft"),
      orders: localStorage.getItem("gasgo-customer-orders"),
      admin: localStorage.getItem("gasgo-admin-session"),
    })`,
  );
}

async function driveMarketingLanding({ cdp }) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const prefix = `marketing-landing-${stamp}`;
  const beforeShot = join(evidenceDir, `${prefix}-01-landing.png`);
  const afterShot = join(evidenceDir, `${prefix}-02-fill.png`);
  const beforeJson = join(evidenceDir, `${prefix}-01-landing.json`);
  const afterJson = join(evidenceDir, `${prefix}-02-fill.json`);
  const reportPath = join(evidenceDir, `${prefix}-report.json`);

  await cdp.send("Page.navigate", { url: `${baseUrl}/` });
  await waitForText(cdp, HEADLINE);
  await waitForText(cdp, "Start a refill");

  const before = await dumpState(cdp);
  if (before.session && before.session.includes('"user"') && !before.session.includes('"user":null')) {
    throw new Error(
      "Signed-in session on this origin — / renders AppHome, not MarketingLanding. Use a fresh Chrome profile (helpers launch one).",
    );
  }
  writeFileSync(beforeJson, JSON.stringify(before, null, 2));
  await screenshot(cdp, beforeShot);

  await clickByText(cdp, "Start a refill", { tag: "a" });
  await waitForText(cdp, FILL_TITLE);
  await waitForText(cdp, PLANT_LINE);

  const after = await dumpState(cdp);
  if (!after.href.includes("/order/cylinder")) {
    throw new Error(`Expected /order/cylinder, got ${after.href}`);
  }
  writeFileSync(afterJson, JSON.stringify(after, null, 2));
  await screenshot(cdp, afterShot);

  const report = {
    feature: "marketing-landing",
    harness: "chrome-cdp",
    baseUrl,
    headline: HEADLINE,
    action: "Click the hero Start a refill link",
    before: { href: before.href, screenshot: beforeShot, state: beforeJson },
    after: { href: after.href, screenshot: afterShot, state: afterJson },
    proven: {
      landingHeadline: before.text.includes(HEADLINE),
      fillComposer: after.text.includes(FILL_TITLE),
      route: after.href,
    },
    createdAt: new Date().toISOString(),
  };
  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  writeFileSync(join(evidenceDir, "LAST_PROOF.json"), JSON.stringify(report, null, 2));
  return report;
}

async function main() {
  const feature = process.argv[2] || "marketing-landing";
  if (feature !== "marketing-landing") {
    throw new Error(`Unknown feature '${feature}'. Seeded driver: marketing-landing`);
  }

  mkdirSync(evidenceDir, { recursive: true });
  mkdirSync(runDir, { recursive: true });

  if (!chromeBin) throw new Error("google-chrome not found");
  if (!(await portOpen(new URL(baseUrl).port || 80))) {
    // portOpen on 80 if missing — still try HTTP
  }
  const home = await fetch(`${baseUrl}/`).catch(() => null);
  if (!home || !home.ok) {
    throw new Error(`App not reachable at ${baseUrl}/ — run helpers/launch.sh and helpers/doctor.sh first`);
  }

  if (await portOpen(cdpPort)) {
    throw new Error(
      `CDP port ${cdpPort} already bound. Set GASGO_VERIFY_CDP_PORT or run helpers/cleanup.sh. Do not attach to a shared Chrome.`,
    );
  }

  const userDataDir = join(runDir, "chrome-profile");
  await launchChrome(userDataDir, cdpPort);
  const { cdp, ws } = await connectPage(cdpPort);

  try {
    const report = await driveMarketingLanding({ cdp });
    console.log(JSON.stringify({ ok: true, reportPath: join(evidenceDir, "LAST_PROOF.json"), report }, null, 2));
  } finally {
    try {
      ws.close();
    } catch {
      // ignore
    }
    if (existsSync(join(runDir, "chrome.pid"))) {
      const chromePid = Number(readFileSync(join(runDir, "chrome.pid"), "utf8").trim());
      if (chromePid) {
        try {
          process.kill(chromePid, "SIGTERM");
        } catch {
          // already gone
        }
      }
    }
  }
}

main().catch((err) => {
  console.error(err.stack || err.message);
  process.exit(1);
});
