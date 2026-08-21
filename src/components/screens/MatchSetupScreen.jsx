import React, { useState } from 'react';
import { Check, Edit2, Search, ArrowRight, ArrowLeft, Shield, Sliders, Plus, Trash2, X, UserPlus } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import { TeamCrest, CricketBatIcon, CricketBatAsset, CricketBallIcon } from '../CricketIcons';

export default function MatchSetupScreen() {
  const { matchSetup, setMatchSetup, navigateTo, goBack, players } = useCricket();
  const [currentStep, setCurrentStep] = useState(2); // 1: Teams, 2: Toss, 3: Rules
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditingXI, setIsEditingXI] = useState(false);
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);
  const [rosterSearchQuery, setRosterSearchQuery] = useState('');

  const addPlayerToXI = (player) => {
    if (matchSetup.playingXI.length >= 11) {
      alert("You can only select up to 11 players for the Playing XI.");
      return;
    }
    if (matchSetup.playingXI.find(p => p.id === player.id)) {
      alert("Player is already in the Playing XI.");
      return;
    }
    
    // Add player with default roles
    const newPlayer = {
      ...player,
      isCaptain: false,
      role: player.role || 'Batter'
    };
    
    setMatchSetup(prev => ({
      ...prev,
      playingXI: [...prev.playingXI, newPlayer]
    }));
  };

  const removePlayerFromXI = (playerId) => {
    setMatchSetup(prev => ({
      ...prev,
      playingXI: prev.playingXI.filter(p => p.id !== playerId)
    }));
  };

  const toggleRole = (playerId, roleType) => {
    setMatchSetup(prev => ({
      ...prev,
      playingXI: prev.playingXI.map(p => {
        if (p.id === playerId) {
          if (roleType === 'captain') return { ...p, isCaptain: !p.isCaptain };
          if (roleType === 'wk') {
            const isWk = p.role.includes('Wicket Keeper');
            return { ...p, role: isWk ? 'Batter' : 'Wicket Keeper' };
          }
        } else {
          // ensure only 1 captain and 1 wk
          if (roleType === 'captain') return { ...p, isCaptain: false };
          if (roleType === 'wk' && p.role.includes('Wicket Keeper')) {
            return { ...p, role: 'Batter' };
          }
        }
        return p;
      })
    }));
  };

  // Stepper items
  const steps = [
    { num: 1, label: 'Teams', icon: Shield },
    { num: 2, label: 'Toss & Batting', icon: CricketBatAsset },
    { num: 3, label: 'Match Settings', icon: Sliders },
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
      <div className="flex items-center justify-between max-w-sm mx-auto mb-6 px-2">
        {steps.map((s, idx) => {
          const isCompleted = s.num < currentStep;
          const isCurrent = s.num === currentStep;
          const IconComp = s.icon;

          return (
            <div key={s.num} className="flex items-center">
              <div 
                onClick={() => setCurrentStep(s.num)}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-blue-50 text-[#0B57D0]'
                      : isCurrent
                      ? 'bg-[#0B57D0] text-white shadow-sm ring-4 ring-blue-100'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : <IconComp className="w-4 h-4" />}
                </div>
                <span
                  className={`text-[11px] sm:text-xs mt-1 font-semibold whitespace-nowrap ${
                    isCurrent || isCompleted ? 'text-[#0B57D0]' : 'text-slate-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>

              {idx < steps.length - 1 && (
                <div
                  className={`w-8 sm:w-12 h-0.5 mx-1.5 sm:mx-2 -mt-4 transition-colors ${
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
            <div className="flex items-center space-x-2 text-slate-800">
              <Shield className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-base">Select Participating Teams</h3>
            </div>
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
            <div className="flex items-center space-x-2 mb-3">
              <CricketBatAsset className="w-5 h-5 object-contain" />
              <h3 className="text-base font-extrabold text-slate-900">
                Elected to (Innings Decision)
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {/* Bat Option */}
              <button
                type="button"
                onClick={() => handleElectedTo('Bat')}
                className={`py-4 px-4 rounded-xl font-bold text-sm flex flex-col items-center justify-center space-y-1.5 transition-all cursor-pointer ${
                  matchSetup.electedTo === 'Bat'
                    ? 'bg-[#FDE68A] text-slate-900 border-2 border-[#F59E0B] shadow-2xs ring-2 ring-amber-200'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="w-9 h-9 flex items-center justify-center bg-amber-100/80 rounded-full p-1.5 shadow-2xs">
                  <CricketBatAsset className="w-7 h-7 object-contain drop-shadow-xs" />
                </div>
                <span className="font-extrabold">Batting First</span>
                <span className="text-[10px] text-slate-500 font-normal">Take Strike 1st Innings</span>
              </button>

              {/* Bowl Option */}
              <button
                type="button"
                onClick={() => handleElectedTo('Bowl')}
                className={`py-4 px-4 rounded-xl font-bold text-sm flex flex-col items-center justify-center space-y-1.5 transition-all cursor-pointer ${
                  matchSetup.electedTo === 'Bowl'
                    ? 'bg-[#FDE68A] text-slate-900 border-2 border-[#F59E0B] shadow-2xs ring-2 ring-amber-200'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="w-9 h-9 flex items-center justify-center bg-red-100/80 rounded-full p-1.5 shadow-2xs">
                  <CricketBallIcon className="w-6 h-6 text-red-700" />
                </div>
                <span className="font-extrabold">Bowling First</span>
                <span className="text-[10px] text-slate-500 font-normal">Field in 1st Innings</span>
              </button>
            </div>
          </div>

          {/* Playing XI List Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                  <CricketBatAsset className="w-4 h-4 object-contain inline" />
                  <span>Playing XI Squad</span>
                </h3>
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
              {filteredPlayers.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-100"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                      {player.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-1">
                        {player.name} 
                        {player.isCaptain && <span className="text-[#0B57D0] font-bold text-[10px] ml-1 bg-blue-100 px-1.5 py-0.5 rounded">(c)</span>}
                        {player.role.includes('Wicket Keeper') && <span className="text-amber-600 font-bold text-[10px] ml-1 bg-amber-100 px-1.5 py-0.5 rounded">(wk)</span>}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        {player.role.includes('Batter') ? (
                          <><CricketBatAsset className="w-3 h-3 object-contain inline" /> {player.role}</>
                        ) : player.role.includes('Bowler') ? (
                          <><CricketBallIcon className="w-2.5 h-2.5 text-red-600 inline" /> {player.role}</>
                        ) : (
                          <><CricketBatAsset className="w-3 h-3 object-contain inline" /> All-Rounder</>
                        )}
                      </span>
                    </div>
                  </div>
                  
                  {isEditingXI ? (
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => toggleRole(player.id, 'captain')}
                        className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${player.isCaptain ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                      >
                        C
                      </button>
                      <button 
                        onClick={() => toggleRole(player.id, 'wk')}
                        className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${player.role.includes('Wicket Keeper') ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                      >
                        WK
                      </button>
                      <button 
                        onClick={() => removePlayerFromXI(player.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors ml-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-slate-400 cursor-grab">
                      <div className="w-4 h-0.5 bg-slate-300 mb-1" />
                      <div className="w-4 h-0.5 bg-slate-300" />
                    </div>
                  )}
                </div>
              ))}

              {!isEditingXI && filteredPlayers.length === 11 ? (
                <div className="text-center py-2 text-xs font-semibold text-emerald-600 bg-emerald-50 rounded-xl mt-2">
                  <Check className="w-4 h-4 inline mr-1" /> Playing XI Complete
                </div>
              ) : null}

              {isEditingXI && (
                <button
                  onClick={() => setIsAddPlayerModalOpen(true)}
                  className="w-full mt-2 py-3 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-500 hover:text-[#0B57D0] hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
                >
                  <Plus className="w-5 h-5 mb-1" />
                  <span className="text-xs font-bold">Add Player ({matchSetup.playingXI.length}/11)</span>
                </button>
              )}
            </div>

          </div>

        </div>
      )}

      {/* Step 3: Match Rules & Settings */}
      {currentStep === 3 && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center space-x-2 text-slate-800">
              <Sliders className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-base">Match Parameters & Innings Settings</h3>
            </div>

            {/* Innings & Overs */}
            <div>
              <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5 mb-1">
                <CricketBatAsset className="w-4 h-4 object-contain inline" />
                <span>Total Innings Overs</span>
              </label>
              <select
                value={matchSetup.totalOvers}
                onChange={(e) => setMatchSetup({ ...matchSetup, totalOvers: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold bg-white"
              >
                <option value={20}>20 Overs (T20 Standard)</option>
                <option value={10}>10 Overs (T10 Sprint)</option>
                <option value={50}>50 Overs (ODI Full Match)</option>
                <option value={5}>5 Overs (Quick Match)</option>
                <option value={1}>1 Over (Super Over)</option>
                <option value={450}>Unlimited (Test Match)</option>
              </select>
            </div>

            {/* Powerplay Batting Settings */}
            <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-900">
                <CricketBatAsset className="w-4 h-4 object-contain inline" />
                <span>Batting Powerplay Settings</span>
              </div>
              <p className="text-xs text-amber-800/90 font-medium">
                Mandatory Fielding Restrictions for the first {matchSetup.totalOvers === 20 ? '6' : matchSetup.totalOvers === 50 ? '10' : matchSetup.totalOvers === 1 ? '1' : '2'} overs. (Max 2 fielders outside 30-yard circle).
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Wide Ball Penalty</label>
              <select
                value={matchSetup.widePenalty}
                onChange={(e) => setMatchSetup({ ...matchSetup, widePenalty: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold bg-white"
              >
                <option value={1}>1 Run + Extra Delivery (Standard)</option>
                <option value={2}>2 Runs (No Re-bowl)</option>
              </select>
            </div>
            
            <div className="pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 mb-2.5">Match Officials</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">On-Field Umpire 1</label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    value={matchSetup.umpires?.umpire1 || ''}
                    onChange={(e) => setMatchSetup({ 
                      ...matchSetup, 
                      umpires: { ...matchSetup.umpires, umpire1: e.target.value } 
                    })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">On-Field Umpire 2</label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    value={matchSetup.umpires?.umpire2 || ''}
                    onChange={(e) => setMatchSetup({ 
                      ...matchSetup, 
                      umpires: { ...matchSetup.umpires, umpire2: e.target.value } 
                    })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold"
                  />
                </div>
              </div>
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

      {/* Add Player Modal */}
      {isAddPlayerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsAddPlayerModalOpen(false)} 
          />
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl z-10 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                Select Player
              </h3>
              <button 
                onClick={() => setIsAddPlayerModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-3 border-b border-slate-100">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search full roster..."
                  value={rosterSearchQuery}
                  onChange={(e) => setRosterSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-slate-100 border-none placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="overflow-y-auto p-2 space-y-1">
              {players
                .filter(p => !matchSetup.playingXI.find(xi => xi.id === p.id))
                .filter(p => p.name.toLowerCase().includes(rosterSearchQuery.toLowerCase()))
                .map((player) => (
                  <div 
                    key={player.id}
                    className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition-colors group cursor-pointer border border-transparent hover:border-slate-200"
                    onClick={() => {
                      addPlayerToXI(player);
                      setIsAddPlayerModalOpen(false);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <img src={player.avatar} alt={player.name} className="w-10 h-10 rounded-full object-cover shadow-sm" />
                      <div>
                        <div className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{player.name}</div>
                        <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                          {player.role} • {player.battingStyle}
                        </div>
                      </div>
                    </div>
                    <button className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors">
                      <Plus className="w-4 h-4 stroke-[3]" />
                    </button>
                  </div>
              ))}
              
              {players.filter(p => !matchSetup.playingXI.find(xi => xi.id === p.id)).length === 0 && (
                <div className="text-center py-6 text-sm text-slate-500">
                  All players are already in the squad!
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
