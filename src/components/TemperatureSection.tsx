interface Props {
  currentTemp?: number;
}

const tempData = [
  { emoji: '🌿', name: 'Basil', min: 'Min: 15°C nights', action: 'Keep indoors until late May', bar: 'temp-very-sensitive' },
  { emoji: '🍆', name: 'Aubergine', min: 'Min: 10°C', action: 'Overwinter indoors or growhouse', bar: 'temp-sensitive' },
  { emoji: '🌶️', name: 'Chillies', min: 'Min: 10°C', action: 'Overwinter indoors — lasts years!', bar: 'temp-sensitive' },
  { emoji: '🍅', name: 'Tomatoes', min: 'Min: 10°C', action: 'Annual; remove after first frost', bar: 'temp-sensitive' },
  { emoji: '🥒', name: 'Courgette', min: 'Min: 10°C', action: 'Annual; remove after first frost', bar: 'temp-sensitive' },
  { emoji: '🫒', name: 'Olive', min: 'Min: -5°C', action: 'Move under cover in hard frosts', bar: 'temp-borderline' },
  { emoji: '🌿', name: 'Bay', min: 'Min: -10°C', action: 'Shelter in prolonged hard frosts', bar: 'temp-borderline' },
  { emoji: '🌿', name: 'Fig', min: 'Min: -10°C', action: 'Wrap or move to shed in hard frosts', bar: 'temp-borderline' },
  { emoji: '🫐', name: 'Blueberries', min: 'Min: -15°C', action: 'Leave outside year-round', bar: 'temp-mostly-hardy' },
  { emoji: '🍁', name: 'Japanese Maple', min: 'Min: -20°C', action: 'Leave outside; shelter from wind', bar: 'temp-hardy' },
  { emoji: '🍓', name: 'Strawberries', min: 'Min: -15°C', action: 'Growhouse in severe frost only', bar: 'temp-hardy' },
  { emoji: '🌱', name: 'Asparagus', min: 'Min: -20°C', action: 'Leave in bed; dies back in winter', bar: 'temp-hardy' },
  { emoji: '🥬', name: 'Kale (all)', min: 'Min: -15°C', action: 'Leave in bed; very frost tolerant', bar: 'temp-hardy' },
  { emoji: '🥕', name: 'Carrots', min: 'Min: -10°C', action: 'Leave in grow bag; fleece in hard frosts', bar: 'temp-mostly-hardy' },
];

export function TemperatureSection({ currentTemp }: Props) {
  const showAlert = currentTemp !== undefined && currentTemp < 10;

  return (
    <section className="section" id="temps">
      <div className="section-header">
        <span className="section-number">06</span>
        <h2 className="section-title">Temperature <em>Guide</em></h2>
      </div>

      {showAlert && (
        <div style={{ background: 'rgba(184,92,42,0.1)', border: '1px solid rgba(184,92,42,0.3)', borderRadius: 10, padding: '14px 18px', marginBottom: 24, fontSize: 13, color: 'var(--rust)' }}>
          🌡️ Current temperature is <strong>{Math.round(currentTemp!)}°C</strong> — tender plants (basil, tomatoes, aubergine, chillies, courgette) should be kept indoors or protected.
        </div>
      )}

      <div className="temp-items">
        {tempData.map(t => (
          <div key={t.name} className="temp-item">
            <div className={`temp-bar ${t.bar}`}></div>
            <div className="t-plant">{t.emoji} {t.name}</div>
            <div className="t-min">{t.min}</div>
            <div className="t-action">{t.action}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
