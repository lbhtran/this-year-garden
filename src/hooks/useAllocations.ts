import { useState, useEffect } from 'react';
import type { Allocation } from '../data/allocations';

function toAllocation(row: Record<string, unknown>): Allocation {
  return {
    id: row.id as string,
    plantId: row.plant_id as string,
    containerId: row.container_id as string,
    zone: (row.zone as string | null) ?? null,
    status: (row.status as 'past' | 'current' | 'future') ?? 'current',
    sortOrder: (row.sort_order as number) ?? 0,
  };
}

export function useAllocations() {
  const [allocations, setAllocations] = useState<Allocation[]>([]);

  useEffect(() => {
    fetch('/api/allocations')
      .then(r => r.json())
      .then((rows: Record<string, unknown>[]) => {
        if (Array.isArray(rows)) {
          setAllocations(rows.map(toAllocation));
        }
      })
      .catch(err => { console.error('Failed to load allocations:', err); });
  }, []);

  return { allocations };
}
