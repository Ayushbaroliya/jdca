import React from 'react';

/**
 * JDCA StatCard — for dashboard stat strips and player profiles
 * size: 'sm' | 'md' | 'lg'
 */
export function StatCard({ value, label, icon: Icon, accent = '#2457D6', bg = '#ffffff', size = 'md', className = '' }) {
  const sizes = {
    sm: { val: 'text-xl font-bold', lbl: 'text-[11px]', pad: 'p-3' },
    md: { val: 'text-2xl font-bold', lbl: 'text-xs', pad: 'p-4' },
    lg: { val: 'text-3xl font-extrabold', lbl: 'text-sm', pad: 'p-5' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div
      className={`jdca-card ${s.pad} flex flex-col gap-1 ${className}`}
      style={{ background: bg }}
    >
      {Icon && (
        <div className="mb-1">
          <Icon size={16} style={{ color: accent }} strokeWidth={2.2} />
        </div>
      )}
      <span className={`${s.val} font-tabular`} style={{ color: '#101827', lineHeight: 1 }}>
        {value}
      </span>
      <span className={`${s.lbl} font-medium`} style={{ color: '#596579' }}>
        {label}
      </span>
    </div>
  );
}

/**
 * StatStrip — horizontal row of stats (dashboard, scorecard summary)
 */
export function StatStrip({ stats, className = '' }) {
  return (
    <div className={`grid gap-3 ${className}`} style={{ gridTemplateColumns: `repeat(${stats.length}, 1fr)` }}>
      {stats.map((stat, i) => (
        <StatCard
          key={i}
          value={stat.value}
          label={stat.label}
          icon={stat.icon}
          accent={stat.accent}
          size={stat.size || 'sm'}
        />
      ))}
    </div>
  );
}

export default StatCard;
