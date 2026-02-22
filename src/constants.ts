import { Suit, Rank, Card, CardColor } from './types';

export const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades', 'stars', 'moons'];
export const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const SUIT_SYMBOLS: Record<Suit, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
  stars: '★',
  moons: '🌙',
};

export const SUIT_COLORS: Record<Suit, string> = {
  hearts: 'text-red-500',
  diamonds: 'text-red-500',
  clubs: 'text-slate-900',
  spades: 'text-slate-900',
  stars: 'text-yellow-500',
  moons: 'text-indigo-500',
};

export const SUIT_NAMES_ZH: Record<Suit, string> = {
  hearts: '红心',
  diamonds: '方块',
  clubs: '梅花',
  spades: '黑桃',
  stars: '星星',
  moons: '月亮',
};

export const CARD_COLOR_ORDER: CardColor[] = ['green', 'blue', 'purple', 'pink', 'red', 'gold', 'rainbow'];

export const CARD_COLOR_CONFIG: Record<CardColor, { name: string, drawExtra: number, rarity: number, bg: string, text: string, border: string }> = {
  none: { name: '普通', drawExtra: 0, rarity: 300, bg: 'bg-white', text: 'text-slate-900', border: 'border-slate-200' },
  green: { name: '绿', drawExtra: 2, rarity: 150, bg: 'bg-emerald-500', text: 'text-emerald-900', border: 'border-emerald-500' },
  blue: { name: '蓝', drawExtra: 3, rarity: 120, bg: 'bg-blue-500', text: 'text-blue-900', border: 'border-blue-500' },
  purple: { name: '紫', drawExtra: 4, rarity: 100, bg: 'bg-purple-600', text: 'text-purple-900', border: 'border-purple-600' },
  pink: { name: '粉', drawExtra: 5, rarity: 80, bg: 'bg-pink-500', text: 'text-pink-900', border: 'border-pink-500' },
  red: { name: '红', drawExtra: 6, rarity: 60, bg: 'bg-red-600', text: 'text-red-900', border: 'border-red-600' },
  gold: { name: '金', drawExtra: 7, rarity: 40, bg: 'bg-yellow-400', text: 'text-yellow-900', border: 'border-yellow-500' },
  rainbow: { name: '彩', drawExtra: 8, rarity: 20, bg: 'bg-gradient-to-br from-red-500 via-yellow-400 via-green-500 via-blue-500 to-purple-500', text: 'text-white', border: 'border-white/50' },
};

function getRandomColor(): CardColor {
  const totalRarity = Object.values(CARD_COLOR_CONFIG).reduce((sum, cfg) => sum + cfg.rarity, 0);
  let random = Math.random() * totalRarity;
  
  for (const [color, cfg] of Object.entries(CARD_COLOR_CONFIG)) {
    if (random < cfg.rarity) return color as CardColor;
    random -= cfg.rarity;
  }
  return 'none';
}

export function createDeck(): Card[] {
  const deck: Card[] = [];
  // Use 2 decks to increase pile size
  for (let i = 0; i < 2; i++) {
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        // Only add '9' in the first deck iteration to reduce its frequency by half
        if (rank === '9' && i > 0) continue;

        deck.push({
          id: `${rank}-${suit}-${i}-${Math.random().toString(36).substr(2, 9)}`,
          suit,
          rank,
          isWild: rank === '9',
          color: rank === '9' ? 'none' : getRandomColor(),
        });
      }
    }
  }
  return shuffle(deck);
}

export function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
