'use client';
import { useState } from 'react';
import { SignInButton } from '@clerk/nextjs';
import type { Container } from '../data/containers';
import { ContainerModal } from './ContainerModal';
import { useAppAuth } from '../contexts/AuthContext';

interface Props {
  containers: Container[];
  onAddContainer: (container: Container) => void;
  onUpdateContainer: (container: Container) => void;
  onDeleteContainer: (id: string) => void;
}

export function OverviewSection({ containers, onAddContainer, onUpdateContainer, onDeleteContainer }: Props) {
  const { clerkEnabled, isSignedIn } = useAppAuth();
  const [filter, setFilter] = useState('');
  const [editingContainer, setEditingContainer] = useState<Container | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = containers.filter(c =>
    c.name.toLowerCase().includes(filter.toLowerCase()) ||
    c.notes.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <section className="section" id="overview">
      <div className="section-header">
        <span className="section-number">01</span>
        <h2 className="section-title">Container <em>Overview</em></h2>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="🔍 Filter containers..."
          style={{ flex: 1, minWidth: 200, maxWidth: 400, padding: '10px 14px', border: '1px solid var(--cream-dark)', borderRadius: 8, fontFamily: 'inherit', fontSize: 13, background: 'white', color: 'var(--ink)' }}
        />
        {isSignedIn && (
          <button
            onClick={() => setShowAddModal(true)}
            style={{ padding: '10px 20px', background: 'var(--green-deep)', border: 'none', borderRadius: 8, color: 'var(--cream)', cursor: 'pointer', fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', whiteSpace: 'nowrap' }}
          >
            + Add Container
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

      <div className="overview-grid">
        {filtered.map(c => (
          <div
            key={c.id}
            className="overview-card"
            style={{ opacity: c.onHold ? 0.55 : 1, cursor: c.diagramId ? 'pointer' : 'default', position: 'relative' }}
            onClick={() => {
              if (c.diagramId) {
                document.getElementById(c.diagramId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
          >
            {isSignedIn && (
              <div
                style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 4, zIndex: 1 }}
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={() => setEditingContainer(c)}
                  style={{ padding: '3px 6px', background: 'var(--green-wash)', border: '1px solid var(--green-pale)', borderRadius: 6, cursor: 'pointer', fontSize: 11, color: 'var(--green-deep)' }}
                  title="Edit container"
                >✏️</button>
                <button
                  onClick={() => { if (window.confirm(`Remove "${c.name}"?`)) onDeleteContainer(c.id); }}
                  style={{ padding: '3px 6px', background: 'rgba(184,92,42,0.1)', border: '1px solid rgba(184,92,42,0.2)', borderRadius: 6, cursor: 'pointer', fontSize: 11, color: 'var(--rust)' }}
                  title="Delete container"
                >🗑️</button>
              </div>
            )}
            <div className="container-name">{c.emoji} {c.name}</div>
            <div className="container-size">{c.size}</div>
            <div className="container-use">{c.notes}</div>
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

      {editingContainer && (
        <ContainerModal
          container={editingContainer}
          onSave={c => { onUpdateContainer(c); setEditingContainer(null); }}
          onClose={() => setEditingContainer(null)}
        />
      )}
      {showAddModal && (
        <ContainerModal
          onSave={c => { onAddContainer(c); setShowAddModal(false); }}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </section>
  );
}

