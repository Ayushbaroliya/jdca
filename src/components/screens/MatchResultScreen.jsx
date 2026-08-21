import React from 'react';
import { 
  Trophy, 
  Award, 
  Share2, 
  ArrowRight, 
  ArrowLeft, 
  Star, 
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import { TeamCrest, CricketBatIcon, CricketBallIcon } from '../CricketIcons';
import { CricketTrophyBannerIllustration } from '../CricketIllustrations';

export default function MatchResultScreen() {
  const { navigateTo } = useCricket();

  return (
    <div className="min-h-[calc(100vh-120px)] bg-slate-100/60 pb-20 px-3.5 pt-3 max-w-xl mx-auto space-y-4 animate-in fade-in duration-200">
      
      {/* 1. Champion Result Hero Card (Matches Image 17) */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0B2545] via-[#133E87] to-[#0A192F] text-white p-6 shadow-xl relative overflow-hidden flex items-center justify-between">
        <div className="relative z-10 space-y-2 max-w-[65%]">
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full">
            CHAMPIONSHIP RESULT
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
            Team A Won by 20 Runs
          </h2>

          <p className="text-xs text-blue-200 font-medium">
            T20 Championship Final • JDCA Stadium
          </p>
        </div>

        {/* Scalable Golden Trophy SVG */}
        <div className="relative z-10">
          <CricketTrophyBannerIllustration className="w-24 h-24 sm:w-28 sm:h-28" />
        </div>
      </div>

      {/* 2. Match Score Summary Card (Matches Image 17) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Match Score Summary
        </h3>

        <div className="space-y-3">
          {/* Team A (Winner) */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-blue-50/70 border border-blue-100">
            <div className="flex items-center space-x-3">
              <TeamCrest teamName="Eagles" className="w-10 h-10 shadow-xs" />
              <div>
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <span>Eagles CC</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
                </h4>
                <p className="text-xs text-slate-500 font-medium">20.0 Overs (Target: 186)</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-extrabold text-[#0B57D0]">185/4</span>
              <span className="text-[10px] text-slate-400 block">RR: 9.25</span>
            </div>
          </div>

          {/* Team B */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-150">
            <div className="flex items-center space-x-3">
              <TeamCrest teamName="Titans" className="w-10 h-10 shadow-xs" />
              <div>
                <h4 className="font-bold text-sm text-slate-800">Titans</h4>
                <p className="text-xs text-slate-500 font-medium">20.0 Overs (Chasing 186)</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-extrabold text-slate-700">165/9</span>
              <span className="text-[10px] text-slate-400 block">RR: 8.25</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Player of the Match Card (Matches Image 17) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
        <div className="flex items-center space-x-1.5 text-amber-500 font-bold text-xs uppercase tracking-wider">
          <Star className="w-4 h-4 fill-amber-400" />
          <span>Player of the Match</span>
        </div>

        <div className="flex items-center space-x-4">
          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
            alt="Alex Mercer"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-xs"
          />

          <div className="flex-1">
            <h4 className="text-lg font-bold text-slate-900 font-display">
              Alex Mercer
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              Team A • All-Rounder
            </p>

            <div className="flex items-center space-x-3 mt-2 text-xs font-semibold text-slate-700">
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded flex items-center gap-1">
                <CricketBatIcon className="w-3.5 h-3.5" />
                <span>78 (42)</span>
              </span>
              <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded flex items-center gap-1">
                <CricketBallIcon className="w-3.5 h-3.5" />
                <span>2/24 (4 ov)</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Top Performers (Matches Image 17) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Other Key Performances
        </h3>

        <div className="space-y-2 text-xs font-semibold">
          <div className="p-3 rounded-xl bg-slate-50 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-bold text-slate-800">S. Sharma (Team B)</span>
            </div>
            <span className="text-red-600 font-bold">4/18 (4.0 ov)</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="font-bold text-slate-800">J. Doe (Team A)</span>
            </div>
            <span className="text-blue-700 font-bold">55 (38 balls)</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="font-bold text-slate-800">M. Patel (Team B)</span>
            </div>
            <span className="text-amber-800 font-bold">42* (26 balls)</span>
          </div>
        </div>
      </div>

      {/* 5. Footer Action CTA Buttons */}
      <div className="space-y-2.5 pt-2">
        <button
          onClick={() => navigateTo('scorecard')}
          className="w-full py-4 bg-[#0B57D0] hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg flex items-center justify-center space-x-2 text-sm sm:text-base transition-all cursor-pointer"
        >
          <span>View Detailed Scorecard & Stats</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => navigateTo('matches')}
          className="w-full py-3.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center transition-all cursor-pointer"
        >
          Return to Matches Hub
        </button>
      </div>

    </div>
  );
}
