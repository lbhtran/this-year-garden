import type { WeatherForecast } from '../hooks/useWeather';
import { getWeatherInfo } from '../hooks/useWeather';
import type { Plant } from '../data/plants';

interface Props {
  plants: Plant[];
  weather: WeatherForecast;
}

export function WeatherWidget({ plants, weather }: Props) {
  if (weather.loading) return (
    <div style={{ background: 'white', border: '1px solid var(--cream-dark)', borderRadius: 12, padding: 20, marginBottom: 32, fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--muted)' }}>
      🌡️ Loading weather...
    </div>
  );

  if (weather.error) return null;

  const current = weather.current!;
  const info = getWeatherInfo(current.weathercode);

  const atRisk = plants.filter(p => p.frostSensitive && current.temperature < (p.minTemp ?? 10));
  const coldWarning = current.temperature < 5;
  const frostWarning = current.temperature < 2;

  return (
    <div style={{ background: 'white', border: '1px solid var(--cream-dark)', borderRadius: 16, padding: 24, marginBottom: 32, overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>
            📍 Milton Keynes, UK — Current Weather
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 48 }}>{info.emoji}</span>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, color: 'var(--green-deep)', lineHeight: 1 }}>
                {Math.round(current.temperature)}°C
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{info.label} · Wind: {Math.round(current.windspeed)} km/h</div>
            </div>
          </div>
        </div>

        {/* 5-day forecast */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {weather.daily.slice(0, 5).map(d => {
            const di = getWeatherInfo(d.weathercode);
            const dateLabel = new Date(d.date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' });
            return (
              <div key={d.date} style={{ background: 'var(--green-wash)', border: '1px solid var(--green-pale)', borderRadius: 10, padding: '10px 12px', textAlign: 'center', minWidth: 64 }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)', marginBottom: 4 }}>{dateLabel}</div>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{di.emoji}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--green-deep)', fontWeight: 500 }}>{Math.round(d.maxTemp)}°</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)' }}>{Math.round(d.minTemp)}°</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Alerts */}
      {(frostWarning || coldWarning || atRisk.length > 0) && (
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {frostWarning && (
            <div style={{ background: 'rgba(184,92,42,0.12)', border: '1px solid rgba(184,92,42,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--rust)', display: 'flex', alignItems: 'center', gap: 8 }}>
              ❄️ <strong>Frost warning!</strong> Current temperature is near freezing. Protect all tender plants immediately!
            </div>
          )}
          {!frostWarning && coldWarning && (
            <div style={{ background: 'rgba(200,168,75,0.12)', border: '1px solid rgba(200,168,75,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--soil)', display: 'flex', alignItems: 'center', gap: 8 }}>
              🌡️ <strong>Cold conditions.</strong> Keep frost-sensitive plants indoors or in growhouse.
            </div>
          )}
          {atRisk.length > 0 && (
            <div style={{ background: 'rgba(200,168,75,0.08)', border: '1px solid rgba(200,168,75,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>
              <strong style={{ color: 'var(--soil)' }}>⚠️ Plants at risk in current conditions:</strong>
              <span style={{ color: 'var(--muted)', marginLeft: 8 }}>{atRisk.map(p => `${p.emoji} ${p.name}`).join(', ')}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
