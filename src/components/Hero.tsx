export function Hero() {
  return (
    <section className="hero">
      <svg className="botanical botanical-tl" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M150 280 C80 240 20 180 10 100 C0 20 60 -10 120 20 C180 50 220 120 200 200 C180 280 150 280 150 280Z" fill="#7aab5a"/>
        <path d="M150 280 L120 180 L80 120 M150 280 L170 160 L220 80" stroke="#c8ddb8" strokeWidth="1.5" fill="none"/>
        <ellipse cx="80" cy="120" rx="30" ry="20" fill="#7aab5a" transform="rotate(-30 80 120)"/>
        <ellipse cx="220" cy="80" rx="25" ry="18" fill="#7aab5a" transform="rotate(20 220 80)"/>
        <ellipse cx="120" cy="180" rx="22" ry="16" fill="#4a7a32" transform="rotate(-10 120 180)"/>
      </svg>
      <svg className="botanical botanical-br" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M150 280 C80 240 20 180 10 100 C0 20 60 -10 120 20 C180 50 220 120 200 200 C180 280 150 280 150 280Z" fill="#4a7a32"/>
        <path d="M150 280 L120 180 L80 120 M150 280 L170 160 L220 80" stroke="#7aab5a" strokeWidth="1.5" fill="none"/>
        <ellipse cx="80" cy="120" rx="30" ry="20" fill="#4a7a32" transform="rotate(-30 80 120)"/>
        <ellipse cx="220" cy="80" rx="25" ry="18" fill="#2c4a1e" transform="rotate(20 220 80)"/>
      </svg>

      <p className="hero-tag">First Season · Spring 2026</p>
      <h1>My <em>Garden</em><br />Plan</h1>
      <p className="hero-sub">Planters · Raised Beds · Pots · Trees</p>

      <div className="hero-scroll">
        <div className="scroll-line"></div>
        <span>Scroll</span>
      </div>
    </section>
  );
}
