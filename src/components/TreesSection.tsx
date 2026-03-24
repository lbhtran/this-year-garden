export function TreesSection() {
  return (
    <section className="section" id="trees">
      <div className="section-header">
        <span className="section-number">07</span>
        <h2 className="section-title">Future <em>Trees</em></h2>
      </div>
      <div style={{ background: 'var(--green-wash)', border: '1px solid var(--green-pale)', borderRadius: 12, padding: 24, marginBottom: 32, fontSize: 14, lineHeight: 1.8, color: 'var(--muted)' }}>
        🌳 More trees, especially fruit trees, are planned once the garden layout is confirmed — swing, seating, and other features first so placement can complement the space. Consider sun &amp; shade patterns, proximity to seating (mulberry drops messy fruit!), espalier options against walls, and pollination pairs.
      </div>
      <div className="trees-grid">
        <div className="tree-card">
          <span className="tr-emoji">🍎</span>
          <div className="tr-name">Apple</div>
          <div className="tr-variety">'Falstaff' on M27 rootstock</div>
          <div className="tr-note">Self-fertile; beautiful spring blossom</div>
        </div>
        <div className="tree-card">
          <span className="tr-emoji">🍒</span>
          <div className="tr-name">Cherry</div>
          <div className="tr-variety">'Stella' (self-fertile)</div>
          <div className="tr-note">Great in a large pot; net when fruiting</div>
        </div>
        <div className="tree-card">
          <span className="tr-emoji">🍑</span>
          <div className="tr-name">Plum</div>
          <div className="tr-variety">'Victoria' on Pixy rootstock</div>
          <div className="tr-note">Very productive; self-fertile</div>
        </div>
        <div className="tree-card">
          <span className="tr-emoji">🌿</span>
          <div className="tr-name">Fig</div>
          <div className="tr-variety">Already in the plan!</div>
          <div className="tr-note">South-facing wall ideal</div>
        </div>
        <div className="tree-card on-hold">
          <span className="tr-emoji">🫒</span>
          <div className="tr-name">Olive</div>
          <div className="tr-variety">'Arbequina'</div>
          <div className="tr-note">Add when space is confirmed</div>
        </div>
        <div className="tree-card on-hold">
          <span className="tr-emoji">🌿</span>
          <div className="tr-name">Bay</div>
          <div className="tr-variety">Laurus nobilis</div>
          <div className="tr-note">Evergreen; great structure year-round</div>
        </div>
        <div className="tree-card on-hold">
          <span className="tr-emoji">🌳</span>
          <div className="tr-name">Mulberry</div>
          <div className="tr-variety">'Charlotte Russe'</div>
          <div className="tr-note">Mind fruit drop near seating!</div>
        </div>
        <div className="tree-card on-hold">
          <span className="tr-emoji">🫐</span>
          <div className="tr-name">Blueberries</div>
          <div className="tr-variety">Bluecrop + Duke</div>
          <div className="tr-note">Buy two for cross-pollination</div>
        </div>
      </div>
    </section>
  );
}
