import { useState } from 'react';
import type { Plant, PlantStage } from '../data/plants';
import { stageLabels, stageColors } from '../data/plants';
import { PlantModal } from './PlantModal';
import type { WeatherData } from '../hooks/useWeather';

interface Props {
  plants: Plant[];
  onUpdatePlant: (plant: Plant) => void;
  onAddPlant: (plant: Plant) => void;
  onDeletePlant: (id: string) => void;
  currentWeather: WeatherData | null;
}

const stageOrder: PlantStage[] = ['sown', 'sprouted', 'chitting', 'hardening-off', 'planted', 'flowering', 'fruiting', 'harvesting', 'dormant'];

export function SeedsSection({ plants, onUpdatePlant, onAddPlant, onDeletePlant, currentWeather }: Props) {
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

  return (
    <section className="section" id="seeds">
      <div className="section-header">
        <span className="section-number">03</span>
        <h2 className="section-title">Current <em>Sown Seeds</em></h2>
      </div>

      {/* Controls */}
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
              <th style={{ width: 90 }}>Actions</th>
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
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => setEditingPlant(plant)}
                      style={{ padding: '4px 8px', background: 'var(--green-wash)', border: '1px solid var(--green-pale)', borderRadius: 6, cursor: 'pointer', fontSize: 12, color: 'var(--green-deep)' }}
                      title="Edit"
                    >✏️</button>
                    <button
                      onClick={() => { if (window.confirm(`Remove ${plant.name}?`)) onDeletePlant(plant.id); }}
                      style={{ padding: '4px 8px', background: 'rgba(184,92,42,0.1)', border: '1px solid rgba(184,92,42,0.2)', borderRadius: 6, cursor: 'pointer', fontSize: 12, color: 'var(--rust)' }}
                      title="Delete"
                    >🗑️</button>
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
