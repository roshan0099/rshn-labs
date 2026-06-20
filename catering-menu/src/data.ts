/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MenuItem {
  id: string;
  name: string;
  category: 'starters' | 'juice' | 'main' | 'dessert';
  type: 'veg' | 'non-veg';
  pricePerGuest: number; // Price in INR (₹) per guest
  unit: string;          // e.g. "piece", "glass", "portion"
  factorPerGuest: number;// recommended unit multiplier per guest (e.g. 2.5 pieces/guest, 1.2 portions/guest)
  description: string;
  popular: boolean;
  spicyLevel: 0 | 1 | 2 | 3; // 0 = sweet/neutral, 1 = mild, 2 = medium, 3 = hot
}

export interface CateringSelection {
  item: MenuItem;
  multiplier: number; // Portion scaling factor chosen by the user (default: 1.0, options: 0.8, 1.0, 1.2, 1.5)
  proportion: number;  // Focus ratio: serve to % of guests (e.g., 100% of guests, 75%, 50%, 25%)
}

export interface GuestConfig {
  count: number;
  eventType: string;
  date: string;
  dietaryPreference: 'all' | 'veg-only' | 'non-veg-only';
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  specialNotes: string;
  venueAddress: string;
}

export const INDIAN_MENU_ITEMS: MenuItem[] = [
  // --- STARTERS ---
  {
    id: 's1',
    name: 'Tandoori Paneer Tikka Shashlik',
    category: 'starters',
    type: 'veg',
    pricePerGuest: 120,
    unit: 'skewers',
    factorPerGuest: 1.2,
    description: 'Juicy cottage cheese cubes marinated in rich hung yogurt, heirloom spices, and roasted with bell peppers in a tandoor.',
    popular: true,
    spicyLevel: 2
  },
  {
    id: 's2',
    name: 'Crispy Cocktail Samosas',
    category: 'starters',
    type: 'veg',
    pricePerGuest: 60,
    unit: 'pieces',
    factorPerGuest: 2.0,
    description: 'Miniature golden pyramid pastries filled with dry-roasted cumin spiced potatoes, sweet green peas, and served with tangy tamarind chutney.',
    popular: false,
    spicyLevel: 1
  },
  {
    id: 's3',
    name: 'Hara Bhara Kabab Patties',
    category: 'starters',
    type: 'veg',
    pricePerGuest: 85,
    unit: 'pieces',
    factorPerGuest: 1.5,
    description: 'Crisp green patties prepared with pureed fresh garden spinach, green peas, mashed potatoes, aromatic spices, and a cashew crown.',
    popular: true,
    spicyLevel: 1
  },
  {
    id: 's4',
    name: 'Amritsari Crispy Fish Fry',
    category: 'starters',
    type: 'non-veg',
    pricePerGuest: 180,
    unit: 'pieces',
    factorPerGuest: 1.8,
    description: 'Golden-fried fresh river fish fingers coated in spiced carom-seeded chickpea batter, finished with a sprinkle of chat masala.',
    popular: true,
    spicyLevel: 2
  },
  {
    id: 's5',
    name: 'Avadhi Murgh Malai Tikka',
    category: 'starters',
    type: 'non-veg',
    pricePerGuest: 160,
    unit: 'pieces',
    factorPerGuest: 1.5,
    description: 'Succulent chicken breast chunks steeped in a luxurious cream cheese, cashew paste, and white cardamom marinade, cooked to smoky perfection.',
    popular: false,
    spicyLevel: 1
  },
  {
    id: 's6',
    name: 'Cracked Pepper Crispy Gobi Manchurian',
    category: 'starters',
    type: 'veg',
    pricePerGuest: 90,
    unit: 'portions',
    factorPerGuest: 0.8,
    description: 'Indo-Chinese style crispy battered cauliflower florets wok-tossed in a dark soy, ginger, fresh black pepper, and scallion glaze.',
    popular: false,
    spicyLevel: 2
  },

  // --- JUICES & BEVERAGES ---
  {
    id: 'j1',
    name: 'Kesar Alphonso Mango Lassi',
    category: 'juice',
    type: 'veg',
    pricePerGuest: 80,
    unit: 'glasses',
    factorPerGuest: 1.0,
    description: 'Creamy cold-whipped sweet yogurt beverage blended with sun-ripened Alphonso mango pulp, pure Kashmiri saffron, and silver leaf.',
    popular: true,
    spicyLevel: 0
  },
  {
    id: 'j2',
    name: 'Shahi Roasted Cumin Chaas',
    category: 'juice',
    type: 'veg',
    pricePerGuest: 45,
    unit: 'glasses',
    factorPerGuest: 1.2,
    description: 'Churned cooling buttermilk infused with freshly roasted fragrant cumin seeds, hand-torn cilantro, black salt, and sparkling ginger juice.',
    popular: false,
    spicyLevel: 0
  },
  {
    id: 'j3',
    name: 'Fresh Mint Limonana & Chia Seed Soda',
    category: 'juice',
    type: 'veg',
    pricePerGuest: 55,
    unit: 'glasses',
    factorPerGuest: 1.1,
    description: 'Vibrant house-squeezed green lemons mixed with crushed mint sprigs, organic chia seeds, and dynamic mineral fizzy gas.',
    popular: false,
    spicyLevel: 0
  },
  {
    id: 'j4',
    name: 'Rich Badam Kesar Golden Milk',
    category: 'juice',
    type: 'veg',
    pricePerGuest: 95,
    unit: 'glasses',
    factorPerGuest: 1.0,
    description: 'Chilled full-cream milk slow-simmered with almond prunes, saffron stigmas, green cardamom powder, and finished with pistachios.',
    popular: true,
    spicyLevel: 0
  },
  {
    id: 'j5',
    name: 'Ruby Watermelon Basil Cooler',
    category: 'juice',
    type: 'veg',
    pricePerGuest: 65,
    unit: 'glasses',
    factorPerGuest: 1.0,
    description: 'Fresh cold-pressed sweet watermelon juice scented with fresh lemon basil leaves and micro black salt particles.',
    popular: false,
    spicyLevel: 0
  },

  // --- MAIN COURSE ---
  {
    id: 'm1',
    name: 'Royal Paneer Butter Masala',
    category: 'main',
    type: 'veg',
    pricePerGuest: 170,
    unit: 'portions',
    factorPerGuest: 0.6,
    description: 'Cubes of fresh handmade cottage cheese cooked in a smooth, sweet-spiced buttery tomato gravy enriched with cashew nut paste.',
    popular: true,
    spicyLevel: 1
  },
  {
    id: 'm2',
    name: 'Delhi-Style Butter Chicken (Murgh Makhani)',
    category: 'main',
    type: 'non-veg',
    pricePerGuest: 230,
    unit: 'portions',
    factorPerGuest: 0.6,
    description: 'Tandoori boneless chicken charcoal-grilled and finished in a velvet-textured butter rich tomato gravy with authentic fenugreek accent.',
    popular: true,
    spicyLevel: 1
  },
  {
    id: 'm3',
    name: 'Signature Slow-Simmered Dal makhani',
    category: 'main',
    type: 'veg',
    pricePerGuest: 120,
    unit: 'portions',
    factorPerGuest: 0.5,
    description: 'Black urad lentils and red kidney beans slow-simmered for 18 hours with vine tomatoes on gentle embers, enriched with premium unsalted butter.',
    popular: true,
    spicyLevel: 1
  },
  {
    id: 'm4',
    name: 'Pindi Chole-Masala',
    category: 'main',
    type: 'veg',
    pricePerGuest: 100,
    unit: 'portions',
    factorPerGuest: 0.5,
    description: 'Kabuli chickpeas simmered in a dark roasted dry-pomegranate spice bouquet and robust ginger-garlic reduction, raw and deeply satisfying.',
    popular: false,
    spicyLevel: 2
  },
  {
    id: 'm5',
    name: 'Awadhi Fragrant Dum Mutton Biryani',
    category: 'main',
    type: 'non-veg',
    pricePerGuest: 290,
    unit: 'portions',
    factorPerGuest: 0.7,
    description: 'Succulent lamb meat marinated in secret spices and slow-cooked with vintage aged basmati rice on low puff flame under sealed flour ring.',
    popular: true,
    spicyLevel: 2
  },
  {
    id: 'm6',
    name: 'Banarasi Subz Kesar Biryani',
    category: 'main',
    type: 'veg',
    pricePerGuest: 160,
    unit: 'portions',
    factorPerGuest: 0.7,
    description: 'Fragrant premium basmati rice cooked with fresh seasonal farm vegetables, rose water droplets, cardamoms, saffron strands, and crispy fried onions.',
    popular: false,
    spicyLevel: 2
  },
  {
    id: 'm7',
    name: 'Fresh Tandoori Breads Basket',
    category: 'main',
    type: 'veg',
    pricePerGuest: 65,
    unit: 'baskets',
    factorPerGuest: 1.0,
    description: 'Assortment of fresh clay-oven baked hot garlic naans, flaky laccha parathas, and high-fiber tandoori rotis served glazed with butter.',
    popular: true,
    spicyLevel: 0
  },

  // --- DESSERTS ---
  {
    id: 'd1',
    name: 'Rosewater Kesar Shahi Rasmalai',
    category: 'dessert',
    type: 'veg',
    pricePerGuest: 110,
    unit: 'pieces',
    factorPerGuest: 1.5,
    description: 'Feathery flat cottage cheese discs poached in thick cardamom and milk reduction, layered with rich saffron and garnished with pistachios.',
    popular: true,
    spicyLevel: 0
  },
  {
    id: 'd2',
    name: 'Deewan-E-Khas Gulab Jamun with Rabri',
    category: 'dessert',
    type: 'veg',
    pricePerGuest: 95,
    unit: 'pieces',
    factorPerGuest: 1.5,
    description: 'Deep golden warm milk-solids syrup balls inside a cold-lake bed of luxurious almond milk Rabri paste.',
    popular: true,
    spicyLevel: 0
  },
  {
    id: 'd3',
    name: 'Chilled Kesar Pista Falooda Kulfi',
    category: 'dessert',
    type: 'veg',
    pricePerGuest: 85,
    unit: 'cups',
    factorPerGuest: 1.0,
    description: 'Rich traditional slow-reduced Indian ice cream seasoned with saffron, sliced pistachios, served over vermicelli noodles and rose water glaze.',
    popular: false,
    spicyLevel: 0
  },
  {
    id: 'd4',
    name: 'Desi Ghee Moong Dal Halwa',
    category: 'dessert',
    type: 'veg',
    pricePerGuest: 105,
    unit: 'portions',
    factorPerGuest: 0.8,
    description: 'Warm, slow-roasted yellow lentils confection heavily cooked in rich organic cow ghee, roasted splinters of cashew-nut, and fine almond milk.',
    popular: false,
    spicyLevel: 0
  },
  {
    id: 'd5',
    name: 'Luxurious Saffron Shahi Tukda',
    category: 'dessert',
    type: 'veg',
    pricePerGuest: 100,
    unit: 'pieces',
    factorPerGuest: 1.2,
    description: 'Crisp ghee fried bread toast soaked in delicate rose sugar syrup, covered with a thick blanket of aromatic condensed rabri and slivered dry fruit.',
    popular: false,
    spicyLevel: 0
  }
];

export const INDIAN_EVENT_TYPES = [
  'Wedding Reception',
  'Mehendi / Sangeet Ceremony',
  'Corporate Banquet',
  'Family Engagement',
  'Housewarming Ceremony',
  'Birthday Celebration',
  'Festive Pooja / Diwali Gathering',
  'Anniversary Dinner'
];

/**
 * Calculate recommended total quantity for an item based on guests, portion-multiplier, and proportion ratio.
 */
export function calculateQuantity(
  guestCount: number,
  item: MenuItem,
  multiplier: number,
  proportion: number
): number {
  const recommendedQuantity = guestCount * item.factorPerGuest * multiplier * (proportion / 100);
  return Math.ceil(recommendedQuantity);
}
