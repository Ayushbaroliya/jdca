import React from 'react';

/**
 * High-fidelity Vector Icons & Logos matching Stitch UI Cricket specifications
 */

// 1. Official Cricket Scorer Emblem (Used in Welcome screen & Header)
export function CricketAppLogo({ className = "w-12 h-12", isMini = false }) {
  if (isMini) {
    return (
      <div className="relative flex items-center justify-center">
        <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="22" fill="#1B6B33" stroke="#145227" strokeWidth="1.5"/>
          {/* Cricket Pitch Ground */}
          <path d="M12 24C12 30.6274 17.3726 36 24 36C30.6274 36 36 30.6274 36 24" stroke="#48BB78" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.6"/>
          {/* Crossed Bat */}
          <rect x="14" y="11" width="5" height="22" rx="2" transform="rotate(-40 14 11)" fill="#ECC94B" stroke="#D69E2E" strokeWidth="1"/>
          <path d="M28 27L33 33" stroke="#CBD5E0" strokeWidth="2.5" strokeLinecap="round"/>
          {/* Cricket Ball */}
          <circle cx="31" cy="18" r="6.5" fill="#E53E3E" stroke="#C53030" strokeWidth="1"/>
          <path d="M26 15.5C28.5 17.5 30 20 31.5 24" stroke="white" strokeWidth="1" strokeDasharray="1.5 1.5"/>
          <path d="M30 12.5C32.5 14.5 34 17 35.5 21" stroke="white" strokeWidth="1" strokeDasharray="1.5 1.5"/>
        </svg>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center">
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="ballShine" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FF6B6B" />
            <stop offset="60%" stopColor="#D92626" />
            <stop offset="100%" stopColor="#991414" />
          </radialGradient>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E7B3B" />
            <stop offset="100%" stopColor="#0E4822" />
          </linearGradient>
          <linearGradient id="goldTrim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F6E05E" />
            <stop offset="100%" stopColor="#D69E2E" />
          </linearGradient>
        </defs>

        {/* Outer Circular Green Emblem */}
        <circle cx="50" cy="50" r="46" fill="url(#shieldGrad)" stroke="url(#goldTrim)" strokeWidth="3" />
        
        {/* Inner Turf Circle */}
        <circle cx="50" cy="50" r="38" fill="#145227" stroke="#2F855A" strokeWidth="1.5" strokeDasharray="4 3" />
        
        {/* Cricket Wickets in Background */}
        <g stroke="#ECC94B" strokeWidth="2" strokeLinecap="round" opacity="0.85">
          {/* Stumps */}
          <line x1="44" y1="32" x2="44" y2="58" />
          <line x1="50" y1="30" x2="50" y2="58" />
          <line x1="56" y1="32" x2="56" y2="58" />
          {/* Bails */}
          <line x1="42" y1="32" x2="58" y2="32" strokeWidth="2.5" />
        </g>

        {/* Cricket Bat (Angled Front) */}
        <g transform="rotate(-38 50 50)">
          {/* Blade */}
          <rect x="45" y="22" width="10" height="42" rx="3" fill="#ED8936" stroke="#C05621" strokeWidth="1.5" />
          <line x1="50" y1="24" x2="50" y2="60" stroke="#DD6B20" strokeWidth="1.5" />
          {/* Handle Grip */}
          <rect x="47" y="10" width="6" height="14" rx="2" fill="#FFFFFF" stroke="#CBD5E0" strokeWidth="1" />
          <line x1="47" y1="13" x2="53" y2="13" stroke="#718096" strokeWidth="1" />
          <line x1="47" y1="16" x2="53" y2="16" stroke="#718096" strokeWidth="1" />
          <line x1="47" y1="19" x2="53" y2="19" stroke="#718096" strokeWidth="1" />
        </g>

        {/* Cricket Ball with Seam & Stitching */}
        <g>
          <circle cx="64" cy="54" r="14" fill="url(#ballShine)" stroke="#741212" strokeWidth="1.5" />
          {/* Ball Seam Curved */}
          <path d="M54 48C58 53 62 57 66 66" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          {/* Seam Stitches */}
          <path d="M53 49L56 46M56 52L59 49M59 55L62 52M62 58L65 55M65 62L68 59" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
        </g>

        {/* Star Accents */}
        <path d="M50 14L52 18L56 19L53 22L54 26L50 24L46 26L47 22L44 19L48 18Z" fill="#F6E05E" />
      </svg>
    </div>
  );
}

// 2. Official Team Badges / Crests matching tournament graphics
export function TeamCrest({ teamName, className = "w-10 h-10", size = 40 }) {
  const name = (teamName || '').toLowerCase();

  // Eagles CC / Royal Eagles
  if (name.includes('eagle')) {
    return (
      <div className={`relative flex items-center justify-center rounded-xl bg-blue-700/10 ${className}`}>
        <svg className="w-full h-full p-1" viewBox="0 0 40 40" fill="none">
          <path d="M20 3L35 9V20C35 29 28.5 35.5 20 38C11.5 35.5 5 29 5 20V9L20 3Z" fill="#1E40AF" stroke="#60A5FA" strokeWidth="1.5"/>
          {/* Eagle head silhouette */}
          <path d="M14 18C16 14 22 13 26 15C28 16 30 18 28 21C26 21.5 23 20 22 21C20 23 18 25 14 26C15.5 23 15 21 14 18Z" fill="#FDE047"/>
          <circle cx="21" cy="16" r="1.5" fill="#1E3A8A"/>
          <path d="M12 28L20 33L28 28" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
    );
  }

  // Strikers / Jabalpur Strikers
  if (name.includes('striker')) {
    return (
      <div className={`relative flex items-center justify-center rounded-xl bg-amber-500/10 ${className}`}>
        <svg className="w-full h-full p-1" viewBox="0 0 40 40" fill="none">
          <path d="M20 3L35 9V20C35 29 28.5 35.5 20 38C11.5 35.5 5 29 5 20V9L20 3Z" fill="#C2410C" stroke="#FB923C" strokeWidth="1.5"/>
          {/* Lightning Bolt */}
          <path d="M22 10L13 22H20L17 31L28 19H20L22 10Z" fill="#FBBF24" stroke="#FFFBEB" strokeWidth="1"/>
        </svg>
      </div>
    );
  }

  // Titans / Lions / Kings
  if (name.includes('titan') || name.includes('king') || name.includes('lion')) {
    return (
      <div className={`relative flex items-center justify-center rounded-xl bg-purple-700/10 ${className}`}>
        <svg className="w-full h-full p-1" viewBox="0 0 40 40" fill="none">
          <path d="M20 3L35 9V20C35 29 28.5 35.5 20 38C11.5 35.5 5 29 5 20V9L20 3Z" fill="#581C87" stroke="#C084FC" strokeWidth="1.5"/>
          {/* Crown */}
          <path d="M12 25L14 16L18 20L20 14L22 20L26 16L28 25H12Z" fill="#FACC15" stroke="#FEF08A" strokeWidth="1"/>
          <circle cx="20" cy="27" r="1.5" fill="#FEF08A"/>
        </svg>
      </div>
    );
  }

  // Warriors / Blasters / Royals
  if (name.includes('warrior') || name.includes('royal') || name.includes('blast')) {
    return (
      <div className={`relative flex items-center justify-center rounded-xl bg-emerald-700/10 ${className}`}>
        <svg className="w-full h-full p-1" viewBox="0 0 40 40" fill="none">
          <path d="M20 3L35 9V20C35 29 28.5 35.5 20 38C11.5 35.5 5 29 5 20V9L20 3Z" fill="#065F46" stroke="#34D399" strokeWidth="1.5"/>
          {/* Crossed Bats */}
          <path d="M14 14L26 26M26 14L14 26" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="20" cy="20" r="3" fill="#DC2626"/>
        </svg>
      </div>
    );
  }

  // Default Club Shield
  return (
    <div className={`relative flex items-center justify-center rounded-xl bg-slate-800/10 ${className}`}>
      <svg className="w-full h-full p-1" viewBox="0 0 40 40" fill="none">
        <path d="M20 3L35 9V20C35 29 28.5 35.5 20 38C11.5 35.5 5 29 5 20V9L20 3Z" fill="#1E293B" stroke="#64748B" strokeWidth="1.5"/>
        <text x="20" y="24" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
          {(teamName || 'CR').slice(0, 2).toUpperCase()}
        </text>
      </svg>
    </div>
  );
}

// 3. Cricket Equipment & Action Icons
export function CricketBatIcon({ className = "w-4 h-4 text-amber-600" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m14 7 3-3 4 4-3 3" />
      <path d="m17 10-9 9a2.83 2.83 0 0 1-4-4l9-9" />
    </svg>
  );
}

export function CricketBallIcon({ className = "w-4 h-4 text-red-500" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
      <path d="M6 10C8.5 11.5 11 13 13.5 17.5" stroke="white" strokeWidth="1.5" strokeDasharray="2 1.5" />
    </svg>
  );
}

export function CricketWicketIcon({ className = "w-4 h-4 text-amber-700" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      {/* 3 Stumps */}
      <line x1="8" y1="7" x2="8" y2="20" />
      <line x1="12" y1="6" x2="12" y2="20" />
      <line x1="16" y1="7" x2="16" y2="20" />
      {/* Bails */}
      <line x1="6" y1="6" x2="18" y2="6" strokeWidth="2.5" />
    </svg>
  );
}

export function CricketKeeperGloveIcon({ className = "w-4 h-4 text-blue-600" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9a3 3 0 0 1 6 0v7a2 2 0 0 1-4 0V9" />
      <path d="M12 9a3 3 0 0 1 6 0v7a2 2 0 0 1-4 0V9" />
      <path d="M4 14a4 4 0 0 0 8 4h4a4 4 0 0 0 4-4v-3a2 2 0 0 0-2-2h-2" />
    </svg>
  );
}

// 4. Stitch-Style Bottom Navigation Icons
export function NavScoringIcon({ active }) {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="m9 15 2 2 4-4" />
    </svg>
  );
}

export function NavScorecardIcon({ active }) {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" fill={active ? "#EBF5FF" : "none"} />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
      <path d="M15 13h3" />
      <path d="M15 17h3" />
      <circle cx="6" cy="13" r="1" fill="currentColor" />
      <circle cx="6" cy="17" r="1" fill="currentColor" />
    </svg>
  );
}

export function NavAnalysisIcon({ active }) {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12A10 10 0 1 1 12 2a10 10 0 0 1 10 10Z" />
      <path d="m14 14-4 2 2-4 4-2-2 4Z" fill={active ? "currentColor" : "none"} />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

export function NavMatchesIcon({ active }) {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" fill={active ? "#EBF5FF" : "none"} />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M2 11h20" />
      <circle cx="12" cy="16" r="2" fill="currentColor" />
    </svg>
  );
}
