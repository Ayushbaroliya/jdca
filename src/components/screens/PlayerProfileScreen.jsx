import React, { useState } from 'react';
import { 
  Award, 
  TrendingUp, 
  MapPin, 
  Share2, 
  ArrowLeft, 
  Star, 
  CheckCircle2, 
  Sparkles,
  Flame,
  BarChart3,
  Sliders
} from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

export default function PlayerProfileScreen() {
  const { selectedPlayer, setCompareModalOpen, goBack } = useCricket();
  const [activeTab, setActiveTab] = useState('Overview');
  const [isFollowing, setIsFollowing] = useState(false);

  const player = selectedPlayer;

  // Pie Chart Data
  const pieData = [
    { name: 'Off Side', value: player.scoringAreas?.offSide || 25, color: '#0B57D0' },
    { name: 'Leg Side', value: player.scoringAreas?.legSide || 25, color: '#F59E0B' },
    { name: 'Behind Sq', value: player.scoringAreas?.behindSquare || 25, color: '#9333EA' },
    { name: 'Fine', value: player.scoringAreas?.fine || 25, color: '#10B981' },
  ];

  return (
    <div className="min-h-[calc(100vh-120px)] bg-slate-100/60 pb-20 px-3.5 pt-3 max-w-xl mx-auto space-y-3.5 animate-in fade-in duration-200">
      
      {/* 1. Profile Hero Card (Matches Image 1 & 9) */}
      <div className="rounded-3xl bg-[#0B2545] text-white p-5 sm:p-6 shadow-xl relative overflow-hidden dot-pattern">
        {/* Decorative ambient blur */}
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-start space-x-4">
          {/* Avatar with PRO badge */}
          <div className="relative">
            <img
              src={player.avatar}
              alt={player.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-white/20 shadow-md"
            />
            {player.isPro && (
              <span className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[10px] shadow-sm">
                PRO
              </span>
            )}
          </div>

          {/* Info & Badges */}
          <div className="flex-1">
            <div className="flex items-center space-x-1.5">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display">
                {player.name}
              </h2>
              <CheckCircle2 className="w-4 h-4 text-blue-400 inline" />
            </div>

            <p className="text-xs text-blue-200 font-medium mt-0.5">
              {player.battingStyle} • {player.team}
            </p>

            {/* Tag Pills */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {player.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-white/10 text-white text-[10px] font-bold border border-white/15"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Actions: Follow & Compare */}
            <div className="flex items-center space-x-2 mt-3.5">
              <button
                type="button"
                onClick={() => setIsFollowing(!isFollowing)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isFollowing
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#0B57D0] hover:bg-blue-600 text-white shadow-sm'
                }`}
              >
                {isFollowing ? '✓ Following' : '+ Follow'}
              </button>

              <button
                type="button"
                onClick={() => setCompareModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white/15 hover:bg-white/25 text-white border border-white/20 transition-all cursor-pointer flex items-center gap-1"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Compare</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Career Runs Big Banner (Matches Image 1 & 9) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            CAREER RUNS
          </span>
          <div className="text-3xl sm:text-4xl font-black text-[#0B57D0] font-display mt-0.5">
            {player.careerRuns.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 font-medium">Across all sanctioned formats</p>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 text-2xl shadow-2xs">
          <Flame className="w-8 h-8 fill-amber-400 text-amber-500" />
        </div>
      </div>

      {/* 3. Primary 4-Stats Grid (Matches Image 1 & 9) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Batting Avg
          </span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            {player.battingAvg}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Strike Rate
          </span>
          <span className="text-2xl font-black text-blue-700 mt-1 block">
            {player.strikeRate}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            High Score
          </span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            {player.highScore}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Matches
          </span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            {player.matches}
          </span>
        </div>
      </div>

      {/* 4. Runs in Last 5 Matches (Interactive Bar Chart - Matches Image 1) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Runs in Last 5 Matches
          </h3>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
            In Prime Form
          </span>
        </div>

        {/* Recharts Bar Graph */}
        <div className="h-48 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={player.last5Matches || []}>
              <XAxis 
                dataKey="opponent" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }}
                dy={10}
              />
              <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar 
                dataKey="runs" 
                radius={[6, 6, 0, 0]}
                barSize={32}
              >
                {(player.last5Matches || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="url(#colorRuns)" />
                ))}
              </Bar>
              <defs>
                <linearGradient id="colorRuns" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0B57D0" stopOpacity={1}/>
                  <stop offset="95%" stopColor="#60A5FA" stopOpacity={1}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. Scoring Areas / Wagon Wheel Distribution (Matches Image 9) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Scoring Areas & Shot Distribution
        </h3>

        <div className="flex items-center space-x-2">
          {/* Recharts Pie Chart */}
          <div className="h-40 w-1/2 -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="w-1/2 space-y-3">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] font-bold text-slate-600">{item.name}</span>
                </div>
                <span className="text-[11px] font-black text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Secondary Career Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4">
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="p-2 rounded-xl bg-slate-50">
            <span className="text-[10px] text-slate-400 block font-bold">50s / 100s</span>
            <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">{player.fifties} / {player.hundreds}</span>
          </div>

          <div className="p-2 rounded-xl bg-slate-50">
            <span className="text-[10px] text-slate-400 block font-bold">4s / 6s</span>
            <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">{player.fours} / {player.sixes}</span>
          </div>

          <div className="p-2 rounded-xl bg-slate-50">
            <span className="text-[10px] text-slate-400 block font-bold">Innings</span>
            <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">{player.innings}</span>
          </div>

          <div className="p-2 rounded-xl bg-slate-50">
            <span className="text-[10px] text-slate-400 block font-bold">Not Outs</span>
            <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">{player.notOuts}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
