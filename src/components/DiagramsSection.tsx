import type { Container } from '../data/containers';
import type { Allocation } from '../data/allocations';
import type { Plant } from '../data/plants';

interface Props {
  containers: Container[];
  allocations: Allocation[];
  plants: Plant[];
}

// Pre-defined SVG slot positions for the trellis planter
const TRELLIS_SLOTS_SIDE_A = [
  { cx: 40, cy: 75,  labelX: 60, labelY: 68 },
  { cx: 40, cy: 125, labelX: 60, labelY: 118 },
  { cx: 40, cy: 175, labelX: 60, labelY: 168 },
];

const TRELLIS_SLOTS_SIDE_B = [
  { cx: 105, cy: 225, labelX: 105, labelY: 249 },
  { cx: 185, cy: 225, labelX: 185, labelY: 249 },
];

function getContainerByDiagramId(containers: Container[], diagramId: string): Container | undefined {
  return containers.find(c => c.diagramId === diagramId);
}

function getAllocsForContainer(
  allocations: Allocation[],
  plants: Plant[],
  containerId: string,
  zone?: string,
): Array<Allocation & { plant: Plant | undefined }> {
  return allocations
    .filter(a => a.containerId === containerId && (zone == null || a.zone === zone))
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(a => ({ ...a, plant: plants.find(p => p.id === a.plantId) }));
}

function hasDynamic(allocations: Allocation[], containerId: string | undefined): boolean {
  return !!containerId && allocations.some(a => a.containerId === containerId);
}

export function DiagramsSection({ containers, allocations, plants }: Props) {
  const c1 = getContainerByDiagramId(containers, 'diagram-c1');
  const c2 = getContainerByDiagramId(containers, 'diagram-c2');
  const c3 = getContainerByDiagramId(containers, 'diagram-c3');
  const c4 = getContainerByDiagramId(containers, 'diagram-c4');
  const c5 = getContainerByDiagramId(containers, 'diagram-c5');
  const growbagContainers = containers.filter(c => c.diagramId === 'diagram-growbags');
  const potContainers = containers.filter(c => c.diagramId === 'diagram-pots');

  // Use dynamic allocation data for a diagram when both the container and its
  // allocations are present in the DB.
  const useDynamic = (container: typeof c1): container is Container =>
    container !== undefined && hasDynamic(allocations, container.id);

  return (
    <section className="section" id="diagrams">
      <div className="section-header">
        <span className="section-number">02</span>
        <h2 className="section-title">Planting <em>Diagrams</em></h2>
      </div>
      <div className="diagrams-grid">

        {/* Corner Trellis Planter */}
        <div id="diagram-c1" className="diagram-card">
          <div className="diagram-header">
            <h3>{c1?.name ?? 'Corner Trellis Planter'}</h3>
            <span className="dims">{c1?.size ?? 'right-angle triangle · 70 × 70 cm'}</span>
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

                {/* SIDE A — plants from allocations (zone "Side A"), or hardcoded fallback */}
                {useDynamic(c1)
                  ? getAllocsForContainer(allocations, plants, c1.id, 'Side A').slice(0, TRELLIS_SLOTS_SIDE_A.length).map((alloc, i) => {
                      const slot = TRELLIS_SLOTS_SIDE_A[i];
                      const emoji = alloc.plant?.emoji ?? '🌱';
                      const name = alloc.plant?.name ?? alloc.plantId;
                      return (
                        <g key={alloc.id}>
                          <circle cx={slot.cx} cy={slot.cy} r="10" fill="#c8ddb8" stroke="var(--green-mid)" strokeWidth="1.5" />
                          <text x={slot.cx} y={slot.cy + 4} fontSize="11" textAnchor="middle">{emoji}</text>
                          <text x={slot.labelX} y={slot.labelY} fontSize="8" fill="var(--green-deep)" fontFamily="'DM Mono', monospace">{name}</text>
                        </g>
                      );
                    })
                  : <>
                      <circle cx="40" cy="75" r="10" fill="#c8ddb8" stroke="var(--green-mid)" strokeWidth="1.5" />
                      <text x="40" y="79" fontSize="11" textAnchor="middle">🍅</text>
                      <text x="60" y="68" fontSize="8" fill="var(--green-deep)" fontFamily="'DM Mono', monospace">Cherry #1</text>
                      <circle cx="40" cy="125" r="10" fill="#c8ddb8" stroke="var(--green-mid)" strokeWidth="1.5" />
                      <text x="40" y="129" fontSize="11" textAnchor="middle">🍅</text>
                      <text x="60" y="118" fontSize="8" fill="var(--green-deep)" fontFamily="'DM Mono', monospace">Cherry #2</text>
                      <circle cx="40" cy="175" r="10" fill="#c8ddb8" stroke="var(--green-mid)" strokeWidth="1.5" />
                      <text x="40" y="179" fontSize="11" textAnchor="middle">🍅</text>
                      <text x="60" y="168" fontSize="8" fill="var(--green-deep)" fontFamily="'DM Mono', monospace">Cherry #3</text>
                    </>
                }

                {/* SIDE B — plants from allocations (zone "Side B"), or hardcoded fallback */}
                {useDynamic(c1)
                  ? getAllocsForContainer(allocations, plants, c1.id, 'Side B').slice(0, TRELLIS_SLOTS_SIDE_B.length).map((alloc, i) => {
                      const slot = TRELLIS_SLOTS_SIDE_B[i];
                      const emoji = alloc.plant?.emoji ?? '🌱';
                      const name = alloc.plant?.name ?? alloc.plantId;
                      return (
                        <g key={alloc.id}>
                          <circle cx={slot.cx} cy={slot.cy} r="10" fill="#c8ddb8" stroke="var(--green-mid)" strokeWidth="1.5" />
                          <text x={slot.cx} y={slot.cy + 4} fontSize="11" textAnchor="middle">{emoji}</text>
                          <text x={slot.labelX} y={slot.labelY} fontSize="8" fill="var(--green-deep)" fontFamily="'DM Mono', monospace" textAnchor="middle">{name}</text>
                        </g>
                      );
                    })
                  : <>
                      <circle cx="105" cy="225" r="10" fill="#c8ddb8" stroke="var(--green-mid)" strokeWidth="1.5" />
                      <text x="105" y="229" fontSize="11" textAnchor="middle">🍅</text>
                      <text x="105" y="249" fontSize="8" fill="var(--green-deep)" fontFamily="'DM Mono', monospace" textAnchor="middle">Beef #1</text>
                      <circle cx="185" cy="225" r="10" fill="#c8ddb8" stroke="var(--green-mid)" strokeWidth="1.5" />
                      <text x="185" y="229" fontSize="11" textAnchor="middle">🍅</text>
                      <text x="185" y="249" fontSize="8" fill="var(--green-deep)" fontFamily="'DM Mono', monospace" textAnchor="middle">Beef #2</text>
                    </>
                }

                {/* HYPOTENUSE — Marigolds & Nasturtiums (structural decoration) */}
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
                <span>🌱 plant position</span>
              </div>
            </div>
            <div className="diagram-note">{c1?.notes ?? 'Right-angle triangle planter with 70 cm trellis on each of the two right-angle sides. Marigolds & nasturtiums planted along the long (diagonal) side as companion plants.'}</div>
          </div>
        </div>

        {/* Planter 1 — Herbs */}
        <div id="diagram-c2" className="diagram-card">
          <div className="diagram-header">
            <h3>{c2?.name ?? 'Planter 1 — Herbs & Spring Onions'}</h3>
            <span className="dims">{c2?.size ?? '20 × 90 cm'}</span>
          </div>
          <div className="diagram-body">
            <div className="planter-diagram">
              {useDynamic(c2)
                ? getAllocsForContainer(allocations, plants, c2.id).map(alloc => (
                    <div key={alloc.id} className="planter-cell">
                      <span className="p-emoji">{alloc.plant?.emoji ?? '🌱'}</span>
                      <div className="p-name">{alloc.plant?.name ?? alloc.plantId}</div>
                      {alloc.zone && <div className="p-note">{alloc.zone}</div>}
                    </div>
                  ))
                : <>
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
                  </>
              }
            </div>
            <div className="diagram-note">{c2?.notes ?? 'Basil kept in grow house to avoid cold snaps — move to planter once reliably warm. Mint on hold — add next season in a pot-in-pot to contain roots.'}</div>
          </div>
        </div>

        {/* Planter 2 — Salad */}
        <div id="diagram-c3" className="diagram-card">
          <div className="diagram-header">
            <h3>{c3?.name ?? 'Planter 2 — Salad & Lettuce'}</h3>
            <span className="dims">{c3?.size ?? '20 × 90 cm'}</span>
          </div>
          <div className="diagram-body">
            <div className="planter-diagram">
              {useDynamic(c3)
                ? getAllocsForContainer(allocations, plants, c3.id).map(alloc => (
                    <div key={alloc.id} className="planter-cell">
                      <span className="p-emoji">{alloc.plant?.emoji ?? '🌱'}</span>
                      <div className="p-name">{alloc.plant?.name ?? alloc.plantId}</div>
                      {alloc.zone && <div className="p-note">{alloc.zone}</div>}
                    </div>
                  ))
                : <>
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
                  </>
              }
            </div>
            <div className="diagram-note">{c3?.notes ?? 'Keep seedlings indoors until mid–late April. Harden off gradually before transplanting. Sow small batches every 2–3 weeks for a continuous harvest.'}</div>
          </div>
        </div>

        {/* Raised Bed 1 */}
        <div id="diagram-c4" className="diagram-card">
          <div className="diagram-header">
            <h3>{c4?.name ?? 'Raised Bed 1 — Vegetables'}</h3>
            <span className="dims">{c4?.size ?? '60 × 120 cm · curved edges'}</span>
          </div>
          <div className="diagram-body">
            {useDynamic(c4)
              ? (() => {
                  const centreAllocs  = getAllocsForContainer(allocations, plants, c4.id, 'centre');
                  const innerAllocs   = getAllocsForContainer(allocations, plants, c4.id, 'inner ring');
                  const midAllocs     = getAllocsForContainer(allocations, plants, c4.id, 'mid ring').concat(
                                         getAllocsForContainer(allocations, plants, c4.id, 'outer ring'));
                  const borderAllocs  = getAllocsForContainer(allocations, plants, c4.id, 'border');
                  return (
                    <div className="oval-bed">
                      <div className="oval-ring oval-outer"></div>
                      <div className="oval-ring oval-mid"></div>
                      <div className="oval-ring oval-inner"></div>
                      <div className="oval-ring oval-centre">
                        {centreAllocs.length > 0
                          ? <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: 18 }}>{centreAllocs.map(a => a.plant?.emoji ?? '🌱').join('')}</div>
                              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'var(--green-deep)', marginTop: 2 }}>
                                {centreAllocs.map(a => a.plant?.name ?? a.plantId).join(' · ')}
                              </div>
                            </div>
                          : <div style={{ textAlign: 'center', fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'var(--muted)' }}>centre</div>
                        }
                      </div>
                      {innerAllocs[0] && <div className="oval-label left-inner" style={{ top: '50%', color: 'var(--muted)' }}>{innerAllocs[0].plant?.emoji} {innerAllocs[0].plant?.name ?? innerAllocs[0].plantId}</div>}
                      {innerAllocs[1] && <div className="oval-label right-inner" style={{ top: '50%', color: 'var(--muted)' }}>{innerAllocs[1].plant?.emoji} {innerAllocs[1].plant?.name ?? innerAllocs[1].plantId}</div>}
                      {borderAllocs[0] && <div className="oval-label top" style={{ color: 'var(--muted)', fontSize: 10 }}>{borderAllocs[0].plant?.emoji} {borderAllocs[0].plant?.name ?? borderAllocs[0].plantId}</div>}
                      {borderAllocs[1] && <div className="oval-label bottom" style={{ color: 'var(--muted)', fontSize: 10 }}>{borderAllocs[1].plant?.emoji} {borderAllocs[1].plant?.name ?? borderAllocs[1].plantId}</div>}
                      {midAllocs[0] && <div className="oval-label left-mid" style={{ top: '50%', color: 'var(--green-mid)', fontSize: 10 }}>{midAllocs[0].plant?.emoji}<br />{midAllocs[0].plant?.name ?? midAllocs[0].plantId}</div>}
                      {midAllocs[1] && <div className="oval-label right-mid" style={{ top: '50%', color: 'var(--green-mid)', fontSize: 10 }}>{midAllocs[1].plant?.emoji}<br />{midAllocs[1].plant?.name ?? midAllocs[1].plantId}</div>}
                    </div>
                  );
                })()
              : <div className="oval-bed">
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
            }
            <div className="diagram-note">{c4?.notes ?? 'Perennial kale = permanent centre, do not disturb. Purple curly kale — sow May–Jun per seed packet for Sep harvest. Nasturtiums trail beautifully over curved edges.'}</div>
          </div>
        </div>

        {/* Raised Bed 2 */}
        <div id="diagram-c5" className="diagram-card">
          <div className="diagram-header">
            <h3>{c5?.name ?? 'Raised Bed 2 — Asparagus & Brassicas'}</h3>
            <span className="dims">{c5?.size ?? '60 × 120 cm · curved edges'}</span>
          </div>
          <div className="diagram-body">
            {useDynamic(c5)
              ? (() => {
                  const centreAllocs  = getAllocsForContainer(allocations, plants, c5.id, 'centre');
                  const innerAllocs   = getAllocsForContainer(allocations, plants, c5.id, 'inner ring');
                  const midAllocs     = getAllocsForContainer(allocations, plants, c5.id, 'mid ring').concat(
                                         getAllocsForContainer(allocations, plants, c5.id, 'outer ring'));
                  const borderAllocs  = getAllocsForContainer(allocations, plants, c5.id, 'border');
                  return (
                    <div className="oval-bed">
                      <div className="oval-ring oval-outer"></div>
                      <div className="oval-ring oval-mid"></div>
                      <div className="oval-ring oval-inner"></div>
                      <div className="oval-ring oval-centre">
                        {centreAllocs.length > 0
                          ? <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: 18 }}>{centreAllocs.map(a => a.plant?.emoji ?? '🌱').join('')}</div>
                              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'var(--green-deep)', marginTop: 2 }}>
                                {centreAllocs.map(a => a.plant?.name ?? a.plantId).join(' · ')}
                              </div>
                            </div>
                          : <div style={{ textAlign: 'center', fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'var(--muted)' }}>centre</div>
                        }
                      </div>
                      {innerAllocs[0] && <div className="oval-label left-inner" style={{ top: '50%', color: 'var(--muted)', fontSize: 10 }}>{innerAllocs[0].plant?.emoji}<br />{innerAllocs[0].plant?.name ?? innerAllocs[0].plantId}</div>}
                      {innerAllocs[1] && <div className="oval-label right-inner" style={{ top: '50%', color: 'var(--muted)', fontSize: 10 }}>{innerAllocs[1].plant?.emoji}<br />{innerAllocs[1].plant?.name ?? innerAllocs[1].plantId}</div>}
                      {borderAllocs[0] && <div className="oval-label top" style={{ color: 'var(--muted)', fontSize: 10 }}>{borderAllocs[0].plant?.emoji} {borderAllocs[0].plant?.name ?? borderAllocs[0].plantId}</div>}
                      {borderAllocs[1] && <div className="oval-label bottom" style={{ color: 'var(--muted)', fontSize: 10 }}>{borderAllocs[1].plant?.emoji} {borderAllocs[1].plant?.name ?? borderAllocs[1].plantId}</div>}
                      {midAllocs[0] && <div className="oval-label left-mid" style={{ top: '50%', color: 'var(--green-mid)', fontSize: 10 }}>{midAllocs[0].plant?.emoji}<br />{midAllocs[0].plant?.name ?? midAllocs[0].plantId}</div>}
                      {midAllocs[1] && <div className="oval-label right-mid" style={{ top: '50%', color: 'var(--green-mid)', fontSize: 10 }}>{midAllocs[1].plant?.emoji}<br />{midAllocs[1].plant?.name ?? midAllocs[1].plantId}</div>}
                    </div>
                  );
                })()
              : <div className="oval-bed">
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
            }
            <div className="diagram-note">{c5?.notes ?? 'No asparagus harvest in year one — patience pays off from year two! Tenderstem broccoli at the back of inner ring as it grows tall. All brassicas need enviromesh protection.'}</div>
          </div>
        </div>

        {/* Grow Bags */}
        <div id="diagram-growbags" className="diagram-card" style={{ gridColumn: '1 / -1' }}>
          <div className="diagram-header">
            <h3>Grow Bags</h3>
            <span className="dims">40–50 L each</span>
          </div>
          <div className="diagram-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {growbagContainers.length > 0
              ? growbagContainers.map(bag => {
                  const bagAllocs = getAllocsForContainer(allocations, plants, bag.id);
                  return (
                    <div key={bag.id}>
                      <div className="growbag-diagram">
                        <span className="g-emoji">{bag.emoji}</span>
                        <div className="g-name">{bag.name}</div>
                        {bagAllocs.length > 0
                          ? <div className="g-variety">{bagAllocs.map(a => a.plant?.name ?? a.plantId).join(', ')}</div>
                          : <div className="g-variety" style={{ color: 'var(--muted)', fontStyle: 'italic' }}>{bag.size}</div>
                        }
                      </div>
                      <div className="diagram-note" style={{ marginTop: 10 }}>{bag.notes}</div>
                    </div>
                  );
                })
              : <>
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
                </>
            }
          </div>
        </div>

      </div>

      {/* Individual Pots */}
      <div id="diagram-pots" style={{ marginTop: 32 }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: 'var(--green-deep)', marginBottom: 20, fontWeight: 400 }}>
          Individual <em style={{ fontStyle: 'italic', color: 'var(--green-mid)' }}>Pots</em>
        </h3>
        <div className="pot-grid">
          {potContainers.length > 0
            ? potContainers.map(pot => {
                const potAllocs = getAllocsForContainer(allocations, plants, pot.id);
                const displayPlant = potAllocs.length > 0 ? potAllocs[0].plant : undefined;
                return (
                  <div key={pot.id} className={`pot-card${pot.onHold ? ' on-hold' : ''}`}>
                    <span className="pc-emoji">{displayPlant?.emoji ?? pot.emoji}</span>
                    <div className="pc-name">{displayPlant?.name ?? pot.name}</div>
                    <div className="pc-size">{pot.size}</div>
                    {pot.notes && <div className="pc-note">{pot.notes}</div>}
                  </div>
                );
              })
            : <>
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
                  <div className="pc-note">&apos;Bloodgood&apos; or &apos;Sango-kaku&apos;</div>
                </div>
                <div className="pot-card">
                  <span className="pc-emoji">🍓</span>
                  <div className="pc-name">Strawberries ×5</div>
                  <div className="pc-size">Individual pots</div>
                  <span className="pc-tag tag-hardy">Hardy</span>
                  <div className="pc-note">Growhouse in hard frosts</div>
                </div>
              </>
          }
        </div>
      </div>
    </section>
  );
}

