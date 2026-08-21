import React from 'react';

/**
 * Premium Scalable SVG Illustrations for Cricket Scorer App
 */

// 1. Stadium Hero Vector Illustration (Stadium under Floodlights & Outfield)
export function CricketStadiumHeroIllustration({ className = "w-full h-44" }) {
  return (
    <div className={`relative overflow-hidden rounded-3xl ${className}`}>
      <svg
        viewBox="0 0 800 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
      >
        <defs>
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B192C" />
            <stop offset="50%" stopColor="#1E3E62" />
            <stop offset="100%" stopColor="#000000" />
          </linearGradient>
          <radialGradient id="floodLight1" cx="20%" cy="10%" r="60%">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#1E3E62" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="floodLight2" cx="80%" cy="10%" r="60%">
            <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#1E3E62" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="grassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#15803D" />
            <stop offset="50%" stopColor="#166534" />
            <stop offset="100%" stopColor="#14532D" />
          </linearGradient>
          <linearGradient id="pitchGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
        </defs>

        {/* Night Sky Background */}
        <rect width="800" height="360" fill="url(#skyGrad)" />

        {/* Floodlight Beams */}
        <circle cx="160" cy="40" r="280" fill="url(#floodLight1)" />
        <circle cx="640" cy="40" r="280" fill="url(#floodLight2)" />

        {/* Stadium Tier Stands Silhouette */}
        <path
          d="M0 200 Q 400 130 800 200 L800 360 L0 360 Z"
          fill="#0F172A"
          opacity="0.85"
        />
        {/* Crowd Light Flecks */}
        <g fill="#F8FAFC" opacity="0.15">
          <circle cx="120" cy="185" r="1.5" /><circle cx="160" cy="178" r="1.2" /><circle cx="210" cy="170" r="1.5" />
          <circle cx="280" cy="162" r="1.2" /><circle cx="340" cy="158" r="1.5" /><circle cx="400" cy="155" r="1.8" />
          <circle cx="460" cy="158" r="1.2" /><circle cx="520" cy="162" r="1.5" /><circle cx="590" cy="170" r="1.2" />
          <circle cx="660" cy="180" r="1.5" /><circle cx="720" cy="190" r="1.5" />
        </g>

        {/* Floodlight Towers */}
        <g stroke="#94A3B8" strokeWidth="2.5" opacity="0.9">
          {/* Left Tower */}
          <line x1="140" y1="170" x2="155" y2="40" />
          <line x1="170" y1="170" x2="155" y2="40" />
          <line x1="145" y1="110" x2="165" y2="110" />
          <rect x="140" y="30" width="30" height="14" rx="2" fill="#E2E8F0" />
          {/* Right Tower */}
          <line x1="630" y1="170" x2="645" y2="40" />
          <line x1="660" y1="170" x2="645" y2="40" />
          <line x1="635" y1="110" x2="655" y2="110" />
          <rect x="630" y="30" width="30" height="14" rx="2" fill="#E2E8F0" />
        </g>

        {/* Stadium Outfield Grass Bowl */}
        <ellipse cx="400" cy="270" rx="380" ry="120" fill="url(#grassGrad)" stroke="#22C55E" strokeWidth="3" />
        
        {/* Mowing Grass Ring Patterns */}
        <ellipse cx="400" cy="270" rx="320" ry="95" fill="none" stroke="#16A34A" strokeWidth="6" opacity="0.4" />
        <ellipse cx="400" cy="270" rx="250" ry="72" fill="none" stroke="#22C55E" strokeWidth="5" opacity="0.3" />
        <ellipse cx="400" cy="270" rx="170" ry="48" fill="none" stroke="#15803D" strokeWidth="4" opacity="0.5" />

        {/* 30-Yard Circle Marker */}
        <ellipse cx="400" cy="270" rx="210" ry="60" fill="none" stroke="#FEF08A" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />

        {/* Central 22-Yard Pitch Strip */}
        <polygon
          points="375,225 425,225 440,315 360,315"
          fill="url(#pitchGrad)"
          stroke="#92400E"
          strokeWidth="1.5"
        />
        {/* Crease Lines (Bowling and Popping Crease) */}
        <line x1="373" y1="240" x2="427" y2="240" stroke="#FFFFFF" strokeWidth="2" />
        <line x1="362" y1="300" x2="438" y2="300" stroke="#FFFFFF" strokeWidth="2.5" />

        {/* Bowling Stumps (Far end & Near end) */}
        <g stroke="#FEF08A" strokeWidth="1.5">
          <line x1="397" y1="233" x2="397" y2="242" />
          <line x1="400" y1="233" x2="400" y2="242" />
          <line x1="403" y1="233" x2="403" y2="242" />
          <line x1="395" y1="233" x2="405" y2="233" strokeWidth="2" />
        </g>
        <g stroke="#FEF08A" strokeWidth="2">
          <line x1="396" y1="295" x2="396" y2="308" />
          <line x1="400" y1="295" x2="400" y2="308" />
          <line x1="404" y1="295" x2="404" y2="308" />
          <line x1="393" y1="295" x2="407" y2="295" strokeWidth="2.5" />
        </g>

        {/* Glowing Ambient Badge in Top Corner */}
        <g transform="translate(680, 20)">
          <rect width="90" height="28" rx="8" fill="#1E293B" fillOpacity="0.8" stroke="#3B82F6" strokeWidth="1" />
          <circle cx="16" cy="14" r="4" fill="#EF4444" className="animate-pulse" />
          <text x="28" y="18" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="sans-serif">MATCH LIVE</text>
        </g>
      </svg>
    </div>
  );
}

// 2. Action Batsman Vector Illustration (Dynamic Cover Drive Pose)
export function CricketBatsmanActionIllustration({ className = "w-32 h-32" }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <linearGradient id="batWood" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
          <linearGradient id="jerseyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1E40AF" />
          </linearGradient>
          <radialGradient id="ballGlow" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#991B1B" />
          </radialGradient>
        </defs>

        {/* Motion Speed Lines */}
        <path d="M40 140 Q 90 130 160 110" stroke="#93C5FD" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
        <path d="M50 155 Q 100 145 150 130" stroke="#60A5FA" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />

        {/* Cricket Ball with Speed Trail */}
        <g>
          <circle cx="170" cy="100" r="10" fill="url(#ballGlow)" stroke="#7F1D1D" strokeWidth="1.5" />
          <path d="M163 96C166 100 170 104 174 107" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Back Leg (Bent knee in stride) */}
        <path d="M80 135 L65 170 L50 175" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M60 150 L55 175" stroke="#E2E8F0" strokeWidth="12" strokeLinecap="round" />

        {/* Front Leg (Forward press with batting pad) */}
        <path d="M98 128 L125 155 L138 178" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="110" y="140" width="22" height="36" rx="4" transform="rotate(22 110 140)" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />

        {/* Torso & Jersey */}
        <path d="M85 85 L105 82 L112 125 L82 128 Z" fill="url(#jerseyGrad)" rx="6" />
        {/* Collar & Accent */}
        <path d="M92 84 L102 83 L98 94 Z" fill="#FBBF24" />

        {/* Head & Cricket Helmet with Grill */}
        <circle cx="102" cy="65" r="14" fill="#1E3A8A" stroke="#1E40AF" strokeWidth="1.5" />
        {/* Helmet Visor */}
        <path d="M106 64 L122 66 L118 72 L106 70 Z" fill="#1E293B" />
        {/* Steel Face Guard Grill */}
        <path d="M110 68 L118 76 L112 80" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" fill="none" />
        <line x1="110" y1="73" x2="117" y2="73" stroke="#94A3B8" strokeWidth="1.5" />

        {/* Arms & Hands Holding Bat (Cover Drive Follow-through) */}
        <path d="M90 90 L115 105 L135 98" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="135" cy="98" r="6" fill="#3B82F6" />

        {/* Cricket Bat */}
        <g transform="rotate(42 135 98)">
          {/* Handle */}
          <rect x="133" y="65" width="5" height="32" rx="2" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1" />
          {/* Blade */}
          <rect x="129" y="94" width="13" height="52" rx="3" fill="url(#batWood)" stroke="#92400E" strokeWidth="1.5" />
          <line x1="135" y1="96" x2="135" y2="142" stroke="#D97706" strokeWidth="1" />
        </g>
      </svg>
    </div>
  );
}

// 3. Golden Championship Trophy Vector Illustration
export function CricketTrophyBannerIllustration({ className = "w-28 h-28" }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
        <defs>
          <linearGradient id="goldCup" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="40%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#CA8A04" />
          </linearGradient>
          <linearGradient id="standGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
        </defs>

        {/* Golden Radiance Rays */}
        <g opacity="0.6">
          <line x1="80" y1="15" x2="80" y2="5" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
          <line x1="125" y1="35" x2="135" y2="28" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
          <line x1="35" y1="35" x2="25" y2="28" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* Trophy Handles */}
        <path d="M42 45 C20 45 20 75 46 82" stroke="url(#goldCup)" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M118 45 C140 45 140 75 114 82" stroke="url(#goldCup)" strokeWidth="6" strokeLinecap="round" fill="none" />

        {/* Trophy Main Cup */}
        <path
          d="M45 35 L115 35 C115 35 112 85 80 95 C48 85 45 35 45 35 Z"
          fill="url(#goldCup)"
          stroke="#A16207"
          strokeWidth="2"
        />

        {/* Embossed Cricket Ball on Trophy */}
        <circle cx="80" cy="58" r="14" fill="#B45309" stroke="#FDE047" strokeWidth="1.5" />
        <path d="M72 52 C76 56 80 60 84 65" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />

        {/* Trophy Stem & Neck */}
        <path d="M72 95 L88 95 L84 116 L76 116 Z" fill="url(#goldCup)" stroke="#A16207" strokeWidth="1.5" />

        {/* Base Pedestal */}
        <rect x="52" y="116" width="56" height="12" rx="3" fill="url(#goldCup)" stroke="#A16207" strokeWidth="1" />
        <rect x="44" y="128" width="72" height="20" rx="4" fill="url(#standGrad)" stroke="#1E293B" strokeWidth="1.5" />
        
        {/* Nameplate on Base */}
        <rect x="54" y="133" width="52" height="10" rx="2" fill="#FBBF24" />
        <text x="80" y="140" textAnchor="middle" fill="#78350F" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif">CHAMPIONS</text>
      </svg>
    </div>
  );
}

// 4. Scouting Analytics Vector Badge / Radar Graphic
export function CricketScoutingRadarIllustration({ className = "w-24 h-24" }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Radar Concentric Rings */}
        <circle cx="70" cy="70" r="58" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
        <circle cx="70" cy="70" r="42" stroke="#60A5FA" strokeWidth="1.5" opacity="0.5" />
        <circle cx="70" cy="70" r="24" stroke="#93C5FD" strokeWidth="1.5" opacity="0.6" />

        {/* Crosshairs */}
        <line x1="70" y1="8" x2="70" y2="132" stroke="#3B82F6" strokeWidth="1.5" opacity="0.5" />
        <line x1="8" y1="70" x2="132" y2="70" stroke="#3B82F6" strokeWidth="1.5" opacity="0.5" />

        {/* Radar Polygon Shape (Player Skill Footprint) */}
        <polygon
          points="70,22 108,55 92,106 48,98 34,50"
          fill="url(#radarFill)"
          stroke="#2563EB"
          strokeWidth="2.5"
        />

        {/* Radar Stat Nodes */}
        <circle cx="70" cy="22" r="4" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1.5" />
        <circle cx="108" cy="55" r="4" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1.5" />
        <circle cx="92" cy="106" r="4" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1.5" />
        <circle cx="48" cy="98" r="4" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1.5" />
        <circle cx="34" cy="50" r="4" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1.5" />
      </svg>
    </div>
  );
}
