import React from 'react';
import { useCricket } from '../context/CricketContext';
import { Home, Calendar, Radio, Users, Settings, MoreHorizontal, User, ClipboardList, LayoutGrid } from 'lucide-react';
import { motion } from 'motion/react';

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

  // Return all tabs for mobile display
  const getNavItems = () => {
    return [
      { id: 'home', label: 'Home', icon: Home, route: 'home' },
      { id: 'matches', label: 'Matches', icon: Calendar, route: 'matches' },
      { id: 'scoring', label: 'Score', icon: Radio, route: 'scoring', liveIndicator: true },
      { id: 'players', label: 'Players', icon: Users, route: 'players' },
      { id: 'selection', label: 'Selection', icon: LayoutGrid, route: 'selection' },
      { id: 'administration', label: 'Admin', icon: Settings, route: 'administration' }
    ];
  };

  const tabs = getNavItems();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-gray-200 pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.06)] h-[68px]">
      <div className="flex items-stretch justify-start overflow-x-auto no-scrollbar h-full px-2 relative">
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
              className="flex flex-col items-center justify-center flex-1 min-w-[70px] shrink-0 space-y-1 transition-all duration-200 cursor-pointer outline-none tap-highlight-transparent relative"
            >
              <div className={`relative flex items-center justify-center w-12 h-8 rounded-full z-10 transition-colors ${isActive && !isMore ? 'text-[#2457D6]' : 'text-[#8a99b0]'}`}>
                {isActive && !isMore && (
                  <motion.div
                    layoutId="bottom-nav-indicator"
                    className="absolute inset-0 bg-[#eef2fd] rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon
                  size={isActive ? 22 : 20}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`transition-colors ${isMore && drawerOpen ? 'text-[#101827]' : ''}`}
                />
                {tab.liveIndicator && (
                  <span className="absolute top-0 right-2 w-2 h-2 bg-[#0FA968] rounded-full shadow-[0_0_0_2px_white] animate-pulse" />
                )}
              </div>
              <span
                className={`text-[10px] tracking-wide transition-colors z-10 ${isActive && !isMore ? 'font-bold text-[#2457D6]' : 'font-medium text-[#8a99b0]'} ${isMore && drawerOpen ? 'text-[#101827]' : ''}`}
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
