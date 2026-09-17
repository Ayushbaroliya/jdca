import React, { useState } from 'react';
import { X, Plus, Shield, Check } from 'lucide-react';
import { TEAM_CATEGORIES } from './selectionData';

export default function CreateTeamModal({ isOpen, onClose, onCreateTeam }) {
  const [season, setSeason] = useState('2026');
  const [selectedCategory, setSelectedCategory] = useState(TEAM_CATEGORIES[0].id);
  const [gender, setGender] = useState('Men');
  const [teamSize, setTeamSize] = useState('15');

  if (!isOpen) return null;

  const currentCategory = TEAM_CATEGORIES.find(c => c.id === selectedCategory) || TEAM_CATEGORIES[0];

  const handleSubmit = e => {
    e.preventDefault();
    const teamName = `${season} JDCA ${currentCategory.name}${gender === 'Women' ? " Women's" : ''} Team`;
    const newTeam = {
      id: `team_${season}_${currentCategory.id}_${gender.toLowerCase()}_${Date.now()}`,
      season,
      category: currentCategory.name,
      gender,
      name: teamName,
      targetSize: parseInt(teamSize, 10) || 15,
      status: 'SELECTION_ACTIVE',
      ageLimit: currentCategory.ageLimit,
      minBatters: 4,
      minAllRounders: 2,
      minWKs: 1,
      minFastBowlers: 3,
      minSpinners: 2,
      selectedPlayerIds: [],
      shortlistedPlayerIds: [],
      roles: {
        captainId: '',
        viceCaptainId: '',
        wicketkeeperId: '',
      },
    };

    onCreateTeam(newTeam);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cobalt text-white flex items-center justify-center font-bold">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase">Create New Team Selection</h3>
              <p className="text-xs text-gray-500">Initialize an official district team selection process</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Season & Gender */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1 uppercase">Season / Year</label>
              <select
                value={season}
                onChange={e => setSeason(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-cobalt font-semibold"
              >
                <option value="2026">2026 Season</option>
                <option value="2027">2027 Season</option>
                <option value="2025">2025 Season</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1 uppercase">Gender / Category</label>
              <select
                value={gender}
                onChange={e => setGender(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-cobalt font-semibold"
              >
                <option value="Men">Men / Boys</option>
                <option value="Women">Women / Girls</option>
              </select>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block font-bold text-gray-700 mb-1 uppercase">Age Category</label>
            <div className="grid grid-cols-3 gap-2">
              {TEAM_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setTeamSize(cat.defaultSize.toString());
                  }}
                  className={`p-2.5 rounded-xl border text-center font-bold transition ${
                    selectedCategory === cat.id
                      ? 'bg-cobalt text-white border-cobalt shadow-xs'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="text-xs">{cat.name}</div>
                  <div className="text-xs opacity-75 font-normal">
                    {cat.ageLimit < 90 ? `Max ${cat.ageLimit} yrs` : 'Open Age'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Target Team Size */}
          <div>
            <label className="block font-bold text-gray-700 mb-1 uppercase">Target Team Size (Players)</label>
            <div className="flex gap-2">
              {['14', '15', '16', '18', '20'].map(sz => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setTeamSize(sz)}
                  className={`flex-1 py-2 rounded-lg border text-xs font-bold transition ${
                    teamSize === sz
                      ? 'bg-cobalt text-white border-cobalt shadow-xs'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Preview Box */}
          <div className="p-3 bg-cobalt-50 border border-cobalt-100 rounded-xl">
            <div className="text-xs font-bold uppercase text-cobalt-700">Selection Preview</div>
            <div className="text-sm font-bold text-cobalt-900 mt-0.5">
              {season} JDCA {currentCategory.name}{gender === 'Women' ? " Women's" : ''} Team
            </div>
            <div className="text-xs text-cobalt-800 mt-0.5">
              Target Size: {teamSize} Players • Eligibility: {currentCategory.ageLimit < 90 ? `Under ${currentCategory.ageLimit} years` : 'Open'}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-cobalt hover:bg-cobalt-700 text-white rounded-xl font-bold transition shadow-xs flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Create Team Selection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
