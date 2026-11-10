export function Logo() {
  return (
    <div className="logo" aria-label="LüneDriver">
      <svg viewBox="0 0 280 78" role="img">
        <title>LüneDriver</title>
        <defs>
          <linearGradient id="ld-road" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#7fd9ff" />
            <stop offset="100%" stopColor="#00b4ff" />
          </linearGradient>
        </defs>
        <path
          d="M18 46 L140 10 L262 46"
          fill="none"
          stroke="url(#ld-road)"
          strokeWidth="3.2"
          strokeLinejoin="round"
        />
        <path
          d="M40 46 L140 18 L240 46"
          fill="none"
          stroke="#00b4ff"
          strokeOpacity="0.45"
          strokeWidth="8"
          strokeLinejoin="round"
        />
        <path
          d="M140 16 v28"
          stroke="#d7f4ff"
          strokeWidth="2"
          strokeDasharray="3 5"
          strokeLinecap="round"
        />
        <path
          d="M92 32 h10 v-8 h8 v8 h7 v-12 h8 v12 h12 v10 H92 z"
          fill="#9ad8ff"
          opacity="0.9"
        />
        <path d="M158 30 h9 v-9 h7 v9 h10 v12 h-26 z" fill="#c8ecff" />
        <circle cx="140" cy="14" r="3.2" fill="#fff" />
        <text
          x="140"
          y="72"
          textAnchor="middle"
          fontFamily="Manrope, Segoe UI, sans-serif"
          fontSize="28"
          fontWeight="800"
          letterSpacing="-0.6"
        >
          <tspan fill="#ffffff">L</tspan>
          <tspan fill="#00b4ff">ü</tspan>
          <tspan fill="#ffffff">neDriver</tspan>
        </text>
      </svg>
    </div>
  )
}
