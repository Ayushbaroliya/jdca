import React, { useState } from 'react';
import { 
  ArrowLeft, Star, MapPin, Award, Activity, TrendingUp, Sliders
} from 'lucide-react';
import { useCricket } from '../../context/CricketContext';

// Simple tab bar for the profile
const ProfileTabs = ({ tabs, active, onChange }) => (
  <div className="flex bg-gray-100 p-1 rounded-xl mb-4 mx-4">
    {tabs.map(tab => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={`flex-1 py-2 rounded-lg text-[13px] font-bold transition-all ${active === tab.id ? 'bg-white text-[#101827] shadow-sm' : 'text-[#8a99b0]'}`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export default function PlayerProfileScreen() {
  const { selectedPlayer, goBack, shortlistedIds, toggleShortlist } = useCricket();
  const [activeTab, setActiveTab] = useState('Overview');

  const player = selectedPlayer || {
    id: 'rohan-sharma',
    name: 'Rohan Sharma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    team: 'Jabalpur Kings XI',
    role: 'Batter',
    battingStyle: 'Right-Hand Batter',
    bowlingStyle: 'Right-Arm Off Break',
    category: 'Senior',
    district: 'Jabalpur',
    careerRuns: 4258,
    battingAvg: 42.5,
    strikeRate: 145.2,
    matches: 112,
    fifties: 28,
    hundreds: 6,
    fours: 412,
    sixes: 85,
    wickets: 0,
    awards: ['Best Batter 2023-24', 'POTM - District Final'],
  };

  const isShortlisted = shortlistedIds?.includes(player.id);

  const tabs = [
    { id: 'Overview', label: 'Stats' },
    { id: 'Batting', label: 'Batting' },
    { id: 'Bowling', label: 'Bowling' },
    { id: 'Selection', label: 'History' },
  ];

  return (
    <div className="pb-[100px] bg-[#F7F8F4] min-h-screen">
      
      {/* Header Area */}
      <div className="bg-white border-b border-gray-100 pt-[60px] pb-6 px-4 relative">
        <button
          onClick={goBack}
          className="absolute top-4 left-4 w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-[#101827] active:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>

        <button
          onClick={() => toggleShortlist(player.id)}
          className={`absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
            isShortlisted ? 'bg-amber-50 text-[#ff6100]' : 'bg-gray-50 text-[#8a99b0]'
          }`}
        >
          <Star size={20} strokeWidth={2.5} fill={isShortlisted ? '#ff6100' : 'none'} />
        </button>

        <div className="flex flex-col items-center mt-6 text-center">
          <img
            src={player.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
            alt={player.name}
            className="w-24 h-24 rounded-full object-cover border-[3px] border-white shadow-md mb-4"
          />
          <h1 className="text-[24px] font-black text-[#101827] leading-tight mb-1">{player.name}</h1>
          <div className="text-[13px] font-medium text-[#596579] flex items-center justify-center gap-1.5 mb-3">
            <span>{player.role}</span>
            <span>•</span>
            <MapPin size={12} className="text-[#2457D6]" />
            <span>{player.district}</span>
          </div>

          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full bg-[#eef2fd] text-[#2457D6] text-[11px] font-bold uppercase tracking-wider">{player.category || 'Senior'}</span>
            <span className="px-3 py-1 rounded-full bg-[#e8f8ef] text-[#0FA968] text-[11px] font-bold uppercase tracking-wider">Registered</span>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <ProfileTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
      </div>

      {/* Content Area */}
      <div className="px-4 pb-8 space-y-4">

        {/* â”€â”€ TAB 1: OVERVIEW â”€â”€ */}
        {activeTab === 'Overview' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-[16px] p-4 border border-gray-100 shadow-sm">
                <div className="text-[28px] font-black text-[#2457D6]">{player.careerRuns || 0}</div>
                <div className="text-[12px] font-bold text-[#8a99b0] uppercase tracking-wider mt-1">Runs</div>
              </div>
              <div className="bg-white rounded-[16px] p-4 border border-gray-100 shadow-sm">
                <div className="text-[28px] font-black text-[#101827]">{player.battingAvg ? player.battingAvg.toFixed(1) : '-'}</div>
                <div className="text-[12px] font-bold text-[#8a99b0] uppercase tracking-wider mt-1">Average</div>
              </div>
              <div className="bg-white rounded-[16px] p-4 border border-gray-100 shadow-sm">
                <div className="text-[28px] font-black text-[#101827]">{player.strikeRate || '-'}</div>
                <div className="text-[12px] font-bold text-[#8a99b0] uppercase tracking-wider mt-1">Strike Rate</div>
              </div>
              <div className="bg-white rounded-[16px] p-4 border border-gray-100 shadow-sm">
                <div className="text-[28px] font-black text-[#F05A47]">{player.wickets ?? (player.role === 'Bowler' ? 14 : 0)}</div>
                <div className="text-[12px] font-bold text-[#8a99b0] uppercase tracking-wider mt-1">Wickets</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#ff6100] to-[#b88920] rounded-[16px] p-5 text-white shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <Award size={20} className="text-white/80" />
                <h3 className="font-bold text-[14px] uppercase tracking-wider text-white/80">Distinctions</h3>
              </div>
              <ul className="space-y-3">
                {(player.awards || ['Best District Batter 2024']).map((award, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-white/50 flex-shrink-0" />
                    <span className="font-bold text-[15px]">{award}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* â”€â”€ TAB 2: BATTING â”€â”€ */}
        {activeTab === 'Batting' && (
          <div className="bg-white rounded-[16px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-50 bg-[#F7F8F4]">
              <h3 className="font-bold text-[14px] text-[#101827]">Batting Profile</h3>
              <p className="text-[12px] text-[#596579]">{player.battingStyle || 'Right-Hand Bat'}</p>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4">
               <div>
                  <div className="text-[12px] font-bold text-[#8a99b0] uppercase">Matches</div>
                  <div className="text-[18px] font-black text-[#101827]">{player.matches || 24}</div>
               </div>
               <div>
                  <div className="text-[12px] font-bold text-[#8a99b0] uppercase">Highest Score</div>
                  <div className="text-[18px] font-black text-[#101827]">{player.highScore || '118*'}</div>
               </div>
               <div>
                  <div className="text-[12px] font-bold text-[#8a99b0] uppercase">50s / 100s</div>
                  <div className="text-[18px] font-black text-[#101827]">{player.fifties || 0} / {player.hundreds || 0}</div>
               </div>
               <div>
                  <div className="text-[12px] font-bold text-[#8a99b0] uppercase">4s / 6s</div>
                  <div className="text-[18px] font-black text-[#101827]">{player.fours || 0} / {player.sixes || 0}</div>
               </div>
            </div>
          </div>
        )}

        {/* â”€â”€ TAB 3: BOWLING â”€â”€ */}
        {activeTab === 'Bowling' && (
          <div className="bg-white rounded-[16px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-50 bg-[#F7F8F4]">
              <h3 className="font-bold text-[14px] text-[#101827]">Bowling Profile</h3>
              <p className="text-[12px] text-[#596579]">{player.bowlingStyle || 'Right-Arm Medium'}</p>
            </div>
             <div className="p-4 grid grid-cols-2 gap-4">
               <div>
                  <div className="text-[12px] font-bold text-[#8a99b0] uppercase">Wickets</div>
                  <div className="text-[18px] font-black text-[#F05A47]">{player.wickets || (player.role === 'Bowler' ? 14 : 0)}</div>
               </div>
               <div>
                  <div className="text-[12px] font-bold text-[#8a99b0] uppercase">Economy</div>
                  <div className="text-[18px] font-black text-[#101827]">{player.economy || (player.role === 'Bowler' ? '6.4' : '-')}</div>
               </div>
               <div>
                  <div className="text-[12px] font-bold text-[#8a99b0] uppercase">Best Figures</div>
                  <div className="text-[18px] font-black text-[#101827]">{player.bestBowling || (player.role === 'Bowler' ? '4/18' : '-')}</div>
               </div>
               <div>
                  <div className="text-[12px] font-bold text-[#8a99b0] uppercase">Average</div>
                  <div className="text-[18px] font-black text-[#101827]">{player.average ? player.average.toFixed(1) : '-'}</div>
               </div>
            </div>
          </div>
        )}

        {/* â”€â”€ TAB 4: SELECTION â”€â”€ */}
        {activeTab === 'Selection' && (
          <div className="bg-white rounded-[16px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-50">
              <h3 className="font-bold text-[14px] text-[#101827]">Selection History</h3>
            </div>
            
            <div className="divide-y divide-gray-100">
               <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                     <span className="text-[14px] font-bold text-[#101827]">Senior District Trophy</span>
                     <span className="text-[12px] font-bold text-[#0FA968]">Selected</span>
                  </div>
                  <div className="text-[12px] text-[#596579]">2026 • {player.district} District XI</div>
               </div>
               <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                     <span className="text-[14px] font-bold text-[#101827]">MPCA Inter-District</span>
                     <span className="text-[12px] font-bold text-[#8a99b0]">Played</span>
                  </div>
                  <div className="text-[12px] text-[#596579]">2025 • Jabalpur Division</div>
               </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
