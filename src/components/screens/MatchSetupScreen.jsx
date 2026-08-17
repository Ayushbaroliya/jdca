import React, { useState } from 'react';
import { Check, Edit2, Search, ArrowRight, ArrowLeft, Shield, Sliders } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import { TeamCrest, CricketBatIcon, CricketBallIcon } from '../CricketIcons';

export default function MatchSetupScreen() {
  const { matchSetup, setMatchSetup, navigateTo, goBack } = useCricket();
  const [currentStep, setCurrentStep] = useState(2); // 1: Teams, 2: Toss, 3: Rules
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditingXI, setIsEditingXI] = useState(false);

  // Stepper items
  const steps = [
    { num: 1, label: 'Teams' },
    { num: 2, label: 'Toss' },
    { num: 3, label: 'Rules' },
  ];

  const handleTossWinner = (team) => {
    setMatchSetup((prev) => ({ ...prev, tossWinner: team }));
  };

  const handleElectedTo = (decision) => {
    setMatchSetup((prev) => ({ ...prev, electedTo: decision }));
  };

  const filteredPlayers = matchSetup.playingXI.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-120px)] bg-slate-50/60 pb-24 px-4 pt-4 max-w-xl mx-auto animate-in fade-in duration-200">
      
      {/* 3-Step Wizard Progress Bar */}
      <div className="flex items-center justify-between max-w-xs mx-auto mb-6 px-4">
        {steps.map((s, idx) => {
          const isCompleted = s.num < currentStep;
          const isCurrent = s.num === currentStep;

          return (
            <div key={s.num} className="flex items-center">
              <div 
                onClick={() => setCurrentStep(s.num)}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-blue-50 text-[#0B57D0]'
                      : isCurrent
                      ? 'bg-[#0B57D0] text-white shadow-sm ring-4 ring-blue-100'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : s.num}
                </div>
                <span
                  className={`text-xs mt-1 font-semibold ${
                    isCurrent || isCompleted ? 'text-[#0B57D0]' : 'text-slate-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>

              {idx < steps.length - 1 && (
                <div
                  className={`w-12 h-0.5 mx-2 -mt-4 transition-colors ${
                    s.num < currentStep ? 'bg-[#0B57D0]' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step 1: Teams Config (if active) */}
      {currentStep === 1 && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-800 text-base">Select Teams</h3>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Team A Name</label>
              <input
                type="text"
                value={matchSetup.teamA}
                onChange={(e) => setMatchSetup({ ...matchSetup, teamA: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Team B Name</label>
              <input
                type="text"
                value={matchSetup.teamB}
                onChange={(e) => setMatchSetup({ ...matchSetup, teamB: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Toss & Playing XI (Matches Image 23) */}
      {currentStep === 2 && (
        <div className="space-y-4 animate-in fade-in duration-150">
          
          {/* Teams Header Pill Card */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
            {/* Team 1 */}
            <div className="flex items-center space-x-3">
              <TeamCrest teamName={matchSetup.teamA} className="w-11 h-11 shadow-xs" />
              <span className="font-bold text-slate-900 text-sm sm:text-base">
                {matchSetup.teamA}
              </span>
            </div>

            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
              VS
            </div>

            {/* Team 2 */}
            <div className="flex items-center space-x-3">
              <span className="font-bold text-slate-900 text-sm sm:text-base text-right">
                {matchSetup.teamB}
              </span>
              <TeamCrest teamName={matchSetup.teamB} className="w-11 h-11 shadow-xs" />
            </div>
          </div>

          {/* Who Won the Toss? */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <h3 className="text-base font-extrabold text-slate-900 mb-3">
              Who won the toss?
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleTossWinner(matchSetup.teamA)}
                className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                  matchSetup.tossWinner === matchSetup.teamA
                    ? 'bg-[#0B57D0] text-white shadow-sm ring-2 ring-blue-300'
                    : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{matchSetup.teamA}</span>
                {matchSetup.tossWinner === matchSetup.teamA && (
                  <Check className="w-4 h-4 ml-1 stroke-[3]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => handleTossWinner(matchSetup.teamB)}
                className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                  matchSetup.tossWinner === matchSetup.teamB
                    ? 'bg-[#0B57D0] text-white shadow-sm ring-2 ring-blue-300'
                    : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{matchSetup.teamB}</span>
                {matchSetup.tossWinner === matchSetup.teamB && (
                  <Check className="w-4 h-4 ml-1 stroke-[3]" />
                )}
              </button>
            </div>
          </div>

          {/* Elected To (Bat / Bowl) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <h3 className="text-base font-extrabold text-slate-900 mb-3">
              Elected to
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {/* Bat Option */}
              <button
                type="button"
                onClick={() => handleElectedTo('Bat')}
                className={`py-4 px-4 rounded-xl font-bold text-sm flex flex-col items-center justify-center space-y-1.5 transition-all cursor-pointer ${
                  matchSetup.electedTo === 'Bat'
                    ? 'bg-[#FDE68A] text-slate-900 border-2 border-[#F59E0B] shadow-2xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="w-7 h-7 flex items-center justify-center">
                  <CricketBatIcon className="w-6 h-6 text-amber-800" />
                </div>
                <span>Bat</span>
              </button>

              {/* Bowl Option */}
              <button
                type="button"
                onClick={() => handleElectedTo('Bowl')}
                className={`py-4 px-4 rounded-xl font-bold text-sm flex flex-col items-center justify-center space-y-1.5 transition-all cursor-pointer ${
                  matchSetup.electedTo === 'Bowl'
                    ? 'bg-[#FDE68A] text-slate-900 border-2 border-[#F59E0B] shadow-2xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="w-7 h-7 flex items-center justify-center">
                  <CricketBallIcon className="w-6 h-6" />
                </div>
                <span>Bowl</span>
              </button>
            </div>
          </div>

          {/* Playing XI List Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Playing XI</h3>
                <p className="text-xs text-slate-500 font-medium">
                  {matchSetup.teamA} ({matchSetup.electedTo === 'Bat' ? 'Batting' : 'Bowling'})
                </p>
              </div>
              <button
                onClick={() => setIsEditingXI(!isEditingXI)}
                className="flex items-center space-x-1 text-xs font-bold text-[#0B57D0] hover:text-blue-800 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{isEditingXI ? 'Done' : 'Edit'}</span>
              </button>
            </div>

            {/* Search players input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search players..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-100 border-none placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Players selected list */}
            <div className="space-y-2 pt-1">
              {filteredPlayers.slice(0, 3).map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-100"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                      {player.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">
                      {player.name} {player.isCaptain && <span className="text-[#0B57D0] font-bold">(c)</span>}
                    </span>
                  </div>
                  
                  {/* Grip lines */}
                  <div className="text-slate-400 cursor-grab">
                    <div className="w-4 h-0.5 bg-slate-300 mb-1" />
                    <div className="w-4 h-0.5 bg-slate-300" />
                  </div>
                </div>
              ))}

              <div className="text-center py-2 text-xs font-semibold text-slate-500">
                + 8 more players selected
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Step 3: Match Rules */}
      {currentStep === 3 && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-800 text-base">Match Parameters & Rules</h3>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Total Overs</label>
              <select
                value={matchSetup.totalOvers}
                onChange={(e) => setMatchSetup({ ...matchSetup, totalOvers: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold bg-white"
              >
                <option value={20}>20 Overs (T20)</option>
                <option value={10}>10 Overs (T10)</option>
                <option value={50}>50 Overs (ODI)</option>
                <option value={5}>5 Overs (Super Over / Quick)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Wide Ball Penalty</label>
              <select
                value={matchSetup.widePenalty}
                onChange={(e) => setMatchSetup({ ...matchSetup, widePenalty: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold bg-white"
              >
                <option value={1}>1 Run + Extra Delivery</option>
                <option value={2}>2 Runs (No Re-bowl)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-200/80 z-30 shadow-lg">
        <div className="max-w-xl mx-auto flex items-center space-x-3">
          <button
            type="button"
            onClick={() => {
              if (currentStep > 1) setCurrentStep(currentStep - 1);
              else goBack();
            }}
            className="flex-1 py-3.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-100 transition-all cursor-pointer"
          >
            Back
          </button>

          <button
            type="button"
            onClick={() => {
              if (currentStep < 3) {
                setCurrentStep(currentStep + 1);
              } else {
                navigateTo('scoring');
              }
            }}
            className="flex-[2] py-3.5 px-4 rounded-xl bg-[#0B57D0] hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer"
          >
            <span>{currentStep === 3 ? 'Start Match' : 'Continue to Rules'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
