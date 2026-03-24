export interface Container {
  id: string;
  emoji: string;
  name: string;
  size: string;
  use: string;
  onHold?: boolean;
}

export const initialContainers: Container[] = [
  { id: 'c1', emoji: '🌿', name: 'Corner Trellis Planter', size: 'Large — 2 trellis sides', use: 'Cherry tomatoes (Side A) + Beef tomatoes (Side B). Marigolds border + nasturtiums climbing trellis.' },
  { id: 'c2', emoji: '🌿', name: 'Planter 1', size: '20 × 90 × 25 cm', use: 'Herbs: basil, parsley, chives. Mint on hold for next season.' },
  { id: 'c3', emoji: '🥗', name: 'Planter 2', size: '20 × 90 × 25 cm', use: 'Mixed salad leaves (cut & come again) + spring onions.' },
  { id: 'c4', emoji: '🥬', name: 'Raised Bed 1', size: '60 × 120 cm — curved edges', use: 'Perennial kale centre · lettuce & spinach inner ring · purple curly kale outer ring · nasturtium border.' },
  { id: 'c5', emoji: '🌱', name: 'Raised Bed 2', size: '60 × 120 cm — curved edges', use: 'Asparagus centre (permanent) · pak choi & tenderstem broccoli inner ring · spring onions outer ring · nasturtium border.' },
  { id: 'c6', emoji: '🥔', name: 'Grow Bag 1', size: '40–50 L', use: 'Potatoes — currently chitting. Maris Piper or Charlotte.' },
  { id: 'c7', emoji: '🥕', name: 'Grow Bag 2', size: '40–50 L', use: 'Carrots — sow directly in rows. Nantes 2 or Chantenay Red Cored.' },
  { id: 'c8', emoji: '🪴', name: 'Individual Pots', size: '7–20 L each', use: 'Aubergine, chillies (7–10 L, overwinter indoors), courgette (20 L, annual).' },
  { id: 'c9', emoji: '🍁', name: 'Japanese Maple', size: '≥ 40 L pot', use: "Fully hardy — leave outside year-round. 'Bloodgood' or 'Sango-kaku'." },
  { id: 'c10', emoji: '🍓', name: 'Strawberries & 🌿 Fig', size: 'Individual pots', use: 'Strawberries in individual pots — growhouse in hard frosts. Fig in large patio pot — move to shed in hard frosts.' },
  { id: 'c11', emoji: '⏸️', name: 'On Hold', size: 'Future seasons', use: 'Blueberries, olive, bay, mulberry, mint. Fruit trees pending garden layout (swing, seating etc.)', onHold: true },
];
