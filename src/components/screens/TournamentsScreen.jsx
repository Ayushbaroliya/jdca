import React, { useMemo, useState } from 'react';
import { Plus, Trophy, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';

const TOURNAMENT_THEMES = [
  {
    header: 'bg-amber-600',
    tag: 'bg-amber-500',
    cardBorder: 'border-slate-200 shadow-sm border-t-4 border-t-amber-500',
    progress: 'bg-amber-500',
    badge: 'bg-white/20',
  },
  {
    header: 'bg-blue-600',
    tag: 'bg-blue-500',
    cardBorder: 'border-slate-200 shadow-sm border-t-4 border-t-blue-500',
    progress: 'bg-blue-500',
    badge: 'bg-white/20',
  },
  {
    header: 'bg-emerald-600',
    tag: 'bg-emerald-500',
    cardBorder: 'border-slate-200 shadow-sm border-t-4 border-t-emerald-500',
    progress: 'bg-emerald-500',
    badge: 'bg-white/20',
  },
  {
    header: 'bg-purple-600',
    tag: 'bg-purple-500',
    cardBorder: 'border-slate-200 shadow-sm border-t-4 border-t-purple-500',
    progress: 'bg-purple-500',
    badge: 'bg-white/20',
  },
  {
    header: 'bg-rose-600',
    tag: 'bg-rose-500',
    cardBorder: 'border-slate-200 shadow-sm border-t-4 border-t-rose-500',
    progress: 'bg-rose-500',
    badge: 'bg-white/20',
  },
];

// Clean match row for tournaments list
const TournamentMatchRow = ({ match, index, onClick }) => {
  const isLive = match.status === 'LIVE' || match.status === 'IN_PROGRESS';
  const isCompleted = match.status === 'COMPLETED' || match.status === 'FINISHED';

  return (
    <div 
      onClick={onClick}
      className="flex items-center justify-between py-3 px-1 border-b border-gray-100 cursor-pointer active:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <span className="text-[12px] font-bold text-[#8a99b0] w-5">{String(index + 1).padStart(2, '0')}</span>
        <div>
          <div className="text-[14px] font-bold text-[#101827]">
            {match.teamA?.name || match.teamA || 'JBP'} <span className="text-[#8a99b0] font-medium mx-1">vs</span> {match.teamB?.name || match.teamB || 'MDL'}
          </div>
          <div className="text-[12px] text-[#596579] mt-0.5">
            {isLive ? (
              <span className="text-[#0FA968] font-bold">LIVE • {match.teamA?.score || '142/4'}</span>
            ) : isCompleted ? (
              <span className="text-[#2457D6] font-bold">{match.result || 'JBP won'}</span>
            ) : (
              <span>{match.date || 'Tomorrow'}</span>
            )}
          </div>
        </div>
      </div>
      <ChevronRight size={16} className="text-[#d2d8e2]" />
    </div>
  );
};

// Points Table Component
const PointsTableUI = ({ pointsTable }) => {
  if (!pointsTable || pointsTable.length === 0) return <div className="p-4 text-center text-[#8a99b0] text-[13px] font-medium">No standings available yet.</div>;

  return (
    <div className="overflow-x-auto w-full no-scrollbar">
      <table className="w-full text-left border-collapse min-w-[500px]">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-3 px-4 text-[10px] font-bold text-[#8a99b0] uppercase tracking-widest text-left w-6">#</th>
            <th className="py-3 px-2 text-[10px] font-bold text-[#8a99b0] uppercase tracking-widest text-left">Team</th>
            <th className="py-3 px-2 text-[10px] font-bold text-[#8a99b0] uppercase tracking-widest text-center w-8">M</th>
            <th className="py-3 px-2 text-[10px] font-bold text-[#8a99b0] uppercase tracking-widest text-center w-8">W</th>
            <th className="py-3 px-2 text-[10px] font-bold text-[#8a99b0] uppercase tracking-widest text-center w-8">L</th>
            <th className="py-3 px-2 text-[10px] font-bold text-[#8a99b0] uppercase tracking-widest text-center w-12">PTS</th>
            <th className="py-3 px-2 text-[10px] font-bold text-[#8a99b0] uppercase tracking-widest text-center w-16">NRR</th>
            <th className="py-3 px-4 text-[10px] font-bold text-[#8a99b0] uppercase tracking-widest text-right w-24">Form</th>
          </tr>
        </thead>
        <tbody>
          {pointsTable.map((team, idx) => {
            const isQualified = idx < 4;
            const nrrColor = parseFloat(team.nrr) >= 0 ? 'text-[#0FA968]' : 'text-[#F05A47]';
            
            return (
              <tr key={team.short} className="border-b border-gray-100 last:border-0 relative">
                {/* Qualification indicator line */}
                {isQualified && (
                  <td className="absolute left-0 top-0 bottom-0 w-1 bg-[#0FA968]" style={{ height: '100%' }} />
                )}
                
                <td className="py-3 px-4 text-[12px] font-bold text-[#8a99b0] text-left">{idx + 1}</td>
                <td className="py-3 px-2 text-left">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-5 h-5 rounded flex items-center justify-center text-[8px] font-black text-white" 
                      style={{ backgroundColor: team.color }}
                    >
                      {team.short}
                    </div>
                    <span className="text-[13px] font-bold text-[#101827] whitespace-nowrap">{team.team}</span>
                  </div>
                </td>
                <td className="py-3 px-2 text-[13px] text-[#596579] font-medium text-center">{team.m}</td>
                <td className="py-3 px-2 text-[13px] text-[#101827] font-bold text-center">{team.w}</td>
                <td className="py-3 px-2 text-[13px] text-[#596579] font-medium text-center">{team.l}</td>
                <td className="py-3 px-2 text-[14px] text-[#2457D6] font-black text-center">{team.pts}</td>
                <td className={`py-3 px-2 text-[12px] font-bold text-center ${nrrColor}`}>{team.nrr}</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {team.form.slice(-3).map((f, i) => (
                      <span 
                        key={i} 
                        className={`w-4 h-4 rounded-sm flex items-center justify-center text-[8px] font-black text-white ${
                          f === 'W' ? 'bg-[#0FA968]' : f === 'L' ? 'bg-[#F05A47]' : 'bg-[#d2d8e2]'
                        }`}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="p-3 bg-gray-50 text-[10px] font-medium text-[#8a99b0] flex items-center gap-4 border-t border-gray-100">
         <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-[#0FA968] rounded-full"/> Top 4 qualify for Semi-Finals</div>
         <div>NRR = Net Run Rate</div>
      </div>
    </div>
  );
};

export default function TournamentsScreen() {
  const { matches = [], pointsTable = [], navigateTo, setActiveMatchId } = useCricket();
  const [activeTab, setActiveTab] = useState('Matches'); // 'Matches' | 'Standings'
  
  // Group matches by tournament
  const tournaments = useMemo(() => {
    const map = new Map();
    matches.forEach(m => {
      const name = m.tournament || 'JDCA Official Fixtures';
      if (!map.has(name)) map.set(name, []);
      map.get(name).push(m);
    });
    return [...map.entries()];
  }, [matches]);

  const openMatch = (match) => {
    setActiveMatchId(match.id);
    navigateTo('match-detail');
  };

  return (
    <div className="pb-[100px] bg-[#F7F8F4] min-h-screen">
      <div className="pt-6 px-4 pb-4">
        <h1 className="text-[28px] font-black text-[#101827] tracking-tight leading-none mb-4">Tournaments</h1>
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
          <button 
            onClick={() => setActiveTab('Matches')}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-[13px] font-bold transition-colors ${
              activeTab === 'Matches' ? 'bg-[#101827] text-white' : 'bg-white border border-gray-200 text-[#596579]'
            }`}
          >
            Matches
          </button>
          <button 
            onClick={() => setActiveTab('Standings')}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-[13px] font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'Standings' ? 'bg-[#101827] text-white' : 'bg-white border border-gray-200 text-[#596579]'
            }`}
          >
            <Trophy size={14} className={activeTab === 'Standings' ? 'text-white' : 'text-[#ff6100]'} /> Points Table
          </button>
        </div>
      </div>

      <div className="px-4 space-y-8">
        {tournaments.map(([name, ms], i) => {
          const completed = ms.filter(m => ['COMPLETED', 'FINISHED'].includes(m.status)).length;
          const progress = Math.round((completed / ms.length) * 100) || 0;
          const theme = TOURNAMENT_THEMES[i % TOURNAMENT_THEMES.length];

          return (
            <div key={name} className={`bg-white rounded-[22px] shadow-lg border ${theme.cardBorder} overflow-hidden hover:scale-[1.01] transition-all`}>
              {/* Tournament Header */}
              <div className={`${theme.header} p-5 sm:p-6 text-white relative overflow-hidden`}>
                {/* Decorative Elements */}
                <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full border-[16px] border-white/10 pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full border-[12px] border-white/10 pointer-events-none" />
                <div className={`absolute top-0 right-0 w-2 h-full ${theme.tag} pointer-events-none`} />

                <div className="relative z-10">
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black tracking-widest uppercase text-white mb-2 border border-white/20 backdrop-blur-xs">
                    Season 2026 • Official JDCA
                  </div>
                  <h2 className="text-[22px] sm:text-[24px] font-black leading-tight mb-4 tracking-tight drop-shadow-sm">{name}</h2>
                  
                  <div className="flex items-center gap-6 text-[12px] font-medium text-white/95">
                    <div className="bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                      <div className="text-[20px] font-black text-white leading-none">{ms.length}</div>
                      <div className="text-[10px] uppercase font-bold tracking-wider text-white/80 mt-1">Total Matches</div>
                    </div>
                    <div className="bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                      <div className="text-[20px] font-black text-white leading-none">{completed}</div>
                      <div className="text-[10px] uppercase font-bold tracking-wider text-white/80 mt-1">Completed</div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-5 w-full bg-black/25 rounded-full h-2 overflow-hidden border border-white/10">
                    <div className={`${theme.progress} h-full rounded-full transition-all duration-500`} style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </div>

              {/* Dynamic Content: Matches OR Standings */}
              {activeTab === 'Standings' ? (
                <PointsTableUI pointsTable={pointsTable} />
              ) : (
                <div className="p-4">
                  <h3 className="text-[12px] font-black uppercase tracking-widest text-[#596579] mb-2">League Stage</h3>
                  <div className="flex flex-col">
                    {ms.map((m, idx) => (
                      <TournamentMatchRow key={m.id} match={m} index={idx} onClick={() => openMatch(m)} />
                    ))}
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
}
