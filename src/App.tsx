/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameLogic } from './hooks/useGameLogic';
import { Card } from './components/Card';
import { SuitSelector } from './components/SuitSelector';
import { SUIT_SYMBOLS, SUIT_COLORS, SUIT_NAMES_ZH, CARD_COLOR_ORDER, CARD_COLOR_CONFIG } from './constants';
import { Trophy, RotateCcw, Info, Play, Layers, Users } from 'lucide-react';

export default function App() {
  const { state, initGame, resetGame, playCard, drawCard, selectSuit, endTurn } = useGameLogic();
  const [aiCount, setAiCount] = useState(3);

  const isCardPlayable = (card: any) => {
    if (state.turn !== 'player' || state.status !== 'playing') return false;
    return card.rank === '9' || card.suit === state.currentSuit || card.rank === state.currentRank;
  };

  const getPlayerName = (pid: string) => {
    if (pid === 'player') return '你';
    return pid.toUpperCase();
  };

  const suitBgColors: Record<string, string> = {
    hearts: 'from-red-900/20',
    diamonds: 'from-orange-900/20',
    clubs: 'from-slate-900/20',
    spades: 'from-blue-900/20',
    stars: 'from-yellow-900/20',
    moons: 'from-indigo-900/20',
  };

  return (
    <div className={`h-screen w-full felt-table relative flex flex-col overflow-hidden transition-colors duration-1000 bg-gradient-to-b ${suitBgColors[state.currentSuit]} to-transparent`}>
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full blur-[120px] transition-colors duration-1000 ${state.currentSuit === 'hearts' ? 'bg-red-500' : state.currentSuit === 'stars' ? 'bg-yellow-500' : 'bg-blue-500'}`} 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full blur-[120px] transition-colors duration-1000 ${state.currentSuit === 'moons' ? 'bg-indigo-500' : 'bg-emerald-500'}`} 
        />
      </div>

      {/* Header / Stats */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <div className={`bg-black/30 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 flex items-center gap-4 transition-all duration-500 ${state.turn === 'player' ? 'ring-2 ring-yellow-400/50 shadow-[0_0_20px_rgba(250,204,21,0.2)]' : ''}`}>
          <div className="flex items-center gap-2">
            <motion.div 
              animate={state.turn === 'player' ? { scale: [1, 1.5, 1], opacity: [1, 0.5, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className={`w-3 h-3 rounded-full ${state.turn === 'player' ? 'bg-green-400' : 'bg-slate-500'}`} 
            />
            <span className="text-white text-xs font-medium uppercase tracking-wider">
              {state.turn === 'player' ? '你的回合' : `${getPlayerName(state.turn)} 的回合`}
            </span>
          </div>
          <div className="w-px h-4 bg-white/20" />
          <div className="text-white/80 text-xs font-mono">
            牌堆: {state.deck.length}
          </div>
        </div>

        <div className="flex gap-2">
          {state.turn === 'player' && state.hasPlayedThisTurn && state.status === 'playing' && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={endTurn}
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-slate-900 text-xs font-bold rounded-full transition-all active:scale-95 shadow-lg"
            >
              结束回合
            </motion.button>
          )}
          <button 
            onClick={initGame}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      {/* Game Table (Centered) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex items-center gap-12 sm:gap-24 relative z-0 pointer-events-auto">
          {/* Draw Pile */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-white/5 rounded-2xl blur-xl group-hover:bg-white/10 transition-all" />
            <div 
              onClick={state.turn === 'player' && state.status === 'playing' && !state.hasPlayedThisTurn ? drawCard : undefined}
              className={`relative transition-transform active:scale-95 ${state.turn !== 'player' || state.hasPlayedThisTurn ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {state.deck.length > 0 ? (
                <>
                  <div className="absolute top-1 left-1 w-20 h-28 sm:w-24 sm:h-36 bg-blue-900 rounded-lg border-2 border-blue-950 translate-x-1 translate-y-1" />
                  <Card card={state.deck[0]} isFaceUp={false} />
                  <div className="absolute -bottom-6 left-0 right-0 text-center text-white/40 text-[10px] uppercase font-bold tracking-tighter">
                    {state.hasPlayedThisTurn ? '已出牌无法摸牌' : '摸牌'}
                  </div>
                </>
              ) : (
                <div className="w-20 h-28 sm:w-24 sm:h-36 rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center text-white/20">
                  已空
                </div>
              )}
            </div>
          </div>

          {/* Discard Pile */}
          <div className="relative">
            <div className="absolute -inset-8 bg-yellow-400/5 rounded-full blur-2xl" />
            
            {/* Combo Indicator */}
            <AnimatePresence>
              {state.cardsPlayedThisTurn > 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.5 }}
                  className="absolute -right-16 top-0 z-20"
                >
                  <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-slate-900 px-3 py-1 rounded-lg font-black italic text-sm shadow-lg border-2 border-white/20 whitespace-nowrap">
                    COMBO x{state.cardsPlayedThisTurn}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="popLayout">
              {state.discardPile.length > 0 && (
                <motion.div
                  key={state.discardPile[0].id}
                  initial={{ scale: 1.5, opacity: 0, rotate: 45 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1, 
                    rotate: 0,
                    boxShadow: state.turn === 'player' ? ['0 0 0px rgba(250,204,21,0)', '0 0 30px rgba(250,204,21,0.3)', '0 0 0px rgba(250,204,21,0)'] : 'none'
                  }}
                  transition={{
                    boxShadow: { duration: 2, repeat: Infinity }
                  }}
                  className="relative"
                >
                  <Card card={state.discardPile[0]} isFaceUp={true} />
                  
                  {/* Current Suit Indicator (for 9s) */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-2 border border-white/20">
                     <span className={`text-xl ${SUIT_COLORS[state.currentSuit]}`}>
                       {SUIT_SYMBOLS[state.currentSuit]}
                     </span>
                     <span className="text-white text-[10px] font-bold uppercase tracking-widest">
                       {SUIT_NAMES_ZH[state.currentSuit]}
                     </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* AI Hands - Top and Sides */}
      <div className="flex-1 relative pointer-events-none">
        {/* AI 2 (Top) */}
        {state.activePlayers.includes('ai2') && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <div className="flex -space-x-16 sm:-space-x-20">
              {state.hands.ai2.map((card, i) => (
                <Card key={card.id} card={card} isFaceUp={false} index={i} className="scale-75 origin-bottom" />
              ))}
            </div>
            <div className="bg-black/40 px-3 py-1 rounded-full text-white/60 text-[10px] font-bold uppercase tracking-widest border border-white/5">
              AI 2 ({state.hands.ai2.length})
            </div>
          </div>
        )}

        {/* AI 1 (Left) */}
        {state.activePlayers.includes('ai1') && (
          <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 rotate-90">
            <div className="flex -space-x-16 sm:-space-x-20">
              {state.hands.ai1.map((card, i) => (
                <Card key={card.id} card={card} isFaceUp={false} index={i} className="scale-75 origin-bottom" />
              ))}
            </div>
            <div className="bg-black/40 px-3 py-1 rounded-full text-white/60 text-[10px] font-bold uppercase tracking-widest border border-white/5">
              AI 1 ({state.hands.ai1.length})
            </div>
          </div>
        )}

        {/* AI 3 (Right) */}
        {state.activePlayers.includes('ai3') && (
          <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 -rotate-90">
            <div className="flex -space-x-16 sm:-space-x-20">
              {state.hands.ai3.map((card, i) => (
                <Card key={card.id} card={card} isFaceUp={false} index={i} className="scale-75 origin-bottom" />
              ))}
            </div>
            <div className="bg-black/40 px-3 py-1 rounded-full text-white/60 text-[10px] font-bold uppercase tracking-widest border border-white/5">
              AI 3 ({state.hands.ai3.length})
            </div>
          </div>
        )}
      </div>

      {/* Player Hand */}
      <div className="flex-1 flex flex-col items-center justify-end pb-12">
        <div className="relative h-40 flex items-center justify-center w-full max-w-4xl px-4">
          <AnimatePresence>
            {state.hands.player.map((card, idx) => (
              <div 
                key={card.id} 
                className="absolute transition-all duration-300"
                style={{ 
                  transform: `translateX(${(idx - (state.hands.player.length - 1) / 2) * (window.innerWidth < 640 ? 30 : 45)}px) rotate(${(idx - (state.hands.player.length - 1) / 2) * 2}deg)`,
                }}
              >
                <Card 
                  card={card} 
                  isFaceUp={true} 
                  isPlayable={isCardPlayable(card)}
                  onClick={() => playCard(card)}
                  index={idx}
                />
              </div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Color Legend - Side */}
      <div className="absolute left-4 top-24 bottom-24 hidden lg:flex flex-col justify-center gap-2 z-10">
        <div className="bg-black/20 backdrop-blur-md border border-white/5 rounded-2xl p-3 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1">
            <Layers size={14} className="text-white/40" />
            <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">稀有度 & 惩罚</span>
          </div>
          {CARD_COLOR_ORDER.map(color => {
            const cfg = CARD_COLOR_CONFIG[color];
            return (
              <div key={color} className="flex items-center gap-3 group">
                <div className={`w-3 h-3 rounded-full ${cfg.bg} ${cfg.border} border shadow-sm`} />
                <div className="flex flex-col">
                  <span className="text-white/60 text-[10px] font-bold leading-none">{cfg.name}</span>
                  <span className="text-white/30 text-[8px] leading-none">+{cfg.drawExtra} 摸牌</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Log */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-xs text-center">
        <motion.p 
          key={state.lastAction}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white/60 text-xs font-medium tracking-wide"
        >
          {state.lastAction}
        </motion.p>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {state.status === 'waiting' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="max-w-md w-full text-center"
            >
              <div className="mb-8 flex justify-center">
                <div className="w-24 h-24 bg-yellow-400 rounded-3xl flex items-center justify-center rotate-12 shadow-2xl shadow-yellow-400/20">
                  <span className="text-6xl font-black text-slate-900">9</span>
                </div>
              </div>
              <h1 className="text-5xl font-black text-white mb-4 tracking-tighter italic">疯狂 9 点</h1>
                <div className="bg-slate-800 border border-white/10 rounded-2xl p-6 mb-8 text-left">
                <h2 className="text-yellow-400 font-bold mb-4 flex items-center gap-2">
                  <Users size={16} /> 选择人机数量
                </h2>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[1, 2, 3].map(count => (
                      <button
                        key={count}
                        onClick={() => setAiCount(count)}
                        className={`relative py-4 rounded-2xl font-black transition-all overflow-hidden group ${aiCount === count ? 'bg-yellow-400 text-slate-900 shadow-[0_0_30px_rgba(250,204,21,0.4)] scale-105' : 'bg-slate-800 text-white/60 hover:bg-slate-700'}`}
                      >
                      {aiCount === count && (
                        <motion.div 
                          layoutId="ai-selector-bg"
                          className="absolute inset-0 bg-yellow-400"
                        />
                      )}
                      <span className="relative z-10 flex flex-col items-center">
                        <span className="text-lg">{count}</span>
                        <span className="text-[10px] uppercase tracking-tighter opacity-60">人机</span>
                      </span>
                    </button>
                  ))}
                </div>

                <h2 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                  <Info size={16} /> 游戏规则
                </h2>
                <ul className="text-white/70 text-sm space-y-2 list-disc list-inside">
                  <li>匹配弃牌堆顶部的<span className="text-white font-bold">花色</span>或<span className="text-white font-bold">点数</span>。</li>
                  <li><span className="text-yellow-400 font-bold">数字 9</span> 是万能牌，可随时打出并更改花色。</li>
                  <li>不同<span className="text-blue-400 font-bold">颜色</span>的卡牌带有不同的摸牌惩罚。</li>
                  <li>单轮打出多张牌可触发 <span className="text-orange-400 font-bold italic">COMBO</span> 特效！</li>
                  <li>率先清空手牌即为胜利。</li>
                </ul>
              </div>
              
              <button 
                onClick={() => initGame(aiCount)}
                className="w-full py-4 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 group shadow-[0_0_30px_rgba(250,204,21,0.3)]"
              >
                <Play fill="currentColor" />
                立即开局
              </button>

              <div className="mt-8 grid grid-cols-3 gap-3">
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                   <h3 className="text-white text-[10px] font-bold mb-1 uppercase tracking-wider">初始手牌</h3>
                   <p className="text-yellow-400 text-lg font-black">12</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                   <h3 className="text-white text-[10px] font-bold mb-1 uppercase tracking-wider">游戏人数</h3>
                   <p className="text-blue-400 text-lg font-black">4</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                   <h3 className="text-white text-[10px] font-bold mb-1 uppercase tracking-wider">牌堆数量</h3>
                   <p className="text-green-400 text-lg font-black">100+</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {state.status === 'choosing_suit' && (
          <SuitSelector onSelect={selectSuit} />
        )}

        {state.status === 'game_over' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-6"
          >
            <div className="bg-white rounded-3xl p-12 max-w-sm w-full text-center shadow-2xl">
              <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${state.winner === 'player' ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-100 text-slate-600'}`}>
                <Trophy size={40} />
              </div>
              <h2 className="text-3xl font-black mb-2 uppercase tracking-tight">
                {state.winner === 'player' ? '胜利！' : '游戏结束'}
              </h2>
              <p className="text-slate-500 mb-8">
                {state.winner === 'player' ? '你率先清空了手牌！' : `${getPlayerName(state.winner || '')} 赢得了比赛。`}
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => initGame(aiCount)}
                  className="w-full py-4 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-[0_0_20px_rgba(250,204,21,0.2)]"
                >
                  <RotateCcw size={20} />
                  再玩一次
                </button>
                <button 
                  onClick={resetGame}
                  className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95"
                >
                  返回主菜单
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Overlay Hint */}
      <div className="sm:hidden absolute top-4 right-4 text-white/20">
        <Info size={20} />
      </div>
    </div>
  );
}
