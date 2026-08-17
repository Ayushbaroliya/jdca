import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CricketProvider, useCricket } from './context/CricketContext';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import DrawerMenu from './components/DrawerMenu';

// Screens
import AuthScreen from './components/screens/AuthScreen';
import MatchesScreen from './components/screens/MatchesScreen';
import MatchSetupScreen from './components/screens/MatchSetupScreen';
import ScoringScreen from './components/screens/ScoringScreen';
import ScorecardScreen from './components/screens/ScorecardScreen';
import MatchOverviewScreen from './components/screens/MatchOverviewScreen';
import InningsBreakScreen from './components/screens/InningsBreakScreen';
import MatchResultScreen from './components/screens/MatchResultScreen';
import ScoutingHubScreen from './components/screens/ScoutingHubScreen';
import PlayerProfileScreen from './components/screens/PlayerProfileScreen';
import PlayerRegistrationScreen from './components/screens/PlayerRegistrationScreen';
import PlayerComparisonModal from './components/screens/PlayerComparisonModal';
import SelectorsScreen from './components/screens/SelectorsScreen';

function MainApp() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-blue-500 selection:text-white">
      {/* Top App Header */}
      <Header />

      {/* Main Screen Content Area */}
      <main className="flex-1 w-full max-w-xl mx-auto">
        <Routes>
          <Route path="/" element={<AuthScreen />} />
          <Route path="/matches" element={<MatchesScreen />} />
          <Route path="/match-setup" element={<MatchSetupScreen />} />
          <Route path="/scoring" element={<ScoringScreen />} />
          <Route path="/scorecard" element={<ScorecardScreen />} />
          <Route path="/match-overview" element={<MatchOverviewScreen />} />
          <Route path="/innings-break" element={<InningsBreakScreen />} />
          <Route path="/match-result" element={<MatchResultScreen />} />
          <Route path="/scouting" element={<ScoutingHubScreen />} />
          <Route path="/player-profile" element={<PlayerProfileScreen />} />
          <Route path="/player-registration" element={<PlayerRegistrationScreen />} />
          <Route path="/selectors" element={<SelectorsScreen />} />
          <Route path="*" element={<Navigate to="/matches" replace />} />
        </Routes>
      </main>

      {/* Persistent Bottom Tab Navigation */}
      <BottomNav />

      {/* Side Drawer Navigation Menu */}
      <DrawerMenu />

      {/* Head-to-Head Comparison Modal */}
      <PlayerComparisonModal />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CricketProvider>
        <MainApp />
      </CricketProvider>
    </BrowserRouter>
  );
}
