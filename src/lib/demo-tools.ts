type DemoEnv = {
  NODE_ENV?: string;
  NEXT_PUBLIC_GASGO_DEMO?: string;
};

/**
 * Pitch controls (tracking stepper) stay off in production builds unless
 * NEXT_PUBLIC_GASGO_DEMO=1 is set for a preview/demo deploy.
 */
export function isDemoToolsEnabled(
  env: DemoEnv = {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_GASGO_DEMO: process.env.NEXT_PUBLIC_GASGO_DEMO,
  },
): boolean {
  if (env.NEXT_PUBLIC_GASGO_DEMO === "1") return true;
  return env.NODE_ENV !== "production";
}
