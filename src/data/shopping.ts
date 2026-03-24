export interface ShoppingItem {
  id: string;
  name: string;
  variety: string;
  note: string;
  category: 'seeds' | 'plants' | 'pest-protection' | 'supplies' | 'on-hold';
  priority: 'high' | 'medium' | 'low' | 'hold';
  bought: boolean;
}

export const initialShoppingItems: ShoppingItem[] = [
  // Seeds
  { id: 's1', name: 'Tenderstem Broccoli', variety: 'Belstar F1 or Green Magic F1', note: 'Sow indoors Mar–Apr as backup to direct sown', category: 'seeds', priority: 'high', bought: false },
  { id: 's2', name: 'Pak Choi', variety: 'Joi Choi F1 (bolt-resistant)', note: 'Sow Apr–Aug directly into Raised Bed 2', category: 'seeds', priority: 'high', bought: false },
  { id: 's3', name: 'Spring Onions', variety: 'White Lisbon', note: 'Sow successionally every 3 weeks Mar–Jun', category: 'seeds', priority: 'high', bought: false },
  { id: 's4', name: 'Mixed Salad Leaves', variety: 'Saladisi or Spicy Salad mix', note: 'Sow Mar–Sep; cut and come again', category: 'seeds', priority: 'high', bought: false },
  { id: 's5', name: 'Spinach', variety: 'Perpetual Spinach', note: 'Less prone to bolting than regular spinach', category: 'seeds', priority: 'high', bought: false },
  { id: 's6', name: 'Lettuce', variety: 'Little Gem or Salad Bowl mix', note: 'Sow successionally for continuous harvest', category: 'seeds', priority: 'high', bought: false },
  { id: 's7', name: 'Courgette', variety: 'Patio Star F1 or Black Beauty', note: 'Sow one seed per pot on its side, indoors Mar–Apr', category: 'seeds', priority: 'high', bought: false },
  { id: 's8', name: 'Asparagus Crowns', variety: "Connover's Colossal or Guelph Millennium", note: 'Buy 2yr crowns not seeds — plant now!', category: 'seeds', priority: 'high', bought: false },
  // Plants
  { id: 'p1', name: 'Japanese Maple', variety: "'Bloodgood' or 'Sango-kaku'", note: 'Buy from specialist nursery for best quality. ≥40 L pot.', category: 'plants', priority: 'high', bought: false },
  { id: 'p2', name: 'Perennial Kale ×2', variety: 'Daubenton', note: 'Very hardy, reliable UK perennial. Plant in Raised Bed 1 centre.', category: 'plants', priority: 'high', bought: false },
  // Pest protection
  { id: 'pp1', name: 'Wool Pellets', variety: '—', note: 'Put down NOW before seedlings emerge. Slugs are active!', category: 'pest-protection', priority: 'high', bought: false },
  { id: 'pp2', name: 'Hoop Frame / Piping', variety: '8–10mm alkathene pipe', note: 'Support netting over both raised beds', category: 'pest-protection', priority: 'high', bought: false },
  { id: 'pp3', name: 'Bird Netting', variety: 'Fine gauge, 2–3m wide roll', note: 'Over raised beds + strawberry pots', category: 'pest-protection', priority: 'high', bought: false },
  { id: 'pp4', name: 'Copper Tape', variety: 'Self-adhesive, min 3cm wide', note: 'Around all pot and planter rims', category: 'pest-protection', priority: 'high', bought: false },
  { id: 'pp5', name: 'Fine Insect Mesh', variety: 'Enviromesh', note: 'Over brassicas in Raised Bed 2 — essential!', category: 'pest-protection', priority: 'high', bought: false },
  { id: 'pp6', name: 'Neem Oil Spray', variety: 'Organic', note: 'Aphid control without harming ladybirds', category: 'pest-protection', priority: 'high', bought: false },
  // Supplies
  { id: 'su1', name: 'Peat-Free Compost', variety: 'Multi-purpose', note: 'For all general pots and planters', category: 'supplies', priority: 'medium', bought: false },
  { id: 'su2', name: 'Horticultural Grit', variety: '—', note: 'Mix into compost for drainage in pots and grow bags', category: 'supplies', priority: 'medium', bought: false },
  { id: 'su3', name: 'Slow-Release Fertiliser', variety: 'Granules', note: 'Add to pots and raised beds in spring', category: 'supplies', priority: 'medium', bought: false },
  { id: 'su4', name: 'Garden Fleece', variety: '—', note: 'Cover raised beds now to warm soil and protect seedlings', category: 'supplies', priority: 'medium', bought: false },
  // On hold
  { id: 'oh1', name: '🍃 Mint', variety: 'Spearmint or Applemint', note: 'Pot-in-pot in Planter 1 to contain roots', category: 'on-hold', priority: 'hold', bought: false },
  { id: 'oh2', name: '🫐 Blueberries', variety: 'Bluecrop + Duke (buy 2)', note: '≥40 L each; ericaceous compost essential', category: 'on-hold', priority: 'hold', bought: false },
  { id: 'oh3', name: '🫒 Olive', variety: "'Arbequina'", note: '≥40–50 L; move under cover below -5°C', category: 'on-hold', priority: 'hold', bought: false },
  { id: 'oh4', name: '🌿 Bay Tree', variety: 'Laurus nobilis', note: '≥30 L; very low maintenance once established', category: 'on-hold', priority: 'hold', bought: false },
  { id: 'oh5', name: '🌳 Mulberry', variety: "'Charlotte Russe'", note: '≥50 L; buy from specialist fruit nursery', category: 'on-hold', priority: 'hold', bought: false },
];
