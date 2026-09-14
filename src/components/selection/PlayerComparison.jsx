import React from 'react';
import { X, Scale, Bookmark, CheckCircle2, Award, Star, UserPlus, UserCheck } from 'lucide-react';

export default function PlayerComparison({
  players,
  team,
  selectedTeamPlayerIds,
  onToggleSelectTeamPlayer,
  shortlistedPlayerIds,
  onToggleShortlistPlayer,
  onRemoveFromCompare,
  onClearCompare,
  onSelectPlayer,
}) {
  if (!players || players.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-10 text-center space-y-3 shadow-2xs">
        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <Scale className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900">No Candidates Selected for Comparison</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Add 2 to 4 candidates from the candidate pool using the <span className="font-medium text-slate-700">"Compare"</span> action to evaluate their head-to-head performance metrics.
        </p>
      </div>
    );
  }

  const hasBatters = players.some(p => p.role === 'Batter' || p.role === 'All-Rounder' || p.role === 'Wicket Keeper');
  const hasBowlers = players.some(p => p.role === 'Bowler' || p.role === 'All-Rounder');
  const hasWKs = players.some(p => p.role === 'Wicket Keeper');

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col space-y-4 p-4 sm:p-5">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-sm sm:text-base font-semibold text-slate-900 flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-500" />
            <span>Head-to-Head Candidate Comparison ({players.length} Players)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-normal">
            Compare key performance figures, recent form, verified eligibility, and career records for {team?.name || 'Team Selection'}.
          </p>
        </div>

        <button
          type="button"
          onClick={onClearCompare}
          className="px-2.5 py-1 text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
        >
          Clear All
        </button>
      </div>

      {/* COMPARISON MATRIX TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="p-3 bg-slate-50/70 text-slate-500 font-semibold text-xs w-36">Metric</th>
              {players.map(p => {
                const isInSelectedTeam = selectedTeamPlayerIds.includes(p.id);
                const isShortlisted = shortlistedPlayerIds.includes(p.id);
                const isEligible = p.eligibility?.isEligible;

                return (
                  <th key={p.id} className="p-3 bg-slate-50/70 min-w-[170px] max-w-[220px]">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <img src={p.avatar} alt={p.name} className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0" />
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 truncate">{p.name}</div>
                          <div className="text-[11px] text-slate-500 truncate font-normal">
                            {p.district} • {p.ageGroup}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => onRemoveFromCompare(p.id)}
                        className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                        title="Remove from comparison"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 mt-2.5">
                      <button
                        onClick={() => onToggleSelectTeamPlayer(p.id)}
                        disabled={!isEligible && !isInSelectedTeam}
                        className={`flex-1 py-1 px-2 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1 cursor-pointer ${
                          isInSelectedTeam
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : !isEligible
                            ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                        }`}
                      >
                        {isInSelectedTeam ? 'Selected ✓' : 'Select'}
                      </button>

                      <button
                        onClick={() => onSelectPlayer(p.id)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-medium text-slate-700 transition cursor-pointer"
                        title="View Full Profile"
                      >
                        View
                      </button>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 font-medium">
            {/* 1. PROFILE & ELIGIBILITY */}
            <SectionHeader label="Profile & Eligibility" cols={players.length + 1} />
            <CompareRow label="Primary Role" values={players.map(p => p.primaryRole || p.role)} />
            <CompareRow label="District Association" values={players.map(p => p.district)} />
            <CompareRow label="Age / DOB" values={players.map(p => `${p.age} yrs (${p.dob})`)} />
            <CompareRow
              label="Selection Status"
              values={players.map(p => (p.eligibility?.isEligible ? '✓ Eligible' : '✕ Ineligible'))}
            />
            <CompareRow label="Batting Style" values={players.map(p => p.battingStyle)} />
            <CompareRow label="Bowling Style" values={players.map(p => p.bowlingStyle || 'None')} />

            {/* 2. RECENT FORM */}
            <SectionHeader label="Recent Form (Last 5 Matches)" cols={players.length + 1} />
            <CompareRow label="Match Scores" values={players.map(p => p.recentFormString || '-')} />
            <CompareRow label="Form Rating" values={players.map(p => p.formRating || 'Strong')} />

            {/* 3. BATTING METRICS */}
            {hasBatters && (
              <>
                <SectionHeader label="Batting Performance" cols={players.length + 1} />
                <CompareRow label="Matches Played" values={players.map(p => p.matches)} />
                <CompareRow
                  label="Career Runs"
                  values={players.map(p => p.careerRuns || p.runs)}
                  highlightIndex={bestMetricIndex(players, 'careerRuns')}
                />
                <CompareRow
                  label="Batting Average"
                  values={players.map(p => p.battingAvg)}
                  highlightIndex={bestMetricIndex(players, 'battingAvg')}
                />
                <CompareRow
                  label="Strike Rate"
                  values={players.map(p => p.strikeRate)}
                  highlightIndex={bestMetricIndex(players, 'strikeRate')}
                />
                <CompareRow label="50s / 100s" values={players.map(p => `${p.fifties || 0} / ${p.hundreds || 0}`)} />
                <CompareRow label="Highest Score" values={players.map(p => p.highScore || '-')} />
              </>
            )}

            {/* 4. BOWLING METRICS */}
            {hasBowlers && (
              <>
                <SectionHeader label="Bowling Performance" cols={players.length + 1} />
                <CompareRow
                  label="Wickets"
                  values={players.map(p => p.wickets || 0)}
                  highlightIndex={bestMetricIndex(players, 'wickets')}
                />
                <CompareRow
                  label="Economy Rate"
                  values={players.map(p => p.economy || '-')}
                  highlightIndex={bestLowestMetricIndex(players, 'economy')}
                />
                <CompareRow label="Bowling Average" values={players.map(p => p.bowlingAvg || '-')} />
                <CompareRow label="Best Bowling" values={players.map(p => p.bestBowling || '-')} />
              </>
            )}

            {/* 5. FIELDING & WK */}
            <SectionHeader label="Fielding & Dismissals" cols={players.length + 1} />
            <CompareRow
              label="Catches"
              values={players.map(p => p.catches || 0)}
              highlightIndex={bestMetricIndex(players, 'catches')}
            />
            {hasWKs && (
              <CompareRow
                label="Stumpings (WK)"
                values={players.map(p => p.stumpings || 0)}
                highlightIndex={bestMetricIndex(players, 'stumpings')}
              />
            )}
            <CompareRow
              label="Total Dismissals"
              values={players.map(p => p.totalDismissals || 0)}
              highlightIndex={bestMetricIndex(players, 'totalDismissals')}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SectionHeader({ label, cols }) {
  return (
    <tr className="bg-slate-50">
      <td colSpan={cols} className="px-3 py-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wider">
        {label}
      </td>
    </tr>
  );
}

function CompareRow({ label, values, highlightIndex }) {
  return (
    <tr className="hover:bg-slate-50/70 transition">
      <td className="px-3 py-2 text-slate-500 font-medium">{label}</td>
      {values.map((val, idx) => {
        const isBest = highlightIndex === idx;
        return (
          <td key={idx} className={`px-3 py-2 ${isBest ? 'text-blue-700 font-semibold bg-blue-50/40' : 'text-slate-800'}`}>
            <span className="flex items-center gap-1">
              {val}
              {isBest && <Star className="w-2.5 h-2.5 fill-blue-600 text-blue-600 inline" />}
            </span>
          </td>
        );
      })}
    </tr>
  );
}

function bestMetricIndex(players, key) {
  const nums = players.map(p => Number(p[key]) || 0);
  const max = Math.max(...nums);
  if (max === 0) return -1;
  return nums.indexOf(max);
}

function bestLowestMetricIndex(players, key) {
  const nums = players.map(p => Number(p[key]) || 999);
  const min = Math.min(...nums);
  if (min === 999) return -1;
  return nums.indexOf(min);
}
