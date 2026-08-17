import React from 'react';
import { useCricket } from '../context/CricketContext';
import { 
  NavScoringIcon, 
  NavScorecardIcon, 
  NavAnalysisIcon, 
  NavMatchesIcon 
} from './CricketIcons';

export default function BottomNav() {
  const { currentScreen, navigateTo, userRole } = useCricket();

  if (currentScreen === 'welcome') {
    return null;
  }

  const navItems = [
    {
      id: 'scoring',
      label: 'Scoring',
      icon: (active) => <NavScoringIcon active={active} />,
      action: () => navigateTo('scoring', 'scoring')
    },
    {
      id: 'scorecard',
      label: 'Scorecard',
      icon: (active) => <NavScorecardIcon active={active} />,
      action: () => navigateTo('scorecard', 'scorecard')
    },
    {
      id: 'analysis',
      label: 'Analysis',
      icon: (active) => <NavAnalysisIcon active={active} />,
      action: () => navigateTo('scouting', 'analysis')
    },
    {
      id: 'matches',
      label: 'Matches',
      icon: (active) => <NavMatchesIcon active={active} />,
      action: () => navigateTo('matches', 'matches')
    },
  ];

  const filteredNavItems = navItems.filter(item => {
    if (userRole === 'Admin') return true;
    if (userRole === 'Scorer') {
      return ['scoring', 'scorecard', 'matches'].includes(item.id);
    }
    if (userRole === 'Selector') {
      return ['analysis', 'matches'].includes(item.id);
    }
    if (userRole === 'Player') {
      return ['scorecard', 'analysis', 'matches'].includes(item.id); // using 'analysis' tab for 'My Profile'
    }
    return true;
  });

  return (
    <nav className="sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {filteredNavItems.map((item) => {
          const isActive = 
            (item.id === 'scoring' && currentScreen === 'scoring') ||
            (item.id === 'scorecard' && (currentScreen === 'scorecard' || currentScreen === 'match-overview')) ||
            (item.id === 'analysis' && (currentScreen === 'scouting' || currentScreen === 'player-profile' || currentScreen === 'player-registration')) ||
            (item.id === 'matches' && (currentScreen === 'matches' || currentScreen === 'match-setup' || currentScreen === 'match-result' || currentScreen === 'innings-break'));

          return (
            <button
              key={item.id}
              onClick={item.action}
              className="flex flex-col items-center justify-center py-1 px-3 min-w-[68px] transition-all cursor-pointer group"
            >
              {isActive ? (
                <div className="flex items-center justify-center px-4 py-1.5 bg-[#0B57D0] text-white rounded-full transition-transform transform active:scale-95 shadow-sm">
                  {item.icon(true)}
                </div>
              ) : (
                <div className="flex items-center justify-center px-3 py-1 text-slate-500 group-hover:text-blue-700 transition-colors">
                  {item.icon(false)}
                </div>
              )}
              <span
                className={`text-[11px] mt-0.5 tracking-tight font-medium transition-colors ${
                  isActive ? 'text-[#0B57D0] font-bold' : 'text-slate-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
