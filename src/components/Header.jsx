import React from 'react';
import { ArrowLeft, Search, Bell } from 'lucide-react';
import { useCricket } from '../context/CricketContext';

// Screen-level titles
const SCREEN_TITLES = {
  'home':              { title: 'JDCA',                 showBack: false },
  'matches':           { title: 'Matches',              showBack: false },
  'match-setup':       { title: 'Match Setup',          showBack: true },
  'scoring':           { title: 'Live Score',         showBack: true },
  'scorecard':         { title: 'Scorecard',            showBack: true },
  'match-overview':    { title: 'Match Overview',       showBack: true },
  'innings-break':     { title: 'Innings Break',        showBack: true },
  'match-result':      { title: 'Match Result',         showBack: true },
  'tournaments':       { title: 'Tournaments',          showBack: false },
  'players':           { title: 'Players',              showBack: false },
  'scouting':          { title: 'Players',              showBack: false },
  'player-profile':    { title: 'Player Profile',       showBack: true },
  'player-registration':{ title: 'Add Player',          showBack: true },
  'selection':         { title: 'Selection Desk',            showBack: false },
  'selectors':         { title: 'Selection Desk',            showBack: false },
  'administration':    { title: 'Administration',       showBack: false },
  'access-control':    { title: 'Administration',       showBack: false },
};

export default function Header() {
  const { currentScreen, goBack, userRole, navigateTo } = useCricket();

  if (currentScreen === 'welcome') return null;

  const info = SCREEN_TITLES[currentScreen] || { title: 'JDCA', showBack: false };

  return (
    <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-100 pt-safe px-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] h-[60px] flex items-center justify-between">
      {/* Left: back button or Logo */}
      <div className="flex items-center gap-3">
        {info.showBack ? (
          <button
            onClick={goBack}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-50 text-[#101827] active:bg-gray-100 transition-colors outline-none tap-highlight-transparent cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
        ) : (
          <div className="flex items-center justify-center w-8 h-8 rounded-[10px] bg-[#2457D6] text-white font-bold text-xs shadow-sm">
            JD
          </div>
        )}
        <h1 className="font-bold text-[#101827] text-[18px] tracking-tight">
          {info.title}
        </h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <span className="hidden sm:flex text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-[#eef2fd] text-[#2457D6]">
          {userRole}
        </span>
        
        {currentScreen === 'home' && (
          <button
            className="flex items-center justify-center w-9 h-9 rounded-full text-[#8a99b0] active:bg-gray-50 transition-colors outline-none tap-highlight-transparent cursor-pointer relative"
          >
            <Bell size={20} strokeWidth={2} />
            {userRole === 'Admin' && <span className="absolute top-2 right-2 w-2 h-2 bg-[#F05A47] rounded-full border-2 border-white" />}
          </button>
        )}

        <button
          onClick={() => navigateTo('players')}
          className="flex items-center justify-center w-9 h-9 rounded-full text-[#8a99b0] active:bg-gray-50 transition-colors outline-none tap-highlight-transparent cursor-pointer"
          aria-label="Search players"
        >
          <Search size={20} strokeWidth={2} />
        </button>
      </div>
    </header>
  );
}
