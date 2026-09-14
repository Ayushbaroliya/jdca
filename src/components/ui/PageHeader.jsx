import React from 'react';

/**
 * JDCA PageHeader — consistent section heading across all screens
 * Used at the top of every major section.
 */
export function PageHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`page-header flex items-start justify-between mb-5 ${className}`}>
      <div>
        <h1 className="text-2xl font-bold page-title" style={{ color: '#101827', letterSpacing: '-0.035em' }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm mt-0.5" style={{ color: '#596579' }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <div className="flex-shrink-0 ml-4 mt-1">
          {action}
        </div>
      )}
    </div>
  );
}

/**
 * SectionLabel — small section sub-header above content groups
 */
export function SectionLabel({ children, className = '' }) {
  return (
    <div className={`section-label mb-3 ${className}`}>
      {children}
    </div>
  );
}

/**
 * TabBar — horizontal tab navigation within a screen
 */
export function TabBar({ tabs, active, onChange, className = '' }) {
  return (
    <div
      className={`flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 ${className}`}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = active === (tab.id || tab);
        const label = tab.label || tab;
        const id = tab.id || tab;
        return (
          <button
            key={id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(id)}
            className="page-tab flex-shrink-0 px-3 py-2 text-sm font-semibold transition-all cursor-pointer whitespace-nowrap"
            style={{
              background: isActive ? '#2457D6' : 'transparent',
              color: isActive ? '#ffffff' : '#596579',
              border: isActive ? 'none' : '1px solid transparent',
            }}
          >
            {tab.icon && <span className="mr-1.5">{tab.icon}</span>}
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default PageHeader;
