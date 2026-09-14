import React, { useState } from 'react';
import { ChevronDown, RotateCcw, Filter, X, Check } from 'lucide-react';
import {
  AGE_FILTER_OPTIONS,
  GENDER_FILTER_OPTIONS,
  ROLE_FILTER_OPTIONS,
  BATTING_STYLE_OPTIONS,
  BOWLING_STYLE_OPTIONS,
} from './selectionData';

export default function FilterTiles({
  filters,
  onFilterChange,
  onResetFilters,
  districts,
  matchCount,
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const ELIGIBILITY_OPTIONS = ['All', 'Eligible Only', 'Ineligible'];
  const STATUS_OPTIONS = ['All', 'Selected in Team', 'Not Selected', 'Shortlisted'];

  const quickRoles = [
    { label: 'All', key: 'role', value: 'All' },
    { label: 'Batters', key: 'role', value: 'Batter' },
    { label: 'Bowlers', key: 'role', value: 'Bowler' },
    { label: 'All-Rounders', key: 'role', value: 'All-Rounder' },
    { label: 'WKs', key: 'role', value: 'Wicket Keeper' },
  ];

  const hasActiveFilters = Object.values(filters).some(val => val && val !== 'All');

  return (
    <div className="space-y-2.5">
      {/* 1. QUICK ROLE / CATEGORY CHIPS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {quickRoles.map(item => {
          const isSelected = filters.role === item.value;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onFilterChange('role', item.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          );
        })}

        {/* Quick Eligibility Toggle */}
        <button
          type="button"
          onClick={() =>
            onFilterChange('eligibility', filters.eligibility === 'Eligible Only' ? 'All' : 'Eligible Only')
          }
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
            filters.eligibility === 'Eligible Only'
              ? 'bg-emerald-600 text-white shadow-2xs font-semibold'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
          }`}
        >
          Eligible Only
        </button>

        {/* Quick Shortlisted Toggle */}
        <button
          type="button"
          onClick={() =>
            onFilterChange('status', filters.status === 'Shortlisted' ? 'All' : 'Shortlisted')
          }
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
            filters.status === 'Shortlisted'
              ? 'bg-amber-600 text-white shadow-2xs font-semibold'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
          }`}
        >
          Shortlisted
        </button>
      </div>

      {/* 2. COMPACT DROPDOWN SELECTS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* District Select */}
        <div>
          <label className="block text-[10px] font-medium text-slate-400 mb-0.5">District</label>
          <select
            value={filters.district}
            onChange={e => onFilterChange('district', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-blue-600 focus:bg-white transition"
          >
            {districts.map(d => (
              <option key={d} value={d}>
                {d === 'All' ? 'All Districts' : d}
              </option>
            ))}
          </select>
        </div>

        {/* Age Group Select */}
        <div>
          <label className="block text-[10px] font-medium text-slate-400 mb-0.5">Age Group</label>
          <select
            value={filters.ageGroup}
            onChange={e => onFilterChange('ageGroup', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-blue-600 focus:bg-white transition"
          >
            {AGE_FILTER_OPTIONS.map(a => (
              <option key={a} value={a}>
                {a === 'All' ? 'All Ages' : a}
              </option>
            ))}
          </select>
        </div>

        {/* Eligibility Select */}
        <div>
          <label className="block text-[10px] font-medium text-slate-400 mb-0.5">Eligibility</label>
          <select
            value={filters.eligibility}
            onChange={e => onFilterChange('eligibility', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-blue-600 focus:bg-white transition"
          >
            {ELIGIBILITY_OPTIONS.map(e => (
              <option key={e} value={e}>
                {e === 'All' ? 'All Candidates' : e}
              </option>
            ))}
          </select>
        </div>

        {/* Batting Style Select */}
        <div>
          <label className="block text-[10px] font-medium text-slate-400 mb-0.5">Batting Style</label>
          <select
            value={filters.battingStyle}
            onChange={e => onFilterChange('battingStyle', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-blue-600 focus:bg-white transition"
          >
            {BATTING_STYLE_OPTIONS.map(b => (
              <option key={b} value={b}>
                {b === 'All' ? 'All Batting' : b}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. ACTIVE FILTERS & RESET ROW */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
          <span className="text-slate-500 font-medium">
            Active filters applied
          </span>
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        </div>
      )}
    </div>
  );
}
