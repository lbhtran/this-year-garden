interface Props {
  activeSection: string;
}

const navItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'diagrams', label: 'Diagrams' },
  { id: 'seeds', label: 'Seeds' },
  { id: 'shopping', label: 'Shopping' },
  { id: 'pests', label: 'Pests' },
  { id: 'temps', label: 'Temperature' },
  { id: 'trees', label: 'Future Trees' },
  { id: 'timeline', label: 'Timeline' },
];

export function Navigation({ activeSection }: Props) {
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
    </nav>
  );
}
