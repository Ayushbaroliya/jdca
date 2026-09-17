import React from 'react';
import { Search, X } from 'lucide-react';
import { BATTING_STYLE_OPTIONS, BOWLING_STYLE_OPTIONS, ROLE_FILTER_OPTIONS } from './selectionData';

export default function SelectionFilters({ filters, setFilters, searchQuery, setSearchQuery }) {
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const FilterSection = ({ title, options, activeValue, filterKey }) => (
    <div className="mb-5">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{title}</h3>
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => updateFilter(filterKey, 'All')}
          className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
            activeValue === 'All'
              ? 'bg-slate-800 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All
        </button>
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => updateFilter(filterKey, opt)}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              activeValue === opt
                ? 'bg-blue-100 text-blue-700 border border-blue-200 shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full font-sans">
      <div className="relative mb-6">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search player or ID..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-blue-500 focus:bg-white text-slate-800 placeholder-slate-400 transition"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <FilterSection 
        title="Role" 
        options={ROLE_FILTER_OPTIONS} 
        activeValue={filters.role} 
        filterKey="role" 
      />
      
      <FilterSection 
        title="Batting Style" 
        options={BATTING_STYLE_OPTIONS} 
        activeValue={filters.battingStyle} 
        filterKey="battingStyle" 
      />

      <FilterSection 
        title="Bowling Style" 
        options={BOWLING_STYLE_OPTIONS} 
        activeValue={filters.bowlingStyle} 
        filterKey="bowlingStyle" 
      />

      <FilterSection 
        title="Selection Status" 
        options={['Considered', 'Selected', 'Unselected']} 
        activeValue={filters.status} 
        filterKey="status" 
      />

      <div className="mt-4 pt-4 border-t border-slate-100">
        <button 
          onClick={() => {
            setSearchQuery('');
            setFilters({
              role: 'All', gender: 'All', battingStyle: 'All', bowlingStyle: 'All', status: 'All'
            });
          }}
          className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
}
