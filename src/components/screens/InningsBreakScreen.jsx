import React from 'react';
import { Trophy, ArrowRight, Play, Award, Zap } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import { CricketBatIcon, CricketBallIcon } from '../CricketIcons';

export default function InningsBreakScreen() {
  const { runs, wickets, setInnings, navigateTo } = useCricket();

  const targetScore = runs + 1;

  const handleStartSecondInnings = () => {
    setInnings(2);
    navigateTo('scoring');
  };

  return (
    <div className="min-h-[calc(100vh-120px)] bg-slate-100/60 pb-20 px-3.5 pt-3 max-w-xl mx-auto space-y-4 animate-in fade-in duration-200">
      
      {/* 1. Deep Blue Hero Banner Card (Matches Image 29) */}
      <div className="rounded-3xl bg-[#092244] text-white p-6 shadow-xl relative overflow-hidden dot-pattern">
        {/* Subtle glow circle */}
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-blue-600/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-300">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Innings Complete • 1st Innings</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-white/10 px-2.5 py-1 rounded-full text-xs font-bold text-amber-300 border border-white/10">
              <CricketBatIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>Batting 1st</span>
            </div>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-blue-100 flex items-center gap-2">
              <span>Super Kings</span>
            </h2>
            <div className="text-4xl sm:text-5xl font-black text-white tracking-tight mt-1 font-display">
              {runs || 214} <span className="text-2xl text-blue-300 font-bold">/{wickets || 4}</span>
            </div>
            <p className="text-xs text-blue-200 font-medium mt-1">
              Overs: <strong>20.0</strong> • Run Rate: <strong>{((runs || 214) / 20).toFixed(2)}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* 2. Target Challenge Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 text-center space-y-2">
        <div className="inline-flex items-center justify-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold uppercase tracking-wider">
          <CricketBatIcon className="w-3.5 h-3.5 text-[#0B57D0]" />
          <span>TARGET FOR 2ND INNINGS BATTING</span>
        </div>
        <div className="text-3xl sm:text-4xl font-extrabold text-[#0B57D0] font-display">
          {targetScore || 215} Runs
        </div>
        <p className="text-xs font-semibold text-slate-600">
          Required from 120 balls (Req RR: {(targetScore / 20).toFixed(2)})
        </p>
      </div>

      {/* 3. Top Performers (Matches Image 29) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Top Performers (1st Innings)
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {/* Top Batter */}
          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/70">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-800 mb-1">
              <CricketBatIcon className="w-3.5 h-3.5 text-amber-700" />
              <span>Top Batter</span>
            </div>
            <h4 className="font-bold text-sm text-slate-900">V. Kohli</h4>
            <div className="text-base font-extrabold text-blue-700 mt-0.5">
              82 <span className="text-xs font-normal text-slate-500">(53 balls)</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">7x4, 3x6 (SR 154.7)</p>
          </div>

          {/* Top Bowler */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 mb-1">
              <CricketBallIcon className="w-3.5 h-3.5 text-red-500" />
              <span>Top Bowler</span>
            </div>
            <h4 className="font-bold text-sm text-slate-900">R. Khan</h4>
            <div className="text-base font-extrabold text-red-600 mt-0.5">
              3/24 <span className="text-xs font-normal text-slate-500">(4.0 ov)</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Econ: 6.00 • 12 Dots</p>
          </div>
        </div>
      </div>

      {/* 4. Start 2nd Innings CTA */}
      <div className="space-y-2.5 pt-2">
        <button
          onClick={handleStartSecondInnings}
          className="w-full py-4 bg-[#0B57D0] hover:bg-blue-700 active:scale-[0.99] text-white font-bold rounded-2xl shadow-lg flex items-center justify-center space-x-2 text-sm sm:text-base transition-all cursor-pointer"
        >
          <CricketBatIcon className="w-4 h-4 text-white" />
          <span>Start 2nd Innings (Batting)</span>
        </button>

        <button
          onClick={() => navigateTo('scorecard')}
          className="w-full py-3.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center transition-all cursor-pointer"
        >
          View Full 1st Innings Scorecard
        </button>
      </div>

    </div>
  );
}
