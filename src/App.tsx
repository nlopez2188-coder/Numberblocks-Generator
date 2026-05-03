import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';

// --- Constants ---

const CHARACTER_MODELS: Record<number, { color: string; eyes: number; columns: number; shape: string; label?: string; pattern?: string }> = {
  [-1]: { color: '#7F1D1D', eyes: 1, columns: 1, shape: 'square', pattern: 'white-top' },
  [-2]: { color: '#9A3412', eyes: 2, columns: 1, shape: 'rect', pattern: 'white-top' },
  [-3]: { color: '#92400E', eyes: 3, columns: 1, shape: 'tall', pattern: 'white-top' },
  [-4]: { color: '#14532D', eyes: 4, columns: 2, shape: 'square', pattern: 'white-top' },
  [-5]: { color: '#1E3A8A', eyes: 5, columns: 1, shape: 'tall', pattern: 'white-top' },
  [-6]: { color: '#581C87', eyes: 6, columns: 2, shape: 'tall', pattern: 'white-top' },
  [-7]: { color: '#7E22CE', eyes: 7, columns: 1, shape: 'tall', pattern: 'rainbow' },
  [-8]: { color: '#9D174D', eyes: 8, columns: 2, shape: 'square', pattern: 'white-top' },
  [-9]: { color: '#374151', eyes: 9, columns: 3, shape: 'square', pattern: 'white-top' },
  [-10]: { color: '#111827', eyes: 10, columns: 2, shape: 'tall', pattern: 'white-top' },
  1: { color: '#EF4444', eyes: 1, columns: 1, shape: 'square' },
  2: { color: '#F97316', eyes: 2, columns: 1, shape: 'rect' },
  3: { color: '#FBBF24', eyes: 3, columns: 1, shape: 'tall' },
  4: { color: '#22C55E', eyes: 4, columns: 2, shape: 'square' },
  5: { color: '#06B6D4', eyes: 5, columns: 1, shape: 'star-eyes' },
  6: { color: '#9333EA', eyes: 6, columns: 2, shape: 'rect' },
  7: { color: 'linear-gradient(to bottom, red, orange, yellow, green, blue, indigo, violet)', eyes: 7, columns: 1, shape: 'rainbow' },
  8: { color: '#D946EF', eyes: 8, columns: 2, shape: 'rect' },
  9: { color: '#94A3B8', eyes: 9, columns: 3, shape: 'square' },
  10: { color: '#FFFFFF', eyes: 2, columns: 2, shape: 'rect', pattern: 'stars-hat' },
  11: { color: '#EF4444', eyes: 2, columns: 2, shape: 'rect', pattern: 'stripes' },
  12: { color: '#F97316', eyes: 2, columns: 3, shape: 'rect', pattern: 'blocks' },
  13: { color: '#FBBF24', eyes: 2, columns: 2, shape: 'tall', pattern: 'white-top' },
  14: { color: '#22C55E', eyes: 2, columns: 2, shape: 'rect', pattern: 'white-bottom' },
  15: { color: '#06B6D4', eyes: 2, columns: 2, shape: 'rect', pattern: 'white-sides' },
  16: { color: '#9333EA', eyes: 2, columns: 2, shape: 'rect', pattern: 'white-mask' },
  17: { color: '#7E22CE', eyes: 2, columns: 2, shape: 'rect', pattern: 'dots' },
  18: { color: '#DB2777', eyes: 2, columns: 2, shape: 'rect', pattern: 'frame' },
  19: { color: '#D1D5DB', eyes: 1, columns: 1, shape: 'giant', pattern: 'red-eye' },
  20: { color: '#D1D5DB', eyes: 1, columns: 1, shape: 'giant' },
  21: { color: '#FBBF24', eyes: 3, columns: 1, shape: 'step' },
  22: { color: '#06B6D4', eyes: 2, columns: 2, shape: 'rect', pattern: 'white-sides-22' },
  23: { color: '#FBBF24', eyes: 3, columns: 1, shape: 'tall', pattern: 'spiky' },
  25: { color: '#FFFFFF', eyes: 2, columns: 2, shape: 'rect', pattern: 'white-sides-25' },
};

const PAGES = [
  [
    { pos: { label: '+0.1666667', value: 0.1666667 }, neg: { label: '-0.1666667', value: -0.1666667 }, color: 'purple' },
    { pos: { label: '+1/2', value: 0.5 }, neg: { label: '-1/2', value: -0.5 }, color: 'orange' },
    { pos: { label: '+1', value: 1 }, neg: { label: '-1', value: -1 }, color: 'red' },
    { pos: { label: '+3', value: 3 }, neg: { label: '-3', value: -3 }, color: 'yellow' },
    { pos: { label: '+10', value: 10 }, neg: { label: '-10', value: -10 }, color: 'white-red' },
    { pos: { label: '+30', value: 30 }, neg: { label: '-30', value: -30 }, color: 'white-yellow' },
    { pos: { label: '+100', value: 100 }, neg: { label: '-100', value: -100 }, color: 'checkered-red' },
    { pos: { label: '+300', value: 300 }, neg: { label: '-300', value: -300 }, color: 'checkered-yellow' },
    { pos: { label: '+1000', value: 1000 }, neg: { label: '-1000', value: -1000 }, color: 'dark-red' },
    { pos: { label: '+10 000', value: 10000 }, neg: { label: '-10 000', value: -10000 }, color: 'white-red-border' },
    { pos: { label: '+100 000', value: 100000 }, neg: { label: '-100 000', value: -100000 }, color: 'gradient-red' },
    { pos: { label: '+1 000 000', value: 1000000 }, neg: { label: '-1 000 000', value: -1000000 }, color: 'dark-checkered-red' },
  ],
  [
    { pos: { label: '+10 000 000', value: 10000000 }, neg: { label: '-10 000 000', value: -10000000 }, color: 'white-red-border' },
    { pos: { label: '+100 000 000', value: 100000000 }, neg: { label: '-100 000 000', value: -100000000 }, color: 'checkered-red' },
    { pos: { label: '+1 000 000 000', value: 1000000000 }, neg: { label: '-1 000 000 000', value: -1000000000 }, color: 'red' },
    { pos: { label: '+10 000 000 000', value: 10000000000 }, neg: { label: '-10 000 000 000', value: -10000000000 }, color: 'white-red-border' },
  ],
  [
    { label: 'SET', action: 'set', color: 'white' },
    { label: 'CLUBS', action: 'clubs', color: 'white' },
    { label: 'FIGURED OUT FRENZY', action: 'fof', color: 'white' },
    { label: 'CENTER NUMBER', action: 'center', color: 'white' },
    { label: '+X', action: 'addX', color: 'white' },
    { label: 'INFO', action: 'info', color: 'white' },
  ],
  [
    { label: 'SAY NUMBER', action: 'say', color: 'white' },
    { label: 'AUTO', action: 'auto', color: 'white' },
  ]
];

const getButtonStyle = (type: string, isToggled?: boolean, label?: string) => {
  if (type === 'white') {
    let textColor = 'text-black';
    if (label === 'FIGURED OUT FRENZY') {
      textColor = isToggled ? 'text-green-600' : 'text-red-800';
    } else if (label === 'AUTO') {
      textColor = isToggled ? 'text-green-600' : 'text-red-800';
    }
    return `bg-white ${textColor} shadow-[0_4px_0_#D1D5DB] active:translate-y-1 active:shadow-none border-b-2 border-gray-300`;
  }
  switch (type) {
    case 'purple': return 'bg-[#8B5CF6] text-white shadow-[0_4px_0_#6D28D9] active:translate-y-1 active:shadow-none';
    case 'orange': return 'bg-[#F97316] text-white shadow-[0_4px_0_#C2410C] active:translate-y-1 active:shadow-none';
    case 'red': return 'bg-[#EF4444] text-white shadow-[0_4px_0_#B91C1C] active:translate-y-1 active:shadow-none';
    case 'yellow': return 'bg-[#FBBF24] text-black shadow-[0_4px_0_#D97706] active:translate-y-1 active:shadow-none';
    case 'white-red': return 'bg-white text-[#EF4444] border-2 border-[#EF4444] shadow-[0_4px_0_#EF4444] active:translate-y-1 active:shadow-none';
    case 'white-yellow': return 'bg-white text-[#FBBF24] border-2 border-[#FBBF24] shadow-[0_4px_0_#FBBF24] active:translate-y-1 active:shadow-none';
    case 'checkered-red': return 'bg-[#EF4444] text-white bg-[repeating-conic-gradient(#ffffff_0_90deg,#EF4444_0_180deg)_0_0/10px_10px] shadow-[0_4px_0_#B91C1C] active:translate-y-1 active:shadow-none';
    case 'checkered-yellow': return 'bg-[#FBBF24] text-black bg-[repeating-conic-gradient(#ffffff_0_90deg,#FBBF24_0_180deg)_0_0/10px_10px] shadow-[0_4px_0_#D97706] active:translate-y-1 active:shadow-none';
    case 'dark-red': return 'bg-[#991B1B] text-white shadow-[0_4px_0_#7F1D1D] active:translate-y-1 active:shadow-none';
    case 'white-red-border': return 'bg-white text-[#991B1B] border-2 border-[#991B1B] shadow-[0_4px_0_#991B1B] active:translate-y-1 active:shadow-none';
    case 'gradient-red': return 'bg-gradient-to-b from-[#EF4444] to-[#991B1B] text-white shadow-[0_4px_0_#7F1D1D] active:translate-y-1 active:shadow-none';
    case 'dark-checkered-red': return 'bg-[#7F1D1D] text-white bg-[repeating-conic-gradient(#ffffff_0_90deg,#7F1D1D_0_180deg)_0_0/8px_8px] shadow-[0_4px_0_#450A0A] active:translate-y-1 active:shadow-none';
    default: return 'bg-gray-500';
  }
};

const ClubIcon = ({ type, val, color, special, active }: { type: string, val: string | number, color?: string, special?: string, active?: boolean, key?: React.Key }) => {
  const baseClass = "w-12 h-12 flex items-center justify-center relative transition-transform hover:scale-110 active:scale-95 cursor-pointer";
  
  if (type === 'box') {
    return (
      <div className={`${baseClass} bg-white border-2 border-black rounded-sm overflow-hidden flex flex-row items-stretch`}>
         <div className="w-5 flex items-center justify-center font-black text-black text-sm border-r-2 border-black/20">{val}</div>
         <div className="flex-1" style={{ background: color === 'rainbow' ? 'linear-gradient(to bottom, red, orange, yellow, green, blue, purple)' : color }} />
      </div>
    );
  }

  if (type === 'box-inv') {
    return (
      <div className={`${baseClass} bg-white border-2 border-black rounded-sm overflow-hidden flex flex-row items-stretch`}>
         <div className="w-5 flex items-center justify-center font-black text-black text-sm border-r-2 border-black/20">{val}</div>
         <div className="flex-1 bg-white" />
      </div>
    );
  }

  if (type === 'circle') {
     return (
        <div className={`${baseClass} bg-white border-2 border-black rounded-full shadow-[0_2px_0_rgba(0,0,0,0.2)] overflow-hidden scale-90`}>
           <div className="w-full h-full flex items-center justify-center font-black text-black text-xl" 
                style={special === 'rainbow' ? { background: 'linear-gradient(to bottom, red, orange, yellow, green, blue, purple)', color: 'white' } : {}}>
             {val}
           </div>
        </div>
     );
  }

  if (type === 'circle-special') {
     return (
        <div className={`${baseClass} bg-white border-2 border-black rounded-full shadow-[0_2px_0_rgba(0,0,0,0.2)] overflow-hidden scale-90`}>
           <div className="w-full h-full flex items-center justify-center font-black text-black text-xl">
             {val === 'cube' ? <div className="w-4 h-4 bg-red-600 border border-black" /> :
              val === 'rect' ? <div className="w-5 h-5 bg-green-500 border border-black rounded-sm" /> :
              val === 'cross' ? <div className="text-blue-500 text-2xl">+</div> : val}
           </div>
        </div>
     );
  }

  if (type === 'club') {
     return (
        <div className={`${baseClass} bg-white border-2 border-black rounded-md shadow-md overflow-hidden ${active ? 'ring-4 ring-yellow-400 scale-110' : ''}`}>
           {val === 'step' && (
              <div className="flex flex-col gap-0.5 items-center justify-center p-1">
                 <div className="w-8 h-2 bg-purple-600 border border-black" />
                 <div className="w-6 h-2 bg-purple-600 border border-black mr-2" />
                 <div className="w-4 h-2 bg-purple-600 border border-black mr-4" />
              </div>
           )}
           {val === 'sq' && <div className="w-6 h-6 bg-pink-500 border-2 border-black rounded-sm flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full" /></div>}
           {val === 'dots' && (
              <div className="w-7 h-7 bg-pink-500 border-2 border-black rounded-sm p-1 grid grid-cols-2 gap-1">
                 {[1,2,3,4].map(i => <div key={i} className="w-1.5 h-1.5 bg-[#EF4444] rounded-sm" />)}
              </div>
           )}
           {val === 'rect' && <div className="w-7 h-7 bg-pink-400 border-2 border-black rounded-sm flex items-center justify-center p-0.5"><div className="w-full h-1/2 bg-red-500" /></div>}
           {val === 'tray' && <div className="w-8 h-6 bg-blue-400 border-2 border-black rounded-sm flex items-center justify-center p-1"><div className="w-full h-full bg-orange-200 border-t-2 border-black" /></div>}
           {val === 'one' && <div className="w-7 h-7 bg-yellow-100 border-2 border-black rounded-sm flex items-center justify-center text-xs font-black">1</div>}
           {val === 'bars' && (
              <div className="w-7 h-7 flex flex-col gap-1">
                 <div className="flex-1 bg-green-500 border border-black" />
                 <div className="flex-1 bg-yellow-400 border border-black" />
                 <div className="flex-1 bg-red-500 border border-black" />
              </div>
           )}
           {val === 'chip' && <div className="w-8 h-8 bg-blue-600 border-2 border-black rounded-sm flex items-center justify-center p-1 shadow-inner"><div className="w-4 h-4 bg-orange-400 border border-black" /></div>}
           {val === 'pad' && <div className="w-6 h-8 bg-yellow-200 border-2 border-black rounded-sm flex flex-col items-center pt-1"><div className="w-4 h-0.5 bg-orange-400 mb-0.5" />{[1,2,3].map(i => <div key={i} className="w-4 h-[1px] bg-black/20 mb-0.5" />)}</div>}
        </div>
     );
  }

  return <div className={baseClass}>{val}</div>;
};

// --- Helper Functions ---

const formatNumber = (n: number) => {
  if (Math.abs(n) < 0.01 && n !== 0) return n.toFixed(4);
  if (n % 1 !== 0) return n.toFixed(1).replace(/\.0$/, '');
  return n.toLocaleString('en-US').replace(/,/g, ' ');
};

const renderUndergroundLayer = (num: number) => {
  const absNum = Math.abs(num);
  const layer = Math.floor(absNum);
  
  const layers = [
    { name: 'roots', color: '#8B4513', decoration: 'root' },
    { name: 'pipes', color: '#B45309', decoration: 'pipe' },
    { name: 'zigzag', color: '#92400E', decoration: 'zigzag' },
    { name: 'wood', color: '#3F6212', decoration: 'wood' },
    { name: 'waves', color: '#1E3A8A', decoration: 'wave' },
    { name: 'blobs', color: '#581C87', decoration: 'blob' },
    { name: 'rainbow', color: '#7E22CE', decoration: 'rainbow' },
    { name: 'wind', color: '#9D174D', decoration: 'wind' },
    { name: 'rocks', color: '#374151', decoration: 'rock' },
  ];

  const currentLayer = layers[layer] || layers[layers.length - 1];

  return (
    <div className="absolute inset-0 transition-colors duration-500 overflow-hidden" style={{ backgroundColor: currentLayer.color }}>
      {/* Texture overlays */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />
      
      {/* Decorative patterns based on the layer */}
      {currentLayer.decoration === 'root' && (
        <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M20,0 Q25,30 15,60 M50,0 Q45,40 55,80 M80,0 Q85,20 75,50" fill="none" stroke="#FDE68A" strokeWidth="1" />
        </svg>
      )}
      {currentLayer.decoration === 'pipe' && (
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-0 w-full h-8 bg-gray-400 border-y-2 border-gray-600" />
          <div className="absolute top-1/2 left-1/3 w-8 h-full bg-gray-400 border-x-2 border-gray-600" />
        </div>
      )}
      {currentLayer.decoration === 'zigzag' && (
        <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,rgba(0,0,0,0.5)_20px,rgba(0,0,0,0.5)_40px)]" />
      )}
      {currentLayer.decoration === 'wood' && (
        <div className="absolute inset-0 opacity-20 border-[30px] border-black/40 rounded-full scale-150" />
      )}
      {currentLayer.decoration === 'wave' && (
        <div className="absolute inset-0 opacity-20">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-full h-8 border-b-4 border-blue-300 rounded-[100%] mt-12" />
          ))}
        </div>
      )}
      {currentLayer.decoration === 'blob' && (
        <div className="absolute inset-0 opacity-20 flex flex-wrap justify-around p-10">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-20 h-10 bg-purple-900 rounded-full" />
          ))}
        </div>
      )}
      {currentLayer.decoration === 'rainbow' && (
        <div className="absolute inset-0 opacity-40 bg-gradient-to-b from-red-500 via-yellow-500 via-green-500 to-purple-500" />
      )}
      {currentLayer.decoration === 'wind' && (
        <div className="absolute inset-0 opacity-30 flex items-center justify-center">
          <div className="w-64 h-64 border-b-8 border-pink-300 rounded-full animate-spin-slow rotate-45" />
        </div>
      )}
      {currentLayer.decoration === 'rock' && (
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#000_10%,transparent_11%)] bg-[length:30px_30px]" />
      )}

      {/* Layer Number Indicator on the side like the image */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center">
         <div className="w-4 h-1 bg-black" />
         <span className="text-black font-black text-4xl -ml-12 italic tracking-tighter">-{layer + 1}</span>
      </div>
      <div className="absolute left-4 top-0 w-1 h-full bg-black/20" />
    </div>
  );
};

export default function App() {
  const [num, setNum] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [sidebarPage, setSidebarPage] = useState(0);
  const [isFOF, setIsFOF] = useState(false);
  const [isOfficial, setIsOfficial] = useState(true);
  const [showClubs, setShowClubs] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isAuto, setIsAuto] = useState(false);
  const [multiplier, setMultiplier] = useState(1);
  const [showMultiplierMenu, setShowMultiplierMenu] = useState(false);
  const [isStepSquad, setIsStepSquad] = useState(false);
  const [showSetPrompt, setShowSetPrompt] = useState(false);
  const [promptInputValue, setPromptInputValue] = useState('');
  const [showSixtiethsPrompt, setShowSixtiethsPrompt] = useState(false);
  const [sixtiethsInputValue, setSixtiethsInputValue] = useState('');

  useEffect(() => {
    let interval: any;
    if (isAuto) {
      interval = setInterval(() => {
        setNum(prev => prev + multiplier);
        setIsJumping(true);
        setTimeout(() => setIsJumping(false), 200);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isAuto, multiplier]);

  const addNum = (val: number) => {
    setNum(prev => prev + val);
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 300);
  };

  const handleSidebarAction = (action: string) => {
    switch (action) {
      case 'set':
        setShowSetPrompt(prev => !prev);
        if (!showSetPrompt) setPromptInputValue('');
        break;
      case 'fof':
        setIsFOF(prev => !prev);
        break;
      case 'addX':
        setShowSixtiethsPrompt(prev => !prev);
        if (!showSixtiethsPrompt) setSixtiethsInputValue('');
        break;
      case 'center':
        setIsJumping(true);
        setTimeout(() => setIsJumping(false), 300);
        break;
      case 'clubs':
        setShowClubs(prev => !prev);
        setShowInfo(false);
        break;
      case 'info':
        setShowInfo(prev => !prev);
        setShowClubs(false);
        break;
      case 'say':
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(num.toString());
          utterance.rate = 1;
          window.speechSynthesis.speak(utterance);
        }
        break;
      case 'auto':
        setIsAuto(prev => !prev);
        if (!isAuto) setShowMultiplierMenu(true);
        break;
      default:
        console.log('Action:', action);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNum(Number(e.target.value));
  };

  return (
    <div className={`relative h-screen w-screen overflow-hidden font-sans select-none transition-colors duration-500 ${isFOF ? 'bg-[#1E1B4B]' : 'bg-[#E0F2FE]'}`}>
      {/* Background World */}
      {num < 0 ? (
        renderUndergroundLayer(num)
      ) : (
        <div className={`absolute inset-0 z-0 transition-opacity duration-500 ${isFOF ? 'opacity-20' : 'opacity-100'}`}>
          {/* Clouds */}
          <div className="absolute top-20 left-10 opacity-60">
            <div className="w-32 h-12 bg-white rounded-full blur-xl" />
          </div>
          <div className="absolute top-40 left-40 opacity-40">
            <div className="w-48 h-16 bg-white rounded-full blur-2xl" />
          </div>
          <div className="absolute top-10 right-1/4 opacity-50">
            <div className="w-40 h-14 bg-white rounded-full blur-xl" />
          </div>

          {/* Rolling Hills */}
          <div className="absolute bottom-0 w-full h-[60%] pointer-events-none">
            <div className="absolute bottom-[-10%] left-[-20%] w-[140%] h-full bg-[#CCFBF1] rounded-[100%] border-t-8 border-[#99F6E4] rotate-[-5deg]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[120%] h-full bg-[#DCFCE7] rounded-[100%] border-t-8 border-[#BBF7D0] rotate-[2deg]" />
          </div>
        </div>
      )}

      {/* Overlays */}
      <AnimatePresence>
        {showClubs && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <div className="bg-[#EF4444] w-full max-w-4xl rounded-xl border-[6px] border-black shadow-2xl overflow-hidden relative">
              {/* Header */}
              <div className="bg-black/20 p-4 border-b-4 border-black/30 flex justify-between items-center">
                <h3 className="text-white font-black text-3xl italic tracking-tighter drop-shadow-md">CLUBS & MODELS</h3>
                <button 
                  onClick={() => setShowClubs(false)}
                  className="bg-white text-black font-black px-6 py-2 rounded-lg border-b-4 border-gray-400 active:translate-y-1 active:border-b-0"
                >
                  CLOSE
                </button>
              </div>

              {/* Grid Content */}
              <div className="p-4 flex flex-col gap-2 overflow-x-auto no-scrollbar">
                {/* Row 1: Digit Boxes (Green/Red background split) */}
                <div className="flex gap-2">
                  <div className="bg-[#22C55E] p-2 flex gap-2">
                    <ClubIcon type="box" val={0} color="#D1D5DB" />
                  </div>
                  <div className="bg-[#EF4444] p-2 flex gap-2 flex-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                      <ClubIcon key={n} type="box" val={n} color={
                        n === 1 ? '#EF4444' : n === 2 ? '#F97316' : n === 3 ? '#FBBF24' : 
                        n === 4 ? '#22C55E' : n === 5 ? '#06B6D4' : n === 6 ? '#9333EA' : 
                        n === 7 ? 'rainbow' : n === 8 ? '#D946EF' : '#94A3B8'
                      } />
                    ))}
                  </div>
                </div>

                {/* Row 2: Negative Digit Boxes */}
                <div className="flex gap-2">
                  <div className="bg-[#22C55E] p-2 flex gap-2 invisible">
                    <ClubIcon type="box" val={0} color="#D1D5DB" />
                  </div>
                  <div className="bg-[#EF4444] p-2 flex gap-2 flex-1">
                    {[-1, -2, -3, -4, -5, -6, -7, -8, -9].map(n => (
                      <ClubIcon key={n} type="box" val={n} color={
                        n === -1 ? '#7F1D1D' : n === -2 ? '#9A3412' : n === -3 ? '#92400E' : 
                        n === -4 ? '#14532D' : n === -5 ? '#1E3A8A' : n === -6 ? '#581C87' : 
                        n === -7 ? 'rainbow' : n === -8 ? '#9D174D' : '#374151'
                      } />
                    ))}
                  </div>
                </div>

                {/* Row 3: Inverted Digit Boxes */}
                <div className="flex gap-2">
                   <div className="bg-[#22C55E] p-2 flex gap-2">
                      <ClubIcon type="box-inv" val={0} />
                   </div>
                   <div className="bg-[#EF4444] p-2 flex gap-2 flex-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                        <ClubIcon key={n} type="box-inv" val={n} />
                      ))}
                   </div>
                </div>

                {/* Row 3: Circular Badges 1-11 */}
                <div className="flex gap-2 bg-[#EF4444] p-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(n => (
                    <ClubIcon key={n} type="circle" val={n} special={n === 7 ? 'rainbow' : undefined} />
                  ))}
                </div>

                {/* Row 4: Special Circles */}
                <div className="flex gap-2 bg-[#EF4444] p-2">
                  {[12, 13, 17, 19, 23, 29, 31, 'cube', 'rect', 'cross'].map((n) => (
                    <ClubIcon key={typeof n === 'number' ? n : n} type="circle-special" val={n} />
                  ))}
                </div>

                {/* Row 5: Actual Clubs (Toggleable) */}
                <div className="flex gap-2">
                   <div className="bg-[#22C55E] p-2 flex gap-2">
                      <button onClick={() => setIsStepSquad(!isStepSquad)}>
                        <ClubIcon type="club" val="step" active={isStepSquad} />
                      </button>
                   </div>
                   <div className="bg-[#EF4444] p-2 flex gap-2 flex-1">
                      <ClubIcon type="club" val="sq" />
                      <ClubIcon type="club" val="dots" />
                      <ClubIcon type="club" val="rect" />
                      <div className="bg-[#22C55E] p-2 -my-2 flex items-center">
                         <ClubIcon type="club" val="tray" />
                      </div>
                      <ClubIcon type="club" val="one" />
                      <ClubIcon type="club" val="bars" />
                      <ClubIcon type="club" val="chip" />
                      <ClubIcon type="club" val="pad" />
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {showMultiplierMenu && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#4C1D95] flex flex-col items-center justify-center p-4 overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-[#4C1D95] overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-20 bg-[radial-gradient(circle_at_center,white_0%,transparent_70%)]" />
            </div>

            <div className="relative z-10 flex flex-col items-center w-full max-w-4xl">
              <h2 className="text-white text-6xl md:text-8xl lg:text-[140px] leading-none font-black mb-12 italic tracking-tighter drop-shadow-[0_12px_0_rgba(0,0,0,0.5)] text-center">
                Step Count
              </h2>
              
              {/* Number Display Box */}
              <div className="bg-[#15803d] w-full max-w-2xl py-8 text-center text-white text-8xl md:text-[180px] leading-none font-black mb-12 border-[12px] border-black shadow-[inset_0_10px_40px_rgba(0,0,0,0.6),0_20px_0_rgba(0,0,0,0.2)]">
                {multiplier}
              </div>

              <div className="flex items-center justify-center gap-8 md:gap-16 mb-24 scale-90 md:scale-125 lg:scale-150">
                {/* Blocky Left Arrow */}
                <button 
                  onClick={() => setMultiplier(m => Math.max(1, m - 1))}
                  className="group relative w-24 h-24 md:w-32 md:h-32 bg-[#EAB308] border-[8px] border-black shadow-[0_10px_0_#854D0E] active:translate-y-2 active:shadow-none transition-all flex items-center justify-center overflow-hidden"
                >
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center opacity-40 pointer-events-none">
                     <div className="flex gap-1">
                       {['#EF4444', '#F97316', '#FBBF24', '#22C55E', '#06B6D4', '#9333EA'].map(c => (
                         <div key={c} className="w-3 h-24" style={{ backgroundColor: c }} />
                       ))}
                     </div>
                  </div>
                  <span className="text-5xl md:text-7xl font-black relative z-10 drop-shadow-xl text-black">{"<"}</span>
                </button>

                {/* Character Frame */}
                <div className="w-36 h-36 md:w-48 md:h-48 bg-[#15803d] border-[10px] border-black shadow-2xl flex items-center justify-center relative overflow-visible">
                   {/* Numberblock 1 Character */}
                   <div className="w-20 h-20 md:w-24 md:h-24 bg-[#EF4444] border-[6px] border-black rounded-sm flex flex-col items-center justify-start pt-3 relative z-10">
                      {/* Eye */}
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full border-[5px] border-black flex items-center justify-center shadow-inner">
                         <div className="w-4 h-4 bg-black rounded-full" />
                      </div>
                      {/* Smile */}
                      <div className="absolute bottom-2 w-8 h-2 bg-black/20 rounded-full" />
                      {/* Rocket Jumper */}
                      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-10 h-14 md:w-12 md:h-16 bg-[#B91C1C] rounded-b-full border-[6px] border-black shadow-[0_10px_30px_rgba(185,28,28,0.6)]" />
                   </div>
                </div>

                {/* Blocky Right Arrow */}
                <button 
                  onClick={() => setMultiplier(m => m + 1)}
                  className="group relative w-24 h-24 md:w-32 md:h-32 bg-[#EAB308] border-[8px] border-black shadow-[0_10px_0_#854D0E] active:translate-y-2 active:shadow-none transition-all flex items-center justify-center overflow-hidden"
                >
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center opacity-40 pointer-events-none">
                     <div className="flex gap-1">
                       {['#EF4444', '#F97316', '#FBBF24', '#22C55E', '#06B6D4', '#9333EA'].map(c => (
                         <div key={c} className="w-3 h-24" style={{ backgroundColor: c }} />
                       ))}
                     </div>
                  </div>
                  <span className="text-5xl md:text-7xl font-black relative z-10 drop-shadow-xl text-black">{">"}</span>
                </button>
              </div>

              <button 
                onClick={() => setShowMultiplierMenu(false)}
                className="bg-[#15803d] w-full max-w-2xl py-6 md:py-10 text-white text-6xl md:text-[140px] leading-none font-black border-[12px] md:border-[16px] border-white shadow-[0_20px_50px_rgba(0,0,0,0.5),0_15px_0_#166534] hover:bg-[#166534] active:scale-[0.98] active:translate-y-4 transition-all uppercase italic tracking-tighter"
              >
                ENTER
              </button>
            </div>
          </motion.div>
        )}

        {showInfo && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-20 left-10 z-30 bg-white/95 backdrop-blur-md p-6 rounded-2xl border-4 border-[#166534] shadow-2xl w-80"
          >
            <h3 className="text-[#166534] font-black text-2xl mb-4">NUMBER INFO</h3>
            <div className="space-y-4">
              <div>
                <span className="text-gray-500 text-xs font-bold uppercase">Classification</span>
                <p className="font-bold text-[#166534]">{num % 2 === 0 ? 'Even' : 'Odd'} Number</p>
              </div>
              <div>
                <span className="text-gray-500 text-xs font-bold uppercase">Show Facts</span>
                <p className="text-sm text-gray-700 leading-tight">
                  In Numberblocks, {formatNumber(num)} is a character who loves to demonstrate mathematical patterns and shapes!
                </p>
              </div>
              <div className="text-[10px] text-gray-400 italic">
                Credits: FOF by original creators. Center Number by @harperetc.
              </div>
            </div>
            <button onClick={() => setShowInfo(false)} className="mt-6 w-full bg-[#166534] text-white py-2 rounded-lg font-bold hover:bg-[#064E3B]">Back to App</button>
          </motion.div>
        )}

        {/* SET Prompt - Numeric Keypad Menu */}
        {showSetPrompt && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#EF4444] flex flex-col items-center justify-center p-4 overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-[#EF4444] overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-20 bg-[radial-gradient(circle_at_center,white_0%,transparent_70%)]" />
            </div>

            <div className="relative z-10 flex flex-col items-center w-full max-w-2xl">
              <h2 className="text-white text-6xl md:text-8xl leading-none font-black mb-8 italic tracking-tighter drop-shadow-[0_8px_0_rgba(0,0,0,0.5)] text-center">
                SET NUMBER
              </h2>
              
              {/* Number Display Box */}
              <div className="bg-white w-full py-6 text-center text-black text-6xl md:text-[100px] leading-none font-black mb-8 border-[10px] border-black shadow-[inset_0_10px_30px_rgba(0,0,0,0.2),0_15px_0_rgba(0,0,0,0.1)] relative">
                {promptInputValue || '0'}
                <motion.div 
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block w-2 md:w-3 h-12 md:h-20 bg-blue-500 ml-2 align-middle"
                />
              </div>

              {/* Numeric Keypad */}
              <div className="grid grid-cols-3 gap-3 md:gap-4 w-full mb-8">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, 'DEL'].map((val) => (
                  <button
                    key={val}
                    onClick={() => {
                      if (val === 'DEL') {
                        setPromptInputValue(prev => prev.slice(0, -1));
                      } else {
                        if (val === '.' && promptInputValue.includes('.')) return;
                        setPromptInputValue(prev => prev + val);
                      }
                    }}
                    className={`h-16 md:h-24 text-3xl md:text-5xl font-black rounded-lg border-[6px] border-black shadow-[0_8px_0_rgba(0,0,0,0.3)] active:translate-y-2 active:shadow-none transition-all flex items-center justify-center ${
                      val === 'DEL' ? 'bg-[#991B1B] text-white' : 'bg-white text-black hover:bg-gray-100'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>

              <div className="flex gap-4 w-full">
                <button 
                  onClick={() => setShowSetPrompt(false)}
                  className="flex-1 bg-white py-4 md:py-6 text-black text-2xl md:text-4xl font-black border-[8px] border-black shadow-[0_10px_0_rgba(0,0,0,0.2)] hover:bg-gray-100 active:translate-y-2 active:shadow-none transition-all italic tracking-tight"
                >
                  CANCEL
                </button>
                <button 
                  onClick={() => {
                    const val = parseFloat(promptInputValue);
                    if (!isNaN(val)) setNum(val);
                    setShowSetPrompt(false);
                  }}
                  className="flex-[2] bg-[#15803d] py-4 md:py-6 text-white text-3xl md:text-5xl font-black border-[8px] border-white shadow-[0_15px_30px_rgba(0,0,0,0.4),0_10px_0_#166534] hover:bg-[#166534] active:translate-y-4 active:shadow-none transition-all italic tracking-tighter"
                >
                  ENTER
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* SIXTIETHS Prompt - Numeric Keypad with Bubble */}
        {showSixtiethsPrompt && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#4C1D95] flex flex-col items-center justify-center p-4 overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-[#4C1D95] overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-20 bg-[radial-gradient(circle_at_center,white_0%,transparent_70%)]" />
            </div>

            {/* Bubble - Floating in overlay */}
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="relative z-20 bg-white px-8 py-4 rounded-[40px] border-[6px] border-gray-300 shadow-2xl mb-6 max-w-lg"
            >
              <p className="text-gray-600 font-extrabold text-3xl md:text-5xl tracking-tighter">Plus how many sixtieths?</p>
              <div className="absolute -bottom-6 right-12 w-8 h-8 bg-white border-r-[6px] border-b-[6px] border-gray-300 rotate-45" />
            </motion.div>

            <div className="relative z-10 flex flex-col items-center w-full max-w-2xl">
              {/* Number Display Box (Shows what user is typing) */}
              <div className="bg-white w-full py-6 text-center text-black text-6xl md:text-[100px] leading-none font-black mb-8 border-[10px] border-black shadow-[inset_0_10px_30px_rgba(0,0,0,0.2),0_15px_0_rgba(0,0,0,0.1)] relative">
                {sixtiethsInputValue || '0'}
                {/* Visual calculation hint */}
                {sixtiethsInputValue && (
                  <div className="absolute bottom-1 right-2 text-xl font-bold opacity-30">
                    +{(parseFloat(sixtiethsInputValue)/60).toFixed(4)}
                  </div>
                )}
                <motion.div 
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block w-2 md:w-3 h-12 md:h-20 bg-purple-500 ml-2 align-middle"
                />
              </div>

              {/* Numeric Keypad */}
              <div className="grid grid-cols-3 gap-3 md:gap-4 w-full mb-8">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, 'DEL'].map((val) => (
                  <button
                    key={val}
                    onClick={() => {
                      if (val === 'DEL') {
                        setSixtiethsInputValue(prev => prev.slice(0, -1));
                      } else {
                        if (val === '.' && sixtiethsInputValue.includes('.')) return;
                        setSixtiethsInputValue(prev => prev + val);
                      }
                    }}
                    className={`h-16 md:h-24 text-3xl md:text-5xl font-black rounded-lg border-[6px] border-black shadow-[0_8px_0_rgba(0,0,0,0.3)] active:translate-y-2 active:shadow-none transition-all flex items-center justify-center ${
                      val === 'DEL' ? 'bg-[#991B1B] text-white' : 'bg-white text-black hover:bg-gray-100'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>

              <div className="flex gap-4 w-full text-center">
                <button 
                  onClick={() => setShowSixtiethsPrompt(false)}
                  className="flex-1 bg-white py-4 md:py-6 text-black text-2xl md:text-3xl font-black border-[8px] border-black shadow-[0_10px_0_rgba(0,0,0,0.2)] hover:bg-gray-100 active:translate-y-2 active:shadow-none transition-all italic tracking-tight"
                >
                  CANCEL
                </button>
                <button 
                  onClick={() => {
                    const val = parseFloat(sixtiethsInputValue);
                    if (!isNaN(val)) addNum(val / 60);
                    setShowSixtiethsPrompt(false);
                  }}
                  className="flex-[2] bg-[#4C1D95] py-4 md:py-6 text-white text-3xl md:text-5xl font-black border-[8px] border-white shadow-[0_15px_30px_rgba(0,0,0,0.4),0_10px_0_#2E1065] hover:bg-[#2E1065] active:translate-y-4 active:shadow-none transition-all italic tracking-tighter"
                >
                  ENTER
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Character area */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none md:pr-24">
        <motion.div
          animate={isJumping ? { y: -40, scale: 1.05 } : { y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
          className="flex flex-col items-center"
        >
          {/* Number Label */}
          <motion.h1 
            key={num}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`text-[120px] leading-none font-bold drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition-colors duration-300 ${isFOF ? 'text-white' : 'text-black'}`}
          >
            {formatNumber(num)}
          </motion.h1>
          
          {/* Character Model */}
          <div className="relative flex flex-col items-center mt-4">
            {isStepSquad ? (
              <div className="flex flex-col items-center gap-1">
                 {[1, 2, 3, 4, 5, 6].map((rowNum) => {
                    const model = CHARACTER_MODELS[rowNum] || { color: '#ccc' };
                    return (
                      <div key={rowNum} className="flex flex-col items-center">
                        <div 
                          className="h-10 rounded-md border-4 border-black/80 flex items-center justify-center relative"
                          style={{ 
                            background: model.color,
                            width: `${rowNum * 2.5}rem`
                          }}
                        >
                           {/* Tiny Eyes for Step bar */}
                           <div className="flex gap-0.5">
                              {[...Array(Math.min(rowNum, 3))].map((_, eyeIdx) => (
                                <div key={eyeIdx} className="w-2 h-2 bg-white rounded-full border border-black" />
                              ))}
                           </div>
                           
                           {/* Individual Feet for EACH bar as shown in image */}
                           <div className="absolute -bottom-4 w-full flex justify-around px-1 z-0">
                              {[...Array(rowNum)].map((_, footIdx) => (
                                <div key={footIdx} className="w-2 h-4 bg-red-600 rounded-b-sm border border-black" />
                              ))}
                           </div>
                        </div>
                        <div className="h-4" /> {/* Gap for feet */}
                      </div>
                    );
                 })}
              </div>
            ) : CHARACTER_MODELS[num] ? (
              <div 
                className={`transition-all duration-300 rounded-lg border-[6px] border-black/80 flex flex-col items-center justify-start py-4 relative shadow-2xl ${
                  [4, 6, 8, 9, 10, 12, 14, 16, 17, 18, 19, 21, 22, 25].includes(num) ? 'w-36' : num === 20 ? 'w-48' : 'w-24'
                } ${
                  num === 1 ? 'h-24' : [2, 4, 14, 16, 17, 18, 19, 21, 25].includes(num) ? 'h-32' : [3, 7, 13, 15, 22, 23].includes(num) ? 'h-48' : num === 20 ? 'h-64' : 'h-56'
                }`}
                style={{ background: CHARACTER_MODELS[num].color }}
              >
                {/* Patterns */}
                {CHARACTER_MODELS[num].pattern === 'stars' && (
                  <div className="absolute inset-0 opacity-20 pointer-events-none flex flex-wrap justify-around p-2">
                    {[...Array(6)].map((_, i) => <div key={i} className="text-red-600 text-xl">★</div>)}
                  </div>
                )}
                {CHARACTER_MODELS[num].pattern === 'stripes' && (
                   <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.2)_10px,rgba(255,255,255,0.2)_20px)]" />
                )}
                {CHARACTER_MODELS[num].pattern === 'white-top' && (
                   <div className="absolute top-0 left-0 w-full h-1/3 bg-white/20 border-b-2 border-white/40" />
                )}
                {CHARACTER_MODELS[num].pattern === 'white-bottom' && (
                   <div className="absolute bottom-0 left-0 w-full h-1/4 bg-white/20 border-t-2 border-white/40" />
                )}
                {CHARACTER_MODELS[num].pattern === 'white-mask' && (
                   <div className="absolute top-2 w-full h-10 bg-white/30 rounded-lg border-y border-white/50" />
                )}
                {CHARACTER_MODELS[num].pattern === 'dots' && (
                   <div className="absolute inset-0 opacity-20 pointer-events-none grid grid-cols-4 items-center justify-center p-2">
                      {[...Array(8)].map((_, i) => <div key={i} className="w-2 h-2 bg-white rounded-full mx-auto" />)}
                   </div>
                )}
                {CHARACTER_MODELS[num].pattern === 'frame' && (
                   <div className="absolute inset-2 border-2 border-white/30 rounded-md" />
                )}
                {CHARACTER_MODELS[num].pattern === 'red-eye' && (
                   <div className="absolute top-4 w-24 h-24 bg-red-600 rounded-full flex items-center justify-center border-4 border-black">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                         <div className="w-8 h-8 bg-black rounded-full" />
                      </div>
                   </div>
                )}
                {CHARACTER_MODELS[num].pattern === 'stars-hat' && (
                  <>
                    <div className="absolute -top-10 w-16 h-12 bg-purple-600 border-4 border-black rounded-t-lg z-20">
                       <div className="absolute -bottom-2 -left-2 w-20 h-4 bg-purple-800 border-2 border-black rounded-full" />
                    </div>
                    <div className="absolute inset-0 opacity-20 pointer-events-none flex flex-wrap justify-around p-2">
                      {[...Array(6)].map((_, i) => <div key={i} className="text-red-600 text-xl">★</div>)}
                    </div>
                  </>
                )}
                {CHARACTER_MODELS[num].pattern === 'white-sides-22' && (
                   <>
                      <div className="absolute left-0 top-0 w-4 h-full bg-white/30 border-r border-white/40" />
                      <div className="absolute right-0 top-0 w-4 h-full bg-white/30 border-l border-white/40" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20 text-4xl font-black">22</div>
                   </>
                )}
                {CHARACTER_MODELS[num].pattern === 'white-sides-25' && (
                   <>
                      <div className="absolute left-0 top-0 w-4 h-full bg-white/30 border-r border-white/40" />
                      <div className="absolute right-0 top-0 w-4 h-full bg-white/30 border-l border-white/40" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20 text-4xl font-black">25</div>
                   </>
                )}
                {CHARACTER_MODELS[num].pattern === 'spiky' && (
                   <div className="absolute -top-6 w-12 h-12 bg-yellow-400 rotate-45 border-2 border-black -z-10" />
                )}

                {/* Eyes */}
                <div className={`grid ${CHARACTER_MODELS[num].columns === 3 ? 'grid-cols-3' : CHARACTER_MODELS[num].columns === 2 ? 'grid-cols-2' : 'grid-cols-1'} gap-1 px-1 z-10`}>
                  {[...Array(CHARACTER_MODELS[num].eyes)].map((_, i) => (
                    <div key={i} className="w-6 h-6 bg-white border-[3px] border-black rounded-full flex items-center justify-center shadow-inner">
                      <div className="w-2 h-2 bg-black rounded-full" />
                    </div>
                  ))}
                </div>
                
                {/* Mouth */}
                <div className="absolute bottom-2 w-10 h-4 flex items-center justify-center">
                  <div className="w-full h-full bg-black/10 rounded-full border border-black/20" />
                </div>

                {/* Animated Legs/Feet or Rocket Jumper */}
                <div className="absolute -bottom-10 w-full flex justify-center gap-4">
                  {isJumping ? (
                    <motion.div 
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      className="w-10 h-12 bg-red-600 rounded-b-full border-2 border-black origin-top shadow-[0_5px_15px_rgba(239,68,68,0.5)]"
                    />
                  ) : (
                    <>
                      <div className="w-4 h-10 bg-black/80 rounded-b-md shadow-md" />
                      <div className="w-4 h-10 bg-black/80 rounded-b-md shadow-md" />
                    </>
                  )}
                </div>
              </div>
            ) : (
              /* Default Mouth (Generic Character) */
              <motion.div 
                animate={{ rotate: [0, -2, 2, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="w-20 h-8 bg-[#FB7185] border-[3px] border-black rounded-full shadow-lg relative flex items-center justify-center overflow-hidden translate-y-4"
              >
                {/* Teeth/Inner Mouth */}
                <div className="absolute top-0 w-full h-1/2 bg-white" />
                <div className="w-full h-full border-t-[10px] border-[#F43F5E] rounded-full translate-y-1" />
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Top Menu Icon */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 cursor-pointer hover:scale-110 transition-transform md:right-8">
        <div className="w-10 h-2 bg-[#059669] rounded-full shadow-[0_2px_0_#064E3B]" />
        <div className="w-10 h-2 bg-[#059669] rounded-full shadow-[0_2px_0_#064E3B]" />
        <div className="w-10 h-2 bg-[#059669] rounded-full shadow-[0_2px_0_#064E3B]" />
      </div>

      {/* Sidebar Controls */}
      <aside className="absolute right-0 top-0 h-full w-24 bg-gradient-to-b from-[#4C1D95] to-[#2E1065] border-l-[3px] border-black/20 z-10 flex flex-col items-center py-4 overflow-y-auto no-scrollbar shadow-[-10px_0_30px_rgba(0,0,0,0.3)]">
        <div className="grid grid-cols-2 gap-x-1 gap-y-1.5 px-1.5 pb-24">
          {PAGES[sidebarPage].map((ctrl: any, i: number) => {
            if (sidebarPage === 2 || sidebarPage === 3) {
              const toggled = ctrl.label === 'FIGURED OUT FRENZY' ? isFOF : ctrl.label === 'AUTO' ? isAuto : false;
              return (
                <button
                  key={i}
                  onClick={() => handleSidebarAction(ctrl.action)}
                  className={`col-span-2 w-full h-16 flex items-center justify-center text-sm font-extrabold leading-none text-center px-1 rounded-sm shadow-[0_4px_0_rgba(0,0,0,0.2)] border-b-4 border-gray-400 transition-all uppercase ${getButtonStyle(ctrl.color, toggled, ctrl.label)}`}
                >
                  {ctrl.label}
                </button>
              );
            }
            return (
              <React.Fragment key={i}>
                <button
                  onClick={() => addNum(ctrl.pos.value)}
                  className={`w-10 h-10 flex items-center justify-center text-[10px] font-extrabold rounded shadow-md border border-black/10 transition-all ${getButtonStyle(ctrl.color)}`}
                >
                  {ctrl.pos.label}
                </button>
                <button
                  onClick={() => addNum(ctrl.neg.value)}
                  className={`w-10 h-10 flex items-center justify-center text-[10px] font-extrabold rounded shadow-md border border-black/10 transition-all ${getButtonStyle(ctrl.color)}`}
                >
                  {ctrl.neg.label}
                </button>
              </React.Fragment>
            );
          })}
        </div>

        {/* Footer Arrows */}
        <div className="absolute bottom-0 left-0 w-full p-2 bg-[#2E1065] flex flex-col items-center gap-1.5 border-t border-white/10 shadow-[0_-10px_20px_rgba(0,0,0,0.4)]">
           {sidebarPage === 2 && (
             <div className="flex gap-2 text-[10px] font-bold mb-1">
               <div className="flex items-center gap-1">
                  <div className={`w-3 h-3 bg-blue-600 rounded-sm border border-black/20 ${isOfficial ? 'opacity-100' : 'opacity-30'}`} />
                  <span className="text-blue-500">Official</span>
               </div>
               <div className="flex items-center gap-1">
                  <div className={`w-3 h-3 bg-red-600 rounded-sm border border-black/20 ${isFOF ? 'opacity-100' : 'opacity-30'}`} />
                  <span className="text-red-500">FOF</span>
               </div>
             </div>
           )}
           <div className="flex gap-1.5">
             <button 
              onClick={() => setSidebarPage(prev => Math.max(0, prev - 1))}
              className="w-9 h-9 bg-black flex items-center justify-center text-white rounded hover:bg-gray-800 transition-colors disabled:opacity-30"
              disabled={sidebarPage === 0}
            >
                <ChevronLeft size={20} />
             </button>
             <button 
              onClick={() => setSidebarPage(prev => Math.min(PAGES.length - 1, prev + 1))}
              className="w-9 h-9 bg-black flex items-center justify-center text-white rounded hover:bg-gray-800 transition-colors disabled:opacity-30"
              disabled={sidebarPage === PAGES.length - 1}
            >
                <ChevronRight size={20} />
             </button>
           </div>
           <span className="text-[#34D399] font-black italic text-2xl tracking-tighter drop-shadow-[0_2px_0_#064E3B]">VI.3.0</span>
        </div>
      </aside>

      {/* Bottom Display Panel */}
      <div className="absolute bottom-6 right-28 z-20 bg-[#065F46] p-2 rounded-lg border-[3px] border-[#064E3B] shadow-2xl flex flex-col gap-2 min-w-[280px]">
        <div className="flex items-center gap-3 bg-[#059669] p-1.5 rounded-md">
          <div className="bg-white px-3 py-1 rounded text-[#065F46] font-bold text-lg leading-none flex items-center justify-center">
            num
          </div>
          <div className="flex-grow bg-[#F97316] text-white px-4 py-1.5 rounded text-2xl font-black text-center shadow-inner">
             {formatNumber(num)}
          </div>
        </div>
        <div className="px-1 flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#3B82F6] shadow-sm" />
          <input 
            type="range"
            min="-10"
            max="100"
            step="1"
            value={Math.min(100, Math.max(-10, num))}
            onChange={handleSliderChange}
            className="flex-grow h-2 bg-[#10B981] rounded-full appearance-none cursor-pointer accent-[#3B82F6]"
          />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
