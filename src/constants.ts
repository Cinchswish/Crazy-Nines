import { Suit, Rank, Card, CardColor } from './types';

export const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades', 'stars'];
export const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

export const SUIT_SYMBOLS: Record<Suit, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
  stars: '★',
};

export const SUIT_COLORS: Record<Suit, string> = {
  hearts: 'text-red-500',
  diamonds: 'text-red-500',
  clubs: 'text-slate-900',
  spades: 'text-slate-900',
  stars: 'text-yellow-500',
};

export const SUIT_NAMES_ZH: Record<Suit, string> = {
  hearts: '红心',
  diamonds: '方块',
  clubs: '梅花',
  spades: '黑桃',
  stars: '星星',
};

export const CARD_COLOR_CONFIG: Record<CardColor, { name: string, drawExtra: number, rarity: number, bg: string, text: string }> = {
  none: { name: '普通', drawExtra: 0, rarity: 500, bg: 'bg-white', text: 'text-slate-900' },
  white: { name: '白', drawExtra: 1, rarity: 200, bg: 'bg-slate-100', text: 'text-slate-700' },
  green: { name: '绿', drawExtra: 2, rarity: 120, bg: 'bg-emerald-100', text: 'text-emerald-700' },
  blue: { name: '蓝', drawExtra: 3, rarity: 80, bg: 'bg-blue-100', text: 'text-blue-700' },
  purple: { name: '紫', drawExtra: 4, rarity: 50, bg: 'bg-purple-100', text: 'text-purple-700' },
  pink: { name: '粉', drawExtra: 5, rarity: 30, bg: 'bg-pink-100', text: 'text-pink-700' },
  red: { name: '红', drawExtra: 6, rarity: 15, bg: 'bg-red-100', text: 'text-red-700' },
  gold: { name: '金', drawExtra: 7, rarity: 4, bg: 'bg-yellow-100', text: 'text-yellow-700' },
  rainbow: { name: '彩', drawExtra: 8, rarity: 1, bg: 'bg-gradient-to-br from-red-200 via-green-200 to-blue-200', text: 'text-slate-900' },
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
        deck.push({
          id: `${rank}-${suit}-${i}-${Math.random().toString(36).substr(2, 9)}`,
          suit,
          rank,
          isWild: rank === '9',
          color: getRandomColor(),
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
