import React, { useEffect, useMemo, useState } from 'react';
import {
  RotateCcw, FileText, ShieldAlert, AlertTriangle, X,
  ChevronRight, RefreshCw, Radio, CircleHelp, WifiOff,
  MoreHorizontal, Users
} from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import { FREE_HIT_ALLOWED_DISMISSALS } from '../../engine/validationSchemas';
import { motion } from 'motion/react';

const DISMISSALS = ['Bowled', 'Caught', 'LBW', 'Run Out', 'Stumped', 'Hit Wicket', 'Other'];
const QUICK_RUNS = [0, 1, 2, 3, 4, 6];

function Modal({ title, children, onClose, danger = false }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#101827]/65 p-3 sm:p-5">
      <div className="w-full max-w-lg bg-white rounded-t-[24px] sm:rounded-2xl shadow-2xl overflow-hidden animate-slide-up sm:animate-none">
        <div className={`px-5 py-4 border-b flex items-center justify-between ${danger ? 'border-coral-100 bg-[#fef0ee]' : 'border-gray-100 bg-gray-50'}`}>
          <h3 className={`text-[16px] font-black ${danger ? 'text-[#F05A47]' : 'text-[#101827]'}`}>{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
            <X size={16} className={danger ? 'text-[#F05A47]' : 'text-[#596579]'} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export default function ScoringScreen() {
  const {
    runs, wickets, balls, formatOvers, calculateCRR, calculateProjectedScore,
    currentOverBalls, striker, nonStriker, currentBowler, isFreeHit, toggleStriker,
    validationError, setValidationError, matchStatus, recordRuns, recordExtra,
    recordWicket, undoLastAction, innings, navigateTo, activeMatchId, matches,
    matchSetup, setMatchSetup, replaceStriker, replaceBatter, handleRetireBatter, continueAfterOver, lastOverBowlerId,
    deliveryLog = [], scoringFirstRunDone, markScoringFirstRunDone, goBack
  } = useCricket();

  const [dismissalOpen, setDismissalOpen] = useState(false);
  const [selectedDismissal, setSelectedDismissal] = useState('Caught');
  const [fielder, setFielder] = useState('');
  const [runOutPlayer, setRunOutPlayer] = useState('');
  const [newBatterOpen, setNewBatterOpen] = useState(false);
  const [replacingBatterType, setReplacingBatterType] = useState('striker');
  const [retireModalOpen, setRetireModalOpen] = useState(false);
  const [retiringBatter, setRetiringBatter] = useState('striker');
  const [retireType, setRetireType] = useState('hurt');
  const [overOpen, setOverOpen] = useState(false);
  const [changeWkOpen, setChangeWkOpen] = useState(false);
  const [extrasOpen, setExtrasOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const activeMatch = matches?.find(m => m.id === activeMatchId);
  const teamAName = activeMatch?.teamA?.name || activeMatch?.teamA || 'Jabalpur';
  const teamBName = activeMatch?.teamB?.name || activeMatch?.teamB || 'Mandla';
  const tournamentName = activeMatch?.tournament || 'JDCA District Cricket';
  const playingXI = matchSetup?.playingXI || [];

  const batters = useMemo(() => playingXI.filter(p => p?.name && p.name !== striker?.name && p.name !== nonStriker?.name), [playingXI, striker?.name, nonStriker?.name]);
  const lastBalls = deliveryLog.length ? deliveryLog.slice(-6) : currentOverBalls.map((b, i) => ({ ...b, id: `mock-${i}`, runs: Number(b.value) || 0, wicket: b.type === 'wicket', extra: b.type === 'extra' }));
  const isOverComplete = matchStatus === 'OVER_COMPLETE';

  useEffect(() => {
    if (isOverComplete) setOverOpen(true);
  }, [isOverComplete]);

  const doRun = (value) => {
    recordRuns(value);
    if (!scoringFirstRunDone) markScoringFirstRunDone?.();
  };

  const submitWicket = () => {
    let outName = striker.name;
    if (selectedDismissal === 'Run Out') outName = runOutPlayer || striker.name;

    let wk = '';
    if (selectedDismissal === 'Stumped') {
      wk = matchSetup?.playingXI?.find(p => /wicket/i.test(p.role))?.name || fielder;
    }

    setReplacingBatterType(outName === nonStriker.name ? 'nonStriker' : 'striker');
    recordWicket(selectedDismissal, outName, fielder, wk);
    setDismissalOpen(false);
    setFielder('');
    setRunOutPlayer('');
    setNewBatterOpen(true);
  };

  const submitRetire = () => {
    handleRetireBatter(retiringBatter === 'striker', retireType === 'out');
    setRetireModalOpen(false);
    setReplacingBatterType(retiringBatter);
    setNewBatterOpen(true);
  };

  const selectNewBatter = (player) => {
    if (player) {
      replaceBatter(replacingBatterType === 'striker', { ...player, runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: '0.0' });
    }
    setNewBatterOpen(false);
    setReplacingBatterType('striker'); // reset
  };

  const selectNextBowler = (player) => {
    if (!player) return;
    if (lastOverBowlerId && player.id === lastOverBowlerId) {
      setValidationError('The same bowler cannot bowl two consecutive overs.');
      return;
    }
    continueAfterOver?.(player);
    setOverOpen(false);
  };

  const selectNewWk = (player) => {
    if (!player) return;
    if (setMatchSetup) {
      setMatchSetup(prev => ({
        ...prev,
        playingXI: prev.playingXI.map(p => {
          if (p.id === player.id) return { ...p, role: 'Wicket Keeper' };
          if (p.role.includes('Wicket Keeper')) return { ...p, role: 'Batter' };
          return p;
        })
      }));
    }
    setChangeWkOpen(false);
  };

  const currentWk = playingXI.find(p => /wicket/i.test(p.role || ''));

  return (
    <div className="pb-[100px] bg-[#101827] min-h-screen text-white">
      
      {/* HEADER */}
      <div className="px-4 pt-[60px] pb-4 bg-gradient-to-b from-black/20 to-transparent">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0FA968] animate-pulse" />
              LIVE SCORING
            </span>
          </div>
          <div className="flex items-center gap-2">
             <button onClick={() => setShowHelp(true)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><CircleHelp size={16}/></button>
             <button onClick={() => navigateTo('match-detail')} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><X size={16}/></button>
          </div>
        </div>

        <div className="text-[11px] font-bold tracking-widest uppercase text-white/50 mb-1">{tournamentName}</div>
        <div className="text-[16px] font-black">{teamAName} <span className="text-white/40">vs</span> {teamBName}</div>
      </div>

      {validationError && (
        <div className="mx-4 mb-4 bg-[#F05A47] text-white p-3 rounded-[12px] flex items-center justify-between text-[12px] font-bold">
          <div className="flex items-center gap-2"><AlertTriangle size={16} /> {validationError}</div>
          <button onClick={() => setValidationError(null)} className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center"><X size={12} /></button>
        </div>
      )}

      {/* SCORE AREA */}
      <div className="px-4 mb-6">
        <div className="text-center">
          <div className="text-[12px] font-bold uppercase tracking-wider text-white/70 mb-2">
            {innings === 1 ? '1st Innings' : '2nd Innings'} • {innings === 1 ? teamAName : teamBName}
          </div>
          <div className="text-[80px] font-black leading-none tracking-tighter tabular-nums mb-2 text-white flex items-baseline justify-center">
            <motion.span
              key={runs}
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {runs}
            </motion.span>
            <span className="text-[40px] text-white/60 mx-1">/</span>
            <motion.span
              key={`w-${wickets}`}
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="text-[40px] text-white/60"
            >
              {wickets}
            </motion.span>
          </div>
          <div className="flex items-center justify-center gap-4 text-[14px] font-bold">
            <div className="bg-white/10 px-4 py-1.5 rounded-full">
              Overs <span className="text-white ml-1">{formatOvers(balls)}</span>
            </div>
            <div className="bg-white/10 px-4 py-1.5 rounded-full">
              CRR <span className="text-white ml-1">{calculateCRR()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* RECENT BALLS */}
      <div className="px-4 mb-6">
        <div className="bg-white/5 rounded-[16px] p-3 border border-white/10 flex items-center justify-between">
          <div className="text-[10px] font-bold uppercase tracking-wider text-white/50 w-12 text-center">THIS OVER</div>
          <div className="flex-1 flex items-center gap-2 overflow-x-auto px-2 no-scrollbar">
            {lastBalls.map((b, i) => (
              <div key={i} className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-black ${
                b.wicket ? 'bg-[#F05A47] text-white' :
                b.extra ? 'bg-[#ff6100] text-black' :
                b.runs >= 4 ? 'bg-[#2457D6] text-white' :
                'bg-white/10 text-white'
              }`}>
                {b.label || b.runs || 0}
              </div>
            ))}
            {!lastBalls.length && <div className="text-[12px] font-medium text-white/40 italic">No balls recorded yet in this over</div>}
          </div>
          <div className="text-[12px] font-black text-white w-8 text-center">{currentOverBalls.length}/6</div>
        </div>
      </div>

      {/* PLAYERS ON FIELD */}
      <div className="px-4 mb-8">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <button onClick={() => toggleStriker?.()} className="bg-white/10 rounded-[16px] p-4 text-left border border-white/20 relative overflow-hidden active:bg-white/20 transition-colors">
            <div className="absolute top-0 right-0 w-2 h-full bg-[#0FA968]" />
            <div className="text-[10px] font-bold text-[#0FA968] uppercase tracking-wider mb-1 flex items-center gap-1">Striker <span>*</span></div>
            <div className="text-[16px] font-black text-white truncate mb-2">{striker.name}</div>
            <div className="text-[18px] font-black tabular-nums leading-none">{striker.runs} <span className="text-[12px] text-white/50">({striker.balls})</span></div>
          </button>
          
          <button onClick={() => toggleStriker?.()} className="bg-white/5 rounded-[16px] p-4 text-left border border-white/20 active:bg-white/10 transition-colors">
            <div className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">Non-Striker</div>
            <div className="text-[16px] font-bold text-white/80 truncate mb-2">{nonStriker.name}</div>
            <div className="text-[18px] font-black tabular-nums leading-none text-white/80">{nonStriker.runs} <span className="text-[12px] text-white/50">({nonStriker.balls})</span></div>
          </button>
        </div>

        <div className="bg-white/5 rounded-[16px] p-4 border border-white/10 flex items-center justify-between mb-3">
           <div>
             <div className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1 flex items-center gap-1"><RefreshCw size={10}/> Bowler</div>
             <div className="text-[16px] font-black text-white">{currentBowler.name}</div>
           </div>
           <div className="text-right">
             <div className="text-[12px] font-bold text-white/50 uppercase tracking-wider mb-1">O-M-R-W</div>
             <div className="text-[16px] font-black tabular-nums">{currentBowler.overs}-{currentBowler.maidens}-{currentBowler.runs}-{currentBowler.wickets}</div>
           </div>
        </div>

        <div className="flex gap-2">
           <button onClick={() => setOverOpen(true)} className="flex-1 bg-white/10 rounded-[12px] py-3 text-[12px] font-bold uppercase tracking-wider border border-white/20 text-white flex items-center justify-center gap-2 active:bg-white/20">
             <RefreshCw size={14} /> Change Bowler
           </button>
           <button onClick={() => setChangeWkOpen(true)} className="flex-1 bg-white/10 rounded-[12px] py-3 text-[12px] font-bold uppercase tracking-wider border border-white/20 text-white flex items-center justify-center gap-2 active:bg-white/20">
             <Users size={14} /> Edit WK {currentWk ? `(${currentWk.name.split(' ')[0]})` : ''}
           </button>
        </div>
      </div>

      {/* SCORING PAD */}
      <div className="bg-white rounded-t-[32px] p-6 text-[#101827] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[18px] font-black">Record Ball</h3>
            <div className="text-[12px] font-medium text-[#8a99b0]">Tap the result of the delivery</div>
          </div>
          <button onClick={undoLastAction} disabled={!deliveryLog.length} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-[#596579] text-[12px] font-bold disabled:opacity-50">
            <RotateCcw size={14} /> Undo
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-3">
          {QUICK_RUNS.map(value => (
            <button 
              key={value} 
              onClick={() => doRun(value)} 
              className={`h-16 rounded-[16px] flex items-center justify-center text-[24px] font-black shadow-sm active:scale-[0.98] transition-transform ${
                value === 0 ? 'bg-gray-100 text-[#596579]' : 
                value >= 4 ? 'bg-gradient-to-b from-[#2457D6] to-[#1b41a8] text-white shadow-md' : 
                'bg-white border border-gray-200 text-[#101827]'
              }`}
            >
              {value}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-2 mb-4">
           <button onClick={() => recordExtra('wide', 0)} className="h-12 rounded-[12px] bg-gray-100 text-[#101827] text-[12px] font-black uppercase tracking-wider active:bg-gray-200">WD</button>
           <button onClick={() => recordExtra('no_ball', 0)} className="h-12 rounded-[12px] bg-gray-100 text-[#101827] text-[12px] font-black uppercase tracking-wider active:bg-gray-200">NB</button>
           <button onClick={() => recordExtra('bye', 1)} className="h-12 rounded-[12px] bg-gray-100 text-[#101827] text-[12px] font-black uppercase tracking-wider active:bg-gray-200">B</button>
           <button onClick={() => recordExtra('leg_bye', 1)} className="h-12 rounded-[12px] bg-gray-100 text-[#101827] text-[12px] font-black uppercase tracking-wider active:bg-gray-200">LB</button>
        </div>

        <div className="grid grid-cols-3 gap-3">
           <button onClick={() => setDismissalOpen(true)} className="h-14 rounded-[16px] bg-[#F05A47] text-white flex items-center justify-center gap-2 text-[14px] font-black shadow-md active:bg-[#d64a39]">
             <ShieldAlert size={16} /> WICKET
           </button>
           <button onClick={() => setRetireModalOpen(true)} className="h-14 rounded-[16px] bg-gray-100 text-[#101827] flex items-center justify-center gap-2 text-[14px] font-black active:bg-gray-200">
             RETIRE
           </button>
           <button onClick={() => setExtrasOpen(true)} className="h-14 rounded-[16px] bg-white border border-gray-200 text-[#101827] flex items-center justify-center gap-2 text-[12px] font-bold active:bg-gray-50">
             <MoreHorizontal size={16} /> EXTRAS
           </button>
        </div>
      </div>

      {/* MODALS */}
      {dismissalOpen && (
        <Modal title="Record Wicket" danger onClose={() => setDismissalOpen(false)}>
          <div className="bg-white border border-gray-100 rounded-[12px] p-3 mb-4 text-center">
            <span className="text-[14px] font-bold text-[#101827]">{striker.name}</span> <span className="text-[12px] text-[#596579]">is on strike</span>
          </div>
          <div className="text-[12px] font-bold uppercase tracking-wider text-[#8a99b0] mb-2">How out?</div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {DISMISSALS.map(type => {
              const blocked = isFreeHit && !FREE_HIT_ALLOWED_DISMISSALS.includes(type);
              const selected = selectedDismissal === type;
              return (
                <button 
                  key={type} 
                  disabled={blocked} 
                  className={`py-3 rounded-[12px] text-[13px] font-bold border transition-colors ${
                    selected ? 'bg-[#101827] text-white border-[#101827]' : 
                    blocked ? 'opacity-30 bg-gray-50 border-gray-100 cursor-not-allowed' : 
                    'bg-white text-[#596579] border-gray-200 active:bg-gray-50'
                  }`}
                  onClick={() => setSelectedDismissal(type)}
                >
                  {type}
                </button>
              );
            })}
          </div>

          {selectedDismissal === 'Caught' && (
            <div className="mb-4">
              <label className="text-[12px] font-bold uppercase tracking-wider text-[#8a99b0] mb-2 block">Caught by</label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                {playingXI.filter(p => p.name !== striker.name && p.name !== nonStriker.name).map(p => (
                  <button 
                    key={p.id} 
                    className={`py-2 px-2 rounded-[8px] text-[12px] font-bold border transition-colors ${fielder === p.name ? 'bg-[#2457D6] text-white border-[#2457D6]' : 'bg-gray-50 text-[#596579] border-gray-100'}`} 
                    onClick={() => setFielder(p.name)}
                  >
                    {p.name} {/wicket/i.test(p.role) ? '(WK)' : ''}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 mt-6">
            <button className="flex-1 py-3 rounded-[12px] font-bold bg-gray-100 text-[#596579]" onClick={() => setDismissalOpen(false)}>Cancel</button>
            <button 
              className="flex-1 py-3 rounded-[12px] font-bold bg-[#F05A47] text-white disabled:opacity-50" 
              onClick={submitWicket} 
              disabled={(selectedDismissal === 'Caught' || selectedDismissal === 'Run Out') && !fielder}
            >
              Confirm Wicket
            </button>
          </div>
        </Modal>
      )}

      {retireModalOpen && (
        <Modal title="Retire Batter" onClose={() => setRetireModalOpen(false)}>
          <div className="mb-4">
            <label className="text-[12px] font-bold uppercase tracking-wider text-[#8a99b0] mb-2 block">Who is retiring?</label>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setRetiringBatter('striker')}
                className={`py-3 rounded-[12px] text-[13px] font-bold border transition-colors ${retiringBatter === 'striker' ? 'bg-[#101827] text-white border-[#101827]' : 'bg-white text-[#596579] border-gray-200'}`}
              >
                {striker.name} (Striker)
              </button>
              <button 
                onClick={() => setRetiringBatter('nonStriker')}
                className={`py-3 rounded-[12px] text-[13px] font-bold border transition-colors ${retiringBatter === 'nonStriker' ? 'bg-[#101827] text-white border-[#101827]' : 'bg-white text-[#596579] border-gray-200'}`}
              >
                {nonStriker.name} (Non-Striker)
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="text-[12px] font-bold uppercase tracking-wider text-[#8a99b0] mb-2 block">Reason</label>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setRetireType('hurt')}
                className={`py-3 px-2 rounded-[12px] text-[13px] font-bold border transition-colors flex flex-col items-center justify-center gap-1 ${retireType === 'hurt' ? 'bg-[#ff6100] text-white border-[#ff6100]' : 'bg-white text-[#596579] border-gray-200'}`}
              >
                <span>Retired Hurt</span><span className="text-[10px] font-normal opacity-80">(No Wicket)</span>
              </button>
              <button 
                onClick={() => setRetireType('out')}
                className={`py-3 px-2 rounded-[12px] text-[13px] font-bold border transition-colors flex flex-col items-center justify-center gap-1 ${retireType === 'out' ? 'bg-[#F05A47] text-white border-[#F05A47]' : 'bg-white text-[#596579] border-gray-200'}`}
              >
                <span>Retired Out</span><span className="text-[10px] font-normal opacity-80">(Counts as Wicket)</span>
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 py-3 rounded-[12px] font-bold bg-gray-100 text-[#596579]" onClick={() => setRetireModalOpen(false)}>Cancel</button>
            <button 
              className="flex-1 py-3 rounded-[12px] font-bold bg-[#0FA968] text-white" 
              onClick={submitRetire}
            >
              Confirm Retire
            </button>
          </div>
        </Modal>
      )}

      {newBatterOpen && wickets < 10 && (
        <Modal title="New Batter" onClose={() => setNewBatterOpen(false)}>
          <p className="text-[13px] text-[#596579] mb-4">Select the next batter. The wicket has been recorded.</p>
          <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
            {batters.map(player => (
              <button 
                key={player.id} 
                onClick={() => selectNewBatter(player)}
                className="flex items-center justify-between p-3 rounded-[12px] bg-white border border-gray-200 active:bg-gray-50 transition-colors"
              >
                <div>
                  <div className="text-[14px] font-bold text-[#101827] text-left">{player.name}</div>
                  <div className="text-[11px] text-[#8a99b0] text-left">{player.role || 'Batter'}</div>
                </div>
                <ChevronRight size={16} className="text-[#d2d8e2]"/>
              </button>
            ))}
          </div>
        </Modal>
      )}

      {overOpen && !newBatterOpen && (
        <Modal title={isOverComplete ? "Over Complete" : "Change Bowler"} onClose={() => setOverOpen(false)}>
          {isOverComplete && (
            <div className="bg-[#eef2fd] p-4 rounded-[12px] mb-4 text-center">
              <div className="text-[24px] font-black text-[#2457D6]">{runs}/{wickets}</div>
              <div className="text-[12px] font-bold text-[#596579]">after {formatOvers(balls)} overs</div>
            </div>
          )}
          <div className="text-[12px] font-bold uppercase tracking-wider text-[#8a99b0] mb-2">Select new bowler</div>
          <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
            {playingXI.filter(p => /bowler|all-rounder/i.test(p.role || '') && p.id !== lastOverBowlerId).map(player => (
              <button 
                key={player.id} 
                onClick={() => selectNextBowler(player)}
                className="flex items-center justify-between p-3 rounded-[12px] bg-white border border-gray-200 active:bg-gray-50 transition-colors"
              >
                <div>
                  <div className="text-[14px] font-bold text-[#101827] text-left">{player.name}</div>
                  <div className="text-[11px] text-[#8a99b0] text-left">{player.role}</div>
                </div>
                <ChevronRight size={16} className="text-[#d2d8e2]"/>
              </button>
            ))}
          </div>
        </Modal>
      )}

      {changeWkOpen && (
        <Modal title="Change Wicket Keeper" onClose={() => setChangeWkOpen(false)}>
          <div className="text-[12px] font-bold uppercase tracking-wider text-[#8a99b0] mb-2">Select new Wicket Keeper</div>
          <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
            {playingXI.map(player => {
              const isWk = /wicket/i.test(player.role || '');
              return (
                <button 
                  key={player.id} 
                  onClick={() => selectNewWk(player)}
                  className={`flex items-center justify-between p-3 rounded-[12px] border transition-colors ${isWk ? 'bg-[#ff6100] border-[#ff6100] text-[#101827]' : 'bg-white border-gray-200 active:bg-gray-50 text-[#101827]'}`}
                >
                  <div className="text-left">
                    <div className="text-[14px] font-bold">{player.name}</div>
                    <div className={`text-[11px] ${isWk ? 'text-[#101827]/70' : 'text-[#8a99b0]'}`}>{player.role}</div>
                  </div>
                  {isWk && <span className="text-[10px] font-bold uppercase tracking-widest bg-white/30 px-2 py-1 rounded">Current WK</span>}
                </button>
              );
            })}
          </div>
        </Modal>
      )}

    </div>
  );
}
