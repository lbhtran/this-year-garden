import { useState } from 'react';
import type { Container } from '../data/containers';

interface Props {
  containers: Container[];
}

export function OverviewSection({ containers }: Props) {
  const [filter, setFilter] = useState('');

  const filtered = containers.filter(c =>
    c.name.toLowerCase().includes(filter.toLowerCase()) ||
    c.use.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <section className="section" id="overview">
      <div className="section-header">
        <span className="section-number">01</span>
        <h2 className="section-title">Container <em>Overview</em></h2>
      </div>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="🔍 Filter containers..."
          style={{ width: '100%', maxWidth: 400, padding: '10px 14px', border: '1px solid var(--cream-dark)', borderRadius: 8, fontFamily: 'inherit', fontSize: 13, background: 'white', color: 'var(--ink)' }}
        />
      </div>

      <div className="overview-grid">
        {filtered.map(c => (
          <div
            key={c.id}
            className="overview-card"
            style={{ opacity: c.onHold ? 0.55 : 1, cursor: c.diagramId ? 'pointer' : 'default' }}
            onClick={() => {
              if (c.diagramId) {
                document.getElementById(c.diagramId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
          >
            <div className="container-name">{c.emoji} {c.name}</div>
            <div className="container-size">{c.size}</div>
            <div className="container-use">{c.use}</div>
            {c.onHold && <span className="on-hold-badge">Deferred</span>}
            {c.diagramId && (
              <div className="container-diagram-link">
                view diagram →
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', color: 'var(--muted)', fontStyle: 'italic', textAlign: 'center', padding: 24 }}>
            No containers match your filter.
          </div>
        )}
      </div>
    </section>
  );
}
