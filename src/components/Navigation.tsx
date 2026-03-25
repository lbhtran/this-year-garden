import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
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

export function Navigation({ activeSection }: Props) {
  const { clerkEnabled } = useAppAuth();

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
      {clerkEnabled && (
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="nav-btn" style={{ whiteSpace: 'nowrap' }}>Sign In</button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      )}
    </nav>
  );
}
