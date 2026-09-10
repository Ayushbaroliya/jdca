import React from 'react';
import {
  Users, Trophy, MapPin, Radio, Calendar, Plus,
  TrendingUp, ArrowRight, Megaphone, AlertCircle, ChevronRight, Activity, Award
} from 'lucide-react';
import { useCricket } from '../../context/CricketContext';

// Helper component for match cards
const MatchCard = ({ match, type = 'live', onClick }) => {
  const isLive = type === 'live';
  return (
    <div 
      onClick={onClick}
      className={`rounded-[16px] p-4 cursor-pointer relative overflow-hidden transition-transform active:scale-[0.98] ${
        isLive ? 'bg-gradient-to-br from-[#2457D6] to-[#1b41a8] text-white shadow-md' : 'bg-white border border-gray-100 shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className={`text-[10px] font-bold tracking-wider uppercase ${isLive ? 'text-white/80' : 'text-[#8a99b0]'}`}>
          {match.tournament || 'JDCA Senior Division'}
        </span>
        {isLive && (
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0FA968] animate-pulse" />
            LIVE
          </span>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className={`text-[18px] font-bold ${isLive ? 'text-white' : 'text-[#101827]'}`}>
            {match.teamA?.name || match.teamA || 'JABALPUR'}
          </div>
          {isLive && (
            <div className="text-[20px] font-black tracking-tight mt-0.5">
              {match.teamA?.score || '142/4'} <span className="text-[12px] font-medium text-white/80 tracking-normal ml-1">({match.teamA?.overs || '24.2'} ov)</span>
            </div>
          )}
        </div>
        <div className={`text-[11px] font-black uppercase tracking-widest px-3 ${isLive ? 'text-white/50' : 'text-[#d2d8e2]'}`}>VS</div>
        <div className="flex-1 text-right">
          <div className={`text-[18px] font-bold ${isLive ? 'text-white' : 'text-[#101827]'}`}>
            {match.teamB?.name || match.teamB || 'MANDLA'}
          </div>
          {isLive && (
            <div className="text-[13px] font-medium text-white/60 mt-1">
              Yet to bat
            </div>
          )}
        </div>
      </div>
      
      <div className={`mt-4 pt-3 flex items-center justify-between text-[11px] font-medium ${isLive ? 'border-t border-white/10 text-white/80' : 'border-t border-gray-100 text-[#8a99b0]'}`}>
        <div className="flex items-center gap-1.5">
          <MapPin size={12} />
          {match.venue || 'Ranital Cricket Ground'}
        </div>
        <div className="flex items-center gap-1 uppercase tracking-wide font-bold">
          {isLive ? 'View Match' : 'Match Details'}
          <ArrowRight size={14} />
        </div>
      </div>
    </div>
  );
};

export default function HomeScreen() {
  const { matches, navigateTo, setActiveMatchId, userRole } = useCricket();

  const liveMatches = matches.filter(m => m.status === 'LIVE' || m.status === 'IN_PROGRESS');
  const upcomingMatches = matches.filter(m => m.status === 'UPCOMING' || m.status === 'SCHEDULED').slice(0, 3);
  const recentMatches = matches.filter(m => m.status === 'COMPLETED' || m.status === 'FINISHED').slice(0, 3);

  // --------------------------------------------------------
  // ADMIN HOME
  // --------------------------------------------------------
  const renderAdminHome = () => (
    <div className="pb-[100px] bg-[#F7F8F4] min-h-screen">
      {/* Header Area */}
      <div className="pt-6 px-4 pb-6">
        <p className="text-[13px] text-[#596579] font-medium mb-1">Good morning</p>
        <h1 className="text-[28px] font-black text-[#101827] tracking-tight leading-none">JDCA Administration</h1>
        
        <div className="mt-4 flex gap-2">
          <div className="bg-white border border-gray-200 rounded-full px-3 py-1.5 text-[12px] font-bold text-[#101827] flex items-center gap-2 shadow-sm">
            Season 2026 <ChevronRight size={14} className="text-[#8a99b0]" />
          </div>
        </div>
      </div>

      {/* Live Matches Hero */}
      {liveMatches.length > 0 && (
        <div className="px-4 mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[14px] font-bold uppercase tracking-wider text-[#596579]">Live Matches</h2>
          </div>
          <div className="space-y-4">
            {liveMatches.map(match => (
              <MatchCard 
                key={match.id} 
                match={match} 
                type="live" 
                onClick={() => { setActiveMatchId(match.id); navigateTo('scoring'); }} 
              />
            ))}
          </div>
        </div>
      )}

      {/* Requires Attention */}
      <div className="px-4 mb-8">
        <h2 className="text-[14px] font-bold uppercase tracking-wider text-[#596579] mb-3">Requires Attention</h2>
        <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#fef0ee] text-[#F05A47] flex items-center justify-center">
              <Users size={16} />
            </div>
            <div className="flex-1">
              <div className="text-[14px] font-bold text-[#101827]">3 Player Registrations</div>
              <div className="text-[12px] text-[#8a99b0]">Awaiting district approval</div>
            </div>
            <ArrowRight size={16} className="text-[#d2d8e2]" />
          </div>
          <div className="p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#fef9ea] text-[#F4B942] flex items-center justify-center">
              <AlertCircle size={16} />
            </div>
            <div className="flex-1">
              <div className="text-[14px] font-bold text-[#101827]">2 Matches Unassigned</div>
              <div className="text-[12px] text-[#8a99b0]">Scorers needed for tomorrow</div>
            </div>
            <ArrowRight size={16} className="text-[#d2d8e2]" />
          </div>
        </div>
      </div>

      {/* Today's Matches */}
      {upcomingMatches.length > 0 && (
        <div className="px-4 mb-8">
          <h2 className="text-[14px] font-bold uppercase tracking-wider text-[#596579] mb-3">Today's Matches</h2>
          <div className="space-y-3">
            {upcomingMatches.map(match => (
              <MatchCard key={match.id} match={match} type="upcoming" onClick={() => {}} />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // --------------------------------------------------------
  // SCORER HOME
  // --------------------------------------------------------
  const renderScorerHome = () => (
    <div className="pb-[100px] bg-[#F7F8F4] min-h-screen">
      <div className="pt-6 px-4 pb-6">
        <p className="text-[13px] text-[#596579] font-medium mb-1">Good morning</p>
        <h1 className="text-[28px] font-black text-[#101827] tracking-tight leading-none">Scoring Desk</h1>
      </div>

      {/* Primary Hero - Next Match */}
      <div className="px-4 mb-8">
        <h2 className="text-[14px] font-bold uppercase tracking-wider text-[#596579] mb-3">Next Match</h2>
        <div className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#0FA968]" />
          <div className="text-[12px] font-bold tracking-wider text-[#8a99b0] uppercase mb-4 mt-2">JDCA Senior Division</div>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="text-[22px] font-black text-[#101827]">JABALPUR</div>
            <div className="text-[12px] font-black text-[#d2d8e2] px-2">VS</div>
            <div className="text-[22px] font-black text-[#101827]">MANDLA</div>
          </div>
          
          <div className="flex items-center justify-center gap-3 text-[12px] font-medium text-[#596579] mb-6">
            <div className="flex items-center gap-1 bg-[#F7F8F4] px-3 py-1.5 rounded-full"><Calendar size={14} /> 10:00 AM</div>
            <div className="flex items-center gap-1 bg-[#F7F8F4] px-3 py-1.5 rounded-full"><MapPin size={14} /> Ranital Ground</div>
          </div>

          <button 
            onClick={() => navigateTo('scoring')}
            className="w-full bg-[#0FA968] text-white rounded-[12px] py-4 font-bold text-[16px] shadow-md active:bg-[#0a7d4e] transition-colors flex items-center justify-center gap-2"
          >
            <Radio size={20} /> START SCORING
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-4 mb-8">
        <h2 className="text-[14px] font-bold uppercase tracking-wider text-[#596579] mb-3">Recent Scoring Activity</h2>
        <div className="space-y-3">
          {recentMatches.map((m, i) => (
             <div key={i} className="bg-white rounded-[12px] p-4 flex items-center justify-between border border-gray-100 shadow-sm">
                <div>
                  <div className="text-[14px] font-bold text-[#101827]">{m.teamA?.name || 'JBP'} vs {m.teamB?.name || 'MDL'}</div>
                  <div className="text-[12px] text-[#8a99b0] mt-1">Synced to cloud • Yesterday</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#e8f8ef] text-[#0FA968] flex items-center justify-center">
                  <Activity size={16} />
                </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );

  // --------------------------------------------------------
  // SELECTOR HOME
  // --------------------------------------------------------
  const renderSelectorHome = () => (
    <div className="pb-[100px] bg-[#F7F8F4] min-h-screen">
      <div className="pt-6 px-4 pb-6">
        <h1 className="text-[28px] font-black text-[#101827] tracking-tight leading-none">Selection Desk</h1>
      </div>

      <div className="px-4 mb-8">
        <h2 className="text-[14px] font-bold uppercase tracking-wider text-[#596579] mb-3">Current Selection</h2>
        <div className="bg-gradient-to-br from-[#101827] to-[#2a3a52] rounded-[20px] p-5 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10" />
          <div className="text-[12px] font-bold tracking-wider text-[#8a99b0] uppercase mb-1">Upcoming Event</div>
          <div className="text-[24px] font-black mb-6">Senior Men<br/>District Trials</div>
          
          <div className="flex gap-2">
            <div className="bg-white/10 rounded-[12px] p-3 flex-1">
              <div className="text-[24px] font-black text-[#F4B942]">45</div>
              <div className="text-[11px] font-medium text-white/70 uppercase tracking-wider">Candidates</div>
            </div>
            <div className="bg-white/10 rounded-[12px] p-3 flex-1">
              <div className="text-[24px] font-black text-[#14c77e]">12</div>
              <div className="text-[11px] font-medium text-white/70 uppercase tracking-wider">Shortlisted</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 mb-8">
        <h2 className="text-[14px] font-bold uppercase tracking-wider text-[#596579] mb-3">Top Performers</h2>
        <div className="space-y-3">
          {[1,2,3].map((i) => (
             <div key={i} className="bg-white rounded-[12px] p-4 flex items-center justify-between border border-gray-100 shadow-sm" onClick={() => navigateTo('player-profile')}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500">{i}</div>
                  <div>
                    <div className="text-[15px] font-bold text-[#101827]">Vikram Patel</div>
                    <div className="text-[12px] font-medium text-[#8a99b0]">Batter • Jabalpur</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[15px] font-black text-[#2457D6]">412</div>
                  <div className="text-[10px] uppercase font-bold text-[#8a99b0]">Runs</div>
                </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );

  // --------------------------------------------------------
  // PLAYER HOME
  // --------------------------------------------------------
  const renderPlayerHome = () => (
    <div className="pb-[100px] bg-[#F7F8F4] min-h-screen">
      <div className="pt-6 px-4 pb-6">
        <p className="text-[13px] text-[#596579] font-medium mb-1">Good morning</p>
        <h1 className="text-[28px] font-black text-[#101827] tracking-tight leading-none">My Cricket</h1>
      </div>

      <div className="px-4 mb-8">
        <h2 className="text-[14px] font-bold uppercase tracking-wider text-[#596579] mb-3">Next Match</h2>
        {upcomingMatches.length > 0 ? (
          <MatchCard match={upcomingMatches[0]} type="upcoming" onClick={() => {}} />
        ) : (
          <div className="bg-white rounded-[16px] p-6 text-center border border-gray-100">
            <Calendar className="mx-auto text-[#d2d8e2] mb-3" size={32} />
            <div className="text-[14px] font-bold text-[#101827]">No upcoming matches</div>
            <div className="text-[12px] text-[#8a99b0] mt-1">Enjoy your rest!</div>
          </div>
        )}
      </div>

      <div className="px-4 mb-8">
        <h2 className="text-[14px] font-bold uppercase tracking-wider text-[#596579] mb-3">Season Statistics</h2>
        <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-[16px] p-4 border border-gray-100 shadow-sm">
              <div className="text-[28px] font-black text-[#2457D6]">186</div>
              <div className="text-[12px] font-bold text-[#8a99b0] uppercase tracking-wider mt-1">Runs</div>
            </div>
            <div className="bg-white rounded-[16px] p-4 border border-gray-100 shadow-sm">
              <div className="text-[28px] font-black text-[#101827]">46.5</div>
              <div className="text-[12px] font-bold text-[#8a99b0] uppercase tracking-wider mt-1">Average</div>
            </div>
            <div className="bg-white rounded-[16px] p-4 border border-gray-100 shadow-sm">
              <div className="text-[28px] font-black text-[#101827]">142.1</div>
              <div className="text-[12px] font-bold text-[#8a99b0] uppercase tracking-wider mt-1">Strike Rate</div>
            </div>
            <div className="bg-white rounded-[16px] p-4 border border-gray-100 shadow-sm">
              <div className="text-[28px] font-black text-[#F4B942]">2</div>
              <div className="text-[12px] font-bold text-[#8a99b0] uppercase tracking-wider mt-1">Fifties</div>
            </div>
        </div>
      </div>
    </div>
  );

  // Render based on role
  if (userRole === 'Admin' || userRole === 'SuperAdmin') return renderAdminHome();
  if (userRole === 'Scorer') return renderScorerHome();
  if (userRole === 'Selector') return renderSelectorHome();
  if (userRole === 'Player') return renderPlayerHome();
  
  return renderAdminHome(); // Fallback
}
