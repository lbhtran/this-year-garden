import { useState, useEffect, useCallback } from 'react';
import { useAppAuth } from '../contexts/AuthContext';
import { initialShoppingItems } from '../data/shopping';
import type { ShoppingItem } from '../data/shopping';

function toShoppingItem(row: Record<string, unknown>): ShoppingItem {
  // The API stores minimal fields; merge with initial data for display fields
  const initial = initialShoppingItems.find(i => i.id === (row.id as string));
  return {
    id: row.id as string,
    name: (row.name as string) ?? initial?.name ?? '',
    variety: initial?.variety ?? '',
    note: initial?.note ?? '',
    category: ((row.category as string) ?? initial?.category ?? 'supplies') as ShoppingItem['category'],
    priority: initial?.priority ?? 'medium',
    bought: Boolean(row.bought),
  };
}

export function useShopping() {
  const { getToken, isSignedIn } = useAppAuth();
  const [items, setItems] = useState<ShoppingItem[]>(initialShoppingItems);
  const [loading, setLoading] = useState(true);

  const authHeaders = useCallback(async () => {
    const token = await getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }, [getToken]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const load = async () => {
      try {
        const token = await getToken();
        const fetchHeaders: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
        const r = await fetch('/api/shopping', { headers: fetchHeaders });
        const rows = (await r.json()) as Record<string, unknown>[];
        if (!cancelled && Array.isArray(rows) && rows.length > 0) {
          setItems(rows.map(toShoppingItem));
        }
      } catch {/* keep initial data on error */}
      finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [isSignedIn, getToken]);

  const toggleItem = useCallback(async (id: string) => {
    let newBought = false;
    let itemName = '';
    let itemCategory = '';
    setItems(prev => {
      const updated = prev.map(item => {
        if (item.id === id) {
          newBought = !item.bought;
          itemName = item.name;
          itemCategory = item.category;
          return { ...item, bought: newBought };
        }
        return item;
      });
      return updated;
    });
    try {
      const headers = await authHeaders();
      await fetch('/api/shopping', {
        method: 'POST',
        headers,
        body: JSON.stringify({ id, name: itemName, category: itemCategory, bought: newBought }),
      });
    } catch {/* optimistic */}
  }, [authHeaders]);

  return { items, loading, toggleItem };
}
