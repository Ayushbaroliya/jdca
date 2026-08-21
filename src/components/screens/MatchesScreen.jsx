import React, { useState } from 'react';
import { Plus, MapPin, ArrowRight, Radio, Trophy, Clock, Sparkles } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import { TeamCrest } from '../CricketIcons';
import { CricketStadiumHeroIllustration } from '../CricketIllustrations';

export default function MatchesScreen() {
  const { matches, navigateTo, setActiveMatchId } = useCricket();
  const [selectedCategory, setSelectedCategory] = useState('All Matches');

  const categories = ['All Matches', 'T20 Leagues', 'T20', 'One Day', 'Test', 'Under-19'];

  const filteredMatches = selectedCategory === 'All Matches'
    ? matches
    : matches.filter((m) => m.category === selectedCategory || (selectedCategory === 'Under-19' && m.tournament.includes('Under')));

  return (
    <div className="min-h-[calc(100vh-120px)] bg-slate-50/60 pb-20 px-4 pt-4 max-w-xl mx-auto animate-in fade-in duration-200">
      
      {/* Stadium Hero Banner SVG */}
      <div 
        onClick={() => {
          setActiveMatchId('match-live-1');
          navigateTo('scoring');
        }}
        className="mb-4 cursor-pointer group transition-transform active:scale-[0.99]"
      >
        <CricketStadiumHeroIllustration className="w-full h-40 shadow-md border border-slate-800/40" />
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center space-x-2.5 overflow-x-auto no-scrollbar pb-3 pt-1">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#0B57D0] text-white shadow-sm shadow-blue-500/20'
                  : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Live Now Section Header */}
      <div className="flex items-center space-x-2 mt-4 mb-3">
        <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
        <h2 className="text-xl font-bold text-slate-900 tracking-tight font-display flex items-center gap-1.5">
          <span className="text-red-600 font-extrabold">•</span> Live Now
        </h2>
      </div>

      {/* Primary Featured Live Match Card (Matches Image 19) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all hover:shadow-md mb-5">
        
        {/* Top colored accent stripe */}
        <div className="h-1.5 bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500" />

        <div className="p-4 sm:p-5">
          {/* Card Header: Tournament & Live pill */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-4 uppercase tracking-wider">
            <span>T20 BLAST • FINAL</span>
            <div className="flex items-center space-x-1 px-2.5 py-0.5 rounded-md bg-red-50 border border-red-200 text-red-600 font-bold text-[11px]">
              <Radio className="w-3 h-3 animate-pulse" />
              <span>LIVE</span>
            </div>
          </div>

          {/* Teams Row */}
          <div className="flex items-center justify-between py-2 px-1">
            {/* Team A */}
            <div className="flex items-center space-x-3">
              <TeamCrest teamName="Eagles" className="w-12 h-12 shadow-sm" />
              <span className="font-bold text-lg sm:text-xl text-slate-900">
                Eagles
              </span>
            </div>

            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">
              v
            </span>

            {/* Team B */}
            <div className="flex items-center space-x-3">
              <span className="font-bold text-lg sm:text-xl text-slate-900 text-right">
                Titans
              </span>
              <TeamCrest teamName="Titans" className="w-12 h-12 shadow-sm" />
            </div>
          </div>

          {/* Highlight Score Box */}
          <div className="my-4 p-4 rounded-xl bg-blue-50/60 border border-blue-100/80 text-center">
            <div className="flex items-baseline justify-center space-x-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#0B57D0] font-display">
                142/4
              </span>
              <span className="text-sm sm:text-base font-semibold text-slate-600">
                (16.2 ov)
              </span>
            </div>
            <p className="text-xs font-medium text-slate-600 mt-1">
              Eagles elected to bat
            </p>
          </div>

          {/* CRR & Projected Stats */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5">
              <span>
                CRR: <strong className="text-slate-900">8.75</strong>
              </span>
              <span>
                Proj: <strong className="text-slate-900">175</strong>
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-600 h-full rounded-full transition-all" 
                style={{ width: '81%' }} 
              />
            </div>
          </div>

          {/* Footer with Venue & Score Match CTA */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Oval Ground, London</span>
            </div>

            <button
              onClick={() => {
                setActiveMatchId('match-live-1');
                navigateTo('scoring');
              }}
              className="flex items-center space-x-1 text-xs sm:text-sm font-bold text-[#0B57D0] hover:text-blue-800 transition-colors cursor-pointer group"
            >
              <span>Score Match</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Other Matches Grid / List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Recent & Other Fixtures
        </h3>

        {/* International Match Card */}
        <div 
          onClick={() => {
            setActiveMatchId('match-ind-aus');
            navigateTo('scoring');
          }}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-700">IND vs AUS (T20)</span>
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[10px]">
              T20I
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <span>🇮🇳 India</span>
                <span className="text-[#0B57D0]">142/4 (15.4 ov)</span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                🇦🇺 Australia • Yet to bat
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                CRR 9.06
              </span>
            </div>
          </div>
        </div>

        {/* Completed Match Card */}
        <div 
          onClick={() => navigateTo('match-result')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-700">T20 Championship Final</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold text-[10px]">
              Finished
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-slate-800">
                Team A 185/4 vs Team B 165/9
              </div>
              <div className="text-xs font-medium text-blue-700 mt-0.5">
                Team A Won by 20 Runs
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                Summary
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button (+) to Create New Match */}
      <button
        onClick={() => navigateTo('match-setup')}
        className="fixed right-6 bottom-20 z-30 w-14 h-14 bg-[#0B57D0] hover:bg-blue-700 text-white rounded-full shadow-xl flex items-center justify-center transition-all transform active:scale-95 cursor-pointer"
        aria-label="Create New Match"
      >
        <Plus className="w-7 h-7 stroke-[2.5]" />
      </button>

    </div>
  );
}
