export type PlantStage =
  | 'wishlist' | 'sourced'
  | 'sown' | 'sprouted' | 'chitting'
  | 'hardening-off' | 'planted'
  | 'flowering' | 'fruiting' | 'harvesting'
  | 'dormant';

export type ContainerStatus = 'past' | 'current' | 'future';

export interface ContainerStop {
  label: string;
  status: ContainerStatus;
}

export interface Plant {
  id: string;
  emoji: string;
  name: string;
  stage: PlantStage;
  nextStep: string;
  /** Current container / placement — used for table display, pest lookup, and diagram navigation */
  placement: string;
  /** Full container journey (past → current → future). When present the detail popup shows a timeline. */
  containers?: ContainerStop[];
  minTemp?: number;
  frostSensitive?: boolean;
}

export const initialPlants: Plant[] = [
  // ── Growing now ──
  {
    id: '1', emoji: '🍅', name: 'Cherry Tomatoes', stage: 'sprouted',
    nextStep: 'Thin/prick out at 2 true leaves', placement: 'Corner trellis — Side A',
    minTemp: 10, frostSensitive: true,
    containers: [
      { label: 'Seed tray (indoors)', status: 'past' },
      { label: 'Individual pot (9 cm) — pricked out', status: 'past' },
      { label: 'Corner trellis — Side A', status: 'current' },
    ],
  },
  {
    id: '2', emoji: '🍅', name: 'Beef Tomatoes (heirloom)', stage: 'sprouted',
    nextStep: 'Thin/prick out at 2 true leaves', placement: 'Corner trellis — Side B',
    minTemp: 10, frostSensitive: true,
    containers: [
      { label: 'Seed tray (indoors)', status: 'past' },
      { label: 'Individual pot (9 cm) — pricked out', status: 'past' },
      { label: 'Corner trellis — Side B', status: 'current' },
    ],
  },
  {
    id: '3', emoji: '🍆', name: 'Aubergine', stage: 'sprouted',
    nextStep: 'Thin/prick out at 2 true leaves', placement: 'Pot (~7–10 L) moveable',
    minTemp: 10, frostSensitive: true,
    containers: [
      { label: 'Seed tray (indoors)', status: 'past' },
      { label: 'Pot (~7–10 L) moveable', status: 'current' },
    ],
  },
  {
    id: '4', emoji: '🌶️', name: 'Habanero Chillies', stage: 'sprouted',
    nextStep: 'Thin/prick out at 2–3 true leaves', placement: 'Pot (~7–10 L) moveable',
    minTemp: 10, frostSensitive: true,
    containers: [
      { label: 'Seed tray (indoors)', status: 'past' },
      { label: 'Pot (~7–10 L) moveable', status: 'current' },
    ],
  },
  { id: '5', emoji: '🌿', name: 'Basil', stage: 'sprouted', nextStep: 'Thin lightly; separate if crowded', placement: 'Planter 1', minTemp: 15, frostSensitive: true },
  { id: '6', emoji: '🌱', name: 'Parsley', stage: 'sprouted', nextStep: 'Thin lightly', placement: 'Planter 1', minTemp: 0 },
  { id: '7', emoji: '🌼', name: 'Marigolds', stage: 'sprouted', nextStep: 'Thin or separate', placement: 'Corner trellis border', minTemp: 5 },
  { id: '8', emoji: '🥗', name: 'Mixed Lettuce', stage: 'sprouted', nextStep: 'Keep indoors until mid–late April; harden off', placement: 'Planter 2', minTemp: 0 },
  { id: '9', emoji: '🥬', name: 'Purple Curly Kale', stage: 'sown', nextStep: 'Watch for slugs; fleece if cold', placement: 'Raised Bed 1 outer ring', minTemp: -15 },
  { id: '10', emoji: '🥦', name: 'Tenderstem Broccoli', stage: 'sown', nextStep: 'Watch for slugs carefully!', placement: 'Raised Bed 2 inner ring', minTemp: -5 },
  { id: '11', emoji: '🌸', name: 'Nasturtiums', stage: 'sown', nextStep: 'Frost sensitive — cover if needed', placement: 'Raised Bed 1 & 2 borders', minTemp: 5, frostSensitive: true },
  {
    id: '12', emoji: '🍓', name: 'Strawberries', stage: 'sprouted',
    nextStep: 'Protect from frost', placement: 'Separate pots; growhouse',
    minTemp: -15,
    containers: [
      { label: 'Separate pots; growhouse', status: 'current' },
      { label: 'Patio pots (×3–4) — outside once frost-free', status: 'future' },
    ],
  },
  {
    id: '13', emoji: '🌿', name: 'Fig', stage: 'dormant',
    nextStep: 'Keep south-facing; shed in hard frost', placement: 'Patio pot — moveable',
    minTemp: -10,
    containers: [
      { label: 'Patio pot — moveable', status: 'current' },
      { label: 'Large grow bag (40–50 L) — move in as season progresses', status: 'future' },
    ],
  },
  {
    id: '14', emoji: '🥔', name: 'Seed Potatoes', stage: 'chitting',
    nextStep: 'Plant when shoots reach 1–2cm', placement: 'Grow Bag 1',
    minTemp: 0,
    containers: [
      { label: 'Egg boxes / chitting tray (windowsill)', status: 'past' },
      { label: 'Grow Bag 1', status: 'current' },
    ],
  },
  // ── Wishlist — seeds to sow ──
  { id: 'w1', emoji: '🥬', name: 'Pak Choi', stage: 'wishlist', nextStep: 'Joi Choi F1 (bolt-resistant). Sow Apr–Aug directly into Raised Bed 2.', placement: 'Raised Bed 2', minTemp: -2 },
  { id: 'w2', emoji: '🧅', name: 'Spring Onions', stage: 'wishlist', nextStep: 'White Lisbon. Sow successionally every 3 weeks Mar–Jun.', placement: 'Raised Bed 2 outer ring', minTemp: -5 },
  { id: 'w3', emoji: '🌿', name: 'Spinach', stage: 'wishlist', nextStep: 'Perpetual Spinach — less prone to bolting. Sow Mar–Jul.', placement: 'Raised Bed 2', minTemp: -10 },
  { id: 'w4', emoji: '🥒', name: 'Courgette', stage: 'wishlist', nextStep: 'Patio Star F1 or Black Beauty. Sow one seed per pot on its side, indoors Mar–Apr.', placement: 'Individual pot (20 L)', minTemp: 10, frostSensitive: true },
  { id: 'w5', emoji: '🌿', name: 'Asparagus', stage: 'wishlist', nextStep: "Connover's Colossal or Guelph Millennium. Buy 2yr crowns — plant now!", placement: 'Raised Bed 2 centre', minTemp: -20 },
  // ── Wishlist — plants to buy ──
  { id: 'w6', emoji: '🍁', name: 'Japanese Maple', stage: 'wishlist', nextStep: "Buy from specialist nursery. 'Bloodgood' or 'Sango-kaku'. Fully hardy — leave outside year-round.", placement: '≥ 40 L pot', minTemp: -20 },
  { id: 'w7', emoji: '🥬', name: 'Perennial Kale (Daubenton)', stage: 'wishlist', nextStep: 'Very hardy, reliable UK perennial. Buy ×2 and plant in Raised Bed 1 centre.', placement: 'Raised Bed 1 centre', minTemp: -15 },
  // ── Wishlist — on hold for future seasons ──
  { id: 'w8', emoji: '🌿', name: 'Mint', stage: 'wishlist', nextStep: 'Spearmint or Applemint. Pot-in-pot to contain roots.', placement: 'Planter 1 (pot-in-pot)', minTemp: -15 },
  { id: 'w9', emoji: '🫐', name: 'Blueberries', stage: 'wishlist', nextStep: 'Bluecrop + Duke. Buy two for cross-pollination. Ericaceous compost essential.', placement: '≥ 40 L pots (× 2)', minTemp: -25 },
  { id: 'w10', emoji: '🫒', name: 'Olive', stage: 'wishlist', nextStep: "Arbequina. Move under cover below -5°C.", placement: '≥ 40–50 L pot', minTemp: -5 },
  { id: 'w11', emoji: '🌿', name: 'Bay Tree', stage: 'wishlist', nextStep: 'Laurus nobilis. Very low maintenance once established.', placement: '≥ 30 L pot', minTemp: -10 },
  { id: 'w12', emoji: '🌳', name: 'Mulberry', stage: 'wishlist', nextStep: "Charlotte Russe. Buy from specialist fruit nursery. Mind fruit drop near seating!", placement: '≥ 50 L pot — TBD', minTemp: -15 },
  // ── Wishlist — future fruit trees ──
  { id: 'w13', emoji: '🍎', name: 'Apple', stage: 'wishlist', nextStep: "Falstaff on M27 rootstock. Self-fertile; beautiful spring blossom.", placement: 'TBD — garden layout pending', minTemp: -25 },
  { id: 'w14', emoji: '🍒', name: 'Cherry', stage: 'wishlist', nextStep: "Stella (self-fertile). Great in a large pot; net when fruiting.", placement: 'TBD — garden layout pending', minTemp: -25 },
  { id: 'w15', emoji: '🍑', name: 'Plum', stage: 'wishlist', nextStep: "Victoria on Pixy rootstock. Very productive; self-fertile.", placement: 'TBD — garden layout pending', minTemp: -25 },
];

export const stageLabels: Record<PlantStage, string> = {
  wishlist: 'On the Wishlist',
  sourced: 'Seed / Plant Sourced',
  sown: 'Sown',
  sprouted: 'Sprouted',
  chitting: 'Chitting',
  dormant: 'Dormant',
  planted: 'Planted Out',
  harvesting: 'Harvesting',
  'hardening-off': 'Hardening Off',
  flowering: 'Flowering',
  fruiting: 'Fruiting',
};

export const stageColors: Record<PlantStage, string> = {
  wishlist: 'stage-wishlist',
  sourced: 'stage-sourced',
  sprouted: 'stage-sprouted',
  sown: 'stage-sown',
  chitting: 'stage-chitting',
  dormant: 'stage-dormant',
  planted: 'stage-planted',
  harvesting: 'stage-harvesting',
  'hardening-off': 'stage-hardening',
  flowering: 'stage-flowering',
  fruiting: 'stage-fruiting',
};
