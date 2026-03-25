import { useState } from 'react';
import type { Plant, PlantStage } from '../data/plants';
import { stageLabels, stageColors } from '../data/plants';
import { PlantModal } from './PlantModal';
import type { WeatherData } from '../hooks/useWeather';
import type { ShoppingItem } from '../data/shopping';

type Tab = 'in-progress' | 'seeds-needed' | 'plants-needed' | 'on-hold';

interface Props {
  plants: Plant[];
  onUpdatePlant: (plant: Plant) => void;
  onAddPlant: (plant: Plant) => void;
  onDeletePlant: (id: string) => void;
  currentWeather: WeatherData | null;
  shoppingItems: ShoppingItem[];
  onToggleShoppingItem: (id: string) => void;
}

const stageOrder: PlantStage[] = ['sown', 'sprouted', 'chitting', 'hardening-off', 'planted', 'flowering', 'fruiting', 'harvesting', 'dormant'];

const futureTrees = [
  { emoji: '🍎', name: 'Apple', variety: "'Falstaff' on M27 rootstock", note: 'Self-fertile; beautiful spring blossom' },
  { emoji: '🍒', name: 'Cherry', variety: "'Stella' (self-fertile)", note: 'Great in a large pot; net when fruiting' },
  { emoji: '🍑', name: 'Plum', variety: "'Victoria' on Pixy rootstock", note: 'Very productive; self-fertile' },
];

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

export function SeedsSection({ plants, onUpdatePlant, onAddPlant, onDeletePlant, currentWeather, shoppingItems, onToggleShoppingItem }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('in-progress');
  const [filter, setFilter] = useState('');
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = plants.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase()) ||
    p.placement.toLowerCase().includes(filter.toLowerCase())
  );

  const cycleStage = (plant: Plant) => {
    const idx = stageOrder.indexOf(plant.stage);
    const nextStage = stageOrder[(idx + 1) % stageOrder.length];
    onUpdatePlant({ ...plant, stage: nextStage });
  };

  const isAtRisk = (plant: Plant) =>
    currentWeather !== null && plant.frostSensitive && currentWeather.temperature < (plant.minTemp ?? 10);

  const seedsNeeded = shoppingItems.filter(i => i.category === 'seeds');
  const plantsNeeded = shoppingItems.filter(i => i.category === 'plants');
  const onHoldItems = shoppingItems.filter(i => i.category === 'on-hold');

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'in-progress', label: '🌱 In Progress', count: plants.length },
    { key: 'seeds-needed', label: '🛒 Seeds Needed', count: seedsNeeded.filter(i => !i.bought).length > 0 ? seedsNeeded.filter(i => !i.bought).length : undefined },
    { key: 'plants-needed', label: '🌳 Plants Needed', count: plantsNeeded.filter(i => !i.bought).length > 0 ? plantsNeeded.filter(i => !i.bought).length : undefined },
    { key: 'on-hold', label: '⏸️ On Hold / Future' },
  ];

  return (
    <section className="section" id="seeds">
      <div className="section-header">
        <span className="section-number">03</span>
        <h2 className="section-title">Plant <em>List</em></h2>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '8px 16px',
              borderRadius: 20,
              border: '1px solid',
              borderColor: activeTab === tab.key ? 'var(--green-mid)' : 'var(--cream-dark)',
              background: activeTab === tab.key ? 'var(--green-mid)' : 'white',
              color: activeTab === tab.key ? 'white' : 'var(--muted)',
              cursor: 'pointer',
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              letterSpacing: 0.5,
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span style={{
                background: activeTab === tab.key ? 'rgba(255,255,255,0.3)' : 'var(--cream-dark)',
                color: activeTab === tab.key ? 'white' : 'var(--muted)',
                borderRadius: 10,
                padding: '1px 6px',
                fontSize: 10,
              }}>{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── In Progress ── */}
      {activeTab === 'in-progress' && (
        <>
          <div style={{ marginBottom: 12, fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
            Click the stage badge to advance a plant's growth stage. Use the quick-links (🪴 🌡️ 🐛) on each row to jump to its container diagram, temperature guide, or pest advice.
          </div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              value={filter}
              onChange={e => setFilter(e.target.value)}
              placeholder="🔍 Filter by plant name or planter..."
              style={{ flex: 1, minWidth: 200, padding: '10px 14px', border: '1px solid var(--cream-dark)', borderRadius: 8, fontFamily: 'inherit', fontSize: 13, background: 'white', color: 'var(--ink)' }}
            />
            <button
              onClick={() => setShowAddModal(true)}
              style={{ padding: '10px 20px', background: 'var(--green-deep)', border: 'none', borderRadius: 8, color: 'var(--cream)', cursor: 'pointer', fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', whiteSpace: 'nowrap' }}
            >
              + Add Plant
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="seed-table">
              <thead>
                <tr>
                  <th>Crop</th>
                  <th>Stage</th>
                  <th>Next Step</th>
                  <th>Placement</th>
                  <th style={{ width: 130 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(plant => (
                  <tr key={plant.id} style={{ background: isAtRisk(plant) ? 'rgba(184,92,42,0.06)' : undefined }}>
                    <td>
                      <span className="crop-name">
                        {isAtRisk(plant) && <span title="At risk in current weather conditions" style={{ marginRight: 6 }}>⚠️</span>}
                        {plant.emoji} {plant.name}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => cycleStage(plant)}
                        className={`stage-badge ${stageColors[plant.stage]}`}
                        title="Click to advance stage"
                        style={{ cursor: 'pointer', border: 'none', display: 'inline-block' }}
                      >
                        {stageLabels[plant.stage]}
                      </button>
                    </td>
                    <td>{plant.nextStep}</td>
                    <td>{plant.placement}</td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {/* Quick-nav links */}
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button
                            onClick={() => scrollTo('diagrams')}
                            style={{ padding: '4px 7px', background: 'rgba(74,122,50,0.1)', border: '1px solid var(--green-pale)', borderRadius: 6, cursor: 'pointer', fontSize: 12, color: 'var(--green-deep)' }}
                            title="View container diagram"
                          >🪴</button>
                          <button
                            onClick={() => scrollTo('temps')}
                            style={{ padding: '4px 7px', background: 'rgba(200,168,75,0.1)', border: '1px solid rgba(200,168,75,0.3)', borderRadius: 6, cursor: 'pointer', fontSize: 12, color: 'var(--soil)' }}
                            title="Temperature guide"
                          >🌡️</button>
                          <button
                            onClick={() => scrollTo('pests')}
                            style={{ padding: '4px 7px', background: 'rgba(184,92,42,0.08)', border: '1px solid rgba(184,92,42,0.2)', borderRadius: 6, cursor: 'pointer', fontSize: 12, color: 'var(--rust)' }}
                            title="Pest protection guide"
                          >🐛</button>
                        </div>
                        {/* Edit / delete */}
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button
                            onClick={() => setEditingPlant(plant)}
                            style={{ padding: '4px 7px', background: 'var(--green-wash)', border: '1px solid var(--green-pale)', borderRadius: 6, cursor: 'pointer', fontSize: 12, color: 'var(--green-deep)' }}
                            title="Edit"
                          >✏️</button>
                          <button
                            onClick={() => { if (window.confirm(`Remove ${plant.name}?`)) onDeletePlant(plant.id); }}
                            style={{ padding: '4px 7px', background: 'rgba(184,92,42,0.1)', border: '1px solid rgba(184,92,42,0.2)', borderRadius: 6, cursor: 'pointer', fontSize: 12, color: 'var(--rust)' }}
                            title="Delete"
                          >🗑️</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)', fontStyle: 'italic', padding: 24 }}>
                      No plants match your filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── Seeds Still Needed ── */}
      {activeTab === 'seeds-needed' && (
        <>
          <div style={{ marginBottom: 16, fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
            Seeds still to buy this season. Click a card to mark as purchased.
          </div>
          <div className="shop-items">
            {seedsNeeded.map(item => (
              <div
                key={item.id}
                className="shop-item"
                style={{ opacity: item.bought ? 0.6 : 1, cursor: 'pointer', transition: 'all 0.2s', position: 'relative', userSelect: 'none' }}
                onClick={() => onToggleShoppingItem(item.id)}
              >
                {item.bought && (
                  <div style={{ position: 'absolute', top: 12, right: 12, width: 22, height: 22, background: 'var(--green-mid)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12 }}>✓</div>
                )}
                <div className="si-name" style={{ textDecoration: item.bought ? 'line-through' : 'none', paddingRight: item.bought ? 28 : 0 }}>{item.name}</div>
                <div className="si-variety">{item.variety}</div>
                <div className="si-note">{item.note}</div>
              </div>
            ))}
          </div>
          {seedsNeeded.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--muted)', fontStyle: 'italic', padding: 40 }}>All seeds purchased! 🎉</div>
          )}
        </>
      )}

      {/* ── Plants Still Needed ── */}
      {activeTab === 'plants-needed' && (
        <>
          <div style={{ marginBottom: 16, fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
            Plants still to buy this season. Click a card to mark as purchased.
          </div>
          <div className="shop-items">
            {plantsNeeded.map(item => (
              <div
                key={item.id}
                className="shop-item"
                style={{ opacity: item.bought ? 0.6 : 1, cursor: 'pointer', transition: 'all 0.2s', position: 'relative', userSelect: 'none' }}
                onClick={() => onToggleShoppingItem(item.id)}
              >
                {item.bought && (
                  <div style={{ position: 'absolute', top: 12, right: 12, width: 22, height: 22, background: 'var(--green-mid)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12 }}>✓</div>
                )}
                <div className="si-name" style={{ textDecoration: item.bought ? 'line-through' : 'none', paddingRight: item.bought ? 28 : 0 }}>{item.name}</div>
                <div className="si-variety">{item.variety}</div>
                <div className="si-note">{item.note}</div>
              </div>
            ))}
          </div>
          {plantsNeeded.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--muted)', fontStyle: 'italic', padding: 40 }}>All plants purchased! 🎉</div>
          )}
        </>
      )}

      {/* ── On Hold / Future Seasons ── */}
      {activeTab === 'on-hold' && (
        <>
          <div style={{ background: 'var(--green-wash)', border: '1px solid var(--green-pale)', borderRadius: 12, padding: 20, marginBottom: 28, fontSize: 13, lineHeight: 1.8, color: 'var(--muted)' }}>
            🌳 Items deferred to future seasons — once the garden layout is confirmed (swing, seating, and other features) so placement can complement the space. Consider sun &amp; shade patterns, pollination pairs, and proximity to seating.
          </div>

          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 400, color: 'var(--green-deep)', marginBottom: 14 }}>
            ⏸️ Deferred Purchases
          </div>
          <div className="shop-items" style={{ marginBottom: 36 }}>
            {onHoldItems.map(item => (
              <div
                key={item.id}
                className="shop-item on-hold"
                style={{ cursor: 'pointer', transition: 'all 0.2s', position: 'relative', userSelect: 'none', opacity: item.bought ? 0.4 : 0.6 }}
                onClick={() => onToggleShoppingItem(item.id)}
              >
                {item.bought && (
                  <div style={{ position: 'absolute', top: 12, right: 12, width: 22, height: 22, background: 'var(--green-mid)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12 }}>✓</div>
                )}
                <div className="si-name" style={{ textDecoration: item.bought ? 'line-through' : 'none', paddingRight: item.bought ? 28 : 0 }}>{item.name}</div>
                <div className="si-variety">{item.variety}</div>
                <div className="si-note">{item.note}</div>
              </div>
            ))}
          </div>

          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 400, color: 'var(--green-deep)', marginBottom: 14 }}>
            🌳 Future Fruit Trees
          </div>
          <div className="trees-grid">
            {futureTrees.map(tree => (
              <div key={tree.name} className="tree-card">
                <span className="tr-emoji">{tree.emoji}</span>
                <div className="tr-name">{tree.name}</div>
                <div className="tr-variety">{tree.variety}</div>
                <div className="tr-note">{tree.note}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {editingPlant && (
        <PlantModal
          plant={editingPlant}
          onSave={p => { onUpdatePlant(p); setEditingPlant(null); }}
          onClose={() => setEditingPlant(null)}
        />
      )}
      {showAddModal && (
        <PlantModal
          onSave={p => { onAddPlant(p); setShowAddModal(false); }}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </section>
  );
}
