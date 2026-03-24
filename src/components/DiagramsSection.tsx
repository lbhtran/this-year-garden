export function DiagramsSection() {
  return (
    <section className="section" id="diagrams">
      <div className="section-header">
        <span className="section-number">02</span>
        <h2 className="section-title">Planting <em>Diagrams</em></h2>
      </div>
      <div className="diagrams-grid">

        {/* Corner Trellis Planter */}
        <div className="diagram-card">
          <div className="diagram-header">
            <h3>Corner Trellis Planter</h3>
            <span className="dims">right-angle triangle · 70 × 70 cm</span>
          </div>
          <div className="diagram-body">
            <div className="trellis-triangle-wrap">
              <svg className="trellis-triangle-svg" viewBox="0 0 280 265" xmlns="http://www.w3.org/2000/svg">
                {/* Soil/planting area fill */}
                <polygon points="40,20 40,225 235,225" fill="var(--green-wash)" stroke="none" />
                {/* Side A trellis (vertical, left leg) */}
                <line x1="40" y1="20" x2="40" y2="225" stroke="var(--green-mid)" strokeWidth="3" />
                {/* Side B trellis (horizontal, bottom leg) */}
                <line x1="40" y1="225" x2="235" y2="225" stroke="var(--green-mid)" strokeWidth="3" />
                {/* Hypotenuse (long side — flowers planted here) */}
                <line x1="40" y1="20" x2="235" y2="225" stroke="var(--rust)" strokeWidth="2" strokeDasharray="6 4" />
                {/* Right-angle marker */}
                <polyline points="40,209 56,209 56,225" fill="none" stroke="var(--green-mid)" strokeWidth="1.8" />
                {/* Trellis horizontal wires on Side A */}
                {[45,65,85,105,125,145,165,185,205].map(y => (
                  <line key={`wa-${y}`} x1="40" y1={y} x2="46" y2={y} stroke="var(--green-light)" strokeWidth="1.5" />
                ))}
                {/* Trellis vertical wires on Side B */}
                {[60,85,110,135,160,185,210].map(x => (
                  <line key={`wb-${x}`} x1={x} y1="225" x2={x} y2="219" stroke="var(--green-light)" strokeWidth="1.5" />
                ))}

                {/* SIDE A — Cherry Tomatoes (3 plants along vertical trellis) */}
                {/* Plant 1 */}
                <circle cx="40" cy="75" r="10" fill="#c8ddb8" stroke="var(--green-mid)" strokeWidth="1.5" />
                <text x="40" y="79" fontSize="11" textAnchor="middle">🍅</text>
                <text x="60" y="68" fontSize="8" fill="var(--green-deep)" fontFamily="'DM Mono', monospace">Cherry #1</text>
                {/* Plant 2 */}
                <circle cx="40" cy="125" r="10" fill="#c8ddb8" stroke="var(--green-mid)" strokeWidth="1.5" />
                <text x="40" y="129" fontSize="11" textAnchor="middle">🍅</text>
                <text x="60" y="118" fontSize="8" fill="var(--green-deep)" fontFamily="'DM Mono', monospace">Cherry #2</text>
                {/* Plant 3 */}
                <circle cx="40" cy="175" r="10" fill="#c8ddb8" stroke="var(--green-mid)" strokeWidth="1.5" />
                <text x="40" y="179" fontSize="11" textAnchor="middle">🍅</text>
                <text x="60" y="168" fontSize="8" fill="var(--green-deep)" fontFamily="'DM Mono', monospace">Cherry #3</text>

                {/* SIDE B — Beef Tomatoes (2 plants along horizontal trellis) */}
                {/* Plant 1 */}
                <circle cx="105" cy="225" r="10" fill="#c8ddb8" stroke="var(--green-mid)" strokeWidth="1.5" />
                <text x="105" y="229" fontSize="11" textAnchor="middle">🍅</text>
                <text x="105" y="249" fontSize="8" fill="var(--green-deep)" fontFamily="'DM Mono', monospace" textAnchor="middle">Beef #1</text>
                {/* Plant 2 */}
                <circle cx="185" cy="225" r="10" fill="#c8ddb8" stroke="var(--green-mid)" strokeWidth="1.5" />
                <text x="185" y="229" fontSize="11" textAnchor="middle">🍅</text>
                <text x="185" y="249" fontSize="8" fill="var(--green-deep)" fontFamily="'DM Mono', monospace" textAnchor="middle">Beef #2</text>

                {/* HYPOTENUSE — Marigolds & Nasturtiums */}
                {/* Flowers evenly spaced along diagonal from (40,20) to (235,225) */}
                <text x="73" y="55" fontSize="13" textAnchor="middle">🌼</text>
                <text x="107" y="90" fontSize="13" textAnchor="middle">🌸</text>
                <text x="141" y="125" fontSize="13" textAnchor="middle">🌼</text>
                <text x="175" y="160" fontSize="13" textAnchor="middle">🌸</text>
                <text x="209" y="195" fontSize="13" textAnchor="middle">🌼</text>

                {/* Side A label (rotated, left of trellis) */}
                <text x="13" y="125" textAnchor="middle" fontSize="9" fill="var(--muted)" fontFamily="'DM Mono', monospace" transform="rotate(-90,13,125)">SIDE A · 70 cm · trellis ↑</text>
                {/* Side B label (below trellis) */}
                <text x="137" y="263" textAnchor="middle" fontSize="9" fill="var(--muted)" fontFamily="'DM Mono', monospace">SIDE B · 70 cm · trellis ↑</text>
                {/* Hypotenuse label */}
                <text x="157" y="108" fontSize="8" fill="var(--rust)" fontFamily="'DM Mono', monospace" transform="rotate(46,157,108)">marigolds &amp; nasturtiums</text>
              </svg>
              <div className="trellis-legend">
                <span><span className="legend-dot" style={{ background: 'var(--green-mid)' }}></span>trellis side (70 cm)</span>
                <span><span className="legend-line" style={{ borderColor: 'var(--rust)' }}></span>long side — flowers</span>
                <span>🍅 tomato plant position</span>
              </div>
            </div>
            <div className="diagram-note">Right-angle triangle planter with 70 cm trellis on each of the two right-angle sides. Marigolds &amp; nasturtiums planted along the long (diagonal) side as companion plants. Pinch out side shoots weekly. Feed weekly once flowering begins.</div>
          </div>
        </div>

        {/* Planter 1 — Herbs */}
        <div className="diagram-card">
          <div className="diagram-header">
            <h3>Planter 1 — Herbs &amp; Spring Onions</h3>
            <span className="dims">20 × 90 cm</span>
          </div>
          <div className="diagram-body">
            <div className="planter-diagram">
              <div className="planter-cell">
                <span className="p-emoji">🌿</span>
                <div className="p-name">Basil</div>
                <div className="p-note">In grow house — needs warmth</div>
              </div>
              <div className="planter-cell">
                <span className="p-emoji">🌱</span>
                <div className="p-name">Parsley</div>
                <div className="p-note">Hardy &amp; reliable</div>
              </div>
              <div className="planter-cell">
                <span className="p-emoji">🌾</span>
                <div className="p-name">Chives</div>
                <div className="p-note">Snip &amp; regrow</div>
              </div>
              <div className="planter-cell">
                <span className="p-emoji">🧅</span>
                <div className="p-name">Spring Onions</div>
                <div className="p-note">Sow every 3 weeks</div>
              </div>
            </div>
            <div className="diagram-note">Basil kept in grow house to avoid cold snaps — move to planter once reliably warm. Mint on hold — add next season in a pot-in-pot to contain roots.</div>
          </div>
        </div>

        {/* Planter 2 — Salad */}
        <div className="diagram-card">
          <div className="diagram-header">
            <h3>Planter 2 — Salad &amp; Lettuce</h3>
            <span className="dims">20 × 90 cm</span>
          </div>
          <div className="diagram-body">
            <div className="planter-diagram">
              <div className="planter-cell">
                <span className="p-emoji">🥗</span>
                <div className="p-name">Mixed Salad Leaves</div>
                <div className="p-note">Cut &amp; come again</div>
              </div>
              <div className="planter-cell">
                <span className="p-emoji">🥬</span>
                <div className="p-name">Little Gem Lettuce</div>
                <div className="p-note">Compact · sow successionally</div>
              </div>
              <div className="planter-cell">
                <span className="p-emoji">🌿</span>
                <div className="p-name">Rocket</div>
                <div className="p-note">Spicy · quick to harvest</div>
              </div>
            </div>
            <div className="diagram-note">Keep seedlings indoors until mid–late April. Harden off gradually before transplanting. Sow small batches every 2–3 weeks for a continuous harvest.</div>
          </div>
        </div>

        {/* Raised Bed 1 */}
        <div className="diagram-card">
          <div className="diagram-header">
            <h3>Raised Bed 1 — Vegetables</h3>
            <span className="dims">60 × 120 cm · curved edges</span>
          </div>
          <div className="diagram-body">
            <div className="oval-bed">
              <div className="oval-ring oval-outer"></div>
              <div className="oval-ring oval-mid"></div>
              <div className="oval-ring oval-inner"></div>
              <div className="oval-ring oval-centre">
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 18 }}>🥬🥬</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'var(--green-deep)', marginTop: 2 }}>Perennial<br />Kale ×2</div>
                </div>
              </div>
              <div className="oval-label left-inner" style={{ top: '50%', color: 'var(--muted)' }}>Lettuce</div>
              <div className="oval-label right-inner" style={{ top: '50%', color: 'var(--muted)' }}>Spinach</div>
              <div className="oval-label top" style={{ color: 'var(--muted)', fontSize: 10 }}>🌸 Nasturtiums (border)</div>
              <div className="oval-label bottom" style={{ color: 'var(--muted)', fontSize: 10 }}>🌸 Nasturtiums (border)</div>
              <div className="oval-label left-mid" style={{ top: '50%', color: 'var(--green-mid)', fontSize: 10 }}>Purple<br />Curly Kale</div>
              <div className="oval-label right-mid" style={{ top: '50%', color: 'var(--green-mid)', fontSize: 10 }}>Purple<br />Curly Kale</div>
            </div>
            <div className="diagram-note">Perennial kale = permanent centre, do not disturb. Purple curly kale — sow May–Jun per seed packet for Sep harvest. Nasturtiums trail beautifully over curved edges.</div>
          </div>
        </div>

        {/* Raised Bed 2 */}
        <div className="diagram-card">
          <div className="diagram-header">
            <h3>Raised Bed 2 — Asparagus &amp; Brassicas</h3>
            <span className="dims">60 × 120 cm · curved edges</span>
          </div>
          <div className="diagram-body">
            <div className="oval-bed">
              <div className="oval-ring oval-outer"></div>
              <div className="oval-ring oval-mid"></div>
              <div className="oval-ring oval-inner"></div>
              <div className="oval-ring oval-centre">
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 18 }}>🌱🌱</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'var(--green-deep)', marginTop: 2 }}>Asparagus<br />(permanent)</div>
                </div>
              </div>
              <div className="oval-label left-inner" style={{ top: '50%', color: 'var(--muted)', fontSize: 10 }}>Pak<br />Choi</div>
              <div className="oval-label right-inner" style={{ top: '50%', color: 'var(--muted)', fontSize: 10 }}>Tenderstem<br />Broccoli</div>
              <div className="oval-label top" style={{ color: 'var(--muted)', fontSize: 10 }}>🌸 Nasturtiums (border)</div>
              <div className="oval-label bottom" style={{ color: 'var(--muted)', fontSize: 10 }}>🌸 Nasturtiums (border)</div>
              <div className="oval-label left-mid" style={{ top: '50%', color: 'var(--green-mid)', fontSize: 10 }}>Spring<br />Onions</div>
              <div className="oval-label right-mid" style={{ top: '50%', color: 'var(--green-mid)', fontSize: 10 }}>Spring<br />Onions</div>
            </div>
            <div className="diagram-note">No asparagus harvest in year one — patience pays off from year two! Tenderstem broccoli at the back of inner ring as it grows tall. All brassicas need enviromesh protection.</div>
          </div>
        </div>

        {/* Grow Bags */}
        <div className="diagram-card" style={{ gridColumn: '1 / -1' }}>
          <div className="diagram-header">
            <h3>Grow Bags</h3>
            <span className="dims">40–50 L each</span>
          </div>
          <div className="diagram-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            <div>
              <div className="growbag-diagram">
                <span className="g-emoji">🥔</span>
                <div className="g-name">Potatoes #1</div>
                <div className="g-variety">Maris Piper or Charlotte</div>
              </div>
              <div className="diagram-note" style={{ marginTop: 10 }}>Currently chitting on windowsill. Half fill bag; earth up as shoots reach 15–20cm.</div>
            </div>
            <div>
              <div className="growbag-diagram">
                <span className="g-emoji">🥔</span>
                <div className="g-name">Potatoes #2</div>
                <div className="g-variety">Maris Piper or Charlotte</div>
              </div>
              <div className="diagram-note" style={{ marginTop: 10 }}>Second potato bag — chit alongside bag #1. Earth up as shoots emerge.</div>
            </div>
            <div>
              <div className="growbag-diagram" style={{ background: 'linear-gradient(135deg,#9a6b3a,#7a5230)' }}>
                <span className="g-emoji">🥕</span>
                <div className="g-name">Carrots</div>
                <div className="g-variety">Nantes 2 or Chantenay</div>
              </div>
              <div className="diagram-note" style={{ marginTop: 10 }}>Sow directly in rows from late March. Fill fully with light compost + grit. Thin to 5cm.</div>
            </div>
            <div>
              <div className="growbag-diagram" style={{ background: 'linear-gradient(135deg,#5a7a3a,#3d5c28)' }}>
                <span className="g-emoji">🌿</span>
                <div className="g-name">Fig</div>
                <div className="g-variety">Move in as season progresses</div>
              </div>
              <div className="diagram-note" style={{ marginTop: 10 }}>Transfer fig to a large grow bag as the season progresses to allow a bigger tree to develop. Move to shed in hard frosts.</div>
            </div>
          </div>
        </div>

      </div>

      {/* Individual Pots */}
      <div style={{ marginTop: 32 }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: 'var(--green-deep)', marginBottom: 20, fontWeight: 400 }}>
          Individual <em style={{ fontStyle: 'italic', color: 'var(--green-mid)' }}>Pots</em>
        </h3>
        <div className="pot-grid">
          <div className="pot-card moveable">
            <span className="pc-emoji">🍆</span>
            <div className="pc-name">Aubergine</div>
            <div className="pc-size">~7–10 L</div>
            <span className="pc-tag tag-moveable">Move indoors winter</span>
          </div>
          <div className="pot-card moveable">
            <span className="pc-emoji">🌶️</span>
            <div className="pc-name">Habanero Chilli</div>
            <div className="pc-size">~7–10 L</div>
            <span className="pc-tag tag-moveable">Move indoors winter</span>
            <div className="pc-note">Can last multiple years!</div>
          </div>
          <div className="pot-card">
            <span className="pc-emoji">🥒</span>
            <div className="pc-name">Courgette</div>
            <div className="pc-size">~20 L</div>
            <span className="pc-tag tag-annual">Annual</span>
          </div>
          <div className="pot-card">
            <span className="pc-emoji">🍁</span>
            <div className="pc-name">Japanese Maple</div>
            <div className="pc-size">≥40 L</div>
            <span className="pc-tag tag-hardy">Fully Hardy</span>
            <div className="pc-note">'Bloodgood' or 'Sango-kaku'</div>
          </div>
          <div className="pot-card">
            <span className="pc-emoji">🍓</span>
            <div className="pc-name">Strawberries ×5</div>
            <div className="pc-size">Individual pots</div>
            <span className="pc-tag tag-hardy">Hardy</span>
            <div className="pc-note">Growhouse in hard frosts</div>
          </div>
        </div>
      </div>
    </section>
  );
}
