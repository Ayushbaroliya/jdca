import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCricket } from '../context/CricketContext';

// ─── Role → Allowed Routes ─────────────────────────────────────────────────
export const ROLE_PERMISSIONS = {
  SuperAdmin: '*', // full access
  Admin: '*',      // full access
  Scorer: [
    '/home', '/matches', '/match-setup', '/match-overview',
    '/scoring', '/scorecard', '/innings-break', '/match-result',
    '/teams', '/tournaments', '/news'
  ],
  Selector: [
    '/home', '/matches', '/match-overview', '/scorecard',
    '/players', '/scouting', '/player-profile', '/player-registration',
    '/selection', '/selectors',
    '/teams', '/tournaments', '/news'
  ],
  Player: [
    '/home', '/matches', '/match-overview', '/scorecard', '/player-profile',
    '/teams', '/tournaments', '/news'
  ],
};

// ─── Role → Default Landing Page After Login ──────────────────────────────
export const ROLE_HOME = {
  SuperAdmin: '/home',
  Admin:      '/home',
  Scorer:     '/home',
  Selector:   '/home',
  Player:     '/home',
};

// ─── Helper: does a role have access to a given path? ────────────────────
export function roleCanAccess(role, path) {
  const allowed = ROLE_PERMISSIONS[role];
  if (!allowed) return false;
  if (allowed === '*') return true;
  return allowed.includes(path);
}

// ─── ProtectedRoute Component ────────────────────────────────────────────
export default function ProtectedRoute({ path, element }) {
  const { isAuthenticated, userRole } = useCricket();

  if (!isAuthenticated) return <Navigate to="/" replace />;

  if (!roleCanAccess(userRole, path)) {
    return <Navigate to={ROLE_HOME[userRole] || '/home'} replace />;
  }

  return element;
}
