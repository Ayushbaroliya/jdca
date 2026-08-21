import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCricket } from '../context/CricketContext';

// ─── Role → Allowed Routes ─────────────────────────────────────────────────
export const ROLE_PERMISSIONS = {
  Admin: '*', // full access
  Scorer: [
    '/matches',
    '/match-overview',
    '/scoring',
    '/scorecard',
    '/innings-break',
    '/match-result',
  ],
  Selector: [
    '/matches',
    '/match-overview',
    '/scorecard',
    '/scouting',
    '/player-profile',
    '/selectors',
  ],
  Player: [
    '/matches',
    '/match-overview',
    '/scorecard',
    '/player-profile',
  ],
};

// ─── Role → Default Landing Page After Login ──────────────────────────────
export const ROLE_HOME = {
  Admin:    '/matches',
  Scorer:   '/matches',
  Selector: '/scouting',
  Player:   '/matches',
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

  // Not logged in → go to auth
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Logged in but not allowed → go to role home
  if (!roleCanAccess(userRole, path)) {
    return <Navigate to={ROLE_HOME[userRole] || '/matches'} replace />;
  }

  return element;
}
