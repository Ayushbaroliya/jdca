import React, { useState } from 'react';
import { useCricket } from '../../context/CricketContext';
import { Megaphone, Bell, Calendar, ChevronRight } from 'lucide-react';

const ANNOUNCEMENT_THEMES = {
  Alert: 'bg-rose-50 text-rose-900 border-rose-200 tag-bg-rose-100 tag-text-rose-700',
  Circular: 'bg-blue-50 text-blue-900 border-blue-200 tag-bg-blue-100 tag-text-blue-700',
  Trial: 'bg-emerald-50 text-emerald-900 border-emerald-200 tag-bg-emerald-100 tag-text-emerald-700',
  Update: 'bg-amber-50 text-amber-900 border-amber-200 tag-bg-amber-100 tag-text-amber-700',
};

export default function NewsScreen() {
  const { announcements = [] } = useCricket();
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'Alert', 'Circular', 'Trial', 'Update'];

  const filteredAnnouncements = activeTab === 'All' 
    ? announcements 
    : announcements.filter(a => a.type === activeTab);

  return (
    <div className="pb-[100px] bg-slate-50 min-h-screen">
      <div className="pt-6 px-4 pb-4 bg-white/95 backdrop-blur-md sticky top-0 z-30 border-b border-gray-200 shadow-2xs">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 mb-4">
          <Megaphone className="text-rose-600" size={24} />
          News & Notices
        </h1>
        
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                activeTab === tab 
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-6 space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="text-center py-12 px-4 bg-white rounded-2xl border border-gray-100 mt-4 shadow-sm">
            <Bell size={32} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">No Notices Found</h3>
            <p className="text-xs text-slate-500">There are no {activeTab !== 'All' ? activeTab : ''} announcements at this time.</p>
          </div>
        ) : (
          filteredAnnouncements.map((ann, idx) => {
            const theme = ANNOUNCEMENT_THEMES[ann.type] || ANNOUNCEMENT_THEMES['Update'];
            const cardStyle = theme.split(' ').filter(c => c.startsWith('bg-') || c.startsWith('text-') || c.startsWith('border-')).join(' ');
            
            let tagBg = 'bg-amber-100 text-amber-700';
            if (theme.includes('tag-bg-rose-100')) tagBg = 'bg-rose-100 text-rose-700';
            if (theme.includes('tag-bg-blue-100')) tagBg = 'bg-blue-100 text-blue-700';
            if (theme.includes('tag-bg-emerald-100')) tagBg = 'bg-emerald-100 text-emerald-700';

            return (
              <div
                key={ann.id || idx}
                className={`p-4 sm:p-5 rounded-2xl ${cardStyle} border hover:scale-[1.01] hover:shadow-md shadow-sm transition-all cursor-pointer relative overflow-hidden group`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <span className={`text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-md backdrop-blur-xs w-fit ${tagBg}`}>
                    {ann.type}
                  </span>
                  <span className="text-xs opacity-70 font-bold flex items-center gap-1.5">
                    <Calendar size={12} /> {ann.date}
                  </span>
                </div>
                <div className="text-base font-black leading-tight mb-2 pr-6 group-hover:text-rose-700 transition-colors">
                  {ann.title}
                </div>
                <p className="text-sm opacity-90 leading-relaxed font-semibold">
                  {ann.body}
                </p>
                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-50 transition-all -translate-x-4 group-hover:translate-x-0" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
