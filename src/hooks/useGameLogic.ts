import { useState, useCallback, useEffect } from 'react';
import { Card, GameState, Suit, Rank, GameStatus, PlayerId } from '../types';
import { createDeck, SUITS, SUIT_NAMES_ZH, CARD_COLOR_CONFIG } from '../constants';
import confetti from 'canvas-confetti';

export const useGameLogic = () => {
  const [state, setState] = useState<GameState>({
    deck: [],
    hands: {
      player: [],
      ai1: [],
      ai2: [],
      ai3: [],
    },
    discardPile: [],
    currentSuit: 'hearts',
    currentRank: 'A',
    turn: 'player',
    status: 'waiting',
    winner: null,
    lastAction: '欢迎来到疯狂 9 点！',
    hasPlayedThisTurn: false,
    cardsPlayedThisTurn: 0,
  });

  const initGame = useCallback(() => {
    const fullDeck = createDeck();
    const hands: Record<PlayerId, Card[]> = {
      player: fullDeck.splice(0, 12),
      ai1: fullDeck.splice(0, 12),
      ai2: fullDeck.splice(0, 12),
      ai3: fullDeck.splice(0, 12),
    };
    
    let firstDiscardIndex = 0;
    while (fullDeck[firstDiscardIndex].rank === '9') {
      firstDiscardIndex++;
    }
    const firstDiscard = fullDeck.splice(firstDiscardIndex, 1)[0];

    setState({
      deck: fullDeck,
      hands,
      discardPile: [firstDiscard],
      currentSuit: firstDiscard.suit,
      currentRank: firstDiscard.rank,
      turn: 'player',
      status: 'playing',
      winner: null,
      lastAction: '游戏开始！轮到你了。',
      hasPlayedThisTurn: false,
      cardsPlayedThisTurn: 0,
    });
  }, []);

  const endTurn = useCallback(() => {
    setState(prev => {
      const playerOrder: PlayerId[] = ['player', 'ai1', 'ai2', 'ai3'];
      const currentIndex = playerOrder.indexOf(prev.turn);
      const nextIndex = (currentIndex + 1) % playerOrder.length;
      const nextPlayer = playerOrder[nextIndex];

      return {
        ...prev,
        turn: nextPlayer,
        hasPlayedThisTurn: false,
        cardsPlayedThisTurn: 0,
        lastAction: `${prev.turn === 'player' ? '你' : prev.turn} 结束了回合。轮到 ${nextPlayer === 'player' ? '你' : nextPlayer} 了。`,
      };
    });
  }, []);

  const checkWin = useCallback((hand: Card[], player: PlayerId) => {
    if (hand.length === 0) {
      setState(prev => ({
        ...prev,
        status: 'game_over',
        winner: player,
        lastAction: player === 'player' ? '你赢了！' : `${player} 赢了！`,
      }));
      if (player === 'player') {
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.6 }
        });
      }
      return true;
    }
    return false;
  }, []);

  const playCard = useCallback((card: Card, isPlayer: boolean) => {
    setState(prev => {
      const playerId = isPlayer ? 'player' : prev.turn;
      const newHand = prev.hands[playerId].filter(c => c.id !== card.id);
      const newCount = prev.cardsPlayedThisTurn + 1;
      
      const newState = {
        ...prev,
        hands: {
          ...prev.hands,
          [playerId]: newHand,
        },
        discardPile: [card, ...prev.discardPile],
        currentSuit: card.suit,
        currentRank: card.rank,
        hasPlayedThisTurn: true,
        cardsPlayedThisTurn: newCount,
        lastAction: `${isPlayer ? '你' : playerId} 打出了 ${SUIT_NAMES_ZH[card.suit]} ${card.rank} (${CARD_COLOR_CONFIG[card.color].name})`,
      };

      if (isPlayer && newCount >= 2) {
        confetti({
          particleCount: 30 * newCount,
          spread: 50 + (10 * newCount),
          origin: { y: 0.8 },
          colors: ['#fbbf24', '#f59e0b', '#d97706']
        });
      }

      if (card.rank === '9') {
        return {
          ...newState,
          status: isPlayer ? 'choosing_suit' : prev.status,
        };
      }

      return newState;
    });
  }, []);

  const selectSuit = useCallback((suit: Suit) => {
    setState(prev => ({
      ...prev,
      currentSuit: suit,
      status: 'playing',
      lastAction: `你选择了 ${SUIT_NAMES_ZH[suit]}。你可以继续出牌或结束回合。`,
    }));
  }, []);

  const drawCard = useCallback((playerId: PlayerId) => {
    setState(prev => {
      const topCard = prev.discardPile[0];
      const extraToDraw = topCard ? CARD_COLOR_CONFIG[topCard.color].drawExtra : 0;
      const totalToDraw = 3 + extraToDraw;

      const playerOrder: PlayerId[] = ['player', 'ai1', 'ai2', 'ai3'];
      const currentIndex = playerOrder.indexOf(prev.turn);
      const nextIndex = (currentIndex + 1) % playerOrder.length;
      const nextPlayer = playerOrder[nextIndex];

      if (prev.deck.length < totalToDraw) {
        // Simple reshuffle if deck is low
        const newDeck = createDeck(); 
        const drawnCards = newDeck.splice(0, totalToDraw);
        return {
          ...prev,
          deck: newDeck,
          hands: {
            ...prev.hands,
            [playerId]: [...prev.hands[playerId], ...drawnCards],
          },
          turn: nextPlayer,
          hasPlayedThisTurn: false,
          cardsPlayedThisTurn: 0,
          lastAction: `${playerId === 'player' ? '你' : playerId} 摸了 ${totalToDraw} 张牌 (含惩罚 ${extraToDraw} 张)。`,
        };
      }

      const newDeck = [...prev.deck];
      const drawnCards: Card[] = [];
      for(let i=0; i<totalToDraw; i++) {
        drawnCards.push(newDeck.pop()!);
      }

      return {
        ...prev,
        deck: newDeck,
        hands: {
          ...prev.hands,
          [playerId]: [...prev.hands[playerId], ...drawnCards],
        },
        turn: nextPlayer,
        hasPlayedThisTurn: false,
        cardsPlayedThisTurn: 0,
        lastAction: `${playerId === 'player' ? '你' : playerId} 摸了 ${totalToDraw} 张牌 (含惩罚 ${extraToDraw} 张)。`,
      };
    });
  }, []);

  // AI Logic
  useEffect(() => {
    if (state.status === 'playing' && state.turn !== 'player') {
      const timer = setTimeout(() => {
        const currentAi = state.turn;
        const aiHand = state.hands[currentAi];
        const playableCards = aiHand.filter(c => 
          c.rank === '9' || c.suit === state.currentSuit || c.rank === state.currentRank
        );

        if (playableCards.length > 0) {
          const nonNines = playableCards.filter(c => c.rank !== '9');
          const cardToPlay = nonNines.length > 0 ? nonNines[0] : playableCards[0];
          
          if (cardToPlay.rank === '9') {
            const suitCounts: Record<Suit, number> = { hearts: 0, diamonds: 0, clubs: 0, spades: 0, stars: 0 };
            aiHand.forEach(c => suitCounts[c.suit]++);
            const bestSuit = (Object.keys(suitCounts) as Suit[]).reduce((a, b) => suitCounts[a] > suitCounts[b] ? a : b);
            
            setState(prev => {
              const newHand = prev.hands[currentAi].filter(c => c.id !== cardToPlay.id);
              return {
                ...prev,
                hands: {
                  ...prev.hands,
                  [currentAi]: newHand,
                },
                discardPile: [cardToPlay, ...prev.discardPile],
                currentSuit: bestSuit,
                currentRank: cardToPlay.rank,
                hasPlayedThisTurn: true,
                cardsPlayedThisTurn: prev.cardsPlayedThisTurn + 1,
                lastAction: `${currentAi} 打出了 9 并选择了 ${SUIT_NAMES_ZH[bestSuit]}`,
              };
            });
          } else {
            playCard(cardToPlay, false);
          }
        } else {
          if (state.hasPlayedThisTurn) {
            endTurn();
          } else {
            drawCard(currentAi);
          }
        }
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [state.status, state.turn, state.hands, state.currentSuit, state.currentRank, state.hasPlayedThisTurn, playCard, drawCard, endTurn]);

  // Check win conditions
  useEffect(() => {
    if (state.status === 'playing') {
      (Object.keys(state.hands) as PlayerId[]).forEach(pid => {
        checkWin(state.hands[pid], pid);
      });
    }
  }, [state.hands, state.status, checkWin]);

  return {
    state,
    initGame,
    playCard: (card: Card) => playCard(card, true),
    drawCard: () => drawCard('player'),
    selectSuit,
    endTurn,
  };
};
