import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Suit } from '../types';
import { SUIT_SYMBOLS, SUIT_COLORS, SUIT_NAMES_ZH } from '../constants';

interface SuitSelectorProps {
  onSelect: (suit: Suit) => void;
}

export const SuitSelector: React.FC<SuitSelectorProps> = ({ onSelect }) => {
  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades', 'stars'];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
        <h2 className="text-2xl font-bold mb-2">万能 9 点！</h2>
        <p className="text-slate-500 mb-6">请选择接下来的花色</p>
        
        <div className="grid grid-cols-2 gap-4">
          {suits.map((suit) => (
            <button
              key={suit}
              onClick={() => onSelect(suit)}
              className={`
                flex flex-col items-center justify-center p-6 rounded-xl border-2 border-slate-100
                hover:border-blue-500 hover:bg-blue-50 transition-all group
              `}
            >
              <span className={`text-5xl mb-2 ${SUIT_COLORS[suit]}`}>
                {SUIT_SYMBOLS[suit]}
              </span>
              <span className="text-sm font-medium capitalize text-slate-600 group-hover:text-blue-600">
                {SUIT_NAMES_ZH[suit]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
