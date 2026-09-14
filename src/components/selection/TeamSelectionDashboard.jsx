import React, { useState } from 'react';
import {
  Users,
  Plus,
  ArrowRight,
  Shield,
  Search,
} from 'lucide-react';
import { TEAM_CATEGORIES } from './selectionData';
import CreateTeamModal from './CreateTeamModal';

export default function TeamSelectionDashboard({
  teams,
  allPlayers,
  onSelectTeam,
  onCreateTeam,
}) {
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredTeams = teams.filter(team => {
    if (categoryFilter !== 'All' && team.category !== categoryFilter && !team.name.includes(categoryFilter)) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return team.name.toLowerCase().includes(q) || team.category.toLowerCase().includes(q) || team.season.includes(q);
    }
    return true;
  });

  const TEAM_CARD_THEMES = [
    { card: 'border-l-blue-500', header: 'bg-white', text: 'text-slate-900', stat: 'bg-blue-50/50 border-blue-100', btn: 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:text-blue-700', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
    { card: 'border-l-amber-500', header: 'bg-white', text: 'text-slate-900', stat: 'bg-amber-50/50 border-amber-100', btn: 'bg-white text-slate-700 border-slate-200 hover:border-amber-300 hover:text-amber-700', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
    { card: 'border-l-emerald-500', header: 'bg-white', text: 'text-slate-900', stat: 'bg-emerald-50/50 border-emerald-100', btn: 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:text-emerald-700', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { card: 'border-l-purple-500', header: 'bg-white', text: 'text-slate-900', stat: 'bg-purple-50/50 border-purple-100', btn: 'bg-white text-slate-700 border-slate-200 hover:border-purple-300 hover:text-purple-700', badge: 'bg-purple-50 text-purple-700 border-purple-200' },
    { card: 'border-l-rose-500', header: 'bg-white', text: 'text-slate-900', stat: 'bg-rose-50/50 border-rose-100', btn: 'bg-white text-slate-700 border-slate-200 hover:border-rose-300 hover:text-rose-700', badge: 'bg-rose-50 text-rose-700 border-rose-200' },
    { card: 'border-l-cyan-500', header: 'bg-white', text: 'text-slate-900', stat: 'bg-cyan-50/50 border-cyan-100', btn: 'bg-white text-slate-700 border-slate-200 hover:border-cyan-300 hover:text-cyan-700', badge: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-y-auto">
      {/* PAGE HEADER */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-8 py-7">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-100/80 text-xs font-semibold rounded-md">
                Official Administration
              </span>
              <span className="text-xs text-slate-400 font-medium">Season 2026</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
              Player Selection & Team Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-normal max-w-2xl leading-relaxed">
              Manage official JDCA district cricket team selections across age categories. Evaluate player eligibility, review previous match performances, and organize balanced team rosters.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition shadow-xs shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Team Selection</span>
          </button>
        </div>
      </div>

      {/* FILTER BAR & SEARCH */}
      <div className="px-4 sm:px-8 py-3.5 bg-white/60 border-b border-slate-200/70 backdrop-blur-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
            <button
              onClick={() => setCategoryFilter('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap cursor-pointer ${
                categoryFilter === 'All'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              All Teams ({teams.length})
            </button>
            {TEAM_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.name)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap cursor-pointer ${
                  categoryFilter === cat.name
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search team selection..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 text-slate-800 placeholder-slate-400 transition"
            />
          </div>
        </div>
      </div>

      {/* TEAMS GRID */}
      <div className="p-4 sm:p-8 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTeams.map((team, idx) => {
            const selectedCount = (team.selectedPlayerIds || []).length;
            const shortlistedCount = (team.shortlistedPlayerIds || []).length;
            const targetSize = team.targetSize || 15;
            const t = TEAM_CARD_THEMES[idx % TEAM_CARD_THEMES.length];

            return (
              <div
                key={team.id}
                className={`rounded-xl border border-slate-200 border-l-4 ${t.card} bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between group`}
              >
                {/* Header */}
                <div className={`${t.header} p-4 pb-2 border-b border-slate-100`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 border rounded uppercase tracking-wide ${t.badge}`}>
                          {team.season} • {team.category}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {team.gender}
                        </span>
                      </div>
                      <h2 className={`text-base font-semibold ${t.text} pt-0.5`}>
                        {team.name}
                      </h2>
                    </div>

                    <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                      <Shield className="w-4.5 h-4.5" />
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3 flex-1">
                  {/* Stats Row */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className={`${t.stat} border p-2.5 rounded-lg`}>
                      <div className="text-[11px] font-medium text-slate-500">Selected</div>
                      <div className="text-base font-semibold text-slate-900 mt-0.5 flex items-baseline gap-1">
                        <span className={selectedCount > 0 ? 'text-emerald-700' : 'text-slate-900'}>{selectedCount}</span>
                        <span className="text-xs font-normal text-slate-400">/ {targetSize} Target</span>
                      </div>
                    </div>

                    <div className={`${t.stat} border p-2.5 rounded-lg`}>
                      <div className="text-[11px] font-medium text-slate-500">Shortlisted</div>
                      <div className="text-base font-semibold text-blue-700 mt-0.5">
                        {shortlistedCount} <span className="text-xs font-normal text-slate-400">Players</span>
                      </div>
                    </div>
                  </div>

                  {/* Roles Summary */}
                  <div className="text-xs text-slate-500 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Captain:</span>
                      <span className="font-medium text-slate-700">
                        {team.roles?.captainId ? allPlayers.find(p => p.id === team.roles.captainId)?.name || 'Assigned' : 'Not Assigned'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Wicketkeeper:</span>
                      <span className="font-medium text-slate-700">
                        {team.roles?.wicketkeeperId ? allPlayers.find(p => p.id === team.roles.wicketkeeperId)?.name || 'Assigned' : 'Not Assigned'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Open Action */}
                <div className="px-4 pb-4">
                  <button
                    type="button"
                    onClick={() => onSelectTeam(team.id)}
                    className={`w-full py-2 px-3.5 border ${t.btn} rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer`}
                  >
                    <span>Open Selection Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTeams.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center space-y-2">
            <Shield className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-800">No Team Selections Found</h3>
            <p className="text-xs text-slate-500">Create a new team selection process using the button above.</p>
          </div>
        )}
      </div>

      {/* CREATE TEAM MODAL */}
      <CreateTeamModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTeam={onCreateTeam}
      />
    </div>
  );
}
