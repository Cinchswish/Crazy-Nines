import React from 'react';
import { motion } from 'motion/react';
import { Card as CardType } from '../types';
import { SUIT_SYMBOLS, SUIT_COLORS, CARD_COLOR_CONFIG } from '../constants';

interface CardProps {
  card: CardType;
  isFaceUp?: boolean;
  onClick?: () => void;
  isPlayable?: boolean;
  className?: string;
  index?: number;
}

export const Card: React.FC<CardProps> = ({
  card,
  isFaceUp = true,
  onClick,
  isPlayable = false,
  className = '',
  index = 0,
}) => {
  const colorCfg = CARD_COLOR_CONFIG[card.color];

  const getColorStyles = () => {
    if (!isFaceUp) return 'bg-blue-800 border-blue-900';
    
    if (isNine) {
      return 'bg-slate-900 border-slate-800 shadow-xl';
    }

    const baseStyles = `bg-white ${colorCfg.border}`;
    
    if (card.color === 'none') return baseStyles;

    // For colored cards, add a very subtle background tint to help recognition
    const tintMap: Record<string, string> = {
      green: 'bg-emerald-50',
      blue: 'bg-blue-50',
      purple: 'bg-purple-50',
      pink: 'bg-pink-50',
      red: 'bg-red-50',
      gold: 'bg-yellow-50',
      rainbow: 'bg-gradient-to-br from-red-50 via-green-50 to-blue-50',
    };

    const tint = tintMap[card.color] || 'bg-white';

    switch (card.color) {
      case 'rainbow': return `${tint} shadow-[0_0_15px_rgba(0,0,0,0.1)] border-transparent ring-2 ring-offset-1 ring-purple-400 animate-pulse`;
      case 'gold': return `${tint} shadow-[0_0_10px_rgba(251,191,36,0.2)] border-yellow-500`;
      default: return `${tint} ${colorCfg.border}`;
    }
  };

  const isNine = card.rank === '9';

  return (
    <motion.div
      layoutId={card.id}
      initial={{ scale: 0.8, opacity: 1, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      whileHover={isPlayable ? { y: -20, scale: 1.05 } : {}}
      onClick={isPlayable ? onClick : undefined}
      className={`
        relative w-20 h-28 sm:w-24 sm:h-36 rounded-lg border-2 
        ${getColorStyles()}
        ${isPlayable ? 'cursor-pointer ring-2 ring-yellow-400 ring-offset-2' : ''}
        flex flex-col items-center justify-center select-none card-shadow
        ${className}
      `}
      style={{
        zIndex: index,
      }}
    >
      {isFaceUp ? (
        <>
          <div className={`absolute top-1 left-1.5 text-xs sm:text-sm font-bold ${isNine ? 'text-white' : (card.color === 'none' ? SUIT_COLORS[card.suit] : colorCfg.text)}`}>
            {card.rank}
          </div>
          {!isNine && (
            <div className={`absolute top-4 left-1.5 text-xs sm:text-sm ${card.color === 'none' ? SUIT_COLORS[card.suit] : colorCfg.text}`}>
              {SUIT_SYMBOLS[card.suit]}
            </div>
          )}
          
          <div className={`text-3xl sm:text-4xl ${isNine ? 'text-white' : (card.color === 'none' ? SUIT_COLORS[card.suit] : colorCfg.text)}`}>
            {isNine ? (
              <span className="text-6xl sm:text-7xl font-black select-none">9</span>
            ) : (
              SUIT_SYMBOLS[card.suit]
            )}
          </div>

          {!isNine && (
            <div className={`absolute bottom-4 right-1.5 text-xs sm:text-sm rotate-180 ${card.color === 'none' ? SUIT_COLORS[card.suit] : colorCfg.text}`}>
              {SUIT_SYMBOLS[card.suit]}
            </div>
          )}
          <div className={`absolute bottom-1 right-1.5 text-xs sm:text-sm font-bold rotate-180 ${isNine ? 'text-white' : (card.color === 'none' ? SUIT_COLORS[card.suit] : colorCfg.text)}`}>
            {card.rank}
          </div>
          
          {card.color !== 'none' && !isNine && (
            <div className={`absolute top-1 right-1 px-1 rounded bg-slate-100 text-[8px] font-bold ${colorCfg.text} border border-black/5`}>
              {colorCfg.name}
            </div>
          )}

          {isNine && (
            <div className="absolute inset-0 border-4 border-yellow-400 rounded-lg pointer-events-none" />
          )}
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center p-2">
          <div className="w-full h-full border border-blue-400 rounded-md flex items-center justify-center">
             <div className="text-blue-200 text-4xl">♠</div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
