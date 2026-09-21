/**
 * Original Port Harcourt “gas world” — Garden City streets, plant tanks,
 * GRA bungalow, creek mangroves. Not Lagos landmarks.
 */
export function HeroWorld({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <svg
        viewBox="0 0 1440 460"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-auto w-full"
        preserveAspectRatio="xMidYMax slice"
      >
        <Clouds />
        <Sun />
        <Hills />
        <Creek />
        <Plant />
        <GraHouse />
        <ShopBlock />
        <Trees />
        <Road />
        <Keke />
        <DeliveryVan />
        <ForegroundCylinders />
      </svg>
    </div>
  );
}

function Clouds() {
  return (
    <g className="hero-cloud" fill="#FFFFFF" fillOpacity="0.92">
      <g>
        <ellipse cx="180" cy="42" rx="54" ry="22" />
        <ellipse cx="230" cy="38" rx="40" ry="18" />
        <ellipse cx="148" cy="48" rx="32" ry="14" />
        <ellipse cx="1080" cy="36" rx="62" ry="24" />
        <ellipse cx="1136" cy="32" rx="36" ry="16" />
        <ellipse cx="640" cy="28" rx="48" ry="16" />
        <ellipse cx="678" cy="24" rx="28" ry="12" />
      </g>
    </g>
  );
}

function Sun() {
  return (
    <g transform="translate(1268 18)">
      <circle cx="48" cy="48" r="36" fill="#FFDF22" />
      <circle cx="48" cy="48" r="26" fill="#FFE86A" />
    </g>
  );
}

function Hills() {
  return (
    <g>
      <path
        d="M0 220C120 188 210 210 320 198C460 182 520 230 680 216C840 200 920 168 1080 190C1200 206 1320 176 1440 196V460H0V220Z"
        fill="#D7E8B8"
      />
      <path
        d="M0 268C160 242 260 280 420 258C580 236 700 286 860 264C1020 242 1180 272 1440 250V460H0V268Z"
        fill="#C8DC9E"
      />
    </g>
  );
}

function Creek() {
  return (
    <g>
      <path
        d="M1180 300C1240 292 1300 310 1440 298V360C1320 348 1248 338 1188 346C1144 352 1128 330 1180 300Z"
        fill="#7DB8A4"
      />
      <path
        d="M1220 318C1288 312 1360 324 1440 316"
        stroke="#FFFFFF"
        strokeOpacity="0.35"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <ellipse cx="1268" cy="332" rx="10" ry="4" fill="#5F9A88" />
      <ellipse cx="1348" cy="340" rx="14" ry="5" fill="#5F9A88" />
    </g>
  );
}

function Plant() {
  return (
    <g transform="translate(40 168)">
      <rect x="20" y="86" width="210" height="78" rx="6" fill="#1CA350" />
      <rect x="20" y="86" width="210" height="16" fill="#147A3E" />
      <rect x="36" y="110" width="36" height="28" rx="3" fill="#FFFFFF" fillOpacity="0.28" />
      <rect x="84" y="110" width="36" height="28" rx="3" fill="#FFFFFF" fillOpacity="0.18" />
      <rect x="20" y="148" width="210" height="8" fill="#FFDF22" />
      <text
        x="128"
        y="142"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="13"
        fontWeight="700"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
      >
        PLANT
      </text>
      <Bullet cx={48} />
      <Bullet cx={108} />
      <Bullet cx={168} />
      <rect x="196" y="48" width="10" height="40" fill="#0B1F14" />
      <path d="M201 48h28" stroke="#0B1F14" strokeWidth="4" strokeLinecap="round" />
      <path d="M229 48v22" stroke="#1CA350" strokeWidth="4" strokeLinecap="round" />
      <rect x="222" y="68" width="16" height="10" rx="2" fill="#FFDF22" />
    </g>
  );
}

function Bullet({ cx }: { cx: number }) {
  return (
    <g transform={`translate(${cx} 28)`}>
      <rect x="0" y="12" width="44" height="52" rx="22" fill="#F7FAF8" stroke="#0B1F14" strokeWidth="2" />
      <rect x="16" y="0" width="12" height="16" rx="3" fill="#0B1F14" />
      <path d="M10 34h24" stroke="#1CA350" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

function GraHouse() {
  return (
    <g transform="translate(430 186)">
      <rect x="18" y="78" width="168" height="70" rx="4" fill="#F4EFE3" />
      <path d="M8 80L102 18L196 80H8Z" fill="#8B5A2B" />
      <path d="M8 80L102 18L196 80" stroke="#0B1F14" strokeWidth="3" strokeLinejoin="round" />
      <rect x="28" y="90" width="36" height="28" rx="2" fill="#7DB8A4" />
      <rect x="78" y="90" width="36" height="28" rx="2" fill="#7DB8A4" />
      <rect x="132" y="96" width="32" height="52" rx="2" fill="#147A3E" />
      <rect x="0" y="146" width="210" height="10" fill="#C8B48A" />
      <rect x="148" y="58" width="18" height="28" fill="#8B5A2B" />
      <rect x="42" y="118" width="70" height="8" fill="#1CA350" />
    </g>
  );
}

function ShopBlock() {
  return (
    <g transform="translate(860 154)">
      <rect x="0" y="70" width="72" height="120" rx="4" fill="#2BB862" />
      <rect x="10" y="84" width="22" height="18" rx="2" fill="#FFF8C8" />
      <rect x="40" y="84" width="22" height="18" rx="2" fill="#FFF8C8" />
      <rect x="10" y="112" width="22" height="18" rx="2" fill="#FFF8C8" />
      <rect x="40" y="112" width="22" height="18" rx="2" fill="#FFF8C8" />
      <rect x="68" y="40" width="88" height="150" rx="4" fill="#0B1F14" />
      <rect x="80" y="56" width="28" height="22" rx="2" fill="#7DB8A4" />
      <rect x="116" y="56" width="28" height="22" rx="2" fill="#7DB8A4" />
      <rect x="80" y="90" width="28" height="22" rx="2" fill="#7DB8A4" />
      <rect x="116" y="90" width="28" height="22" rx="2" fill="#7DB8A4" />
      <rect x="90" y="132" width="44" height="48" rx="3" fill="#1CA350" />
      <rect x="156" y="88" width="64" height="102" rx="4" fill="#FFDF22" />
      <rect x="168" y="104" width="40" height="26" rx="2" fill="#FFFFFF" fillOpacity="0.55" />
      <rect x="174" y="148" width="28" height="42" rx="2" fill="#147A3E" />
    </g>
  );
}

function Trees() {
  return (
    <g>
      <Palm x={390} y={210} />
      <Mango x={700} y={228} />
      <Palm x={780} y={200} />
      <Mango x={1324} y={220} />
    </g>
  );
}

function Palm({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="18" y="40" width="8" height="72" rx="3" fill="#6B4226" />
      <path
        d="M22 44C4 28 2 8 12 4C18 22 22 28 22 44Z"
        fill="#1CA350"
      />
      <path
        d="M22 44C40 26 52 10 44 2C34 18 26 30 22 44Z"
        fill="#147A3E"
      />
      <path
        d="M22 48C8 52 -6 46 -8 36C8 40 16 44 22 48Z"
        fill="#2BB862"
      />
    </g>
  );
}

function Mango({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="22" y="52" width="8" height="56" rx="3" fill="#6B4226" />
      <ellipse cx="26" cy="40" rx="28" ry="26" fill="#1CA350" />
      <ellipse cx="18" cy="34" rx="14" ry="12" fill="#2BB862" />
    </g>
  );
}

function Road() {
  return (
    <g>
      <path d="M0 392h1440v68H0Z" fill="#3D4A42" />
      <path d="M0 388h1440v8H0Z" fill="#2A332E" />
      <path
        d="M20 424h48M92 424h48M164 424h48M236 424h48M308 424h48M380 424h48M452 424h48M524 424h48M596 424h48M668 424h48M740 424h48M812 424h48M884 424h48M956 424h48M1028 424h48M1100 424h48M1172 424h48M1244 424h48M1316 424h48M1388 424h32"
        className="hero-road-dash"
        stroke="#FFDF22"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </g>
  );
}

function DeliveryVan() {
  return (
    <g className="hero-van">
      <g transform="translate(760 338)">
      <ellipse cx="118" cy="58" rx="90" ry="8" fill="#0B1F14" opacity="0.18" />
      <rect x="24" y="8" width="148" height="42" rx="8" fill="#1CA350" />
      <rect x="24" y="8" width="148" height="10" rx="8" fill="#2BB862" />
      <rect x="24" y="28" width="148" height="4" fill="#FFDF22" />
      <rect x="168" y="14" width="52" height="36" rx="6" fill="#147A3E" />
      <path d="M214 14h12l16 18v18h-10c-4 0-7-3-8-7L214 14Z" fill="#0B1F14" />
      <rect x="180" y="18" width="28" height="16" rx="3" fill="#FFFFFF" fillOpacity="0.35" />
      <rect x="46" y="14" width="18" height="22" rx="6" fill="#FFFFFF" />
      <rect x="50" y="10" width="10" height="6" rx="1.5" fill="#147A3E" />
      <circle cx="64" cy="52" r="12" fill="#0B1F14" />
      <circle cx="64" cy="52" r="5.5" fill="#FFDF22" />
      <circle cx="186" cy="52" r="12" fill="#0B1F14" />
      <circle cx="186" cy="52" r="5.5" fill="#FFDF22" />
      </g>
    </g>
  );
}

function Keke() {
  return (
    <g className="hero-keke">
      <g transform="translate(220 352)">
      <ellipse cx="70" cy="48" rx="58" ry="7" fill="#0B1F14" opacity="0.16" />
      <rect x="28" y="8" width="72" height="28" rx="8" fill="#FFDF22" />
      <rect x="28" y="8" width="72" height="8" rx="8" fill="#FFE86A" />
      <rect x="8" y="18" width="28" height="20" rx="6" fill="#1CA350" />
      <rect x="14" y="22" width="14" height="10" rx="2" fill="#FFFFFF" fillOpacity="0.4" />
      <circle cx="22" cy="44" r="9" fill="#0B1F14" />
      <circle cx="22" cy="44" r="3.5" fill="#FFDF22" />
      <circle cx="58" cy="44" r="9" fill="#0B1F14" />
      <circle cx="90" cy="44" r="9" fill="#0B1F14" />
      <circle cx="58" cy="44" r="3.5" fill="#FFDF22" />
      <circle cx="90" cy="44" r="3.5" fill="#FFDF22" />
      </g>
    </g>
  );
}

function ForegroundCylinders() {
  return (
    <g>
      <g transform="translate(520 348)">
        <MiniCyl x={0} />
        <MiniCyl x={28} />
      </g>
      <g transform="translate(1108 336)">
        <rect x="8" y="0" width="8" height="8" rx="1.5" fill="#0B1F14" />
        <rect x="0" y="8" width="24" height="36" rx="10" fill="#FFFFFF" stroke="#0B1F14" strokeWidth="1.6" />
        <path d="M6 24h12" stroke="#1CA350" strokeWidth="2" strokeLinecap="round" />
      </g>
    </g>
  );
}

function MiniCyl({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <rect x="6" y="0" width="7" height="7" rx="1.4" fill="#0B1F14" />
      <rect x="0" y="7" width="19" height="32" rx="8" fill="#FFFFFF" stroke="#0B1F14" strokeWidth="1.5" />
      <path d="M4 20h11" stroke="#1CA350" strokeWidth="1.6" strokeLinecap="round" />
    </g>
  );
}
