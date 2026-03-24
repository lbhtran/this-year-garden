export type PlantStage = 'sprouted' | 'sown' | 'chitting' | 'dormant' | 'planted' | 'harvesting' | 'hardening-off' | 'flowering' | 'fruiting';

export interface Plant {
  id: string;
  emoji: string;
  name: string;
  stage: PlantStage;
  nextStep: string;
  placement: string;
  minTemp?: number;
  frostSensitive?: boolean;
}

export const initialPlants: Plant[] = [
  { id: '1', emoji: '🍅', name: 'Cherry Tomatoes', stage: 'sprouted', nextStep: 'Thin/prick out at 2 true leaves', placement: 'Corner trellis — Side A', minTemp: 10, frostSensitive: true },
  { id: '2', emoji: '🍅', name: 'Beef Tomatoes (heirloom)', stage: 'sprouted', nextStep: 'Thin/prick out at 2 true leaves', placement: 'Corner trellis — Side B', minTemp: 10, frostSensitive: true },
  { id: '3', emoji: '🍆', name: 'Aubergine', stage: 'sprouted', nextStep: 'Thin/prick out at 2 true leaves', placement: 'Pot (~7–10 L) moveable', minTemp: 10, frostSensitive: true },
  { id: '4', emoji: '🌶️', name: 'Habanero Chillies', stage: 'sprouted', nextStep: 'Thin/prick out at 2–3 true leaves', placement: 'Pot (~7–10 L) moveable', minTemp: 10, frostSensitive: true },
  { id: '5', emoji: '🌿', name: 'Basil', stage: 'sprouted', nextStep: 'Thin lightly; separate if crowded', placement: 'Planter 1', minTemp: 15, frostSensitive: true },
  { id: '6', emoji: '🌱', name: 'Parsley', stage: 'sprouted', nextStep: 'Thin lightly', placement: 'Planter 1', minTemp: 0 },
  { id: '7', emoji: '🌼', name: 'Marigolds', stage: 'sprouted', nextStep: 'Thin or separate', placement: 'Corner trellis border', minTemp: 5 },
  { id: '8', emoji: '🥗', name: 'Mixed Lettuce', stage: 'sprouted', nextStep: 'Keep indoors until mid–late April; harden off', placement: 'Planter 2', minTemp: 0 },
  { id: '9', emoji: '🥬', name: 'Purple Curly Kale', stage: 'sown', nextStep: 'Watch for slugs; fleece if cold', placement: 'Raised Bed 1 outer ring', minTemp: -15 },
  { id: '10', emoji: '🥦', name: 'Tenderstem Broccoli', stage: 'sown', nextStep: 'Watch for slugs carefully!', placement: 'Raised Bed 2 inner ring', minTemp: -5 },
  { id: '11', emoji: '🌸', name: 'Nasturtiums', stage: 'sown', nextStep: 'Frost sensitive — cover if needed', placement: 'Raised Bed 1 & 2 borders', minTemp: 5, frostSensitive: true },
  { id: '12', emoji: '🍓', name: 'Strawberries', stage: 'sprouted', nextStep: 'Protect from frost', placement: 'Separate pots; growhouse', minTemp: -15 },
  { id: '13', emoji: '🌿', name: 'Fig', stage: 'dormant', nextStep: 'Keep south-facing; shed in hard frost', placement: 'Patio pot — moveable', minTemp: -10 },
  { id: '14', emoji: '🥔', name: 'Seed Potatoes', stage: 'chitting', nextStep: 'Plant when shoots reach 1–2cm', placement: 'Grow Bag 1', minTemp: 0 },
];

export const stageLabels: Record<PlantStage, string> = {
  sprouted: 'Sprouted indoors',
  sown: 'Direct sown',
  chitting: 'Chitting',
  dormant: 'Dormant',
  planted: 'Planted out',
  harvesting: 'Harvesting',
  'hardening-off': 'Hardening off',
  flowering: 'Flowering',
  fruiting: 'Fruiting',
};

export const stageColors: Record<PlantStage, string> = {
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
