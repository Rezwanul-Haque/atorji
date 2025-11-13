import { Product } from '@shared/types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Noir Essence',
    brand: 'Luxe Parfums',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=600&fit=crop',
    description: 'A sophisticated blend of dark woods and subtle spices, perfect for evening wear.',
    size: '100ml',
    notes: {
      top: ['Bergamot', 'Black Pepper', 'Cardamom'],
      middle: ['Lavender', 'Iris', 'Geranium'],
      base: ['Cedarwood', 'Vetiver', 'Amber']
    },
    gender: 'male',
    rating: 4.8,
    inStock: true
  },
  {
    id: '2',
    name: 'Rose Lumière',
    brand: 'Maison de Fleur',
    price: 159.99,
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=600&fit=crop',
    description: 'An elegant floral composition centered around the finest Bulgarian rose.',
    size: '75ml',
    notes: {
      top: ['Pink Pepper', 'Mandarin', 'Lychee'],
      middle: ['Bulgarian Rose', 'Peony', 'Jasmine'],
      base: ['Sandalwood', 'Vanilla', 'White Musk']
    },
    gender: 'female',
    rating: 4.9,
    inStock: true
  },
  {
    id: '3',
    name: 'Azure Coast',
    brand: 'Coastal Scents',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59c75?w=400&h=600&fit=crop',
    description: 'Fresh and invigorating, capturing the essence of Mediterranean coastlines.',
    size: '100ml',
    notes: {
      top: ['Sea Salt', 'Grapefruit', 'Mint'],
      middle: ['Aquatic Notes', 'Sage', 'Rosemary'],
      base: ['Driftwood', 'Amber', 'Musk']
    },
    gender: 'unisex',
    rating: 4.6,
    inStock: true
  },
  {
    id: '4',
    name: 'Velvet Oud',
    brand: 'Orient Luxe',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=600&fit=crop',
    description: 'Rich and opulent oud fragrance with a modern, luxurious twist.',
    size: '50ml',
    notes: {
      top: ['Saffron', 'Cinnamon', 'Orange Blossom'],
      middle: ['Oud', 'Rose', 'Patchouli'],
      base: ['Leather', 'Incense', 'Musk']
    },
    gender: 'unisex',
    rating: 4.9,
    inStock: true
  },
  {
    id: '5',
    name: 'Citrus Dream',
    brand: 'Fresh & Co',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&h=600&fit=crop',
    description: 'Bright and energizing citrus blend perfect for daytime wear.',
    size: '100ml',
    notes: {
      top: ['Lemon', 'Bergamot', 'Orange'],
      middle: ['Neroli', 'Petit Grain', 'Green Tea'],
      base: ['White Musk', 'Cedarwood', 'Amber']
    },
    gender: 'unisex',
    rating: 4.5,
    inStock: true
  },
  {
    id: '6',
    name: 'Midnight Garden',
    brand: 'Nocturne',
    price: 139.99,
    image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400&h=600&fit=crop',
    description: 'Mysterious and enchanting, like a moonlit garden in full bloom.',
    size: '75ml',
    notes: {
      top: ['Night Blooming Jasmine', 'Violet Leaves'],
      middle: ['Tuberose', 'Gardenia', 'Ylang Ylang'],
      base: ['Tonka Bean', 'Benzoin', 'Vanilla']
    },
    gender: 'female',
    rating: 4.7,
    inStock: true
  },
  {
    id: '7',
    name: 'Spice Trail',
    brand: 'Nomad Collection',
    price: 119.99,
    image: 'https://images.unsplash.com/photo-1596727362302-b8d891c42ab8?w=400&h=600&fit=crop',
    description: 'Warm and exotic spice blend inspired by ancient trade routes.',
    size: '100ml',
    notes: {
      top: ['Cardamom', 'Ginger', 'Clove'],
      middle: ['Cinnamon', 'Nutmeg', 'Star Anise'],
      base: ['Sandalwood', 'Patchouli', 'Vanilla']
    },
    gender: 'male',
    rating: 4.6,
    inStock: true
  },
  {
    id: '8',
    name: 'White Tea Blossom',
    brand: 'Zen Garden',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1528821154947-1aa3d1b74941?w=400&h=600&fit=crop',
    description: 'Delicate and serene, a calming blend of white tea and soft florals.',
    size: '75ml',
    notes: {
      top: ['White Tea', 'Mandarin', 'Ginger'],
      middle: ['Cherry Blossom', 'Freesia', 'White Rose'],
      base: ['Musk', 'Cedarwood', 'Amber']
    },
    gender: 'female',
    rating: 4.8,
    inStock: false
  }
];
