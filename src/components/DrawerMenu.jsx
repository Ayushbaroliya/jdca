import React from 'react';
import {
  X, Home, Calendar, Trophy, Users, Clipboard, Radio, Settings, LogOut
} from 'lucide-react';
import { useCricket } from '../context/CricketContext';
import { RoleBadge } from './ui/Badge';
import batIcon from '../assets/bat-icon.png';

const ALL_NAV = [
  { id: 'home',           label: 'Home',          icon: Home,      route: 'home' },
  { id: 'matches',        label: 'Matches',        icon: Calendar,  route: 'matches' },
  { id: 'tournaments',    label: 'Tournaments',    icon: Trophy,    route: 'tournaments' },
  { id: 'players',        label: 'Players',        icon: Users,     route: 'players' },
  { id: 'selection',      label: 'Player Selection',      icon: Clipboard, route: 'selection' },
  { id: 'scoring',        label: 'Live Score',   icon: Radio,     route: 'scoring', liveIndicator: true },
  { id: 'administration', label: 'Administration', icon: Settings,  route: 'administration', adminOnly: true },
];

const ACTIVE_MAP = {
  'home': 'home', 'matches': 'matches', 'match-setup': 'matches',
  'match-overview': 'matches', 'match-result': 'matches', 'innings-break': 'matches',
  'scoring': 'scoring', 'scorecard': 'scoring',
  'tournaments': 'tournaments',
  'players': 'players', 'scouting': 'players', 'player-profile': 'players', 'player-registration': 'players',
  'selection': 'selection', 'selectors': 'selection',
  'administration': 'administration', 'access-control': 'administration',
};

export default function DrawerMenu() {
  const { drawerOpen, setDrawerOpen, navigateTo, currentScreen, userRole, userEmail, setIsAuthenticated } = useCricket();

  if (!drawerOpen) return null;

  const activeId = ACTIVE_MAP[currentScreen] || currentScreen;

  const visible = ALL_NAV.filter(item => {
    if (item.adminOnly && !['SuperAdmin', 'Admin'].includes(userRole)) return false;
    if (userRole === 'Scorer')   return ['home','matches','scoring'].includes(item.id);
    if (userRole === 'Selector') return ['home','players','selection'].includes(item.id);
    if (userRole === 'Player')   return ['home','matches','players'].includes(item.id);
    return true;
  });

  const handleNav = (route) => {
    navigateTo(route);
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setDrawerOpen(false);
    navigateTo('welcome');
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0"
        style={{ background: 'rgba(16,24,39,0.65)', backdropFilter: 'blur(2px)' }}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Drawer panel */}
      <div
        className="relative flex flex-col h-full shadow-2xl z-10 fade-in-up"
        style={{
          width: 260,
          background: '#101827',
          borderRight: '1px solid rgba(255,255,255,0.07)',
          animation: 'slideInLeft 0.2s ease both',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex items-center gap-2.5">
            <div className="jdca-brand-mark flex items-center justify-center" style={{ width: 40, height: 40 }}>
              <img src={batIcon} alt="" style={{ width: 29, height: 29, objectFit: 'contain' }} />
            </div>
            <div>
              <div className="font-bold text-white" style={{ fontSize: 14 }}>JDCA</div>
              <div style={{ fontSize: 10, color: '#8a99b0' }}>Jabalpur District Cricket Association</div>
            </div>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.08)', border: 'none' }}
            id="drawer-close-btn"
          >
            <X size={17} style={{ color: '#8a99b0' }} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto no-scrollbar space-y-0.5">
          <div className="section-label px-3 mb-3" style={{ color: '#4a5568', fontSize: 10 }}>
            SECTIONS
          </div>
          {visible.map((item) => {
            const Icon = item.icon;
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                id={`drawer-nav-${item.id}`}
                onClick={() => handleNav(item.route)}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={17} strokeWidth={isActive ? 2.5 : 2} className="flex-shrink-0" />
                <span className="flex-1 text-left" style={{ fontSize: 14 }}>{item.label}</span>
                {item.liveIndicator && <span className="live-dot" style={{ width: 6, height: 6 }} />}
              </button>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="px-3 pb-5 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="px-3 py-2.5 rounded-lg mb-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="font-semibold text-white mb-1.5" style={{ fontSize: 12 }}>
              {userEmail || 'JDCA Official'}
            </div>
            <RoleBadge role={userRole} />
          </div>
          <button
            onClick={handleLogout}
            className="sidebar-item w-full"
            style={{ color: '#8a99b0', fontSize: 13 }}
            id="drawer-logout-btn"
          >
            <LogOut size={15} strokeWidth={2} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
