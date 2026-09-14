import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CricketProvider, useCricket } from './context/CricketContext';
import { AnimatePresence } from 'motion/react';
import Header   from './components/Header';
import BottomNav from './components/BottomNav';
import DrawerMenu from './components/DrawerMenu';
import Sidebar  from './components/Sidebar';
import ProtectedRoute, { ROLE_HOME } from './components/ProtectedRoute';
import AnimatedPage from './components/AnimatedPage';

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
import SelectionScreen        from './components/selection/SelectionWorkspace';
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
  const location = useLocation();
  const isAuth = currentScreen === 'welcome';

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#F7F8F4', fontFamily: "'Inter', system-ui, sans-serif", color: '#101827' }}
    >
      {/* Mobile top bar */}
      <Header />

      {/* Body: sidebar + main content */}
      <div className="flex flex-1 min-h-0 relative">
        {/* Desktop sidebar */}
        {!isAuth && <Sidebar />}

        {/* Main content area */}
        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden relative">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* Public */}
              <Route path="/"                    element={<AnimatedPage><RootRedirect /></AnimatedPage>} />

              {/* Protected */}
              <Route path="/home"                element={<ProtectedRoute path="/home"                element={<AnimatedPage><HomeScreen /></AnimatedPage>} />} />
              <Route path="/matches"             element={<ProtectedRoute path="/matches"             element={<AnimatedPage><MatchesScreen /></AnimatedPage>} />} />
              <Route path="/match-setup"         element={<ProtectedRoute path="/match-setup"         element={<AnimatedPage><MatchSetupScreen /></AnimatedPage>} />} />
              <Route path="/scoring"             element={<ProtectedRoute path="/scoring"             element={<AnimatedPage><ScoringScreen /></AnimatedPage>} />} />
              <Route path="/scorecard"           element={<ProtectedRoute path="/scorecard"           element={<AnimatedPage><ScorecardScreen /></AnimatedPage>} />} />
              <Route path="/match-detail"        element={<ProtectedRoute path="/match-detail"        element={<AnimatedPage><MatchDetailScreen /></AnimatedPage>} />} />
              <Route path="/match-overview"      element={<ProtectedRoute path="/match-overview"      element={<AnimatedPage><MatchOverviewScreen /></AnimatedPage>} />} />
              <Route path="/innings-break"       element={<ProtectedRoute path="/innings-break"       element={<AnimatedPage><InningsBreakScreen /></AnimatedPage>} />} />
              <Route path="/match-result"        element={<ProtectedRoute path="/match-result"        element={<AnimatedPage><MatchResultScreen /></AnimatedPage>} />} />
              <Route path="/tournaments"         element={<ProtectedRoute path="/tournaments"         element={<AnimatedPage><TournamentsScreen /></AnimatedPage>} />} />
              <Route path="/players"             element={<ProtectedRoute path="/players"             element={<AnimatedPage><PlayersScreen /></AnimatedPage>} />} />
              <Route path="/player-profile"      element={<ProtectedRoute path="/player-profile"      element={<AnimatedPage><PlayerProfileScreen /></AnimatedPage>} />} />
              <Route path="/player-registration" element={<ProtectedRoute path="/player-registration" element={<AnimatedPage><PlayerRegistrationScreen /></AnimatedPage>} />} />
              <Route path="/selection"           element={<ProtectedRoute path="/selection"           element={<AnimatedPage><SelectionScreen /></AnimatedPage>} />} />
              <Route path="/administration"      element={<ProtectedRoute path="/administration"      element={<AnimatedPage><AdministrationScreen /></AnimatedPage>} />} />

              {/* Legacy aliases */}
              <Route path="/scouting"            element={<Navigate to="/players" replace />} />
              <Route path="/selectors"           element={<Navigate to="/selection" replace />} />
              <Route path="/access-control"      element={<Navigate to="/administration" replace />} />

              {/* Fallback */}
              <Route path="*"                    element={<Navigate to="/home" replace />} />
            </Routes>
          </AnimatePresence>
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
