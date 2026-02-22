export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades' | 'stars';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export type CardColor = 'none' | 'white' | 'green' | 'blue' | 'purple' | 'pink' | 'red' | 'gold' | 'rainbow';

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  isWild?: boolean;
  color: CardColor;
}

export type GameStatus = 'waiting' | 'playing' | 'choosing_suit' | 'game_over';

export type PlayerId = 'player' | 'ai1' | 'ai2' | 'ai3';

export interface GameState {
  deck: Card[];
  hands: Record<PlayerId, Card[]>;
  discardPile: Card[];
  currentSuit: Suit;
  currentRank: Rank;
  turn: PlayerId;
  status: GameStatus;
  winner: PlayerId | null;
  lastAction: string;
  hasPlayedThisTurn: boolean;
  cardsPlayedThisTurn: number;
}
