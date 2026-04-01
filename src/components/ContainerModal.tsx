import { useState } from 'react';
import type { Container } from '../data/containers';

interface Props {
  container?: Container;
  onSave: (container: Container) => void;
  onClose: () => void;
}

const containerTypes = [
  { value: 'trellis_planter', label: 'Trellis Planter' },
  { value: 'planter',         label: 'Planter' },
  { value: 'raised_bed',      label: 'Raised Bed' },
  { value: 'grow_bag',        label: 'Grow Bag' },
  { value: 'pot',             label: 'Pot' },
];

const labelStyle = {
  fontFamily: "'DM Mono', monospace",
  fontSize: 10,
  letterSpacing: 1,
  textTransform: 'uppercase' as const,
  color: 'var(--muted)',
  display: 'block',
  marginBottom: 6,
};

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid var(--cream-dark)',
  borderRadius: 8,
  fontFamily: 'inherit',
  fontSize: 14,
  background: 'white',
  color: 'var(--ink)',
  boxSizing: 'border-box' as const,
};

export function ContainerModal({ container, onSave, onClose }: Props) {
  const isNew = !container;
  const [form, setForm] = useState<Container>(() => container ?? {
    id: `container-${crypto.randomUUID()}`,
    emoji: '🪴',
    name: '',
    type: 'planter',
    size: '',
    notes: '',
    onHold: false,
    diagramId: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave({
      ...form,
      diagramId: form.diagramId?.trim() || undefined,
    });
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(26,36,16,0.6)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: 16, overflowY: 'auto' }}
      onClick={onClose}
    >
      <div
        style={{ background: 'var(--cream)', borderRadius: 16, padding: 32, width: '100%', maxWidth: 520, margin: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 400, color: 'var(--green-deep)' }}>
            {isNew ? '🪴 Add Container' : `✏️ Edit ${container!.name}`}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--muted)', padding: 4 }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Emoji + Name */}
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Emoji</label>
              <input
                value={form.emoji}
                onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))}
                style={{ ...inputStyle, fontSize: 20, textAlign: 'center' }}
              />
            </div>
            <div>
              <label style={labelStyle}>Name *</label>
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
                placeholder="e.g. Corner Trellis Planter"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Type */}
          <div>
            <label style={labelStyle}>Type</label>
            <select
              value={form.type ?? ''}
              onChange={e => setForm(f => ({ ...f, type: e.target.value || undefined }))}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="">— select type —</option>
              {containerTypes.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Size */}
          <div>
            <label style={labelStyle}>Size</label>
            <input
              value={form.size}
              onChange={e => setForm(f => ({ ...f, size: e.target.value }))}
              placeholder="e.g. 60 × 120 cm"
              style={inputStyle}
            />
          </div>

          {/* Notes */}
          <div>
            <label style={labelStyle}>Notes / Use</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="What's planted here, any special notes…"
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* Diagram ID + On Hold */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'end' }}>
            <div>
              <label style={labelStyle}>Diagram ID (optional)</label>
              <input
                value={form.diagramId ?? ''}
                onChange={e => setForm(f => ({ ...f, diagramId: e.target.value }))}
                placeholder="e.g. diagram-c1"
                style={inputStyle}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 2 }}>
              <input
                type="checkbox"
                id="onHold"
                checked={form.onHold ?? false}
                onChange={e => setForm(f => ({ ...f, onHold: e.target.checked }))}
                style={{ width: 16, height: 16, cursor: 'pointer' }}
              />
              <label htmlFor="onHold" style={{ fontSize: 13, color: 'var(--ink)', cursor: 'pointer', whiteSpace: 'nowrap' }}>On hold / deferred</label>
            </div>
          </div>

          {/* Actions */}
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
              {isNew ? '+ Add Container' : '✓ Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
