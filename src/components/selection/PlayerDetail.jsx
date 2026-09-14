import React, { useState } from 'react';
import { useCricket } from '../../context/CricketContext';
import {
  X,
  CheckCircle2,
  Bookmark,
  Scale,
  Calendar,
  ChevronDown,
  ChevronUp,
  Shield,
  ExternalLink,
  FileText,
  UserCheck,
  UserPlus,
  AlertTriangle,
  History,
  Tag,
} from 'lucide-react';
import PerformanceGraphs from './PerformanceGraphs';

export default function PlayerDetail({
  player,
  team,
  onClose,
  isSelectedInTeam,
  onToggleSelectTeam,
  isShortlisted,
  onToggleShortlist,
  isInCompare,
  onToggleCompare,
  onUpdateEvaluation,
}) {
  const { navigateTo, setActiveMatchId } = useCricket();

  const [matchFilter, setMatchFilter] = useState('all');
  const [expandedMatchId, setExpandedMatchId] = useState(null);

  const [notes, setNotes] = useState(
    player.evaluations?.notes || player.evaluationNotes || ''
  );
  const [selectedTags, setSelectedTags] = useState(
    player.evaluations?.tags || ['Solid Technique', 'Match Winner']
  );
  const [notesSaved, setNotesSaved] = useState(false);

  if (!player) return null;

  const isBowler =
    player.role === 'Bowler' ||
    player.primaryRole?.includes('Bowl') ||
    player.primaryRole?.includes('Fast') ||
    player.primaryRole?.includes('Spin');

  const isEligible = player.eligibility ? player.eligibility.isEligible : true;
  const eligibilityReason = player.eligibility
    ? player.eligibility.reason
    : 'Eligible for open selection.';

  let matchesToDisplay = player.matchHistory || [];
  if (matchFilter === 'last5') {
    matchesToDisplay = matchesToDisplay.slice(0, 5);
  } else if (matchFilter === 'season') {
    matchesToDisplay = matchesToDisplay.filter(m => m.date.includes('2026'));
  }

  const SUGGESTED_OBSERVATION_TAGS = [
    'Solid Technique',
    'Strong Against Pace',
    'Good Spin Player',
    'High Strike Rate Finisher',
    'Disciplined Line & Length',
    'Deceptive Variations',
    'Agile In-Ring Fielder',
    'Calm Match Temperament',
    'Leadership Potential',
    'Fit & Athletic',
  ];

  const handleToggleTag = tag => {
    const updated = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(updated);
    if (onUpdateEvaluation) {
      onUpdateEvaluation(player.id, { notes, tags: updated });
    }
  };

  const handleSaveNotes = () => {
    if (onUpdateEvaluation) {
      onUpdateEvaluation(player.id, { notes, tags: selectedTags });
    }
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2500);
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200 shadow-lg overflow-hidden">
      {/* TOP TOOLBAR */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white/95 backdrop-blur-xs sticky top-0 z-20">
        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
              title="Close Profile"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-xs font-semibold text-slate-700 tracking-wider uppercase">
            Candidate Assessment
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* COMPARE */}
          <button
            onClick={() => onToggleCompare(player.id)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
              isInCompare
                ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>{isInCompare ? 'In Compare' : 'Compare'}</span>
          </button>

          {/* SHORTLIST */}
          <button
            onClick={() => onToggleShortlist(player.id)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
              isShortlisted
                ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{isShortlisted ? 'Shortlisted' : 'Shortlist'}</span>
          </button>

          {/* SELECT FOR TEAM */}
          <button
            onClick={() => onToggleSelectTeam(player.id)}
            disabled={!isEligible && !isSelectedInTeam}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
              isSelectedInTeam
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                : !isEligible
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-xs'
            }`}
          >
            {isSelectedInTeam ? (
              <UserCheck className="w-3.5 h-3.5" />
            ) : (
              <UserPlus className="w-3.5 h-3.5" />
            )}
            <span>
              {isSelectedInTeam
                ? 'Selected in Team ✓'
                : `Select for ${team?.category || 'Team'}`}
            </span>
          </button>
        </div>
      </div>

      {/* SCROLLABLE PROFILE CONTENT */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* 1. IDENTITY */}
        <div className="flex items-start gap-4">
          <img
            src={player.avatar}
            alt={player.name}
            className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0"
          />
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium rounded">
                {player.district}
              </span>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded">
                {player.ageGroup} ({player.age} yrs)
              </span>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded">
                DOB: {player.dob}
              </span>
              {isSelectedInTeam && (
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-xs font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Selected
                </span>
              )}
            </div>

            <h2 className="text-xl font-semibold text-slate-900 leading-tight truncate">
              {player.name}
            </h2>

            <p className="text-xs text-slate-500 font-normal">
              <span className="font-medium text-slate-700">
                {player.primaryRole || player.role}
              </span>
              <span className="mx-1 text-slate-300">•</span>
              <span>{player.battingStyle}</span>
              {player.bowlingStyle &&
                player.bowlingStyle !== 'None (Pure Batter)' && (
                  <>
                    <span className="mx-1 text-slate-300">•</span>
                    <span>{player.bowlingStyle}</span>
                  </>
                )}
            </p>

            <div className="text-xs text-slate-400 font-normal">
              {player.team || player.club || 'District XI'}
            </div>
          </div>
        </div>

        {/* 2. ELIGIBILITY BANNER */}
        <div
          className={`p-3.5 rounded-xl border flex items-start gap-3 ${
            isEligible
              ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
              : 'bg-rose-50/60 border-rose-200 text-rose-950'
          }`}
        >
          {isEligible ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="text-xs space-y-0.5">
            <div className="font-semibold text-slate-900">
              {isEligible
                ? `Eligible for ${team?.name || 'this team selection'}`
                : `Ineligible for ${team?.name || 'this team selection'}`}
            </div>
            <div className="text-xs text-slate-600 font-normal">
              {eligibilityReason}
            </div>
          </div>
        </div>

        {/* 3. PERFORMANCE SUMMARY */}
        <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Career & Season Performance
            </span>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              Form: {player.formRating || 'Strong'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-2.5 bg-white rounded-lg border border-slate-100">
              <div className="text-[11px] font-medium text-slate-400">
                Last 5 Matches
              </div>
              <div className="text-xs font-semibold text-slate-900 mt-0.5 truncate">
                {player.recentFormString || '84 · 62 · 95'}
              </div>
            </div>

            <div className="p-2.5 bg-white rounded-lg border border-slate-100">
              <div className="text-[11px] font-medium text-slate-400">
                Career Runs
              </div>
              <div className="text-xs font-semibold text-blue-700 mt-0.5">
                {player.careerRuns || player.runs}{' '}
                <span className="text-[11px] text-slate-400 font-normal">
                  (@ {player.battingAvg} avg)
                </span>
              </div>
            </div>

            <div className="p-2.5 bg-white rounded-lg border border-slate-100">
              <div className="text-[11px] font-medium text-slate-400">
                {isBowler ? 'Wickets' : 'Strike Rate'}
              </div>
              <div className="text-xs font-semibold text-slate-900 mt-0.5">
                {isBowler
                  ? `${player.wickets} Wkts (@ ${player.economy} econ)`
                  : `${player.strikeRate} SR`}
              </div>
            </div>

            <div className="p-2.5 bg-white rounded-lg border border-slate-100">
              <div className="text-[11px] font-medium text-slate-400">
                Best Figure
              </div>
              <div className="text-xs font-semibold text-emerald-700 mt-0.5">
                {isBowler ? player.bestBowling : `${player.highScore} High`}
              </div>
            </div>
          </div>
        </div>

        {/* 4. PERFORMANCE GRAPHS */}
        <PerformanceGraphs player={player} />

        {/* 5. SELECTOR OBSERVATIONS & NOTES (REAL WORLD PRACTICAL TOOL) */}
        <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
            <div className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Selector Observations & Remarks
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-normal">
              Official Committee Log
            </span>
          </div>

          {/* Quick Technical Tag Badges */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
              <Tag className="w-3 h-3" />
              <span>Key Technical Observations:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_OBSERVATION_TAGS.map(tag => {
                const isTagActive = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition cursor-pointer ${
                      isTagActive
                        ? 'bg-blue-50 text-blue-700 border-blue-300 font-semibold'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {tag} {isTagActive ? '✓' : '+'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Written Observations Textarea */}
          <div className="space-y-1.5 pt-1">
            <label className="block text-xs font-medium text-slate-700">
              Selector Comments & Notes
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Record selector notes regarding player temperament, form, role suitability, or technical strengths..."
              className="w-full text-xs p-3 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 text-slate-800 resize-none h-20 transition"
            />
            <div className="flex items-center justify-between pt-1">
              {notesSaved ? (
                <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Notes recorded successfully
                </span>
              ) : (
                <span className="text-[11px] text-slate-400">
                  Shared across JDCA selection committee
                </span>
              )}
              <button
                type="button"
                onClick={handleSaveNotes}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-blue-600 text-white rounded-lg text-xs font-medium transition cursor-pointer shadow-2xs"
              >
                Save Selector Remarks
              </button>
            </div>
          </div>
        </div>

        {/* 6. OFFICIAL MATCH RECORDS */}
        <div className="space-y-3 pt-1">
          {/* Header & Filter Segmented Control */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-1 border-b border-slate-200/70">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  Official Match Records
                </h3>
                <p className="text-[11px] text-slate-400 font-normal">
                  Verified scorecards from registered competitions
                </p>
              </div>
            </div>

            {/* Filter Pills Segmented Container */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-medium self-start sm:self-auto">
              {[
                { id: 'all', label: 'All Matches' },
                { id: 'season', label: 'Season 2026' },
                { id: 'last5', label: 'Last 5' },
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setMatchFilter(tab.id)}
                  className={`px-3 py-1 rounded-md text-xs transition cursor-pointer ${
                    matchFilter === tab.id
                      ? 'bg-white text-blue-700 shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Match Cards List */}
          <div className="space-y-2.5">
            {matchesToDisplay.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No match records found for the selected filter.
              </div>
            ) : (
              matchesToDisplay.map((m, idx) => {
                const isExpanded = expandedMatchId === m.id;
                const hasBowling = m.bowling?.overs && m.bowling.overs !== '0.0';
                const hasBatting = m.batting && m.batting.runs !== undefined;

                return (
                  <div
                    key={m.id || idx}
                    className={`bg-white border rounded-xl overflow-hidden transition-all duration-150 ${
                      isExpanded
                        ? 'border-blue-300 ring-1 ring-blue-500/10 shadow-xs'
                        : 'border-slate-200/90 hover:border-slate-300 hover:shadow-2xs'
                    }`}
                  >
                    {/* Main Match Card Row */}
                    <div
                      onClick={() => setExpandedMatchId(isExpanded ? null : m.id)}
                      className="p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/50 transition"
                    >
                      {/* Left: Opponent & Metadata */}
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
                          <span className="text-sm font-semibold text-slate-900">
                            vs {m.opponent}
                          </span>
                          <span className="inline-flex items-center text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {m.date}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 font-normal truncate flex items-center gap-1.5">
                          <span className="truncate">{m.tournament}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-600 font-medium shrink-0">{m.result}</span>
                        </div>
                      </div>

                      {/* Right: Isolated Primary Performance Metric */}
                      <div className="flex items-center gap-3 shrink-0 pl-2">
                        <div className="text-right space-y-0.5">
                          {hasBatting && (
                            <div className="text-sm font-semibold tabular-nums text-slate-900">
                              {m.batting.runs}
                              {m.batting.notOut ? '*' : ''}{' '}
                              <span className="text-xs text-slate-400 font-normal">
                                ({m.batting.balls}b)
                              </span>
                            </div>
                          )}
                          {hasBowling && (
                            <div className="text-xs font-semibold tabular-nums text-emerald-700">
                              {m.bowling.wickets}/{m.bowling.runs}{' '}
                              <span className="text-[11px] text-slate-400 font-normal">
                                ({m.bowling.overs} ov)
                              </span>
                            </div>
                          )}
                          {!hasBatting && !hasBowling && (
                            <div className="text-xs text-slate-400 font-medium">DNB</div>
                          )}
                        </div>

                        <div className="p-1 rounded-md text-slate-400 hover:text-slate-600 bg-slate-50 border border-slate-100">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expandable Scorecard Breakdown */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-3 bg-slate-50/70 border-t border-slate-100 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {/* Batting Card */}
                          <div className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-2xs space-y-1">
                            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                              Batting Inning
                            </div>
                            <div className="text-sm font-semibold tabular-nums text-slate-900">
                              {m.batting?.runs ?? 0} runs{' '}
                              <span className="text-xs text-slate-500 font-normal">
                                ({m.batting?.balls ?? 0} balls)
                              </span>
                            </div>
                            <div className="text-xs tabular-nums text-slate-600">
                              {m.batting?.fours ?? 0} fours • {m.batting?.sixes ?? 0} sixes • SR{' '}
                              <span className="font-semibold text-slate-800">{m.batting?.strikeRate ?? '-'}</span>
                            </div>
                            {m.batting?.dismissal && (
                              <div className="text-[11px] text-slate-400 pt-0.5 truncate">
                                {m.batting.dismissal}
                              </div>
                            )}
                          </div>

                          {/* Bowling Card */}
                          <div className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-2xs space-y-1">
                            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                              Bowling Spell
                            </div>
                            <div className="text-sm font-semibold tabular-nums text-slate-900">
                              {m.bowling?.wickets ?? 0} wkts / {m.bowling?.runs ?? 0} runs
                            </div>
                            <div className="text-xs tabular-nums text-slate-600">
                              {m.bowling?.overs ?? '0.0'} overs • Econ{' '}
                              <span className="font-semibold text-slate-800">{m.bowling?.economy ?? '-'}</span>
                            </div>
                            <div className="text-[11px] tabular-nums text-slate-400 pt-0.5">
                              {m.bowling?.maidens ?? 0} Maiden overs
                            </div>
                          </div>

                          {/* Fielding Card */}
                          <div className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-2xs space-y-1">
                            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                              Fielding Impact
                            </div>
                            <div className="text-sm font-semibold tabular-nums text-slate-900">
                              {m.fielding?.catches ?? 0} Catches
                            </div>
                            <div className="text-xs tabular-nums text-slate-600">
                              {m.fielding?.stumpings ?? 0} Stumpings • {m.fielding?.runOuts ?? 0} Run Outs
                            </div>
                            <div className="text-[11px] text-slate-400 pt-0.5">
                              Ground fielding contribution
                            </div>
                          </div>
                        </div>

                        {/* Venue & Full Scorecard Action */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/60 text-xs">
                          <span className="text-slate-500 font-normal">
                            Venue: <strong className="text-slate-700 font-medium">{m.venue}</strong>
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMatchId('match-live-1');
                              navigateTo('scorecard');
                            }}
                            className="inline-flex items-center gap-1.5 font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                          >
                            <span>Open Official Match Scorecard</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 7. FIELDING & WICKETKEEPING */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            Fielding & Wicketkeeping Stats
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
              <div className="text-base font-semibold text-slate-900">
                {player.catches}
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                Catches
              </div>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
              <div className="text-base font-semibold text-slate-900">
                {player.runOuts}
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                Run Outs
              </div>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
              <div className="text-base font-semibold text-slate-900">
                {player.stumpings}
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                Stumpings (WK)
              </div>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
              <div className="text-base font-semibold text-blue-700">
                {player.totalDismissals}
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                Total Dismissals
              </div>
            </div>
          </div>
        </div>

        {/* 8. HISTORICAL SELECTIONS */}
        <div className="space-y-2.5 pt-1">
          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-blue-600" />
            Historical Team Selections
          </h3>

          <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100 text-xs">
            {(player.selectionHistoryRecords || []).map((rec, i) => (
              <div key={i} className="p-2.5 flex items-center justify-between">
                <span className="font-medium text-slate-800">
                  {rec.season} {rec.team}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                    rec.status === 'Selected'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {rec.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
