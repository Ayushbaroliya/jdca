import React from 'react';
import { useCricket } from '../context/CricketContext';
import { Home, Calendar, Radio, Users, Settings, MoreHorizontal, User, ClipboardList, LayoutGrid } from 'lucide-react';

export default function BottomNav() {
  const { currentScreen, navigateTo, userRole, drawerOpen, setDrawerOpen } = useCricket();

  if (currentScreen === 'welcome') return null;

  // Active Map ensures active states highlight correctly
  const ACTIVE_MAP = {
    'home': 'home',
    'matches': 'matches', 'match-setup': 'matches', 'match-overview': 'matches',
    'match-result': 'matches', 'innings-break': 'matches',
    'scoring': 'scoring', 'scorecard': 'scoring',
    'players': 'players', 'scouting': 'players',
    'player-profile': 'player-profile',
    'player-registration': 'players',
    'selection': 'selection', 'selectors': 'selection',
    'administration': 'administration', 'access-control': 'administration',
    'tournaments': 'more'
  };

  const activeId = ACTIVE_MAP[currentScreen] || 'home';

  // Role-Aware Navigation Configuration
  const getNavItems = () => {
    const baseItems = [
      { id: 'home', label: 'Home', icon: Home, route: 'home' },
    ];
    
    switch (userRole) {
      case 'SuperAdmin':
      case 'Admin':
        return [
          ...baseItems,
          { id: 'matches', label: 'Matches', icon: Calendar, route: 'matches' },
          { id: 'players', label: 'Players', icon: Users, route: 'players' },
          { id: 'administration', label: 'Admin', icon: Settings, route: 'administration' },
          { id: 'more', label: 'More', icon: MoreHorizontal, route: null },
        ];
      case 'Scorer':
        return [
          ...baseItems,
          { id: 'matches', label: 'Matches', icon: Calendar, route: 'matches' },
          { id: 'scoring', label: 'Score', icon: Radio, route: 'scoring', liveIndicator: true },
          { id: 'more', label: 'More', icon: MoreHorizontal, route: null },
        ];
      case 'Selector':
        return [
          ...baseItems,
          { id: 'players', label: 'Players', icon: Users, route: 'players' },
          { id: 'selection', label: 'Selection', icon: LayoutGrid, route: 'selection' },
          { id: 'matches', label: 'Matches', icon: Calendar, route: 'matches' },
          { id: 'more', label: 'More', icon: MoreHorizontal, route: null },
        ];
      case 'Player':
        return [
          ...baseItems,
          { id: 'matches', label: 'Matches', icon: Calendar, route: 'matches' },
          { id: 'player-profile', label: 'Profile', icon: User, route: 'player-profile' },
          { id: 'more', label: 'More', icon: MoreHorizontal, route: null },
        ];
      default:
        return [
          ...baseItems,
          { id: 'matches', label: 'Matches', icon: Calendar, route: 'matches' },
          { id: 'more', label: 'More', icon: MoreHorizontal, route: null },
        ];
    }
  };

  const tabs = getNavItems();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.04)] h-[68px]">
      <div className="flex items-stretch justify-around h-full px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeId === tab.id;
          const isMore = tab.id === 'more';

          const handleClick = () => {
            if (isMore) {
              setDrawerOpen(true);
            } else {
              navigateTo(tab.route);
            }
          };

          return (
            <button
              key={tab.id}
              onClick={handleClick}
              className="flex flex-col items-center justify-center flex-1 space-y-1 transition-all duration-200 cursor-pointer outline-none tap-highlight-transparent"
            >
              <div className={`relative flex items-center justify-center w-10 h-8 rounded-full transition-colors ${isActive && !isMore ? 'bg-[#eef2fd] text-[#2457D6]' : 'text-[#8a99b0]'}`}>
                <Icon
                  size={isActive ? 22 : 20}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`transition-colors ${isMore && drawerOpen ? 'text-[#101827]' : ''}`}
                />
                {tab.liveIndicator && (
                  <span className="absolute top-0 right-1 w-2 h-2 bg-[#0FA968] rounded-full shadow-[0_0_0_2px_white] animate-pulse" />
                )}
              </div>
              <span
                className={`text-[10px] tracking-wide transition-colors ${isActive && !isMore ? 'font-bold text-[#2457D6]' : 'font-medium text-[#8a99b0]'} ${isMore && drawerOpen ? 'text-[#101827]' : ''}`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
