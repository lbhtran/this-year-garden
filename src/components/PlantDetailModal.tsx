import React from 'react';
import type { Plant, ContainerStop } from '../data/plants';
import { stageLabels, stageColors } from '../data/plants';

interface Props {
  plant: Plant;
  onClose: () => void;
  onEdit: (plant: Plant) => void;
}

interface PestInfo {
  bird: string;
  slug: string;
  aphid: string;
}

interface TempInfo {
  barClass: string;
  advice: string;
}

const PEST_RULES: Array<{ keywords: string[]; pest: PestInfo }> = [
  { keywords: ['raised bed 2'], pest: { bird: 'Hoop + netting + enviromesh', slug: 'Wool pellets + grit', aphid: 'Neem oil — brassicas are aphid magnets! 🚨' } },
  { keywords: ['raised bed 1', 'raised bed'], pest: { bird: 'Hoop + bird netting', slug: 'Wool pellets + grit', aphid: 'Neem oil + water blast' } },
  { keywords: ['trellis', 'corner'], pest: { bird: 'Less of a concern', slug: 'Copper tape on planter', aphid: 'Marigolds + nasturtiums + neem oil' } },
  { keywords: ['strawberr'], pest: { bird: 'Pot covers / fruit cage', slug: 'Copper tape on pots', aphid: 'Water blast' } },
  { keywords: ['planter'], pest: { bird: 'Less of a concern', slug: 'Copper tape on planters', aphid: 'Water blast' } },
  { keywords: ['grow bag'], pest: { bird: 'Less of a concern', slug: 'Copper tape on edges', aphid: 'Water blast' } },
];

const DEFAULT_PEST: PestInfo = { bird: 'Less of a concern', slug: 'Copper tape around pot rim', aphid: 'Water blast; neem oil if needed' };

const getPestInfo = (placement: string): PestInfo => {
  const p = placement.toLowerCase();
  return PEST_RULES.find(rule => rule.keywords.some(kw => p.includes(kw)))?.pest ?? DEFAULT_PEST;
};

const getTempInfo = (minTemp: number, frostSensitive?: boolean): TempInfo => {
  if (minTemp >= 15) return { barClass: 'temp-very-sensitive', advice: 'Keep indoors until overnight temperatures are reliably above 15°C — late May onwards.' };
  if (minTemp >= 10) return { barClass: 'temp-sensitive', advice: frostSensitive ? 'Frost sensitive — only move outside after the last frost has passed.' : 'Protect from frost; can go outside once temperatures are reliably mild.' };
  if (minTemp >= 5) return { barClass: 'temp-sensitive', advice: frostSensitive ? 'Frost sensitive — cover or bring in on cold nights.' : 'Some frost tolerance; fleece on very cold nights.' };
  if (minTemp >= -5) return { barClass: 'temp-borderline', advice: 'Borderline hardy — can handle light frosts, but protect in prolonged hard frosts.' };
  if (minTemp >= -10) return { barClass: 'temp-borderline', advice: 'Mostly hardy — tolerates hard frosts; move under cover only in prolonged severe cold.' };
  if (minTemp >= -15) return { barClass: 'temp-mostly-hardy', advice: 'Hardy — can handle most UK winters outdoors year-round.' };
  return { barClass: 'temp-hardy', advice: 'Fully hardy — leave outside year-round; very tolerant of cold.' };
};

const isPlacementTBD = (placement: string) => !placement.trim() || placement.toLowerCase().includes('tbd');

const DIAGRAM_RULES: Array<{ keywords: string[]; id: string }> = [
  { keywords: ['corner trellis', 'trellis', 'corner'], id: 'diagram-c1' },
  { keywords: ['planter 1'], id: 'diagram-c2' },
  { keywords: ['planter 2'], id: 'diagram-c3' },
  { keywords: ['raised bed 1'], id: 'diagram-c4' },
  { keywords: ['raised bed 2', 'raised bed'], id: 'diagram-c5' },
  { keywords: ['grow bag'], id: 'diagram-growbags' },
  { keywords: ['pot', 'pots', 'patio'], id: 'diagram-pots' },
];

const getDiagramId = (placement: string): string | null => {
  if (isPlacementTBD(placement)) return null;
  const p = placement.toLowerCase();
  return DIAGRAM_RULES.find(rule => rule.keywords.some(kw => p.includes(kw)))?.id ?? null;
};

const CONTAINER_STATUS_CONFIG: Record<ContainerStop['status'], { dot: string; label: string; dimmed: boolean }> = {
  past:    { dot: 'var(--muted)', label: 'Past', dimmed: true },
  current: { dot: 'var(--green-mid)', label: 'Now', dimmed: false },
  future:  { dot: 'var(--rust)', label: 'Next', dimmed: false },
};

const getStatusBadgeStyle = (color: string): React.CSSProperties => ({
  fontFamily: "'DM Mono', monospace",
  fontSize: 9,
  letterSpacing: 1,
  textTransform: 'uppercase',
  color,
  background: `color-mix(in srgb, ${color} 12%, transparent)`,
  padding: '1px 6px',
  borderRadius: 6,
  border: `1px solid color-mix(in srgb, ${color} 30%, transparent)`,
  flexShrink: 0,
});

/** Small delay (ms) to let the modal unmount before scrolling, so the target element is unobscured */
const MODAL_CLOSE_DELAY_MS = 50;

const labelStyle = {
  fontSize: 10,
  letterSpacing: 1.5,
  textTransform: 'uppercase' as const,
  color: 'var(--muted)',
  marginBottom: 8,
  display: 'block',
};

export function PlantDetailModal({ plant, onClose, onEdit }: Props) {
  const showPest = plant.placement && !isPlacementTBD(plant.placement);
  const temp = plant.minTemp !== undefined ? getTempInfo(plant.minTemp, plant.frostSensitive) : null;
  const pest = showPest ? getPestInfo(plant.placement) : null;
  const diagramId = plant.placement ? getDiagramId(plant.placement) : null;

  const handleContainerClick = () => {
    if (!diagramId) return;
    onClose();
    setTimeout(() => document.getElementById(diagramId)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), MODAL_CLOSE_DELAY_MS);
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
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 44, marginBottom: 8 }}>{plant.emoji}</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 400, color: 'var(--green-deep)', marginBottom: 10 }}>{plant.name}</h2>
            <span className={`stage-badge ${stageColors[plant.stage]}`}>{stageLabels[plant.stage]}</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--muted)', padding: 4, flexShrink: 0, marginLeft: 16 }}>✕</button>
        </div>

        <div style={{ height: 1, background: 'var(--cream-dark)', marginBottom: 20 }} />

        {/* Container / Placement */}
        {plant.placement && (
          <div style={{ marginBottom: 20 }}>
            <span style={labelStyle}>🪴 Container</span>
            {plant.containers && plant.containers.length > 0 ? (
              /* One card per journey; multiple journeys = parallel locations */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {plant.containers.filter(Array.isArray).map((journey, ji) => (
                  <div
                    key={ji}
                    style={{ background: 'var(--green-wash)', borderRadius: 8, border: '1px solid var(--green-pale)', overflow: 'hidden', position: 'relative' }}
                  >
                    {/* Single continuous connector line behind all dots */}
                    {journey.length > 1 && (
                      <div style={{ position: 'absolute', left: 18, top: 17, bottom: 17, width: 2, background: 'var(--green-pale)', zIndex: 0 }} />
                    )}
                    {journey.map((stop: ContainerStop, i: number) => {
                      const cfg = CONTAINER_STATUS_CONFIG[stop.status];
                      const stopDiagramId = getDiagramId(stop.label);
                      const isLast = i === journey.length - 1;
                      return (
                        <div
                          key={i}
                          onClick={stopDiagramId ? () => { onClose(); setTimeout(() => document.getElementById(stopDiagramId)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), MODAL_CLOSE_DELAY_MS); } : undefined}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 12,
                            padding: '10px 14px',
                            borderBottom: isLast ? 'none' : '1px solid var(--green-pale)',
                            cursor: stopDiagramId ? 'pointer' : 'default',
                            opacity: cfg.dimmed ? 0.55 : 1,
                            position: 'relative',
                            zIndex: 1,
                          }}
                          title={stopDiagramId ? 'Click to view in Planting Diagrams' : undefined}
                        >
                          {/* Dot — box-shadow masks the connector line behind it */}
                          <div style={{ display: 'flex', alignItems: 'flex-start', flexShrink: 0, paddingTop: 2 }}>
                            <div style={{
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              background: cfg.dot,
                              flexShrink: 0,
                              position: 'relative',
                              zIndex: 2,
                              boxShadow: '0 0 0 3px var(--green-wash)',
                            }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                              <span style={getStatusBadgeStyle(cfg.dot)}>{cfg.label}</span>
                              <span style={{ fontSize: 13, color: 'var(--ink)', fontWeight: stop.status === 'current' ? 600 : 400 }}>{stop.label}</span>
                            </div>
                          </div>
                          {stopDiagramId && <span style={{ fontSize: 11, color: 'var(--green-mid)', flexShrink: 0, alignSelf: 'center' }}>→</span>}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            ) : (
              /* Single placement fallback */
              <div
                onClick={diagramId ? handleContainerClick : undefined}
                style={{
                  fontSize: 14,
                  color: diagramId ? 'var(--green-deep)' : 'var(--ink)',
                  background: 'var(--green-wash)',
                  borderRadius: 8,
                  padding: '10px 14px',
                  fontWeight: 500,
                  border: `1px solid ${diagramId ? 'var(--green-mid)' : 'var(--green-pale)'}`,
                  cursor: diagramId ? 'pointer' : 'default',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'opacity 0.15s',
                }}
                title={diagramId ? 'Click to view in Planting Diagrams' : undefined}
              >
                <span>{isPlacementTBD(plant.placement) ? '⏳ Placement TBD — waiting for garden layout' : plant.placement}</span>
                {diagramId && <span style={{ fontSize: 12, color: 'var(--green-mid)', marginLeft: 8, flexShrink: 0 }}>View diagram →</span>}
              </div>
            )}
          </div>
        )}

        {/* Next Step */}
        {plant.nextStep && (
          <div style={{ marginBottom: 20 }}>
            <span style={labelStyle}>💬 Next Step</span>
            <div style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.6, background: 'white', borderRadius: 8, padding: '10px 14px', border: '1px solid var(--cream-dark)' }}>{plant.nextStep}</div>
          </div>
        )}

        {/* Temperature */}
        {temp !== null && plant.minTemp !== undefined && (
          <div style={{ marginBottom: 20 }}>
            <span style={labelStyle}>🌡️ Temperature</span>
            <div style={{ background: 'white', borderRadius: 8, padding: '12px 14px', border: '1px solid var(--cream-dark)' }}>
              <div className={`temp-bar ${temp.barClass}`} style={{ marginBottom: 10 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--ink)', fontWeight: 500 }}>Min: {plant.minTemp}°C</span>
                {plant.frostSensitive && (
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--rust)', background: 'rgba(184,92,42,0.1)', padding: '2px 8px', borderRadius: 10 }}>🧊 Frost sensitive</span>
                )}
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>{temp.advice}</div>
            </div>
          </div>
        )}

        {/* Pest guidance */}
        {pest && (
          <div style={{ marginBottom: 24 }}>
            <span style={labelStyle}>🐛 Pest Watch</span>
            <div style={{ background: 'white', borderRadius: 8, border: '1px solid var(--cream-dark)', overflow: 'hidden' }}>
              {[
                { icon: '🪶', label: 'BIRDS', info: pest.bird },
                { icon: '🐌', label: 'SLUGS & SNAILS', info: pest.slug },
                { icon: '🐛', label: 'APHIDS', info: pest.aphid },
              ].map(({ icon, label, info }, i, arr) => (
                <div key={label} style={{ display: 'flex', gap: 10, padding: '10px 14px', borderBottom: i < arr.length - 1 ? '1px solid var(--cream-dark)' : 'none', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
                  <div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--muted)', marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink)' }}>{info}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Edit button */}
        <button
          onClick={() => { onClose(); onEdit(plant); }}
          style={{ width: '100%', padding: '12px', border: 'none', borderRadius: 8, background: 'var(--green-deep)', cursor: 'pointer', fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--cream)', fontWeight: 500 }}
        >
          ✏️ Edit Plant
        </button>
      </div>
    </div>
  );
}
