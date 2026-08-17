import React, { useState } from 'react';
import { Radio, Users, ShieldCheck, ChevronRight, Share2 } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';

export default function ScorecardScreen() {
  const { scorecard, navigateTo } = useCricket();
  const [activeInningsTab, setActiveInningsTab] = useState('1st'); // '1st' | '2nd' | 'info'

  return (
    <div className="min-h-[calc(100vh-120px)] bg-slate-100/60 pb-20 px-3.5 pt-3 max-w-xl mx-auto space-y-3.5 animate-in fade-in duration-200">
      
      {/* 1. Header Match Banner Card (Matches Image 25) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-5">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
          <span>T20 FINAL</span>
          <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>Live</span>
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B57D0] tracking-tight font-display">
              Eagles CC
            </h2>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 mt-0.5">
              184<span className="text-2xl font-bold text-slate-400">/4</span>
            </div>
            <div className="text-xs font-medium text-slate-500 mt-1">
              Overs: <strong className="text-slate-800">18.2</strong> / 20.0 (CRR: 10.09)
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-slate-700 block">Tigers XI</span>
            <span className="text-xs text-slate-400 font-medium">Yet to bat</span>
          </div>
        </div>
      </div>

      {/* 2. Innings Tabs (Matches Image 25) */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setActiveInningsTab('1st')}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeInningsTab === '1st'
              ? 'bg-[#0B57D0] text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Eagles CC (1st Inn)
        </button>

        <button
          onClick={() => setActiveInningsTab('2nd')}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeInningsTab === '2nd'
              ? 'bg-[#0B57D0] text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Tigers XI (2nd Inn)
        </button>

        <button
          onClick={() => navigateTo('match-overview')}
          className="px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-1"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Match Info & Umpires</span>
        </button>
      </div>

      {/* 3. Detailed Batting & Bowling Scorecard (Matches Image 25) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        
        {/* Batting Section Header */}
        <div className="p-4 border-b border-slate-100">
          <div className="grid grid-cols-12 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <div className="col-span-6">Batting</div>
            <div className="col-span-1 text-right">R</div>
            <div className="col-span-1 text-right">B</div>
            <div className="col-span-1 text-right">4s</div>
            <div className="col-span-1 text-right">6s</div>
            <div className="col-span-2 text-right">SR</div>
          </div>
        </div>

        {/* Batting Rows */}
        <div className="divide-y divide-slate-100">
          {scorecard.batting.map((batter) => (
            <div key={batter.id} className="p-4 hover:bg-slate-50/70 transition-colors">
              <div className="grid grid-cols-12 items-center">
                <div className="col-span-6">
                  <div className="font-bold text-sm text-slate-900 flex items-center space-x-1.5">
                    <span>{batter.name} {batter.isCaptain ? '*' : ''}</span>
                    {batter.isStriker && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium lowercase">
                    {batter.status}
                  </div>
                </div>

                <div className="col-span-1 text-right font-black text-sm text-slate-900">
                  {batter.runs}
                </div>

                <div className="col-span-1 text-right text-xs font-semibold text-slate-500">
                  {batter.balls}
                </div>

                <div className="col-span-1 text-right text-xs font-semibold text-slate-700">
                  {batter.fours}
                </div>

                <div className="col-span-1 text-right text-xs font-semibold text-slate-700">
                  {batter.sixes}
                </div>

                <div className="col-span-2 text-right text-xs font-bold text-slate-800">
                  {batter.strikeRate}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Extras Row */}
        <div className="p-4 bg-slate-50/80 border-t border-b border-slate-100 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800 uppercase tracking-wider">
            Extras
          </span>
          <div className="space-x-1">
            <strong className="text-sm font-black text-slate-900">
              {scorecard.extras.total}
            </strong>{' '}
            <span className="text-slate-500 font-medium">
              (b {scorecard.extras.byes}, lb {scorecard.extras.legByes}, w {scorecard.extras.wides}, nb {scorecard.extras.noBalls})
            </span>
          </div>
        </div>

        {/* Bowling Section Header */}
        <div className="p-4 bg-white border-b border-slate-100">
          <div className="grid grid-cols-12 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <div className="col-span-5">Bowling</div>
            <div className="col-span-1 text-right">O</div>
            <div className="col-span-1 text-right">M</div>
            <div className="col-span-2 text-right">R</div>
            <div className="col-span-1 text-right text-red-600 font-bold">W</div>
            <div className="col-span-2 text-right">ECON</div>
          </div>
        </div>

        {/* Bowling Rows */}
        <div className="divide-y divide-slate-100 bg-white">
          {scorecard.bowling.map((bowler) => (
            <div key={bowler.id} className="p-4 hover:bg-slate-50/70 transition-colors">
              <div className="grid grid-cols-12 items-center">
                <div className="col-span-5 flex items-center space-x-1.5">
                  <span className="font-bold text-sm text-slate-900">
                    {bowler.name}
                  </span>
                  {bowler.isCurrent && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  )}
                </div>

                <div className="col-span-1 text-right text-xs font-semibold text-slate-700">
                  {bowler.overs.toFixed(1)}
                </div>

                <div className="col-span-1 text-right text-xs font-semibold text-slate-500">
                  {bowler.maidens}
                </div>

                <div className="col-span-2 text-right text-xs font-bold text-slate-900">
                  {bowler.runs}
                </div>

                <div className="col-span-1 text-right text-xs font-black text-red-600">
                  {bowler.wickets}
                </div>

                <div className="col-span-2 text-right text-xs font-bold text-slate-800">
                  {bowler.economy.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Fall of Wickets Timeline */}
        <div className="p-4 bg-slate-50/60 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2.5">
            Fall of Wickets
          </h4>
          <div className="space-y-1.5 text-xs text-slate-700 font-medium">
            {scorecard.fallOfWickets.map((fow) => (
              <div key={fow.wicketNumber} className="flex items-center space-x-2">
                <strong className="font-bold text-slate-900">
                  {fow.wicketNumber}-{fow.score}
                </strong>
                <span className="text-slate-500">
                  ({fow.player}, {fow.over})
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
