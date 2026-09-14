import React, { useState, useMemo } from 'react';
import { useCricket } from '../../context/CricketContext';
import {
  Users,
  Bookmark,
  Scale,
  Search,
  ArrowLeft,
  CheckCircle2,
  X,
} from 'lucide-react';
import TeamSelectionDashboard from './TeamSelectionDashboard';
import FilterTiles from './FilterTiles';
import PlayerPool from './PlayerPool';
import SelectedTeam from './SelectedTeam';
import PlayerDetail from './PlayerDetail';
import PlayerComparison from './PlayerComparison';
import {
  normalizeSelectionPlayer,
  getAvailableDistricts,
  checkPlayerEligibility,
  INITIAL_OFFICIAL_TEAMS,
} from './selectionData';

export default function SelectionWorkspace() {
  const { players: rawPlayers } = useCricket();

  // Multi-team independent state
  const [teams, setTeams] = useState(INITIAL_OFFICIAL_TEAMS);

  // Active selected team selection ID (null shows the TeamSelectionDashboard)
  const [activeTeamId, setActiveTeamId] = useState(null);

  // Active view inside a team workspace: 'candidates' | 'selected' | 'compare'
  const [activeTab, setActiveTab] = useState('candidates');

  // Currently opened player for right pane / mobile slide-over
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);

  // Active comparison IDs (array of up to 4 player IDs)
  const [compareIds, setCompareIds] = useState([]);

  // Search query in candidate pool
  const [searchQuery, setSearchQuery] = useState('');

  // Local store for player evaluations
  const [evaluationsStore, setEvaluationsStore] = useState({});

  // Filter state
  const [filters, setFilters] = useState({
    district: 'All',
    ageGroup: 'All',
    gender: 'All',
    role: 'All',
    battingStyle: 'All',
    bowlingStyle: 'All',
    eligibility: 'All',
    status: 'All',
  });

  // Active team object
  const activeTeam = useMemo(() => {
    return teams.find(t => t.id === activeTeamId) || null;
  }, [teams, activeTeamId]);

  // Normalize all raw players and attach eligibility relative to the active team
  const normalizedPlayers = useMemo(() => {
    return (rawPlayers || []).map(p => {
      const normalized = normalizeSelectionPlayer(p);
      const eligibility = activeTeam ? checkPlayerEligibility(normalized, activeTeam) : { isEligible: true, status: 'ELIGIBLE', reason: 'Open selection' };
      const evaluations = evaluationsStore[p.id] || normalized.evaluations;

      return {
        ...normalized,
        eligibility,
        evaluations,
      };
    });
  }, [rawPlayers, activeTeam, evaluationsStore]);

  // Dynamically extract districts from active pool
  const dynamicDistricts = useMemo(() => {
    return getAvailableDistricts(normalizedPlayers);
  }, [normalizedPlayers]);

  // Auto-select first candidate on large desktop screens when entering a team workspace
  React.useEffect(() => {
    if (activeTeamId && !selectedPlayerId && normalizedPlayers.length > 0 && window.innerWidth >= 1024) {
      setSelectedPlayerId(normalizedPlayers[0].id);
    }
  }, [activeTeamId, selectedPlayerId, normalizedPlayers]);

  // Reset filters when switching team
  const handleOpenTeam = teamId => {
    setActiveTeamId(teamId);
    setActiveTab('candidates');
    setFilters({
      district: 'All',
      ageGroup: 'All',
      gender: 'All',
      role: 'All',
      battingStyle: 'All',
      bowlingStyle: 'All',
      eligibility: 'All',
      status: 'All',
    });
    setSearchQuery('');
    setCompareIds([]);
  };

  // Create new team handler
  const handleCreateTeam = newTeam => {
    setTeams(prev => [newTeam, ...prev]);
    setActiveTeamId(newTeam.id);
  };

  // Filter change handlers
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      district: 'All',
      ageGroup: 'All',
      gender: 'All',
      role: 'All',
      battingStyle: 'All',
      bowlingStyle: 'All',
      eligibility: 'All',
      status: 'All',
    });
    setSearchQuery('');
  };

  // Toggle player selection for the active team
  const handleToggleSelectTeamPlayer = playerId => {
    if (!activeTeam) return;

    setTeams(prevTeams =>
      prevTeams.map(t => {
        if (t.id !== activeTeam.id) return t;

        const currentSelected = t.selectedPlayerIds || [];
        const isSelected = currentSelected.includes(playerId);

        let newSelected = [];
        if (isSelected) {
          newSelected = currentSelected.filter(id => id !== playerId);
        } else {
          newSelected = [...currentSelected, playerId];
        }

        const newRoles = { ...t.roles };
        if (isSelected) {
          if (newRoles.captainId === playerId) newRoles.captainId = '';
          if (newRoles.viceCaptainId === playerId) newRoles.viceCaptainId = '';
          if (newRoles.wicketkeeperId === playerId) newRoles.wicketkeeperId = '';
        }

        return {
          ...t,
          selectedPlayerIds: newSelected,
          roles: newRoles,
        };
      })
    );
  };

  // Toggle shortlist for the active team
  const handleToggleShortlistPlayer = playerId => {
    if (!activeTeam) return;

    setTeams(prevTeams =>
      prevTeams.map(t => {
        if (t.id !== activeTeam.id) return t;

        const currentShortlisted = t.shortlistedPlayerIds || [];
        const isShortlisted = currentShortlisted.includes(playerId);

        return {
          ...t,
          shortlistedPlayerIds: isShortlisted
            ? currentShortlisted.filter(id => id !== playerId)
            : [...currentShortlisted, playerId],
        };
      })
    );
  };

  // Update team roles
  const handleUpdateTeamRoles = newRoles => {
    if (!activeTeam) return;
    setTeams(prevTeams =>
      prevTeams.map(t => (t.id === activeTeam.id ? { ...t, roles: newRoles } : t))
    );
  };

  // Compare toggles
  const handleToggleCompare = playerId => {
    setCompareIds(prev => {
      if (prev.includes(playerId)) return prev.filter(id => id !== playerId);
      if (prev.length >= 4) return [...prev.slice(1), playerId];
      return [...prev, playerId];
    });
  };

  const handleRemoveFromCompare = playerId => {
    setCompareIds(prev => prev.filter(id => id !== playerId));
  };

  // Update evaluations
  const handleUpdateEvaluation = (playerId, newEval) => {
    setEvaluationsStore(prev => ({
      ...prev,
      [playerId]: newEval,
    }));
  };

  // Filter candidate pool
  const filteredCandidates = useMemo(() => {
    if (!activeTeam) return [];

    const activeSelectedIds = activeTeam.selectedPlayerIds || [];
    const activeShortlistedIds = activeTeam.shortlistedPlayerIds || [];

    return normalizedPlayers.filter(player => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = player.name.toLowerCase().includes(q);
        const matchesDistrict = player.district.toLowerCase().includes(q);
        const matchesRole = (player.primaryRole || player.role).toLowerCase().includes(q);
        if (!matchesName && !matchesDistrict && !matchesRole) return false;
      }

      if (filters.district !== 'All' && player.district !== filters.district) {
        return false;
      }
      if (filters.ageGroup !== 'All' && player.ageGroup !== filters.ageGroup) {
        return false;
      }
      if (filters.gender !== 'All' && player.gender !== filters.gender) {
        return false;
      }
      if (filters.role !== 'All') {
        if (filters.role === 'Batter' && player.role !== 'Batter') return false;
        if (filters.role === 'Bowler' && player.role !== 'Bowler') return false;
        if (filters.role === 'All-Rounder' && player.role !== 'All-Rounder') return false;
        if (filters.role === 'Wicket Keeper' && player.role !== 'Wicket Keeper') return false;
      }
      if (filters.battingStyle !== 'All') {
        if (!player.battingStyle.toLowerCase().includes(filters.battingStyle.toLowerCase())) return false;
      }
      if (filters.bowlingStyle !== 'All') {
        if (filters.bowlingStyle === 'No Bowling') {
          if (player.bowlingStyle && !player.bowlingStyle.includes('None') && !player.bowlingStyle.includes('Pure')) return false;
        } else if (!player.bowlingStyle.toLowerCase().includes(filters.bowlingStyle.toLowerCase())) {
          return false;
        }
      }
      if (filters.eligibility === 'Eligible Only' && !player.eligibility?.isEligible) {
        return false;
      }
      if (filters.eligibility === 'Ineligible' && player.eligibility?.isEligible) {
        return false;
      }
      if (filters.status === 'Selected in Team' && !activeSelectedIds.includes(player.id)) {
        return false;
      }
      if (filters.status === 'Not Selected' && activeSelectedIds.includes(player.id)) {
        return false;
      }
      if (filters.status === 'Shortlisted' && !activeShortlistedIds.includes(player.id)) {
        return false;
      }

      return true;
    });
  }, [normalizedPlayers, activeTeam, filters, searchQuery]);

  // Selected team players subset
  const selectedTeamPlayers = useMemo(() => {
    if (!activeTeam) return [];
    const ids = activeTeam.selectedPlayerIds || [];
    return normalizedPlayers.filter(p => ids.includes(p.id));
  }, [normalizedPlayers, activeTeam]);

  // Compared players subset
  const comparedPlayers = useMemo(() => {
    return normalizedPlayers.filter(p => compareIds.includes(p.id));
  }, [normalizedPlayers, compareIds]);

  // Selected player object for detail pane
  const activeSelectedPlayer = useMemo(() => {
    return normalizedPlayers.find(p => p.id === selectedPlayerId) || null;
  }, [normalizedPlayers, selectedPlayerId]);

  // If no team is selected, show Dashboard
  if (!activeTeamId || !activeTeam) {
    return (
      <TeamSelectionDashboard
        teams={teams}
        allPlayers={normalizedPlayers}
        onSelectTeam={handleOpenTeam}
        onCreateTeam={handleCreateTeam}
      />
    );
  }

  const selectedCount = (activeTeam.selectedPlayerIds || []).length;
  const targetSize = activeTeam.targetSize || 15;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] md:h-screen w-full bg-[#f8fafc] overflow-hidden">
      {/* TOP HEADER */}
      <header className="bg-white border-b border-slate-200/80 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 z-10">
        {/* Back Button + Team Info */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTeamId(null)}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition flex items-center gap-1.5 text-xs font-medium cursor-pointer"
            title="Return to Teams Selection Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">All Teams</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100/60">
                {activeTeam.season} • {activeTeam.category}
              </span>
              <span className="text-xs text-slate-400 font-normal">
                Official Selection
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-semibold text-slate-900 leading-snug truncate">
              {activeTeam.name}
            </h1>
          </div>
        </div>

        {/* Workflow Navigation Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1">
          {/* Candidates Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('candidates')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeTab === 'candidates'
                ? 'bg-white text-blue-700 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Candidates</span>
            <span className="px-1.5 py-0.2 text-[11px] bg-slate-200/80 text-slate-700 rounded-full font-medium">
              {filteredCandidates.length}
            </span>
          </button>

          {/* Selected Team Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('selected')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeTab === 'selected'
                ? 'bg-white text-emerald-700 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Selected Team</span>
            <span
              className={`px-1.5 py-0.2 text-[11px] rounded-full font-medium ${
                selectedCount >= targetSize
                  ? 'bg-emerald-100 text-emerald-800 font-semibold'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {selectedCount} / {targetSize}
            </span>
          </button>

          {/* Compare Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('compare')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeTab === 'compare'
                ? 'bg-white text-amber-600 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Compare</span>
            {compareIds.length > 0 && (
              <span className="px-1.5 py-0.2 text-[11px] bg-amber-100 text-amber-800 rounded-full font-medium">
                {compareIds.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* WORKSPACE BODY */}
      <div className="flex-1 flex overflow-hidden">
        {/* 1. SELECTED TEAM VIEW */}
        {activeTab === 'selected' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <SelectedTeam
              team={activeTeam}
              selectedPlayers={selectedTeamPlayers}
              onSelectPlayer={id => {
                setSelectedPlayerId(id);
                setActiveTab('candidates');
              }}
              onRemovePlayerFromTeam={handleToggleSelectTeamPlayer}
              onUpdateTeamRoles={handleUpdateTeamRoles}
            />
          </div>
        )}

        {/* 2. COMPARE VIEW */}
        {activeTab === 'compare' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="max-w-6xl mx-auto">
              <PlayerComparison
                players={comparedPlayers}
                team={activeTeam}
                selectedTeamPlayerIds={activeTeam.selectedPlayerIds || []}
                onToggleSelectTeamPlayer={handleToggleSelectTeamPlayer}
                shortlistedPlayerIds={activeTeam.shortlistedPlayerIds || []}
                onToggleShortlistPlayer={handleToggleShortlistPlayer}
                onRemoveFromCompare={handleRemoveFromCompare}
                onClearCompare={() => setCompareIds([])}
                onSelectPlayer={id => {
                  setSelectedPlayerId(id);
                  setActiveTab('candidates');
                }}
              />
            </div>
          </div>
        )}

        {/* 3. CANDIDATES WORKSPACE */}
        {activeTab === 'candidates' && (
          <div className="flex-1 flex overflow-hidden">
            {/* LEFT PANE: Candidate Pool & Filter Toolbar */}
            <div className="w-full lg:w-[450px] xl:w-[480px] 2xl:w-[510px] flex flex-col border-r border-slate-200 bg-[#f8fafc] overflow-hidden shrink-0">
              {/* Filter Tiles & Search */}
              <div className="p-3.5 bg-white border-b border-slate-200 space-y-2.5 shrink-0 shadow-2xs">
                <FilterTiles
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onResetFilters={handleResetFilters}
                  districts={dynamicDistricts}
                  matchCount={filteredCandidates.length}
                />

                {/* Search Bar + Live Counter */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search candidates by name, club or district..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-600 focus:bg-white text-slate-800 placeholder-slate-400 transition"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1.5 rounded-lg shrink-0">
                    {filteredCandidates.length} Candidates
                  </span>
                </div>
              </div>

              {/* Candidates Scrollable List */}
              <div className="flex-1 overflow-y-auto p-3.5">
                <PlayerPool
                  players={filteredCandidates}
                  team={activeTeam}
                  selectedPlayerId={selectedPlayerId}
                  onSelectPlayer={id => setSelectedPlayerId(id)}
                  selectedTeamPlayerIds={activeTeam.selectedPlayerIds || []}
                  onToggleSelectTeamPlayer={handleToggleSelectTeamPlayer}
                  shortlistedPlayerIds={activeTeam.shortlistedPlayerIds || []}
                  onToggleShortlistPlayer={handleToggleShortlistPlayer}
                  compareIds={compareIds}
                  onToggleCompare={handleToggleCompare}
                />
              </div>
            </div>

            {/* RIGHT PANE: DESKTOP PLAYER DETAIL */}
            <div className="hidden lg:flex flex-1 flex-col overflow-hidden bg-white">
              {activeSelectedPlayer ? (
                <PlayerDetail
                  player={activeSelectedPlayer}
                  team={activeTeam}
                  isSelectedInTeam={(activeTeam.selectedPlayerIds || []).includes(activeSelectedPlayer.id)}
                  onToggleSelectTeam={() => handleToggleSelectTeamPlayer(activeSelectedPlayer.id)}
                  isShortlisted={(activeTeam.shortlistedPlayerIds || []).includes(activeSelectedPlayer.id)}
                  onToggleShortlist={() => handleToggleShortlistPlayer(activeSelectedPlayer.id)}
                  isInCompare={compareIds.includes(activeSelectedPlayer.id)}
                  onToggleCompare={() => handleToggleCompare(activeSelectedPlayer.id)}
                  onUpdateEvaluation={handleUpdateEvaluation}
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                  <Users className="w-10 h-10 stroke-[1.5] text-slate-300 mb-2" />
                  <p className="text-sm font-medium text-slate-700">Select any candidate to review eligibility & performance</p>
                  <p className="text-xs text-slate-400 mt-1">Review verified match history, assessment ratings, and select for {activeTeam.name}.</p>
                </div>
              )}
            </div>

            {/* MOBILE SLIDE-OVER PLAYER DETAIL */}
            {activeSelectedPlayer && (
              <div className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
                <div className="w-full sm:w-[480px] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
                  <PlayerDetail
                    player={activeSelectedPlayer}
                    team={activeTeam}
                    onClose={() => setSelectedPlayerId(null)}
                    isSelectedInTeam={(activeTeam.selectedPlayerIds || []).includes(activeSelectedPlayer.id)}
                    onToggleSelectTeam={() => handleToggleSelectTeamPlayer(activeSelectedPlayer.id)}
                    isShortlisted={(activeTeam.shortlistedPlayerIds || []).includes(activeSelectedPlayer.id)}
                    onToggleShortlist={() => handleToggleShortlistPlayer(activeSelectedPlayer.id)}
                    isInCompare={compareIds.includes(activeSelectedPlayer.id)}
                    onToggleCompare={() => handleToggleCompare(activeSelectedPlayer.id)}
                    onUpdateEvaluation={handleUpdateEvaluation}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
