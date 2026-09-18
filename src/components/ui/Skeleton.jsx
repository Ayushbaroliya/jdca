import React from 'react';

export default function Skeleton({ className = '', variant = 'rectangular' }) {
  // A clean, subtle skeleton component
  const baseClasses = 'animate-pulse bg-slate-200/60';
  const variantClasses = variant === 'circular' ? 'rounded-full' : 'rounded-md';
  
  return (
    <div className={`${baseClasses} ${variantClasses} ${className}`} />
  );
}
