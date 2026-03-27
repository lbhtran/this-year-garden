'use client';
import { useState } from 'react';
import { SignInButton } from '@clerk/nextjs';
import type { ShoppingItem } from '../data/shopping';
import { useAppAuth } from '../contexts/AuthContext';

interface Props {
  items: ShoppingItem[];
  onToggle: (id: string) => void;
  isSignedIn: boolean;
}

const categoryTitles: Record<string, string> = {
  'pest-protection': '🛡️ Pest Protection',
  supplies: '🪴 Compost & Supplies',
};

export function ShoppingSection({ items, onToggle, isSignedIn }: Props) {
  const { clerkEnabled } = useAppAuth();
  const [showBought, setShowBought] = useState(false);

  const supplyItems = items.filter(i =>
    (i.category === 'pest-protection' || i.category === 'supplies') &&
    (showBought || !i.bought)
  );

  const grouped = (['pest-protection', 'supplies'] as const)
    .map(cat => ({ cat, items: supplyItems.filter(i => i.category === cat) }))
    .filter(g => g.items.length > 0);

  const totalBought = items.filter(i => (i.category === 'pest-protection' || i.category === 'supplies') && i.bought).length;
  const totalItems = items.filter(i => i.category === 'pest-protection' || i.category === 'supplies').length;

  return (
    <section className="section" id="shopping">
      <div className="section-header">
        <span className="section-number">04</span>
        <h2 className="section-title">Supplies &amp; <em>Protection</em></h2>
      </div>

      {/* Progress bar */}
      <div style={{ background: 'white', border: '1px solid var(--cream-dark)', borderRadius: 12, padding: '16px 20px', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--muted)' }}>Supplies Progress</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--green-deep)', fontWeight: 500 }}>{totalBought} / {totalItems} items</span>
        </div>
        <div style={{ background: 'var(--cream-dark)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--green-mid), var(--green-light))', width: `${totalItems > 0 ? (totalBought / totalItems) * 100 : 0}%`, transition: 'width 0.3s ease', borderRadius: 4 }} />
        </div>
      </div>

      {/* Show/hide bought toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
        {!isSignedIn && (
          clerkEnabled ? (
            <SignInButton mode="modal">
              <button style={{ padding: '7px 16px', borderRadius: 20, border: '1px solid var(--green-mid)', background: 'none', color: 'var(--green-deep)', cursor: 'pointer', fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 0.5 }}>
                Sign in to track purchases
              </button>
            </SignInButton>
          ) : (
            <button disabled style={{ padding: '7px 16px', borderRadius: 20, border: '1px solid var(--cream-dark)', background: 'none', color: 'var(--muted)', cursor: 'default', fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 0.5, opacity: 0.6 }}>
              Sign in to track purchases
            </button>
          )
        )}
        {isSignedIn && <div />}
        <button
          onClick={() => setShowBought(b => !b)}
          style={{ padding: '7px 14px', borderRadius: 20, border: '1px solid', borderColor: showBought ? 'var(--green-mid)' : 'var(--cream-dark)', background: showBought ? 'rgba(74,122,50,0.1)' : 'white', color: showBought ? 'var(--green-deep)' : 'var(--muted)', cursor: 'pointer', fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 0.5 }}
        >
          {showBought ? '✓ Hide bought' : '○ Show bought'}
        </button>
      </div>

      {grouped.map(({ cat, items: groupItems }) => (
        <div key={cat} style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400, color: 'var(--green-deep)', marginBottom: 16 }}>
            {categoryTitles[cat]}
          </div>
          <div className="shop-items">
            {groupItems.map(item => (
              <div
                key={item.id}
                className="shop-item"
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

      {grouped.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--muted)', fontStyle: 'italic', padding: 40 }}>
          {showBought ? 'No items.' : 'All supplies ticked off! 🎉'}
        </div>
      )}
    </section>
  );
}
