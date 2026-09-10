import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CricketProvider, useCricket } from './context/CricketContext';
import Header   from './components/Header';
import BottomNav from './components/BottomNav';
import DrawerMenu from './components/DrawerMenu';
import Sidebar  from './components/Sidebar';
import ProtectedRoute, { ROLE_HOME } from './components/ProtectedRoute';

// ── Screens ────────────────────────────────────────────────────
import AuthScreen             from './components/screens/AuthScreen';
import HomeScreen             from './components/screens/HomeScreen';
import MatchesScreen          from './components/screens/MatchesScreen';
import MatchSetupScreen       from './components/screens/MatchSetupScreen';
import ScoringScreen          from './components/screens/ScoringScreen';
import ScorecardScreen        from './components/screens/ScorecardScreen';
import MatchOverviewScreen    from './components/screens/MatchOverviewScreen';
import MatchDetailScreen      from './components/screens/MatchDetailScreen';
import InningsBreakScreen     from './components/screens/InningsBreakScreen';
import MatchResultScreen      from './components/screens/MatchResultScreen';
import TournamentsScreen      from './components/screens/TournamentsScreen';
import PlayersScreen          from './components/screens/PlayersScreen';
import PlayerProfileScreen    from './components/screens/PlayerProfileScreen';
import PlayerRegistrationScreen from './components/screens/PlayerRegistrationScreen';
import SelectionScreen        from './components/screens/SelectionScreen';
import AdministrationScreen   from './components/screens/AdministrationScreen';
import PlayerComparisonModal  from './components/screens/PlayerComparisonModal';

// Legacy / still in use
import ScoutingHubScreen      from './components/screens/ScoutingHubScreen';
import SelectorsScreen        from './components/screens/SelectorsScreen';
import AccessControlScreen    from './components/screens/AccessControlScreen';

// Auth-aware root redirect
function RootRedirect() {
  const { isAuthenticated, userRole } = useCricket();
  if (isAuthenticated) {
    return <Navigate to={ROLE_HOME[userRole] || '/home'} replace />;
  }
  return <AuthScreen />;
}

function MainApp() {
  const { currentScreen } = useCricket();
  const isAuth = currentScreen === 'welcome';

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#F7F8F4', fontFamily: "'Inter', system-ui, sans-serif", color: '#101827' }}
    >
      {/* Mobile top bar */}
      <Header />

      {/* Body: sidebar + main content */}
      <div className="flex flex-1 min-h-0">
        {/* Desktop sidebar */}
        {!isAuth && <Sidebar />}

        {/* Main content area */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          <Routes>
            {/* Public */}
            <Route path="/"                    element={<RootRedirect />} />

            {/* Protected */}
            <Route path="/home"                element={<ProtectedRoute path="/home"                element={<HomeScreen />} />} />
            <Route path="/matches"             element={<ProtectedRoute path="/matches"             element={<MatchesScreen />} />} />
            <Route path="/match-setup"         element={<ProtectedRoute path="/match-setup"         element={<MatchSetupScreen />} />} />
            <Route path="/scoring"             element={<ProtectedRoute path="/scoring"             element={<ScoringScreen />} />} />
            <Route path="/scorecard"           element={<ProtectedRoute path="/scorecard"           element={<ScorecardScreen />} />} />
            <Route path="/match-detail"         element={<ProtectedRoute path="/match-detail"         element={<MatchDetailScreen />} />} />
            <Route path="/match-overview"      element={<ProtectedRoute path="/match-overview"      element={<MatchOverviewScreen />} />} />
            <Route path="/innings-break"       element={<ProtectedRoute path="/innings-break"       element={<InningsBreakScreen />} />} />
            <Route path="/match-result"        element={<ProtectedRoute path="/match-result"        element={<MatchResultScreen />} />} />
            <Route path="/tournaments"         element={<ProtectedRoute path="/tournaments"         element={<TournamentsScreen />} />} />
            <Route path="/players"             element={<ProtectedRoute path="/players"             element={<PlayersScreen />} />} />
            <Route path="/player-profile"      element={<ProtectedRoute path="/player-profile"      element={<PlayerProfileScreen />} />} />
            <Route path="/player-registration" element={<ProtectedRoute path="/player-registration" element={<PlayerRegistrationScreen />} />} />
            <Route path="/selection"           element={<ProtectedRoute path="/selection"           element={<SelectionScreen />} />} />
            <Route path="/administration"      element={<ProtectedRoute path="/administration"      element={<AdministrationScreen />} />} />

            {/* Legacy aliases */}
            <Route path="/scouting"            element={<Navigate to="/players" replace />} />
            <Route path="/selectors"           element={<Navigate to="/selection" replace />} />
            <Route path="/access-control"      element={<Navigate to="/administration" replace />} />

            {/* Fallback */}
            <Route path="*"                    element={<Navigate to="/home" replace />} />
          </Routes>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav />

      {/* Slide-out drawer (mobile More menu) */}
      <DrawerMenu />

      {/* Player comparison modal */}
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
