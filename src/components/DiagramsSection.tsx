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
            <span className="dims">2 sides · large</span>
          </div>
          <div className="diagram-body">
            <div className="trellis-wrap">
              <div className="trellis-side">
                <div className="trellis-lines"></div>
                <div className="t-label">Side A</div>
                <span className="t-emoji">🍅</span>
                <div className="t-name">Cherry Tomatoes</div>
                <div className="t-count">3 plants · train up trellis ↑</div>
              </div>
              <div className="trellis-side">
                <div className="trellis-lines"></div>
                <div className="t-label">Side B</div>
                <span className="t-emoji">🍅</span>
                <div className="t-name">Beef Tomatoes</div>
                <div className="t-count">2 heirloom plants · train up trellis ↑</div>
              </div>
              <div className="trellis-border">
                🌼 Marigolds border all around &nbsp;·&nbsp; 🌸 Nasturtiums climbing trellis (aphid trap crop)
              </div>
            </div>
            <div className="diagram-note">Pinch out side shoots weekly. Tie in regularly as they grow. Feed weekly once flowering begins.</div>
          </div>
        </div>

        {/* Planter 1 — Herbs */}
        <div className="diagram-card">
          <div className="diagram-header">
            <h3>Planter 1 — Herbs</h3>
            <span className="dims">20 × 90 cm</span>
          </div>
          <div className="diagram-body">
            <div className="planter-diagram">
              <div className="planter-cell">
                <span className="p-emoji">🌿</span>
                <div className="p-name">Basil</div>
                <div className="p-note">Keep warm &amp; sheltered</div>
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
            </div>
            <div className="diagram-note">Mint on hold — add next season in a pot-in-pot to contain roots.</div>
          </div>
        </div>

        {/* Planter 2 — Salad */}
        <div className="diagram-card">
          <div className="diagram-header">
            <h3>Planter 2 — Salad</h3>
            <span className="dims">20 × 90 cm</span>
          </div>
          <div className="diagram-body">
            <div className="planter-diagram">
              <div className="planter-cell wide">
                <span className="p-emoji">🥗</span>
                <div className="p-name">Mixed Salad Leaves</div>
                <div className="p-note">Cut &amp; come again · harden off mid–late April</div>
              </div>
              <div className="planter-cell">
                <span className="p-emoji">🧅</span>
                <div className="p-name">Spring Onions</div>
                <div className="p-note">Sow every 3 weeks</div>
              </div>
            </div>
            <div className="diagram-note">Keep lettuce seedlings indoors until mid–late April. Harden off gradually before transplanting.</div>
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
        <div className="diagram-card">
          <div className="diagram-header">
            <h3>Grow Bags</h3>
            <span className="dims">40–50 L each</span>
          </div>
          <div className="diagram-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div className="growbag-diagram">
                <span className="g-emoji">🥔</span>
                <div className="g-name">Potatoes</div>
                <div className="g-variety">Maris Piper or Charlotte</div>
              </div>
              <div className="diagram-note" style={{ marginTop: 10 }}>Currently chitting on windowsill. Half fill bag; earth up as shoots reach 15–20cm.</div>
            </div>
            <div>
              <div className="growbag-diagram" style={{ background: 'linear-gradient(135deg,#9a6b3a,#7a5230)' }}>
                <span className="g-emoji">🥕</span>
                <div className="g-name">Carrots</div>
                <div className="g-variety">Nantes 2 or Chantenay</div>
              </div>
              <div className="diagram-note" style={{ marginTop: 10 }}>Sow directly in rows from late March. Fill fully with light compost + grit. Thin to 5cm.</div>
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
          <div className="pot-card moveable">
            <span className="pc-emoji">🌿</span>
            <div className="pc-name">Fig</div>
            <div className="pc-size">Large patio pot</div>
            <span className="pc-tag tag-moveable">Move to shed in frosts</span>
          </div>
        </div>
      </div>
    </section>
  );
}
