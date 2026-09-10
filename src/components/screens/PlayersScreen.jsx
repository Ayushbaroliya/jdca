import React, { useState } from 'react';
import { Search, ChevronRight, UserPlus, Filter } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';

const JDCA_DISTRICTS = ['All', 'Jabalpur', 'Katni', 'Narsinghpur', 'Seoni', 'Mandla', 'Balaghat', 'Chhindwara', 'Dindori', 'Pandhurna'];
const CATEGORIES = ['All', 'Senior', 'U-22', 'U-18', 'U-15', 'U-13'];

const PlayerListItem = ({ player, onClick }) => (
  <div 
    onClick={onClick}
    className="flex items-center justify-between p-4 bg-white border-b border-gray-100 cursor-pointer active:bg-gray-50 transition-colors"
  >
    <div className="flex items-center gap-3">
      <img
        src={player.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
        alt={player.name}
        className="w-12 h-12 rounded-full object-cover border border-gray-100"
      />
      <div>
        <div className="text-[15px] font-bold text-[#101827]">{player.name}</div>
        <div className="text-[12px] font-medium text-[#596579] mt-0.5">
          {player.role || 'Batter'} • {player.district || 'Jabalpur'}
        </div>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <div className="text-right hidden sm:block">
        <div className="text-[14px] font-black text-[#2457D6]">{player.careerRuns || 0}</div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#8a99b0]">Runs</div>
      </div>
      <ChevronRight size={18} className="text-[#d2d8e2]" />
    </div>
  </div>
);

export default function PlayersScreen() {
  const { players, setSelectedPlayer, navigateTo } = useCricket();

  const [genderTab, setGenderTab] = useState('Men');
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredPlayers = players.filter(p => {
    const isWomen = String(p.category || '').toLowerCase().includes('women');
    if (genderTab === 'Men' && isWomen) return false;
    if (genderTab === 'Women' && !isWomen) return false;

    if (searchQuery) {
      const matchSearch = (p.name || '').toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchSearch) return false;
    }

    if (districtFilter !== 'All' && p.district !== districtFilter) return false;
    
    if (categoryFilter !== 'All') {
      const cat = String(p.category || 'Senior').toLowerCase();
      const f = categoryFilter.toLowerCase().replace('-', '');
      if (!cat.includes(f)) return false;
    }

    return true;
  });

  const handlePlayerClick = (player) => {
    setSelectedPlayer(player);
    navigateTo('player-profile');
  };

  return (
    <div className="pb-[100px] bg-[#F7F8F4] min-h-screen">
      <div className="bg-white sticky top-[60px] z-30 border-b border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-[28px] font-black text-[#101827] tracking-tight leading-none">Players</h1>
            <button 
              onClick={() => navigateTo('player-registration')}
              className="w-10 h-10 rounded-full bg-[#eef2fd] text-[#2457D6] flex items-center justify-center active:bg-blue-100"
            >
              <UserPlus size={20} />
            </button>
          </div>

          <div className="flex bg-gray-100 p-1 rounded-xl mb-4">
            <button
              onClick={() => setGenderTab('Men')}
              className={`flex-1 py-2 rounded-lg text-[13px] font-bold transition-all ${genderTab === 'Men' ? 'bg-white text-[#101827] shadow-sm' : 'text-[#8a99b0]'}`}
            >
              Men
            </button>
            <button
              onClick={() => setGenderTab('Women')}
              className={`flex-1 py-2 rounded-lg text-[13px] font-bold transition-all ${genderTab === 'Women' ? 'bg-white text-[#101827] shadow-sm' : 'text-[#8a99b0]'}`}
            >
              Women
            </button>
          </div>

          <div className="relative mb-4">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a99b0]" />
            <input 
              type="text" 
              placeholder="Search players..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#F7F8F4] rounded-[12px] py-3 pl-10 pr-4 text-[14px] font-medium outline-none focus:ring-2 focus:ring-[#2457D6]/20 border border-transparent focus:border-[#2457D6]/50"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            <select 
              value={districtFilter}
              onChange={e => setDistrictFilter(e.target.value)}
              className="bg-white border border-gray-200 rounded-full px-4 py-1.5 text-[12px] font-bold text-[#101827] outline-none"
            >
              {JDCA_DISTRICTS.map(d => <option key={d} value={d}>{d === 'All' ? 'District' : d}</option>)}
            </select>
            <select 
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="bg-white border border-gray-200 rounded-full px-4 py-1.5 text-[12px] font-bold text-[#101827] outline-none"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c === 'All' ? 'Age Group' : c}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="px-4 pt-6">
        <h2 className="text-[12px] font-black uppercase tracking-widest text-[#596579] mb-3 ml-1">
          {filteredPlayers.length} Players Found
        </h2>
        
        <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          {filteredPlayers.map(p => (
            <PlayerListItem key={p.id} player={p} onClick={() => handlePlayerClick(p)} />
          ))}

          {filteredPlayers.length === 0 && (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Filter size={24} className="text-[#8a99b0]" />
              </div>
              <h3 className="text-[16px] font-bold text-[#101827] mb-1">No players match</h3>
              <p className="text-[13px] text-[#8a99b0]">Try adjusting your filters or search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
