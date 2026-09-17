import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  ChevronRight, 
  CheckCircle2, 
  Users, 
  Filter, 
  Award, 
  Download, 
  Save, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import { PageHeader, SectionLabel } from '../ui/PageHeader';
import { Badge } from '../ui/Badge';
import StatCard from '../ui/StatCard';
import { motion, AnimatePresence } from 'motion/react';

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const JDCA_DISTRICTS = [
  'All Districts',
  'Jabalpur',
  'Katni',
  'Narsinghpur',
  'Seoni',
  'Mandla',
  'Balaghat',
  'Chhindwara',
  'Dindori',
  'Pandhurna'
];

const AGE_CATEGORIES = ['Under 14', 'Under 16', 'Under 19', 'Under 23', 'Senior'];
const ROLE_FILTERS = ['All Roles', 'Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper'];

export default function SelectionScreen() {
  const { 
    players = [], 
    shortlistedIds = [], 
    toggleShortlist, 
    setSelectedPlayer, 
    navigateTo 
  } = useCricket();

  const [selectedCategory, setSelectedCategory] = useState('Under 14');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Filter players
  const filteredPlayers = players.filter((player) => {
    const normalizedPlayerCategory = (player.category || '').replace('-', ' ').toLowerCase();
    const normalizedSelectedCategory = selectedCategory.replace('-', ' ').toLowerCase();
    const matchesCategory = normalizedPlayerCategory === normalizedSelectedCategory;

    const matchesDistrict = 
      selectedDistrict === 'All Districts' ? true : player.district === selectedDistrict;

    const matchesRole = 
      selectedRole === 'All Roles' ? true : (player.primaryRole || player.role || '').toLowerCase() === selectedRole.toLowerCase();

    const matchesSearch = 
      (player.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (player.district || '').toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesDistrict && matchesRole && matchesSearch;
  });

  const selectedSquad = players.filter(p => shortlistedIds.includes(p.id));

  // Squad composition breakdown
  const squadComposition = selectedSquad.reduce((acc, p) => {
    const role = (p.primaryRole || p.role || '').toLowerCase();
    if (role.includes('bat')) acc.batsmen += 1;
    else if (role.includes('bowl')) acc.bowlers += 1;
    else if (role.includes('all')) acc.allRounders += 1;
    else if (role.includes('keeper') || role.includes('wk')) acc.wicketKeepers += 1;
    else acc.others += 1;
    return acc;
  }, { batsmen: 0, bowlers: 0, allRounders: 0, wicketKeepers: 0, others: 0 });

  const handlePlayerClick = (player) => {
    if (setSelectedPlayer) setSelectedPlayer(player);
    if (navigateTo) navigateTo('player-profile');
  };

  const handleSaveSquad = () => {
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Toast Notification */}
      {showSavedToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl bg-jade-600 px-4 py-3 text-white shadow-xl animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-semibold">Team selection saved successfully!</span>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        title="Player Selection"
        subtitle="Official Jabalpur District Cricket Association Team Selection"
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveSquad}
              className="inline-flex items-center gap-1.5 rounded-lg bg-cobalt px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-cobalt-700"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Team ({shortlistedIds.length})</span>
            </button>
          </div>
        }
      />

      {/* Selection Metrics Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <StatCard
          label="Total Players"
          value={filteredPlayers.length}
          subtext={`In ${selectedCategory}`}
          icon={Users}
        />
        <StatCard
          label="Selected Players"
          value={shortlistedIds.length}
          subtext="Target team: 15-18"
          tone={shortlistedIds.length >= 15 && shortlistedIds.length <= 18 ? 'success' : 'primary'}
          icon={CheckCircle2}
        />
        <StatCard
          label="Districts Represented"
          value={new Set(selectedSquad.map(p => p.district)).size}
          subtext="Across 9 JDCA districts"
          tone="warning"
          icon={MapPin}
        />
        <StatCard
          label="Pro / High Performance"
          value={selectedSquad.filter(p => p.isPro || p.inForm).length}
          subtext="In-form or pro-rated"
          tone="info"
          icon={Sparkles}
        />
      </div>

      {/* Selected Team Strip if any selected */}
      {shortlistedIds.length > 0 && (
        <div className="jdca-card p-4.5 bg-emerald-50 border-emerald-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-sm font-bold text-ink">
                  Selected Team ({shortlistedIds.length} Players)
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-500">
                <span>Batsmen: <strong className="text-gray-900">{squadComposition.batsmen}</strong></span>
                <span>•</span>
                <span>Bowlers: <strong className="text-gray-900">{squadComposition.bowlers}</strong></span>
                <span>•</span>
                <span>All-Rounders: <strong className="text-gray-900">{squadComposition.allRounders}</strong></span>
                <span>•</span>
                <span>Wicket-Keepers: <strong className="text-gray-900">{squadComposition.wicketKeepers}</strong></span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveSquad}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Confirm & Save Team</span>
            </button>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
            <AnimatePresence mode="popLayout">
              {selectedSquad.map((player) => (
                <motion.div
                  key={player.id}
                  layout
                  initial={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  onClick={() => handlePlayerClick(player)}
                  className="group relative flex flex-col items-center min-w-[72px] cursor-pointer rounded-xl p-2 bg-white/60 backdrop-blur-md border border-emerald-100 shadow-2xs hover:shadow-xs transition"
                >
                  <img
                    src={player.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80`}
                    alt={player.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500 shadow-2xs"
                  />
                  <span className="text-xs font-bold text-gray-900 truncate w-16 text-center mt-1">
                    {player.name ? player.name.split(' ')[0] : 'Player'}
                  </span>
                  <span className="text-[9px] text-gray-400 truncate max-w-[64px]">
                    {player.district}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="jdca-card p-4 space-y-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {AGE_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-cobalt text-white shadow-xs'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-100'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search and Dropdown Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-1">
          <div className="relative sm:col-span-6">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${selectedCategory} players by name or district...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50/70 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-cobalt font-medium text-gray-900"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50/70 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-cobalt font-semibold text-gray-700 cursor-pointer"
            >
              {JDCA_DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50/70 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-cobalt font-semibold text-gray-700 cursor-pointer"
            >
              {ROLE_FILTERS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Player List Grid */}
      <div>
        {filteredPlayers.length === 0 ? (
          <div className="jdca-card p-12 text-center space-y-2">
            <ShieldAlert className="w-8 h-8 text-gray-300 mx-auto" />
            <h4 className="text-sm font-bold text-gray-700">No players found matching your criteria</h4>
            <p className="text-xs text-gray-400">
              Try adjusting your category, district, or role filter to view players.
            </p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredPlayers.map((player) => {
              const isShortlisted = shortlistedIds.includes(player.id);

              return (
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -4 }}
                  key={player.id}
                  className={`jdca-card p-4.5 flex flex-col justify-between transition-all duration-200 ${
                    isShortlisted
                      ? 'border-emerald-300 ring-2 ring-emerald-500/20 bg-emerald-50/40 backdrop-blur-md'
                      : 'hover:border-cobalt-200 hover:shadow-md bg-white/80 backdrop-blur-md'
                  }`}
                >
                  {/* Top: Avatar, Names, Badges */}
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div 
                        onClick={() => handlePlayerClick(player)}
                        className="flex items-center gap-3 cursor-pointer group flex-1 min-w-0"
                      >
                        <div className="relative shrink-0">
                          <img
                            src={player.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80`}
                            alt={player.name}
                            className="w-12 h-12 rounded-xl object-cover border border-gray-200"
                          />
                          {player.isPro && (
                            <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded bg-mango-400 text-ink font-black text-[9px] shadow-2xs">
                              PRO
                            </span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-sm text-gray-900 truncate group-hover:text-cobalt transition">
                              {player.name}
                            </h4>
                            {player.inForm && (
                              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="In Form" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {player.primaryRole || player.role || 'Player'} • {player.battingStyle || 'Right hand'}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                            <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                            <span className="truncate">{player.district || 'Jabalpur'}</span>
                          </div>
                        </div>
                      </div>

                      <Badge
                        variant={isShortlisted ? 'success' : 'neutral'}
                        size="xs"
                      >
                        {isShortlisted ? 'Selected' : 'Candidate'}
                      </Badge>
                    </div>

                    {/* Stats Strip */}
                    <div 
                      onClick={() => handlePlayerClick(player)}
                      className="grid grid-cols-4 gap-2 my-3.5 p-2.5 rounded-lg bg-gray-50/80 border border-gray-100 cursor-pointer text-center"
                    >
                      <div>
                        <span className="text-xs uppercase font-bold text-gray-400 block">
                          RUNS
                        </span>
                        <span className="text-xs font-bold text-gray-900">
                          {player.careerRuns || player.runs || 0}
                        </span>
                      </div>

                      <div>
                        <span className="text-xs uppercase font-bold text-gray-400 block">
                          AVG
                        </span>
                        <span className="text-xs font-bold text-cobalt">
                          {player.battingAvg || player.average || 0}
                        </span>
                      </div>

                      <div>
                        <span className="text-xs uppercase font-bold text-gray-400 block">
                          SR
                        </span>
                        <span className="text-xs font-bold text-gray-900">
                          {player.strikeRate || 0}
                        </span>
                      </div>

                      <div>
                        <span className="text-xs uppercase font-bold text-gray-400 block">
                          HS
                        </span>
                        <span className="text-xs font-bold text-gray-900">
                          {player.highScore || '0'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Selection Action */}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700">
                      {isShortlisted ? 'In Team' : 'Add to Team'}
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleShortlist(player.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        isShortlisted
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-cobalt hover:text-white'
                      }`}
                    >
                      {isShortlisted ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Selected</span>
                        </>
                      ) : (
                        <span>+ Select</span>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
