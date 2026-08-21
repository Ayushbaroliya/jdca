import React, { useState, useEffect } from 'react';
import { 
  RotateCcw, 
  MoreHorizontal, 
  ChevronRight, 
  User, 
  ShieldAlert, 
  Sliders,
  Check,
  X,
  Sparkles,
  Zap,
  AlertTriangle
} from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import { FIELD_DIRECTIONS } from '../../data/mockData';
import { FREE_HIT_ALLOWED_DISMISSALS } from '../../engine/validationSchemas';
import { 
  CricketBatIcon, 
  CricketBatAsset,
  CricketBallIcon, 
  CricketKeeperGloveIcon 
} from '../CricketIcons';

export default function ScoringScreen() {
  const {
    runs,
    wickets,
    balls,
    formatOvers,
    calculateCRR,
    calculateProjectedScore,
    currentOverBalls,
    striker,
    nonStriker,
    currentBowler,
    isFreeHit,
    validationError,
    setValidationError,
    matchStatus,
    toggleStriker,
    recordRuns,
    recordExtra,
    recordWicket,
    undoLastAction,
    selectedDirection,
    setSelectedDirection,
    dismissalModalOpen,
    setDismissalModalOpen,
    extrasModalOpen,
    setExtrasModalOpen,
    innings,
    navigateTo
  } = useCricket();

  const [selectedDismissal, setSelectedDismissal] = useState('Caught');
  const [fielderName, setFielderName] = useState('P. Cummins');

  // If Free Hit becomes active, auto-default to 'Run Out'
  useEffect(() => {
    if (isFreeHit && !FREE_HIT_ALLOWED_DISMISSALS.includes(selectedDismissal)) {
      setSelectedDismissal('Run Out');
    }
  }, [isFreeHit]);

  const allDismissalTypes = ['Bowled', 'Caught', 'LBW', 'Run Out', 'Stumped', 'Hit Wicket', 'Obstructing Field', 'Other'];

  const handleRunClick = (amount) => {
    recordRuns(amount, selectedDirection);
  };

  const handleDismissalSubmit = () => {
    recordWicket(selectedDismissal, striker.name, fielderName);
  };

  return (
    <div className="min-h-[calc(100vh-120px)] bg-slate-100/60 pb-20 px-3.5 pt-3 max-w-xl mx-auto space-y-3.5 animate-in fade-in duration-200">
      
      {/* Dynamic Validation Alert Toast */}
      {validationError && (
        <div className="bg-amber-500 text-white px-4 py-3 rounded-2xl shadow-lg flex items-center justify-between animate-in slide-in-from-top duration-300">
          <div className="flex items-center space-x-2.5">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-white animate-bounce" />
            <span className="text-xs font-bold tracking-wide">{validationError}</span>
          </div>
          <button 
            onClick={() => setValidationError(null)}
            className="p-1 rounded-full hover:bg-amber-600 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      {/* Free Hit Active Banner */}
      {isFreeHit && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white px-4 py-2.5 rounded-2xl shadow-md flex items-center justify-between animate-pulse">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 fill-white text-yellow-200" />
            <span className="text-xs font-extrabold uppercase tracking-wider">
              FREE HIT ACTIVE (Law 21.18)
            </span>
          </div>
          <span className="text-[11px] font-semibold bg-white/20 px-2 py-0.5 rounded-full">
            No Dismissals except Run Out
          </span>
        </div>
      )}

      {/* 1. Score Summary Banner Card (Matches Image 7 / 27) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {/* Top multi-color strip */}
        <div className="h-1.5 bg-gradient-to-r from-red-500 via-amber-400 to-blue-600" />
        
        <div className="p-4 sm:p-5">
          {/* Innings & Match header */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span className="font-bold text-red-600 tracking-wide">
                {innings === 1 ? '1st Innings' : '2nd Innings'}
              </span>
            </div>
            <span className="text-slate-500 font-medium uppercase tracking-wider">
              IND vs AUS (T20)
            </span>
          </div>

          {/* Main Huge Runs & Wickets */}
          <div className="flex items-baseline space-x-1 mt-1 mb-3">
            <span className="text-4xl sm:text-5xl font-extrabold text-[#0B57D0] tracking-tight font-display">
              {runs}
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-slate-400">
              /{wickets}
            </span>
          </div>

          {/* Overs & CRR Row */}
          <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-600 mb-3 border-t border-slate-100 pt-2.5">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-bold">
                OVERS
              </span>
              <span className="text-slate-900 font-bold text-base">
                {formatOvers(balls)} <span className="text-slate-400 font-normal">/ 20</span>
              </span>
            </div>

            <div className="text-right">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-bold">
                CRR
              </span>
              <span className="text-slate-900 font-bold text-base">
                {calculateCRR()}
              </span>
            </div>
          </div>

          {/* Projected Score Blue Highlight Bar */}
          <div className="py-2.5 px-3.5 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">
              Proj. Score
            </span>
            <span className="text-sm font-extrabold text-[#0B57D0]">
              {calculateProjectedScore()}
            </span>
          </div>

        </div>
      </div>

      {/* 2. Batters & Bowler Card (Matches Image 7 / 27) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 space-y-3.5">
        
        {/* Batters section header */}
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <div className="flex items-center space-x-1.5">
            <CricketBatAsset className="w-3.5 h-3.5 object-contain" />
            <span>BATTERS (TAP TO SELECT STRIKER)</span>
          </div>
          <span className="text-[10px] text-blue-600 lowercase bg-blue-50 px-2 py-0.5 rounded font-semibold">
            tap to switch strike
          </span>
        </div>

        {/* Striker Batters Row (Click to toggle) */}
        <div className="space-y-2">
          {/* Striker */}
          <div 
            onClick={toggleStriker}
            className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/80 border border-blue-200/80 cursor-pointer transition-colors"
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-2xs p-1">
                <CricketBatAsset className="w-4 h-4 object-contain brightness-0 invert" />
              </div>
              <span className="font-bold text-sm text-slate-900">
                {striker.name} <span className="text-blue-600 font-extrabold">*</span>
              </span>
            </div>
            <div className="text-sm font-bold text-slate-900">
              {striker.runs} <span className="text-xs font-normal text-slate-500">({striker.balls})</span>
            </div>
          </div>

          {/* Non-Striker */}
          <div 
            onClick={toggleStriker}
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-150 cursor-pointer transition-colors"
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center p-1">
                <CricketBatAsset className="w-4 h-4 object-contain opacity-70" />
              </div>
              <span className="font-semibold text-sm text-slate-700">
                {nonStriker.name}
              </span>
            </div>
            <div className="text-sm font-bold text-slate-800">
              {nonStriker.runs} <span className="text-xs font-normal text-slate-500">({nonStriker.balls})</span>
            </div>
          </div>
        </div>

        {/* Bowler Details */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            <span>BOWLER</span>
            <span className="flex items-center gap-1">
              <CricketKeeperGloveIcon className="w-3.5 h-3.5 text-blue-600 inline" />
              WK: {currentBowler.wk}
            </span>
          </div>

          <div className="flex items-center justify-between bg-slate-50/90 p-2.5 rounded-xl border border-slate-100">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
                <CricketBallIcon className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-sm text-slate-800">
                {currentBowler.name}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">
                O-M-R-W
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-900">
                {currentBowler.overs}-{currentBowler.maidens}-{currentBowler.runs}-{currentBowler.wickets}
              </span>
            </div>
          </div>
        </div>

        {/* Current Over Balls Array */}
        <div className="pt-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            CURRENT OVER ({formatOvers(balls)})
          </div>

          <div className="flex items-center space-x-2">
            {/* Render recorded balls */}
            {currentOverBalls.map((b, idx) => {
              const isWicket = b.type === 'wicket' || b.value === 'W';
              const isFour = b.value === 4 || b.label === '4';
              const isSix = b.value === 6 || b.label === '6';

              return (
                <div
                  key={idx}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-transform ${
                    isWicket
                      ? 'bg-red-100 text-red-700 border-2 border-red-400'
                      : isFour || isSix
                      ? 'bg-amber-100 text-amber-800 border-2 border-amber-300'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {b.label}
                </div>
              );
            })}

            {/* Empty slots for remaining balls in over */}
            {Array.from({ length: Math.max(0, 6 - currentOverBalls.length) }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="w-9 h-9 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-slate-300 text-xs"
              >
                •
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. Ball Direction / Wagon Wheel Field Map (Matches Image 7) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4">
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
          <span>BALL DIRECTION</span>
          <span className="text-blue-600 font-semibold lowercase">
            zone: <strong className="uppercase">{selectedDirection}</strong>
          </span>
        </div>

        {/* Circular Cricket Ground & Pitch Diagram */}
        <div className="relative w-56 h-56 mx-auto flex items-center justify-center my-1">
          {/* Outer Boundary Circle */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-slate-300 bg-slate-50/50" />
          
          {/* Inner 30-yard Circle */}
          <div className="absolute inset-8 rounded-full border border-slate-200 bg-white/70" />

          {/* Central Pitch Rectangle */}
          <div className="relative z-10 w-8 h-24 bg-amber-100/80 border border-amber-300 rounded-sm flex items-center justify-center shadow-xs">
            <div className="w-1 h-16 border-x border-dashed border-amber-400/80" />
          </div>

          {/* Sector Labels & Interactive Click Zones */}
          {FIELD_DIRECTIONS.map((dir) => {
            const isSelected = selectedDirection === dir.name;
            
            // Positioning coordinates around the circle
            let posClass = '';
            if (dir.id === 'third_man') posClass = 'top-3 left-8';
            else if (dir.id === 'fine_leg') posClass = 'top-3 right-8';
            else if (dir.id === 'point') posClass = 'top-20 left-2';
            else if (dir.id === 'square_leg') posClass = 'top-20 right-2';
            else if (dir.id === 'cover') posClass = 'bottom-16 left-3';
            else if (dir.id === 'mid_wicket') posClass = 'bottom-16 right-3';
            else if (dir.id === 'long_off') posClass = 'bottom-2 left-10';
            else if (dir.id === 'long_on') posClass = 'bottom-2 right-10';

            return (
              <button
                key={dir.id}
                type="button"
                onClick={() => setSelectedDirection(dir.name)}
                className={`absolute ${posClass} text-[10px] font-bold transition-all px-1.5 py-0.5 rounded cursor-pointer z-20 ${
                  isSelected
                    ? 'bg-[#0B57D0] text-white scale-110 shadow-sm'
                    : 'text-slate-600 hover:text-blue-700 hover:bg-white/80'
                }`}
              >
                {dir.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Score Action Keypad (Matches Image 7 / 27) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 space-y-3">
        
        {/* Action Header with Undo & Extras */}
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900 font-display">
            Score Action
          </h3>

          <div className="flex items-center space-x-2">
            {/* Undo Button */}
            <button
              onClick={undoLastAction}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Undo</span>
            </button>

            {/* Extras Button */}
            <button
              onClick={() => setExtrasModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
            >
              Extras
            </button>
          </div>
        </div>

        {/* Keypad Grid 1: 0, 1, 2, 3, 4, 5 */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* 0 */}
          <button
            onClick={() => handleRunClick(0)}
            className="py-4 bg-slate-200 hover:bg-slate-300 active:scale-95 text-slate-900 font-extrabold text-xl rounded-xl shadow-2xs transition-all cursor-pointer"
          >
            0
          </button>

          {/* 1 */}
          <button
            onClick={() => handleRunClick(1)}
            className="py-4 bg-[#0A57C2] hover:bg-blue-700 active:scale-95 text-white font-extrabold text-xl rounded-xl shadow-2xs transition-all cursor-pointer"
          >
            1
          </button>

          {/* 2 */}
          <button
            onClick={() => handleRunClick(2)}
            className="py-4 bg-[#0A57C2] hover:bg-blue-700 active:scale-95 text-white font-extrabold text-xl rounded-xl shadow-2xs transition-all cursor-pointer"
          >
            2
          </button>

          {/* 3 */}
          <button
            onClick={() => handleRunClick(3)}
            className="py-4 bg-[#0A57C2] hover:bg-blue-700 active:scale-95 text-white font-extrabold text-xl rounded-xl shadow-2xs transition-all cursor-pointer"
          >
            3
          </button>

          {/* 4 (Yellow) */}
          <button
            onClick={() => handleRunClick(4)}
            className="py-4 bg-[#FABB05] hover:bg-amber-500 active:scale-95 text-slate-950 font-extrabold text-xl rounded-xl shadow-2xs transition-all cursor-pointer"
          >
            4
          </button>

          {/* 5 */}
          <button
            onClick={() => handleRunClick(5)}
            className="py-4 bg-slate-200 hover:bg-slate-300 active:scale-95 text-slate-900 font-extrabold text-xl rounded-xl shadow-2xs transition-all cursor-pointer"
          >
            5
          </button>
        </div>

        {/* Keypad Grid 2: 6 (Yellow) & OUT (Red) */}
        <div className="grid grid-cols-3 gap-2.5">
          <button
            onClick={() => handleRunClick(6)}
            className="col-span-2 py-4 bg-[#FABB05] hover:bg-amber-500 active:scale-95 text-slate-950 font-black text-2xl rounded-xl shadow-2xs transition-all cursor-pointer"
          >
            6
          </button>

          <button
            onClick={() => setDismissalModalOpen(true)}
            className="py-4 bg-[#DC2626] hover:bg-red-700 active:scale-95 text-white font-black text-sm flex flex-col items-center justify-center rounded-xl shadow-2xs transition-all cursor-pointer"
          >
            <ShieldAlert className="w-5 h-5 mb-0.5" />
            <span>OUT</span>
          </button>
        </div>

        {/* Extras Quick Row: Wide, No Ball, Leg Bye */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          <button
            onClick={() => recordExtra('wide', 0)}
            className="py-3 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 transition-all cursor-pointer"
          >
            Wide
          </button>

          <button
            onClick={() => recordExtra('no_ball', 0)}
            className="py-3 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 transition-all cursor-pointer"
          >
            No Ball
          </button>

          <button
            onClick={() => recordExtra('leg_bye', 1)}
            className="py-3 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 transition-all cursor-pointer"
          >
            Leg Bye
          </button>
        </div>

      </div>

      {/* Dismissal / Out Modal Sheet */}
      {dismissalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-5 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Record Dismissal</h3>
                <p className="text-xs text-slate-500">Batter: <strong className="text-slate-800">{striker.name}</strong></p>
              </div>
              <button
                onClick={() => setDismissalModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Hit Info Banner inside Modal */}
            {isFreeHit && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>
                  <strong>MCC Law 21.18:</strong> Only Run Out / Obstructing Field is permitted during a Free Hit.
                </span>
              </div>
            )}

            {/* Dismissal Types Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {allDismissalTypes.map((type) => {
                const isBlocked = isFreeHit && !FREE_HIT_ALLOWED_DISMISSALS.includes(type);

                return (
                  <button
                    key={type}
                    type="button"
                    disabled={isBlocked}
                    onClick={() => !isBlocked && setSelectedDismissal(type)}
                    className={`py-3 px-2 rounded-xl text-xs font-bold transition-all relative ${
                      isBlocked
                        ? 'bg-slate-100/60 text-slate-300 border border-dashed border-slate-200 cursor-not-allowed line-through'
                        : selectedDismissal === type
                        ? 'bg-red-600 text-white shadow-md cursor-pointer'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer'
                    }`}
                  >
                    {type}
                    {isBlocked && (
                      <span className="block text-[9px] font-normal no-underline text-amber-700 mt-0.5">
                        Free Hit Rule
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Fielder Name if caught or run out */}
            {(selectedDismissal === 'Caught' || selectedDismissal === 'Run Out' || selectedDismissal === 'Stumped') && (
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Fielder / Wicket Keeper Name
                </label>
                <input
                  type="text"
                  value={fielderName}
                  onChange={(e) => setFielderName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setDismissalModalOpen(false)}
                className="flex-1 py-3 rounded-xl border border-slate-300 font-bold text-xs text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDismissalSubmit}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md"
              >
                Confirm Wicket
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Extras Details Modal */}
      {extrasModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-5 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-lg text-slate-900">Custom Extras</h3>
              <button
                onClick={() => setExtrasModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-semibold">
              <div className="p-3 rounded-xl bg-slate-50 flex items-center justify-between">
                <span>Wide + 4 (5 Wides)</span>
                <button
                  onClick={() => {
                    recordExtra('wide', 4);
                    setExtrasModalOpen(false);
                  }}
                  className="px-3 py-1.5 bg-[#0B57D0] text-white rounded-lg font-bold"
                >
                  +5 Wide
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 flex items-center justify-between">
                <span>No Ball + Boundary (1+4 = 5 Runs)</span>
                <button
                  onClick={() => {
                    recordExtra('no_ball', 4);
                    setExtrasModalOpen(false);
                  }}
                  className="px-3 py-1.5 bg-[#0B57D0] text-white rounded-lg font-bold"
                >
                  +5 No Ball
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 flex items-center justify-between">
                <span>Byes (4 Byes)</span>
                <button
                  onClick={() => {
                    recordExtra('bye', 4);
                    setExtrasModalOpen(false);
                  }}
                  className="px-3 py-1.5 bg-slate-800 text-white rounded-lg font-bold"
                >
                  +4 Byes
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
