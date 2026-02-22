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
    
    switch (card.color) {
      case 'rainbow': return `${colorCfg.bg} shadow-[0_0_20px_rgba(255,255,255,0.8)] border-transparent bg-gradient-to-br from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400 animate-pulse`;
      case 'gold': return `${colorCfg.bg} shadow-[0_0_15px_rgba(251,191,36,0.6)] border-yellow-400 ring-1 ring-yellow-400/50`;
      case 'red': return `${colorCfg.bg} shadow-[0_0_12px_rgba(239,68,68,0.5)] border-red-500`;
      case 'pink': return `${colorCfg.bg} shadow-[0_0_10px_rgba(244,114,182,0.4)] border-pink-400`;
      case 'purple': return `${colorCfg.bg} shadow-[0_0_8px_rgba(192,132,252,0.3)] border-purple-400`;
      case 'blue': return `${colorCfg.bg} shadow-[0_0_6px_rgba(96,165,250,0.2)] border-blue-400`;
      case 'green': return `${colorCfg.bg} shadow-[0_0_6px_rgba(52,211,153,0.2)] border-emerald-400`;
      case 'white': return `${colorCfg.bg} shadow-[0_0_4px_rgba(255,255,255,0.2)] border-slate-300`;
      default: return `${colorCfg.bg} border-slate-200`;
    }
  };

  return (
    <motion.div
      layoutId={card.id}
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
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
          <div className={`absolute top-1 left-1.5 text-xs sm:text-sm font-bold ${card.color === 'none' ? SUIT_COLORS[card.suit] : colorCfg.text}`}>
            {card.rank}
          </div>
          <div className={`absolute top-4 left-1.5 text-xs sm:text-sm ${card.color === 'none' ? SUIT_COLORS[card.suit] : colorCfg.text}`}>
            {SUIT_SYMBOLS[card.suit]}
          </div>
          
          <div className={`text-3xl sm:text-4xl ${card.color === 'none' ? SUIT_COLORS[card.suit] : colorCfg.text}`}>
            {card.rank === '9' ? '★' : SUIT_SYMBOLS[card.suit]}
          </div>

          <div className={`absolute bottom-4 right-1.5 text-xs sm:text-sm rotate-180 ${card.color === 'none' ? SUIT_COLORS[card.suit] : colorCfg.text}`}>
            {SUIT_SYMBOLS[card.suit]}
          </div>
          <div className={`absolute bottom-1 right-1.5 text-xs sm:text-sm font-bold rotate-180 ${card.color === 'none' ? SUIT_COLORS[card.suit] : colorCfg.text}`}>
            {card.rank}
          </div>
          
          {card.color !== 'none' && (
            <div className="absolute top-1 right-1 px-1 rounded bg-black/10 text-[8px] font-bold">
              {colorCfg.name}
            </div>
          )}

          {card.rank === '9' && (
            <div className="absolute inset-0 border-2 border-yellow-400/30 rounded-lg pointer-events-none" />
          )}
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center p-2">
          <div className="w-full h-full border border-blue-400/30 rounded-md flex items-center justify-center">
             <div className="text-blue-200/20 text-4xl">♠</div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
