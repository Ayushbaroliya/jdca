import React, { useMemo, useState } from 'react';
import { Plus, Trophy, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';

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

export default function TournamentsScreen() {
  const { matches = [], navigateTo, setActiveMatchId } = useCricket();
  
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
          <button className="whitespace-nowrap px-4 py-2 rounded-full text-[13px] font-bold bg-[#101827] text-white">Current</button>
          <button className="whitespace-nowrap px-4 py-2 rounded-full text-[13px] font-bold bg-[#f0f2f4] text-[#596579]">Completed</button>
        </div>
      </div>

      <div className="px-4 space-y-8">
        {tournaments.map(([name, ms], i) => {
          const completed = ms.filter(m => ['COMPLETED', 'FINISHED'].includes(m.status)).length;
          const progress = Math.round((completed / ms.length) * 100) || 0;

          return (
            <div key={name} className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
              {/* Tournament Header */}
              <div className="bg-gradient-to-r from-[#2457D6] to-[#1b41a8] p-5 text-white">
                <div className="text-[10px] font-bold tracking-widest uppercase text-white/70 mb-1">Season 2026</div>
                <h2 className="text-[20px] font-black leading-tight mb-4">{name}</h2>
                
                <div className="flex items-center gap-6 text-[12px] font-medium text-white/90">
                  <div>
                    <div className="text-[18px] font-black text-white">{ms.length}</div>
                    <div className="text-[10px] uppercase tracking-wider text-white/60">Matches</div>
                  </div>
                  <div>
                    <div className="text-[18px] font-black text-white">{completed}</div>
                    <div className="text-[10px] uppercase tracking-wider text-white/60">Completed</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-5 w-full bg-black/20 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#0FA968] h-full rounded-full" style={{ width: `${progress}%` }} />
                </div>
              </div>

              {/* Match Rows */}
              <div className="p-4">
                <h3 className="text-[12px] font-black uppercase tracking-widest text-[#596579] mb-2">League Stage</h3>
                <div className="flex flex-col">
                  {ms.map((m, idx) => (
                    <TournamentMatchRow key={m.id} match={m} index={idx} onClick={() => openMatch(m)} />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
