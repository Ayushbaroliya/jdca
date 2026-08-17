import React from 'react';
import { 
  X, 
  PlayCircle, 
  Award, 
  Users, 
  UserPlus, 
  Settings, 
  ShieldCheck, 
  RefreshCw, 
  Smartphone,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useCricket } from '../context/CricketContext';
import { CricketAppLogo } from './CricketIcons';

export default function DrawerMenu() {
  const { 
    drawerOpen, 
    setDrawerOpen, 
    navigateTo, 
    currentScreen,
    userRole
  } = useCricket();

  if (!drawerOpen) return null;

  const screensList = [
    { id: 'matches', label: 'Matches Hub (Live & Upcoming)', icon: PlayCircle, badge: 'Home' },
    { id: 'scoring', label: 'Live Scorer (Keypad & Field)', icon: PlayCircle, badge: 'Live' },
    { id: 'scorecard', label: 'Full Scorecard', icon: Award },
    { id: 'match-overview', label: 'Match Overview & Umpires', icon: ShieldCheck },
    { id: 'match-setup', label: 'Match Setup Wizard', icon: Settings },
    { id: 'innings-break', label: 'Innings Break Screen', icon: RefreshCw },
    { id: 'match-result', label: 'Match Result & Player of Match', icon: Award },
    { id: 'scouting', label: 'Scouting & Selection Hub', icon: Users, badge: 'Talent' },
    { id: 'selectors', label: 'Selectors Panel', icon: Users, badge: 'New' },
    { id: 'player-profile', label: 'Player Profile & Shot Analysis', icon: Users },
    { id: 'player-registration', label: 'Register New Player', icon: UserPlus },
    { id: 'welcome', label: 'Welcome / Auth Screen', icon: Smartphone },
  ];

  const filteredScreensList = screensList.filter(screen => {
    if (userRole === 'Admin') return true;
    if (userRole === 'Scorer') {
      return ['matches', 'scoring', 'scorecard', 'match-overview', 'match-setup', 'innings-break', 'match-result', 'welcome'].includes(screen.id);
    }
    if (userRole === 'Selector') {
      return ['matches', 'scouting', 'selectors', 'player-profile', 'player-registration', 'welcome'].includes(screen.id);
    }
    if (userRole === 'Player') {
      return ['matches', 'player-profile', 'match-result', 'scorecard', 'welcome'].includes(screen.id);
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setDrawerOpen(false)}
      />

      {/* Drawer Content */}
      <div className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
        
        {/* Drawer Header */}
        <div className="p-5 bg-gradient-to-r from-blue-700 to-blue-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CricketAppLogo className="w-10 h-10 drop-shadow" isMini={true} />
            <div>
              <h2 className="font-bold text-lg leading-tight">Cricket Scorer</h2>
              <p className="text-xs text-blue-100/80">Pro Match & Talent Suite</p>
            </div>
          </div>
          <button 
            onClick={() => setDrawerOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Screen Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Application Screens ({userRole})
          </div>

          {filteredScreensList.map((item) => {
            const Icon = item.icon;
            const isCurrent = currentScreen === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  navigateTo(item.id);
                  setDrawerOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left cursor-pointer ${
                  isCurrent 
                    ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/80 shadow-2xs' 
                    : 'text-slate-700 hover:bg-slate-50 hover:text-blue-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isCurrent ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  {item.badge && (
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 text-xs text-slate-500">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-slate-700">Cricket Scorer v2.4</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-[10px]">
              Ready
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Responsive live scoring & player analytics</p>
        </div>

      </div>
    </div>
  );
}
