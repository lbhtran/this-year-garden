import { useState, useEffect, useCallback } from 'react';
import { useAppAuth } from '../contexts/AuthContext';
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
  const { getToken } = useAppAuth();
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

  const authHeaders = useCallback(async () => {
    const token = await getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }, [getToken]);

  const addContainer = useCallback(async (container: Container) => {
    setContainers(prev => [...prev, container]);
    try {
      const headers = await authHeaders();
      const res = await fetch('/api/containers', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          id: container.id,
          name: container.name,
          emoji: container.emoji,
          type: container.type ?? 'planter',
          size: container.size,
          notes: container.notes,
          on_hold: container.onHold ?? false,
          diagram_id: container.diagramId,
        }),
      });
      if (!res.ok) {
        console.error('Failed to add container:', await res.text());
        setContainers(prev => prev.filter(c => c.id !== container.id));
      }
    } catch (err) {
      console.error('Failed to add container:', err);
      setContainers(prev => prev.filter(c => c.id !== container.id));
    }
  }, [authHeaders]);

  const updateContainer = useCallback(async (container: Container) => {
    setContainers(prev => prev.map(c => c.id === container.id ? container : c));
    try {
      const headers = await authHeaders();
      const res = await fetch(`/api/containers/${container.id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          name: container.name,
          emoji: container.emoji,
          type: container.type,
          size: container.size,
          notes: container.notes,
          on_hold: container.onHold ?? false,
          diagram_id: container.diagramId,
        }),
      });
      if (!res.ok) {
        console.error('Failed to update container:', await res.text());
      }
    } catch (err) {
      console.error('Failed to update container:', err);
    }
  }, [authHeaders]);

  const deleteContainer = useCallback(async (id: string) => {
    const previous = containers.find(c => c.id === id);
    setContainers(prev => prev.filter(c => c.id !== id));
    try {
      const headers = await authHeaders();
      const res = await fetch(`/api/containers/${id}`, { method: 'DELETE', headers });
      if (!res.ok) {
        console.error('Failed to delete container:', await res.text());
        if (previous) setContainers(prev => [...prev, previous]);
      }
    } catch (err) {
      console.error('Failed to delete container:', err);
      if (previous) setContainers(prev => [...prev, previous]);
    }
  }, [authHeaders, containers]);

  return { containers, loading, addContainer, updateContainer, deleteContainer };
}

