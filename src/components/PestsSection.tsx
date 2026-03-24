export function PestsSection() {
  return (
    <section className="section" id="pests">
      <div className="section-header">
        <span className="section-number">05</span>
        <h2 className="section-title">Pest &amp; Bird <em>Protection</em></h2>
      </div>
      <div className="pest-grid">
        <div className="pest-card">
          <span className="pest-icon">🪶</span>
          <div className="pest-name">Birds</div>
          <ul>
            <li>Hoop frames over raised beds with bird netting — easy to lift for harvesting</li>
            <li>Individual pot covers for strawberries — net the moment fruit forms</li>
            <li>Shiny tape or old CDs offer some deterrence but netting is the only reliable method</li>
          </ul>
        </div>
        <div className="pest-card">
          <span className="pest-icon">🐌</span>
          <div className="pest-name">Slugs &amp; Snails</div>
          <ul>
            <li>Wool pellets around seedlings NOW — before they even emerge is ideal timing</li>
            <li>Copper tape around all pot and planter rims</li>
            <li>Sharp grit or crushed eggshell around base of plants</li>
            <li>Hand-pick at dusk with a torch after rain — very effective</li>
            <li>Avoid straw mulch — creates perfect hiding spots for slugs</li>
            <li>No slug pellets — harmful to hedgehogs and wildlife</li>
          </ul>
        </div>
        <div className="pest-card">
          <span className="pest-icon">🐛</span>
          <div className="pest-name">Aphids</div>
          <ul>
            <li>Strong blast of water to knock aphids off — simple and effective</li>
            <li>Neem oil spray — organic, disrupts lifecycle without harming ladybirds</li>
            <li>Marigolds attract aphid predators — already in trellis planter ✅</li>
            <li>Nasturtiums as trap crop — aphids prefer them over your veg ✅</li>
            <li>Brassicas in Raised Bed 2 are aphid magnets — watch closely!</li>
          </ul>
        </div>
      </div>

      <div style={{ overflowX: 'auto', marginTop: 8 }}>
        <table className="seed-table">
          <thead>
            <tr>
              <th>Crop / Bed</th>
              <th>Bird Protection</th>
              <th>Slug &amp; Snail</th>
              <th>Aphids</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="crop-name">Raised Bed 1</td><td>Hoop + bird netting</td><td>Wool pellets + grit</td><td>Neem oil + water blast</td></tr>
            <tr><td className="crop-name">Raised Bed 2 ⚠️</td><td>Hoop + netting + enviromesh</td><td>Wool pellets + grit</td><td>Neem oil — brassicas are aphid magnets!</td></tr>
            <tr><td className="crop-name">Trellis Planter</td><td>Less of a concern</td><td>Copper tape on planter</td><td>Marigolds + nasturtiums + neem oil</td></tr>
            <tr><td className="crop-name">Strawberries</td><td>Pot covers / fruit cage</td><td>Copper tape on pots</td><td>Water blast</td></tr>
            <tr><td className="crop-name">Planters 1 &amp; 2</td><td>Less of a concern</td><td>Copper tape on planters</td><td>Water blast</td></tr>
            <tr><td className="crop-name">Grow Bags</td><td>Less of a concern</td><td>Copper tape on edges</td><td>Water blast</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
