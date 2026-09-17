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
import PageHeader from '../ui/PageHeader';
import Badge from '../ui/Badge';

export default function MatchOverviewScreen() {
  const { officials = [], navigateTo, goBack } = useCricket();

  return (
    <div className="space-y-5 pb-20 max-w-5xl mx-auto animate-in fade-in duration-200">
      
      {/* 1. Page Header */}
      <PageHeader
        title="Active Match Overview"
        subtitle="Live statistics, partnership progression, and playing 11 list"
        actions={
          <div className="flex items-center gap-2">
            <span className="badge badge-live inline-flex items-center gap-1.5 px-3 py-1 text-xs">
              <span className="live-dot" />
              LIVE MATCH
            </span>
          </div>
        }
      />

      {/* 2. Key Metrics 4-Column Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Metric 1: Run Rate - Blue */}
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200 border-l-4 border-l-blue-500 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all">
          <span className="text-xs uppercase font-black tracking-wider text-slate-500 block mb-1">
            Run Rate
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-tabular leading-none">
            8.45
          </div>
          <div className="text-xs text-slate-500 font-semibold mt-1.5">
            Req: <strong className="text-blue-600">9.10</strong>
          </div>
        </div>

        {/* Metric 2: Overs Progress - Emerald */}
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200 border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all">
          <span className="text-xs uppercase font-black tracking-wider text-slate-500 block mb-1">
            Overs Progress
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-tabular leading-none">
            14.2 <span className="text-sm font-bold text-slate-400">/ 20</span>
          </div>
          <div className="text-xs text-slate-500 font-semibold mt-1.5">
            34 balls left
          </div>
        </div>

        {/* Metric 3: Extras - Amber */}
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200 border-l-4 border-l-amber-500 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all">
          <span className="text-xs uppercase font-black tracking-wider text-slate-500 block mb-1">
            Extras Given
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-tabular leading-none">
            12
          </div>
          <div className="text-xs text-slate-500 font-semibold mt-1.5">
            Wd: 8 • Nb: 2 • Lb: 2
          </div>
        </div>

        {/* Metric 4: Current Partnership - Purple */}
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200 border-l-4 border-l-purple-500 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all">
          <span className="text-xs uppercase font-black tracking-wider text-slate-500 block mb-1">
            Current Stand
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-tabular leading-none">
            45
          </div>
          <div className="text-xs text-slate-500 font-semibold mt-1.5">
            from 28 balls (RR 9.6)
          </div>
        </div>
      </div>

      {/* 3. Official Assignments Card */}
      <div className="jdca-card p-5 space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-cobalt" />
            <h3 className="text-base font-bold text-ink">
              Official Assignments & Match Observers
            </h3>
          </div>
          <Badge variant="upcoming">MPCA / JDCA Certified</Badge>
        </div>

        {/* Officials List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {officials.map((official) => (
            <div
              key={official.id}
              className="p-3.5 rounded-xl bg-gray-50/70 border border-gray-150 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={official.avatar}
                  alt={official.name}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-2xs"
                />
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{official.name}</h4>
                  <p className="text-xs text-gray-500 font-medium">{official.role}</p>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-md bg-cobalt-50 text-cobalt text-xs font-bold">
                {official.experience}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => navigateTo('scoring')}
          className="flex-1 min-w-[180px] py-3 px-4 bg-cobalt hover:bg-cobalt-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-xs transition cursor-pointer"
        >
          <span>Return to Scoring Console</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => navigateTo('scorecard')}
          className="flex-1 min-w-[180px] py-3 px-4 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center transition cursor-pointer"
        >
          <span>Official Scorecard Table</span>
        </button>
      </div>

    </div>
  );
}
