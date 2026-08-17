import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  MoreVertical, 
  ArrowLeft, 
  Share2, 
  Sparkles,
  Layers,
  ChevronDown
} from 'lucide-react';
import { useCricket } from '../context/CricketContext';
import { CricketAppLogo } from './CricketIcons';

export default function Header() {
  const { 
    currentScreen, 
    navigateTo, 
    goBack, 
    setDrawerOpen 
  } = useCricket();

  const [menuOpen, setMenuOpen] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'Cricket Scorer', url: window.location.href }).catch(() => {});
    } else {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href).catch(() => {});
      }
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  // Screen titles matching the images
  const getHeaderInfo = () => {
    switch (currentScreen) {
      case 'welcome':
        return { title: 'Cricket Scorer', showBack: false, showLogo: true };
      case 'matches':
        return { title: 'Cricket Scorer', showBack: false, showLogo: false, showMenu: true, showSearch: true };
      case 'match-setup':
        return { title: 'Match Setup', showBack: true, showLogo: false, showDots: true };
      case 'scoring':
        return { title: 'Cricket Scorer', showBack: false, showLogo: true, showDots: true };
      case 'scorecard':
        return { title: 'Cricket Scorer', showBack: false, showLogo: true, showDots: true };
      case 'match-overview':
        return { title: 'Cricket Scorer', showBack: false, showMenu: true, showDots: true };
      case 'innings-break':
        return { title: 'Innings Break', showBack: true, showDots: true };
      case 'match-result':
        return { title: 'Match Summary', showBack: true, showDots: true };
      case 'scouting':
        return { title: 'Selection Hub', showBack: false, showMenu: true, showDots: true };
      case 'player-profile':
        return { title: 'Player Profile', showBack: true, showShare: true };
      case 'player-registration':
        return { title: 'Player Registration', showBack: true, showDots: false };
      default:
        return { title: 'Cricket Scorer', showBack: false, showLogo: true, showDots: true };
    }
  };

  const info = getHeaderInfo();

  // Quick switch dropdown options
  const screenOptions = [
    { id: 'matches', label: 'Matches Hub (Live Now)' },
    { id: 'scoring', label: 'Live Scoring (Keypad & Wagon Wheel)' },
    { id: 'scorecard', label: 'Full Scorecard (Bat & Bowl Tables)' },
    { id: 'match-overview', label: 'Match Overview & Officials' },
    { id: 'match-setup', label: 'Match Setup (Teams & Toss)' },
    { id: 'innings-break', label: 'Innings Complete Modal' },
    { id: 'match-result', label: 'Final Result & Player of Match' },
    { id: 'scouting', label: 'Scouting / Selection Hub' },
    { id: 'player-profile', label: 'Player Profile & Shot Analysis' },
    { id: 'player-registration', label: 'Player Registration Form' },
    { id: 'welcome', label: 'Welcome / Login Screen' },
  ];

  if (currentScreen === 'welcome') {
    return null; // The welcome screen has its own clean layout
  }

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 transition-all">
      <div className="max-w-xl mx-auto flex items-center justify-between">
        
        {/* Left Action */}
        <div className="flex items-center space-x-3">
          {info.showBack ? (
            <button
              onClick={goBack}
              className="p-1.5 -ml-1 text-slate-700 hover:text-blue-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
          ) : (
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-1.5 -ml-1 text-slate-700 hover:text-blue-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              aria-label="Open Drawer Menu"
            >
              <Menu className="w-5 h-5 stroke-[2.2]" />
            </button>
          )}

          {/* Cricket Icon Badge */}
          {info.showLogo && (
            <div className="flex items-center justify-center -ml-1">
              <CricketAppLogo className="w-7 h-7" isMini={true} />
            </div>
          )}

          {/* Header Title */}
          <h1 className="text-lg font-bold text-[#0B57D0] tracking-tight">
            {info.title}
          </h1>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-1.5 relative">
          
          {/* Quick Screen Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center space-x-1 text-xs font-semibold px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full border border-blue-200/70 transition-all cursor-pointer shadow-2xs"
            >
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Screen</span>
              <ChevronDown className="w-3 h-3 ml-0.5 opacity-75" />
            </button>

            {/* Screen Dropdown */}
            {menuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setMenuOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    Switch App Screen
                  </div>
                  <div className="max-h-72 overflow-y-auto py-1">
                    {screenOptions.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          navigateTo(item.id);
                          setMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-blue-50 transition-colors ${
                          currentScreen === item.id 
                            ? 'font-bold text-blue-700 bg-blue-50/70' 
                            : 'text-slate-700'
                        }`}
                      >
                        <span>{item.label}</span>
                        {currentScreen === item.id && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {info.showSearch && (
            <button 
              onClick={() => navigateTo('scouting')}
              className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-5 h-5 stroke-[2.2]" />
            </button>
          )}

          {info.showShare && (
            <button 
              onClick={handleShare}
              className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              aria-label="Share"
            >
              <Share2 className="w-5 h-5 stroke-[2.2]" />
            </button>
          )}

          {copiedToast && (
            <div className="absolute right-0 top-12 px-3 py-1.5 bg-slate-900 text-white text-[11px] font-semibold rounded-lg shadow-lg animate-in fade-in zoom-in-95 z-50 whitespace-nowrap">
              ✓ Link copied to clipboard!
            </div>
          )}

          <button
            onClick={() => setDrawerOpen(true)}
            className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            aria-label="More Options"
          >
            <MoreVertical className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>

      </div>
    </header>
  );
}
