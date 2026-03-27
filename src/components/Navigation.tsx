'use client';
import React from 'react';
import { SignInButton, UserButton } from '@clerk/nextjs';
import { useAppAuth } from '../contexts/AuthContext';

interface Props {
  activeSection: string;
}

const navItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'diagrams', label: 'Diagrams' },
  { id: 'seeds', label: 'Plants' },
  { id: 'shopping', label: 'Supplies' },
  { id: 'pests', label: 'Pests' },
  { id: 'temps', label: 'Temperature' },
  { id: 'timeline', label: 'Timeline' },
];

const signInBtnStyle: React.CSSProperties = {
  fontFamily: "'DM Mono', monospace",
  fontSize: 11,
  letterSpacing: 1.5,
  textTransform: 'uppercase',
  color: 'var(--green-deep)',
  background: 'none',
  border: '1px solid var(--green-mid)',
  borderRadius: 4,
  padding: '6px 16px',
  cursor: 'pointer',
  transition: 'all 0.2s',
  whiteSpace: 'nowrap',
};

export function Navigation({ activeSection }: Props) {
  const { clerkEnabled, isSignedIn } = useAppAuth();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="nav">
      {navItems.map(item => (
        <button
          key={item.id}
          onClick={() => scrollTo(item.id)}
          className={`nav-btn${activeSection === item.id ? ' nav-btn-active' : ''}`}
        >
          {item.label}
        </button>
      ))}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', padding: '0 4px' }}>
        {isSignedIn ? (
          <UserButton />
        ) : clerkEnabled ? (
          <SignInButton mode="modal">
            <button style={signInBtnStyle}>Sign In</button>
          </SignInButton>
        ) : (
          <button style={{ ...signInBtnStyle, opacity: 0.45, cursor: 'default' }} disabled title="Authentication not configured">
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}
