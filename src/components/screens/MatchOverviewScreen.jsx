import React from 'react';
import { 
  ShieldCheck, 
  Award, 
  Activity, 
  Clock, 
  Radio, 
  ArrowLeft, 
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { useCricket } from '../../context/CricketContext';

export default function MatchOverviewScreen() {
  const { officials, navigateTo, goBack } = useCricket();

  return (
    <div className="min-h-[calc(100vh-120px)] bg-slate-100/60 pb-20 px-3.5 pt-3 max-w-xl mx-auto space-y-4 animate-in fade-in duration-200">
      
      {/* 1. Header Banner (Matches Image 5) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
          <span className="text-slate-700 font-bold uppercase tracking-wider">
            Championship Finals • T20 Format
          </span>
          <div className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 font-bold text-[11px] border border-red-200">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>LIVE</span>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B57D0] tracking-tight font-display">
          Active Match Overview
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Live statistics, partnership progression, and certified official roster.
        </p>
      </div>

      {/* 2. Key Metrics 2x2 Grid (Matches Image 5) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Metric 1: Run Rate */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
            Run Rate
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
            8.45
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">
            Req: <strong className="text-blue-700">9.10</strong>
          </div>
        </div>

        {/* Metric 2: Overs Progress */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
            Overs Progress
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
            14.2 <span className="text-sm font-normal text-slate-400">/ 20</span>
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">
            34 balls left
          </div>
        </div>

        {/* Metric 3: Extras */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
            Extras Given
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
            12
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">
            Wd: 8 • Nb: 2 • Lb: 2
          </div>
        </div>

        {/* Metric 4: Current Partnership */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
            Current Stand
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 font-display">
            45
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">
            from 28 balls (RR 9.6)
          </div>
        </div>
      </div>

      {/* 3. Official Assignments Card (Matches Image 5) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-[#0B57D0]" />
            <h3 className="text-base font-extrabold text-slate-900 font-display">
              Official Assignments
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            ICC Certified
          </span>
        </div>

        {/* Officials List */}
        <div className="space-y-2.5">
          {officials.map((official) => (
            <div
              key={official.id}
              className="p-3 rounded-xl bg-slate-50 border border-slate-150 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={official.avatar}
                  alt={official.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{official.name}</h4>
                  <p className="text-xs text-slate-500 font-medium">{official.role}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                  {official.experience}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Action Buttons */}
      <div className="flex items-center space-x-3 pt-2">
        <button
          onClick={() => navigateTo('scoring')}
          className="flex-1 py-3.5 px-4 bg-[#0B57D0] hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer"
        >
          <span>Return to Scoring</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => navigateTo('scorecard')}
          className="flex-1 py-3.5 px-4 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center transition-all cursor-pointer"
        >
          <span>Scorecard Table</span>
        </button>
      </div>

    </div>
  );
}
