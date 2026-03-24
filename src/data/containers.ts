export interface Container {
  id: string;
  emoji: string;
  name: string;
  size: string;
  use: string;
  onHold?: boolean;
  diagramId?: string;
}

export const initialContainers: Container[] = [
  { id: 'c1', emoji: '🌿', name: 'Corner Trellis Planter', size: 'Right-angle triangle — 70 × 70 cm trellis sides', use: 'Cherry tomatoes (Side A, vertical) + Beef tomatoes (Side B, horizontal). Marigolds & nasturtiums along the long (diagonal) side.', diagramId: 'diagram-c1' },
  { id: 'c2', emoji: '🌿', name: 'Planter 1', size: '20 × 90 × 25 cm', use: 'Herbs & spring onions: basil (in grow house until warm), parsley, chives, spring onions. Mint on hold for next season.', diagramId: 'diagram-c2' },
  { id: 'c3', emoji: '🥗', name: 'Planter 2', size: '20 × 90 × 25 cm', use: 'Fully salad & lettuce: mixed salad leaves (cut & come again), Little Gem lettuce, rocket. Sow successionally.', diagramId: 'diagram-c3' },
  { id: 'c4', emoji: '🥬', name: 'Raised Bed 1', size: '60 × 120 cm — curved edges', use: 'Perennial kale centre · lettuce & spinach inner ring · purple curly kale outer ring · nasturtium border.', diagramId: 'diagram-c4' },
  { id: 'c5', emoji: '🌱', name: 'Raised Bed 2', size: '60 × 120 cm — curved edges', use: 'Asparagus centre (permanent) · pak choi & tenderstem broccoli inner ring · spring onions outer ring · nasturtium border.', diagramId: 'diagram-c5' },
  { id: 'c6', emoji: '🥔', name: 'Grow Bag 1', size: '40–50 L', use: 'Potatoes #1 — currently chitting. Maris Piper or Charlotte.', diagramId: 'diagram-growbags' },
  { id: 'c6b', emoji: '🥔', name: 'Grow Bag 2', size: '40–50 L', use: 'Potatoes #2 — second bag for larger yield. Maris Piper or Charlotte.', diagramId: 'diagram-growbags' },
  { id: 'c7', emoji: '🥕', name: 'Grow Bag 3', size: '40–50 L', use: 'Carrots — sow directly in rows. Nantes 2 or Chantenay Red Cored.', diagramId: 'diagram-growbags' },
  { id: 'c7b', emoji: '🌿', name: 'Grow Bag 4', size: 'Large (40–50 L+)', use: 'Fig — transfer from patio pot as season progresses to allow a bigger tree. Move to shed in hard frosts.', diagramId: 'diagram-growbags' },
  { id: 'c8', emoji: '🪴', name: 'Individual Pots', size: '7–20 L each', use: 'Aubergine, chillies (7–10 L, overwinter indoors), courgette (20 L, annual).', diagramId: 'diagram-pots' },
  { id: 'c9', emoji: '🍁', name: 'Japanese Maple', size: '≥ 40 L pot', use: "Fully hardy — leave outside year-round. 'Bloodgood' or 'Sango-kaku'.", diagramId: 'diagram-pots' },
  { id: 'c10', emoji: '🍓', name: 'Strawberries', size: 'Individual pots', use: 'Strawberries in individual pots — growhouse in hard frosts.', diagramId: 'diagram-pots' },
  { id: 'c11', emoji: '⏸️', name: 'On Hold', size: 'Future seasons', use: 'Blueberries, olive, bay, mulberry, mint. Fruit trees pending garden layout (swing, seating etc.)', onHold: true },
];
