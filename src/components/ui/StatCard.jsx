import React from 'react';

/**
 * JDCA StatCard — for dashboard stat strips and player profiles
 * Clean UI styling with subtle solid accents
 */
const SOLID_THEMES = {
  blue: {
    bg: 'bg-white border-l-4 border-l-blue-500 border-slate-200 shadow-sm',
    iconBg: 'bg-blue-50 text-blue-600 border border-blue-100',
    val: 'text-slate-900',
    lbl: 'text-slate-500',
    sub: 'text-slate-400',
  },
  emerald: {
    bg: 'bg-white border-l-4 border-l-emerald-500 border-slate-200 shadow-sm',
    iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    val: 'text-slate-900',
    lbl: 'text-slate-500',
    sub: 'text-slate-400',
  },
  amber: {
    bg: 'bg-white border-l-4 border-l-amber-500 border-slate-200 shadow-sm',
    iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
    val: 'text-slate-900',
    lbl: 'text-slate-500',
    sub: 'text-slate-400',
  },
  purple: {
    bg: 'bg-white border-l-4 border-l-purple-500 border-slate-200 shadow-sm',
    iconBg: 'bg-purple-50 text-purple-600 border border-purple-100',
    val: 'text-slate-900',
    lbl: 'text-slate-500',
    sub: 'text-slate-400',
  },
  rose: {
    bg: 'bg-white border-l-4 border-l-rose-500 border-slate-200 shadow-sm',
    iconBg: 'bg-rose-50 text-rose-600 border border-rose-100',
    val: 'text-slate-900',
    lbl: 'text-slate-500',
    sub: 'text-slate-400',
  },
  cyan: {
    bg: 'bg-white border-l-4 border-l-cyan-500 border-slate-200 shadow-sm',
    iconBg: 'bg-cyan-50 text-cyan-600 border border-cyan-100',
    val: 'text-slate-900',
    lbl: 'text-slate-500',
    sub: 'text-slate-400',
  },
  orange: {
    bg: 'bg-white border-l-4 border-l-orange-500 border-slate-200 shadow-sm',
    iconBg: 'bg-orange-50 text-orange-600 border border-orange-100',
    val: 'text-slate-900',
    lbl: 'text-slate-500',
    sub: 'text-slate-400',
  },
};

const TONE_MAP = {
  primary: 'blue',
  success: 'emerald',
  warning: 'amber',
  info: 'cyan',
  danger: 'rose',
};

const THEME_KEYS = ['blue', 'emerald', 'amber', 'purple', 'rose', 'cyan', 'orange'];

export function StatCard({
  value,
  label,
  subtext,
  icon: Icon,
  tone,
  color,
  accent,
  bg,
  size = 'md',
  className = '',
  index = 0
}) {
  const sizes = {
    sm: { val: 'text-xl font-bold', lbl: 'text-xs', pad: 'p-3.5', icon: 16 },
    md: { val: 'text-2xl font-black', lbl: 'text-xs', pad: 'p-4', icon: 18 },
    lg: { val: 'text-3xl font-black', lbl: 'text-sm', pad: 'p-5', icon: 20 },
  };
  const s = sizes[size] || sizes.md;

  const selectedThemeKey = color || (tone && TONE_MAP[tone]) || THEME_KEYS[index % THEME_KEYS.length];
  const theme = SOLID_THEMES[selectedThemeKey] || SOLID_THEMES.blue;

  return (
    <div
      className={`rounded-2xl ${s.pad} flex flex-col justify-between border hover:shadow-md transition-all duration-300 ${theme.bg} ${className}`}
      style={bg ? { background: bg } : undefined}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`${s.lbl} font-bold uppercase tracking-wider ${theme.lbl}`}>
          {label}
        </span>
        {Icon && (
          <div className={`p-1.5 rounded-xl ${theme.iconBg}`}>
            <Icon size={s.icon} strokeWidth={2.4} />
          </div>
        )}
      </div>

      <div className={`${s.val} font-tabular tracking-tight leading-none ${theme.val}`}>
        {value}
      </div>

      {subtext && (
        <div className={`text-xs font-medium mt-1.5 ${theme.sub}`}>
          {subtext}
        </div>
      )}
    </div>
  );
}

/**
 * StatStrip — horizontal row of stats with solid colored cards
 */
export function StatStrip({ stats, className = '' }) {
  return (
    <div className={`grid gap-3 ${className}`} style={{ gridTemplateColumns: `repeat(${stats.length}, 1fr)` }}>
      {stats.map((stat, i) => (
        <StatCard
          key={i}
          index={i}
          value={stat.value}
          label={stat.label}
          subtext={stat.subtext}
          icon={stat.icon}
          tone={stat.tone}
          color={stat.color}
          accent={stat.accent}
          size={stat.size || 'sm'}
        />
      ))}
    </div>
  );
}

export default StatCard;
