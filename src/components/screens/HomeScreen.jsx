import React from 'react';
import {
  Users, Trophy, MapPin, Radio, Calendar, Plus,
  TrendingUp, ArrowRight, Megaphone, AlertCircle, ChevronRight, Activity, Award
} from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import { motion } from 'motion/react';

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
};

// Compact widget for matches on home screen
const CompactMatchWidget = ({ match, type = 'live', onClick }) => {
  const isLive = type === 'live';
  return (
    <motion.div 
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`rounded-xl p-3 cursor-pointer flex items-center justify-between border shadow-sm transition-colors ${
        isLive ? 'bg-gradient-to-r from-[#2457D6]/10 to-transparent border-[#2457D6]/30 hover:border-[#2457D6]' : 'bg-white border-gray-200 hover:border-[#ff6100]'
      }`}
    >
      <div className="flex items-center gap-3">
        {isLive ? (
          <div className="w-8 h-8 rounded-full bg-[#2457D6]/10 text-[#2457D6] flex items-center justify-center relative">
            <Radio size={14} />
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#0FA968] animate-pulse" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center">
            <Calendar size={14} />
          </div>
        )}
        <div>
          <div className="text-[13px] font-bold text-[#101827]">
            {match.teamA?.name || match.teamA || 'JABALPUR'} <span className="text-gray-400 font-normal mx-1">vs</span> {match.teamB?.name || match.teamB || 'MANDLA'}
          </div>
          <div className="text-[11px] font-medium text-[#8a99b0]">
            {isLive ? 'Live Score: ' + (match.teamA?.score || '0/0') : 'Upcoming • ' + (match.venue || 'Ranital Ground')}
          </div>
        </div>
      </div>
      <ChevronRight size={16} className={isLive ? 'text-[#2457D6]' : 'text-[#d2d8e2]'} />
    </motion.div>
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
          <motion.div 
            className="space-y-4"
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            {liveMatches.map(match => (
              <CompactMatchWidget 
                key={match.id} 
                match={match} 
                type="live" 
                onClick={() => { setActiveMatchId(match.id); navigateTo('scoring'); }} 
              />
            ))}
          </motion.div>
        </div>
      )}

      {/* Requires Attention */}
      <div className="px-4 mb-8">
        <h2 className="text-[14px] font-bold uppercase tracking-wider text-[#596579] mb-3">Requires Attention</h2>
        <motion.div 
          className="bg-white rounded-[16px] shadow-sm border border-gray-200 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="p-4 border-b border-gray-50 flex items-center gap-3 hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-full bg-[#fef0ee] text-[#F05A47] flex items-center justify-center">
              <Users size={16} />
            </div>
            <div className="flex-1">
              <div className="text-[14px] font-bold text-[#101827]">3 Player Registrations</div>
              <div className="text-[12px] text-[#8a99b0]">Awaiting district approval</div>
            </div>
            <ArrowRight size={16} className="text-[#d2d8e2]" />
          </div>
          <div className="p-4 flex items-center gap-3 hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-full bg-[#fef9ea] text-[#ff6100] flex items-center justify-center">
              <AlertCircle size={16} />
            </div>
            <div className="flex-1">
              <div className="text-[14px] font-bold text-[#101827]">2 Matches Unassigned</div>
              <div className="text-[12px] text-[#8a99b0]">Scorers needed for tomorrow</div>
            </div>
            <ArrowRight size={16} className="text-[#d2d8e2]" />
          </div>
        </motion.div>
      </div>

      {/* Today's Matches */}
      {upcomingMatches.length > 0 && (
        <div className="px-4 mb-8">
          <h2 className="text-[14px] font-bold uppercase tracking-wider text-[#596579] mb-3">Today's Matches</h2>
          <motion.div 
            className="space-y-3"
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            {upcomingMatches.map(match => (
              <CompactMatchWidget key={match.id} match={match} type="upcoming" onClick={() => {}} />
            ))}
          </motion.div>
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
        <h2 className="text-[14px] font-bold uppercase tracking-wider text-[#596579] mb-3">Next Assignment</h2>
        <motion.div 
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[14px] font-bold text-[#101827]">JABALPUR vs MANDLA</div>
              <div className="text-[12px] font-medium text-[#596579]">Today • 10:00 AM • Ranital Ground</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#0FA968]/10 text-[#0FA968] flex items-center justify-center">
              <Radio size={18} />
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigateTo('scoring')}
            className="w-full bg-[#0FA968] text-white rounded-[10px] py-3 font-bold text-[14px] shadow-sm active:bg-[#0a7d4e] transition-colors flex items-center justify-center gap-2"
          >
            START SCORING
          </motion.button>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="px-4 mb-8">
        <h2 className="text-[14px] font-bold uppercase tracking-wider text-[#596579] mb-3">Recent Scoring Activity</h2>
        <motion.div className="space-y-3" variants={listVariants} initial="hidden" animate="visible">
          {recentMatches.map((m, i) => (
             <motion.div variants={itemVariants} key={i} className="bg-white rounded-[12px] p-4 flex items-center justify-between border border-gray-200 shadow-sm">
                <div>
                  <div className="text-[14px] font-bold text-[#101827]">{m.teamA?.name || 'JBP'} vs {m.teamB?.name || 'MDL'}</div>
                  <div className="text-[12px] text-[#8a99b0] mt-1">Synced to cloud • Yesterday</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#e8f8ef] text-[#0FA968] flex items-center justify-center">
                  <Activity size={16} />
                </div>
             </motion.div>
          ))}
        </motion.div>
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
        <motion.div 
          className="bg-gradient-to-br from-[#101827] to-[#2a3a52] rounded-[20px] p-5 text-white shadow-lg relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10" />
          <div className="text-[12px] font-bold tracking-wider text-[#8a99b0] uppercase mb-1">Upcoming Event</div>
          <div className="text-[24px] font-black mb-6">Senior Men<br/>District Trials</div>
          
          <div className="flex gap-2">
            <div className="bg-white/10 rounded-[12px] p-3 flex-1">
              <div className="text-[24px] font-black text-[#ff6100]">45</div>
              <div className="text-[11px] font-medium text-white/70 uppercase tracking-wider">Candidates</div>
            </div>
            <div className="bg-white/10 rounded-[12px] p-3 flex-1">
              <div className="text-[24px] font-black text-[#14c77e]">12</div>
              <div className="text-[11px] font-medium text-white/70 uppercase tracking-wider">Shortlisted</div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="px-4 mb-8">
        <h2 className="text-[14px] font-bold uppercase tracking-wider text-[#596579] mb-3">Top Performers</h2>
        <motion.div className="space-y-3" variants={listVariants} initial="hidden" animate="visible">
          {[1,2,3].map((i) => (
             <motion.div 
                variants={itemVariants} 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }} 
                key={i} 
                className="bg-white rounded-[12px] p-4 flex items-center justify-between border border-gray-200 hover:border-[#ff6100] cursor-pointer shadow-sm transition-colors" 
                onClick={() => navigateTo('player-profile')}
             >
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
             </motion.div>
          ))}
        </motion.div>
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
          <CompactMatchWidget match={upcomingMatches[0]} type="upcoming" onClick={() => {}} />
        ) : (
          <motion.div 
            className="bg-white rounded-[16px] p-6 text-center border border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Calendar className="mx-auto text-[#d2d8e2] mb-3" size={32} />
            <div className="text-[14px] font-bold text-[#101827]">No upcoming matches</div>
            <div className="text-[12px] text-[#8a99b0] mt-1">Enjoy your rest!</div>
          </motion.div>
        )}
      </div>

      <div className="px-4 mb-8">
        <h2 className="text-[14px] font-bold uppercase tracking-wider text-[#596579] mb-3">Season Statistics</h2>
        <motion.div 
          className="grid grid-cols-2 gap-3"
          variants={listVariants}
          initial="hidden"
          animate="visible"
        >
            <motion.div variants={itemVariants} className="bg-white rounded-[16px] p-4 border border-gray-200 shadow-sm">
              <div className="text-[28px] font-black text-[#2457D6]">186</div>
              <div className="text-[12px] font-bold text-[#8a99b0] uppercase tracking-wider mt-1">Runs</div>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-white rounded-[16px] p-4 border border-gray-200 shadow-sm">
              <div className="text-[28px] font-black text-[#101827]">46.5</div>
              <div className="text-[12px] font-bold text-[#8a99b0] uppercase tracking-wider mt-1">Average</div>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-white rounded-[16px] p-4 border border-gray-200 shadow-sm">
              <div className="text-[28px] font-black text-[#101827]">142.1</div>
              <div className="text-[12px] font-bold text-[#8a99b0] uppercase tracking-wider mt-1">Strike Rate</div>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-white rounded-[16px] p-4 border border-gray-200 shadow-sm">
              <div className="text-[28px] font-black text-[#ff6100]">2</div>
              <div className="text-[12px] font-bold text-[#8a99b0] uppercase tracking-wider mt-1">Fifties</div>
            </motion.div>
        </motion.div>
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
