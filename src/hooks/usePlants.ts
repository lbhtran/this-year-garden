import { useState, useEffect, useCallback } from 'react';
import { useAppAuth } from '../contexts/AuthContext';
import type { Plant } from '../data/plants';

function toPlant(row: Record<string, unknown>): Plant {
  return {
    id: row.id as string,
    emoji: (row.emoji as string) ?? '',
    name: row.name as string,
    stage: row.stage as Plant['stage'],
    nextStep: (row.next_step as string) ?? '',
    placement: (row.placement as string) ?? '',
    minTemp: row.min_temp != null ? Number(row.min_temp) : undefined,
    frostSensitive: row.frost_sensitive as boolean | undefined,
  };
}

export function usePlants() {
  const { getToken } = useAppAuth();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/plants')
      .then(r => r.json())
      .then((rows: Record<string, unknown>[]) => {
        if (Array.isArray(rows) && rows.length > 0) {
          setPlants(rows.map(toPlant));
        }
      })
      .catch(() => {/* keep initial data on error */})
      .finally(() => setLoading(false));
  }, []);

  const authHeaders = useCallback(async () => {
    const token = await getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }, [getToken]);

  const updatePlant = useCallback(async (plant: Plant) => {
    setPlants(prev => prev.map(p => p.id === plant.id ? plant : p));
    try {
      const headers = await authHeaders();
      await fetch(`/api/plants/${plant.id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          name: plant.name,
          emoji: plant.emoji,
          stage: plant.stage,
          next_step: plant.nextStep,
          placement: plant.placement,
          min_temp: plant.minTemp,
          frost_sensitive: plant.frostSensitive,
        }),
      });
    } catch {
      // optimistic update stays, sync will reconcile on next load
    }
  }, [authHeaders]);

  const addPlant = useCallback(async (plant: Plant) => {
    setPlants(prev => [...prev, plant]);
    try {
      const headers = await authHeaders();
      await fetch('/api/plants', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          id: plant.id,
          name: plant.name,
          emoji: plant.emoji,
          stage: plant.stage,
          next_step: plant.nextStep,
          placement: plant.placement,
          min_temp: plant.minTemp,
          frost_sensitive: plant.frostSensitive,
        }),
      });
    } catch {/* optimistic */}
  }, [authHeaders]);

  const deletePlant = useCallback(async (id: string) => {
    setPlants(prev => prev.filter(p => p.id !== id));
    try {
      const headers = await authHeaders();
      await fetch(`/api/plants/${id}`, { method: 'DELETE', headers });
    } catch {/* optimistic */}
  }, [authHeaders]);

  return { plants, loading, updatePlant, addPlant, deletePlant };
}
