import { useState, useEffect } from 'react';
import { initialContainers } from '../data/containers';
import type { Container } from '../data/containers';

function toContainer(row: Record<string, unknown>): Container {
  return {
    id: row.id as string,
    emoji: (row.emoji as string) ?? '',
    name: row.name as string,
    type: (row.type as string) ?? undefined,
    size: (row.size as string) ?? '',
    notes: (row.notes as string) ?? '',
    onHold: Boolean(row.on_hold),
    diagramId: (row.diagram_id as string) ?? undefined,
  };
}

export function useContainers() {
  const [containers, setContainers] = useState<Container[]>(initialContainers);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/containers')
      .then(r => r.json())
      .then((rows: Record<string, unknown>[]) => {
        if (Array.isArray(rows) && rows.length > 0) {
          setContainers(rows.map(toContainer));
        }
      })
      .catch(() => {/* keep initial data on error */})
      .finally(() => setLoading(false));
  }, []);

  return { containers, loading };
}
