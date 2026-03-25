import { useState } from 'react';
import type { Plant, PlantStage, ContainerStop, ContainerStatus } from '../data/plants';
import { stageLabels } from '../data/plants';

interface Props {
  plant?: Plant;
  onSave: (plant: Plant) => void;
  onClose: () => void;
}

const stages: PlantStage[] = ['wishlist', 'sourced', 'sown', 'sprouted', 'chitting', 'hardening-off', 'planted', 'flowering', 'fruiting', 'harvesting', 'dormant'];
const containerStatuses: ContainerStatus[] = ['past', 'current', 'future'];
const containerStatusLabels: Record<ContainerStatus, string> = { past: 'Past', current: 'Now', future: 'Next' };

export function PlantModal({ plant, onSave, onClose }: Props) {
  const isNew = !plant;
  const [form, setForm] = useState<Plant>(() => plant || {
    id: `plant-${crypto.randomUUID()}`,
    emoji: '🌱',
    name: '',
    stage: 'wishlist',
    nextStep: '',
    placement: '',
    containers: [],
    frostSensitive: false,
    minTemp: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form);
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(26,36,16,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={onClose}
    >
      <div
        style={{ background: 'var(--cream)', borderRadius: 16, padding: 32, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 400, color: 'var(--green-deep)' }}>
            {isNew ? '🌱 Add New Plant' : `✏️ Edit ${plant!.name}`}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--muted)', padding: 4 }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 12 }}>
            <div>
              <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Emoji</label>
              <input
                value={form.emoji}
                onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--cream-dark)', borderRadius: 8, fontFamily: 'inherit', fontSize: 20, background: 'white', textAlign: 'center' }}
              />
            </div>
            <div>
              <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Plant Name *</label>
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
                placeholder="e.g. Cherry Tomatoes"
                style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--cream-dark)', borderRadius: 8, fontFamily: 'inherit', fontSize: 14, background: 'white' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Stage</label>
            <select
              value={form.stage}
              onChange={e => setForm(f => ({ ...f, stage: e.target.value as PlantStage }))}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--cream-dark)', borderRadius: 8, fontFamily: 'inherit', fontSize: 14, background: 'white', cursor: 'pointer' }}
            >
              {stages.map(s => <option key={s} value={s}>{stageLabels[s]}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Next Step</label>
            <input
              value={form.nextStep}
              onChange={e => setForm(f => ({ ...f, nextStep: e.target.value }))}
              placeholder="e.g. Thin to 5cm spacing"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--cream-dark)', borderRadius: 8, fontFamily: 'inherit', fontSize: 14, background: 'white' }}
            />
          </div>

          <div>
            <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Placement</label>
            <input
              value={form.placement}
              onChange={e => setForm(f => ({ ...f, placement: e.target.value }))}
              placeholder="e.g. Raised Bed 1"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--cream-dark)', borderRadius: 8, fontFamily: 'inherit', fontSize: 14, background: 'white' }}
            />
          </div>

          {/* Container journey */}
          <div>
            <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Container Journey</label>
            {(form.containers ?? []).map((stop: ContainerStop, i: number) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '100px 1fr auto', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                <select
                  value={stop.status}
                  onChange={e => setForm(f => {
                    const updated = [...(f.containers ?? [])];
                    updated[i] = { ...updated[i], status: e.target.value as ContainerStatus };
                    return { ...f, containers: updated };
                  })}
                  style={{ padding: '8px 10px', border: '1px solid var(--cream-dark)', borderRadius: 8, fontFamily: 'inherit', fontSize: 13, background: 'white', cursor: 'pointer' }}
                >
                  {containerStatuses.map(s => <option key={s} value={s}>{containerStatusLabels[s]}</option>)}
                </select>
                <input
                  value={stop.label}
                  onChange={e => setForm(f => {
                    const updated = [...(f.containers ?? [])];
                    updated[i] = { ...updated[i], label: e.target.value };
                    return { ...f, containers: updated };
                  })}
                  placeholder="e.g. Seed tray (indoors)"
                  style={{ padding: '8px 10px', border: '1px solid var(--cream-dark)', borderRadius: 8, fontFamily: 'inherit', fontSize: 13, background: 'white' }}
                />
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, containers: (f.containers ?? []).filter((_, j) => j !== i) }))}
                  style={{ background: 'none', border: '1px solid var(--cream-dark)', borderRadius: 8, cursor: 'pointer', fontSize: 14, color: 'var(--muted)', padding: '6px 10px' }}
                  title="Remove this stop"
                >✕</button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setForm(f => ({ ...f, containers: [...(f.containers ?? []), { label: '', status: 'current' as ContainerStatus }] }))}
              style={{ padding: '7px 14px', border: '1px dashed var(--green-mid)', borderRadius: 8, background: 'transparent', cursor: 'pointer', fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--green-mid)' }}
            >+ Add stop</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Min Temp (°C)</label>
              <input
                type="number"
                value={form.minTemp ?? 0}
                onChange={e => setForm(f => ({ ...f, minTemp: Number(e.target.value) }))}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--cream-dark)', borderRadius: 8, fontFamily: 'inherit', fontSize: 14, background: 'white' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 24 }}>
              <input
                type="checkbox"
                id="frostSensitive"
                checked={form.frostSensitive || false}
                onChange={e => setForm(f => ({ ...f, frostSensitive: e.target.checked }))}
                style={{ width: 16, height: 16, cursor: 'pointer' }}
              />
              <label htmlFor="frostSensitive" style={{ fontSize: 13, color: 'var(--ink)', cursor: 'pointer' }}>Frost sensitive</label>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button
              type="button"
              onClick={onClose}
              style={{ flex: 1, padding: '12px', border: '1px solid var(--cream-dark)', borderRadius: 8, background: 'white', cursor: 'pointer', fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--muted)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ flex: 2, padding: '12px', border: 'none', borderRadius: 8, background: 'var(--green-deep)', cursor: 'pointer', fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--cream)', fontWeight: 500 }}
            >
              {isNew ? '+ Add Plant' : '✓ Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
