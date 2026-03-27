'use client';
import { useState } from 'react';
import { SignInButton } from '@clerk/nextjs';
import type { Plant, PlantStage } from '../data/plants';
import { stageLabels, stageColors } from '../data/plants';
import { PlantModal } from './PlantModal';
import { PlantDetailModal } from './PlantDetailModal';
import type { WeatherData } from '../hooks/useWeather';
import { useAppAuth } from '../contexts/AuthContext';

type Tab = 'all' | 'growing' | 'wishlist';

interface Props {
  plants: Plant[];
  onUpdatePlant: (plant: Plant) => void;
  onAddPlant: (plant: Plant) => void;
  onDeletePlant: (id: string) => void;
  currentWeather: WeatherData | null;
  isSignedIn: boolean;
}

const stageOrder: PlantStage[] = [
  'wishlist', 'sourced',
  'sown', 'sprouted', 'chitting',
  'hardening-off', 'planted',
  'flowering', 'fruiting', 'harvesting',
  'dormant',
];

const growingStages = new Set<PlantStage>(['sown', 'sprouted', 'chitting', 'hardening-off', 'planted', 'flowering', 'fruiting', 'harvesting', 'dormant']);
const wishlistStages = new Set<PlantStage>(['wishlist', 'sourced']);

export function SeedsSection({ plants, onUpdatePlant, onAddPlant, onDeletePlant, currentWeather, isSignedIn }: Props) {
  const { clerkEnabled } = useAppAuth();
  const [activeTab, setActiveTab] = useState<Tab>('growing');
  const [filter, setFilter] = useState('');
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
  const [viewingPlant, setViewingPlant] = useState<Plant | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const cycleStage = (plant: Plant, e: React.MouseEvent) => {
    e.stopPropagation();
    const idx = stageOrder.indexOf(plant.stage);
    const nextStage = stageOrder[(idx + 1) % stageOrder.length];
    onUpdatePlant({ ...plant, stage: nextStage });
  };

  const isAtRisk = (plant: Plant) =>
    currentWeather !== null && plant.frostSensitive && currentWeather.temperature < (plant.minTemp ?? 10);

  const tabFiltered = plants.filter(p => {
    if (activeTab === 'growing') return growingStages.has(p.stage);
    if (activeTab === 'wishlist') return wishlistStages.has(p.stage);
    return true;
  });

  const filtered = tabFiltered.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase()) ||
    p.placement.toLowerCase().includes(filter.toLowerCase())
  );

  const growingCount = plants.filter(p => growingStages.has(p.stage)).length;
  const wishlistCount = plants.filter(p => wishlistStages.has(p.stage)).length;

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'all', label: '🌿 All Plants', count: plants.length },
    { key: 'growing', label: '🌱 Growing', count: growingCount },
    { key: 'wishlist', label: '🌟 Wishlist', count: wishlistCount },
  ];

  return (
    <section className="section" id="seeds">
      <div className="section-header">
        <span className="section-number">03</span>
        <h2 className="section-title">Plant <em>Database</em></h2>
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
            <span style={{
              background: activeTab === tab.key ? 'rgba(255,255,255,0.3)' : 'var(--cream-dark)',
              color: activeTab === tab.key ? 'white' : 'var(--muted)',
              borderRadius: 10,
              padding: '1px 6px',
              fontSize: 10,
            }}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Hint */}
      <div style={{ marginBottom: 14, fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
        Click a plant name to see its full overview — container, temperature guide, and pest advice.
        {activeTab === 'growing' && ' Click the stage badge to advance its growth stage.'}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="🔍 Filter by plant name or placement..."
          style={{ flex: 1, minWidth: 200, padding: '10px 14px', border: '1px solid var(--cream-dark)', borderRadius: 8, fontFamily: 'inherit', fontSize: 13, background: 'white', color: 'var(--ink)' }}
        />
        {isSignedIn && (
          <button
            onClick={() => setShowAddModal(true)}
            style={{ padding: '10px 20px', background: 'var(--green-deep)', border: 'none', borderRadius: 8, color: 'var(--cream)', cursor: 'pointer', fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', whiteSpace: 'nowrap' }}
          >
            + Add Plant
          </button>
        )}
        {!isSignedIn && (
          clerkEnabled ? (
            <SignInButton mode="modal">
              <button style={{ padding: '10px 20px', background: 'none', border: '1px solid var(--green-mid)', borderRadius: 8, color: 'var(--green-deep)', cursor: 'pointer', fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                Sign in to manage
              </button>
            </SignInButton>
          ) : (
            <button disabled style={{ padding: '10px 20px', background: 'none', border: '1px solid var(--green-pale)', borderRadius: 8, color: 'var(--muted)', cursor: 'default', fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', whiteSpace: 'nowrap', opacity: 0.6 }}>
              Sign in to manage
            </button>
          )
        )}
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table className="seed-table">
          <thead>
            <tr>
              <th>Crop</th>
              <th>Stage</th>
              <th>Next Step</th>
              <th>Placement</th>
              <th style={{ width: 80 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(plant => (
              <tr
                key={plant.id}
                style={{ background: isAtRisk(plant) ? 'rgba(184,92,42,0.06)' : undefined, cursor: 'pointer' }}
                onClick={() => setViewingPlant(plant)}
                title="Click for full plant overview"
              >
                <td>
                  <span className="crop-name" style={{ color: 'var(--green-deep)', textDecoration: 'underline', textDecorationColor: 'var(--green-pale)', textUnderlineOffset: 3 }}>
                    {isAtRisk(plant) && <span title="At risk in current weather conditions" style={{ marginRight: 6 }}>⚠️</span>}
                    {plant.emoji} {plant.name}
                  </span>
                </td>
                <td>
                  <button
                    onClick={e => { e.stopPropagation(); if (isSignedIn) cycleStage(plant, e); }}
                    className={`stage-badge ${stageColors[plant.stage]}`}
                    title={isSignedIn ? 'Click to advance stage' : 'Sign in to edit'}
                    style={{ cursor: isSignedIn ? 'pointer' : 'default', border: 'none', display: 'inline-block' }}
                  >
                    {stageLabels[plant.stage]}
                  </button>
                </td>
                <td>{plant.nextStep}</td>
                <td>{plant.placement}</td>
                <td>
                  {isSignedIn && (
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        onClick={e => { e.stopPropagation(); setEditingPlant(plant); }}
                        style={{ padding: '4px 7px', background: 'var(--green-wash)', border: '1px solid var(--green-pale)', borderRadius: 6, cursor: 'pointer', fontSize: 12, color: 'var(--green-deep)' }}
                        title="Edit"
                      >✏️</button>
                      <button
                        onClick={e => { e.stopPropagation(); if (window.confirm(`Remove ${plant.name}?`)) onDeletePlant(plant.id); }}
                        style={{ padding: '4px 7px', background: 'rgba(184,92,42,0.1)', border: '1px solid rgba(184,92,42,0.2)', borderRadius: 6, cursor: 'pointer', fontSize: 12, color: 'var(--rust)' }}
                        title="Delete"
                      >🗑️</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)', fontStyle: 'italic', padding: 24 }}>
                  {filter ? 'No plants match your filter.' : activeTab === 'wishlist' ? 'Nothing on the wishlist yet.' : 'No plants here yet.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {viewingPlant && (
        <PlantDetailModal
          plant={viewingPlant}
          onClose={() => setViewingPlant(null)}
          onEdit={p => { setViewingPlant(null); setEditingPlant(p); }}
        />
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
