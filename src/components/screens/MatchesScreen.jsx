import React, { useMemo, useState } from 'react';
import { Plus, Search, CalendarDays, ArrowRight, MapPin } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import { MatchStatusBadge } from '../ui/Badge';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'live', label: 'Live' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
];

const MatchListItem = ({ match, onClick }) => {
  const isLive = match.status === 'LIVE' || match.status === 'IN_PROGRESS';
  const isCompleted = match.status === 'COMPLETED' || match.status === 'FINISHED';

  // Determine border color based on status
  let borderStyle = 'border-slate-200';
  let leftAccent = 'border-l-blue-500';
  if (isLive) leftAccent = 'border-l-emerald-500';
  if (isCompleted) leftAccent = 'border-l-slate-400';

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-2xl p-4.5 cursor-pointer relative transition-all duration-300 active:scale-[0.99] border ${borderStyle} border-l-4 ${leftAccent} mb-3 shadow-sm hover:shadow-md`}
    >
      <div className="flex items-center justify-between mb-3 relative z-10">
        <span className={`text-[10px] font-bold tracking-wider uppercase text-slate-500`}>
          {match.tournament || 'JDCA Official Fixtures'}
        </span>
        {isLive ? (
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            LIVE
          </span>
        ) : (
          <span className={`text-[10px] font-bold uppercase tracking-widest ${isCompleted ? 'text-slate-500' : 'text-blue-600'}`}>
            {isCompleted ? 'COMPLETED' : 'UPCOMING'}
          </span>
        )}
      </div>
      
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="text-[16px] font-bold text-slate-900">
            {match.teamA?.name || match.teamA || 'JABALPUR'}
          </div>
          {(isLive || isCompleted) && (
            <div className="text-[18px] font-black text-slate-900">
              {match.teamA?.score || (isLive ? '142/4' : '186/4')}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-[16px] font-bold text-slate-900">
            {match.teamB?.name || match.teamB || 'MANDLA'}
          </div>
          {(isLive || isCompleted) && (
            <div className="text-[18px] font-black text-slate-900">
              {match.teamB?.score || (isLive ? '—' : '184/8')}
            </div>
          )}
        </div>
      </div>
      
      {isCompleted && (
        <div className="mt-3 text-[12px] font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl inline-block border border-slate-100">
          {match.result || 'Jabalpur won by 6 wickets'}
        </div>
      )}

      {isLive && (
        <div className="mt-2 text-[12px] font-semibold text-slate-500">
          {match.teamA?.overs || '24.2'} overs · {match.format || '40'} overs match
        </div>
      )}
      
      <div className="mt-4 pt-3 flex items-center justify-between text-[11px] font-medium border-t border-slate-100 text-slate-500">
        <div className="flex items-center gap-1.5">
          <MapPin size={12} />
          {match.venue || 'Ranital Cricket Ground'}
        </div>
        <div className="flex items-center gap-1 uppercase tracking-wide font-bold text-blue-600">
          VIEW MATCH
          <ArrowRight size={14} />
        </div>
      </div>
    </div>
  );
};

export default function MatchesScreen() {
  const { matches = [], navigateTo, setActiveMatchId } = useCricket();
  const [activeTab, setActiveTab] = useState('all');

  const filtered = useMemo(() => matches.filter(m => {
    const status = String(m.status || '').toUpperCase();
    const live = status === 'LIVE' || status === 'IN_PROGRESS';
    const upcoming = status === 'UPCOMING' || status === 'SCHEDULED';
    const completed = status === 'COMPLETED' || status === 'FINISHED';
    
    if (activeTab === 'live') return live;
    if (activeTab === 'upcoming') return upcoming;
    if (activeTab === 'completed') return completed;
    return true;
  }), [matches, activeTab]);

  const openMatch = (match) => {
    setActiveMatchId(match.id);
    navigateTo('match-detail');
  };

  const liveMatches = filtered.filter(m => m.status === 'LIVE' || m.status === 'IN_PROGRESS');
  const upcomingMatches = filtered.filter(m => m.status === 'UPCOMING' || m.status === 'SCHEDULED');
  const completedMatches = filtered.filter(m => m.status === 'COMPLETED' || m.status === 'FINISHED');

  return (
    <div className="pb-[100px] bg-[#F7F8F4] min-h-screen">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-2 border-b border-gray-100 sticky top-[60px] z-30">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-[13px] font-bold transition-colors ${
                activeTab === tab.id 
                  ? 'bg-[#101827] text-white' 
                  : 'bg-[#f0f2f4] text-[#596579] hover:bg-[#e5e8ec]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-6">
        {/* LIVE SECTION */}
        {(activeTab === 'all' || activeTab === 'live') && liveMatches.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[12px] font-black uppercase tracking-widest text-[#596579] mb-3 ml-1">Today</h2>
            {liveMatches.map(match => (
              <MatchListItem key={match.id} match={match} onClick={() => openMatch(match)} />
            ))}
          </div>
        )}

        {/* UPCOMING SECTION */}
        {(activeTab === 'all' || activeTab === 'upcoming') && upcomingMatches.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[12px] font-black uppercase tracking-widest text-[#596579] mb-3 ml-1">Upcoming</h2>
            {upcomingMatches.map(match => (
              <MatchListItem key={match.id} match={match} onClick={() => openMatch(match)} />
            ))}
          </div>
        )}

        {/* COMPLETED SECTION */}
        {(activeTab === 'all' || activeTab === 'completed') && completedMatches.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[12px] font-black uppercase tracking-widest text-[#596579] mb-3 ml-1">Completed</h2>
            {completedMatches.map(match => (
              <MatchListItem key={match.id} match={match} onClick={() => openMatch(match)} />
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-12 px-4 bg-white rounded-[16px] border border-gray-100 mt-4">
            <CalendarDays size={32} className="mx-auto text-[#d2d8e2] mb-3" />
            <h3 className="text-[16px] font-bold text-[#101827] mb-1">No Matches Found</h3>
            <p className="text-[13px] text-[#8a99b0]">No matches match the selected criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
