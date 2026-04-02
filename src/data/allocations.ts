export interface Allocation {
  id: string;
  plantId: string;
  containerId: string;
  zone: string | null;
  status: 'past' | 'current' | 'future';
  sortOrder: number;
}
