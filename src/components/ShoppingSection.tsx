import { useState } from 'react';
import type { ShoppingItem } from '../data/shopping';

interface Props {
  items: ShoppingItem[];
  onToggle: (id: string) => void;
  isSignedIn: boolean;
}

const categories = [
  { key: 'all', label: 'All' },
  { key: 'seeds', label: '🌱 Seeds' },
  { key: 'plants', label: '🌳 Plants' },
  { key: 'pest-protection', label: '🛡️ Pest Protection' },
  { key: 'supplies', label: '🪴 Supplies' },
  { key: 'on-hold', label: '⏸️ On Hold' },
];

const priorityLabels: Record<string, string> = {
  high: 'Buy Soon',
  medium: 'Get Ready',
  low: 'When Needed',
  hold: 'Deferred',
};

const priorityClasses: Record<string, string> = {
  high: 'priority-high',
  medium: 'priority-med',
  low: 'priority-low',
  hold: 'priority-hold',
};

const categoryTitles: Record<string, string> = {
  seeds: '🌱 Seeds Still Needed',
  plants: '🌳 Plants Still Needed',
  'pest-protection': '🛡️ Pest Protection',
  supplies: '🪴 Compost & Supplies',
  'on-hold': '⏸️ On Hold — Future Seasons',
};

export function ShoppingSection({ items, onToggle, isSignedIn }: Props) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [showBought, setShowBought] = useState(false);

  const filtered = items.filter(item => {
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    if (!showBought && item.bought) return false;
    return true;
  });

  const groupedByCategory = (['seeds', 'plants', 'pest-protection', 'supplies', 'on-hold'] as const)
    .map(cat => ({
      cat,
      items: filtered.filter(i => i.category === cat),
      // use the first non-bought item's priority, or any item's priority
      priority: items.find(i => i.category === cat)?.priority || 'medium',
    }))
    .filter(g => g.items.length > 0);

  const totalBought = items.filter(i => i.bought && i.category !== 'on-hold').length;
  const totalItems = items.filter(i => i.category !== 'on-hold').length;

  return (
    <section className="section" id="shopping">
      <div className="section-header">
        <span className="section-number">04</span>
        <h2 className="section-title">Shopping <em>List</em></h2>
      </div>

      {/* Progress bar */}
      <div style={{ background: 'white', border: '1px solid var(--cream-dark)', borderRadius: 12, padding: '16px 20px', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--muted)' }}>Shopping Progress</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--green-deep)', fontWeight: 500 }}>{totalBought} / {totalItems} items</span>
        </div>
        <div style={{ background: 'var(--cream-dark)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--green-mid), var(--green-light))', width: `${totalItems > 0 ? (totalBought / totalItems) * 100 : 0}%`, transition: 'width 0.3s ease', borderRadius: 4 }} />
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        {categories.map(c => (
          <button
            key={c.key}
            onClick={() => setActiveCategory(c.key)}
            style={{ padding: '7px 14px', borderRadius: 20, border: '1px solid', borderColor: activeCategory === c.key ? 'var(--green-mid)' : 'var(--cream-dark)', background: activeCategory === c.key ? 'var(--green-mid)' : 'white', color: activeCategory === c.key ? 'white' : 'var(--muted)', cursor: 'pointer', fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 0.5, transition: 'all 0.2s' }}
          >
            {c.label}
          </button>
        ))}
        <button
          onClick={() => setShowBought(b => !b)}
          style={{ padding: '7px 14px', borderRadius: 20, border: '1px solid', borderColor: showBought ? 'var(--green-mid)' : 'var(--cream-dark)', background: showBought ? 'rgba(74,122,50,0.1)' : 'white', color: showBought ? 'var(--green-deep)' : 'var(--muted)', cursor: 'pointer', fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 0.5, marginLeft: 'auto' }}
        >
          {showBought ? '✓ Hide bought' : '○ Show bought'}
        </button>
      </div>

      {groupedByCategory.map(({ cat, items: groupItems, priority }) => (
        <div key={cat} style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400, color: 'var(--green-deep)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
            {categoryTitles[cat]}
            <span className={`priority-badge ${priorityClasses[priority]}`}>{priorityLabels[priority]}</span>
          </div>
          <div className="shop-items">
            {groupItems.map(item => (
              <div
                key={item.id}
                className={`shop-item${cat === 'on-hold' ? ' on-hold' : ''}`}
                style={{ opacity: item.bought ? 0.6 : 1, cursor: isSignedIn ? 'pointer' : 'default', transition: 'all 0.2s', position: 'relative', userSelect: 'none' }}
                onClick={() => isSignedIn && onToggle(item.id)}
                title={isSignedIn ? undefined : 'Sign in to tick off items'}
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
        </div>
      ))}

      {groupedByCategory.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--muted)', fontStyle: 'italic', padding: 40 }}>
          {showBought ? 'No items in this category.' : 'All items in this category have been ticked off! 🎉'}
        </div>
      )}
    </section>
  );
}
