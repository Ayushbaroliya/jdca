import React from 'react';
import { X, Sliders, CheckCircle, Sparkles } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';

export default function PlayerComparisonModal() {
  const { 
    compareModalOpen, 
    setCompareModalOpen, 
    selectedPlayer, 
    comparePlayer2, 
    setComparePlayer2, 
    players 
  } = useCricket();

  if (!compareModalOpen) return null;

  const p1 = selectedPlayer;
  const p2 = comparePlayer2;

  const metrics = [
    { label: 'Career Runs', v1: p1.careerRuns, v2: p2.careerRuns, higherIsBetter: true },
    { label: 'Batting Avg', v1: p1.battingAvg, v2: p2.battingAvg, higherIsBetter: true },
    { label: 'Strike Rate', v1: p1.strikeRate, v2: p2.strikeRate, higherIsBetter: true },
    { label: 'Matches', v1: p1.matches, v2: p2.matches, higherIsBetter: true },
    { label: '50s / 100s', v1: `${p1.fifties} / ${p1.hundreds}`, v2: `${p2.fifties} / ${p2.hundreds}`, rawV1: p1.fifties + p1.hundreds * 2, rawV2: p2.fifties + p2.hundreds * 2, higherIsBetter: true },
    { label: 'Off-Side Scoring %', v1: `${p1.scoringAreas.offSide}%`, v2: `${p2.scoringAreas.offSide}%`, rawV1: p1.scoringAreas.offSide, rawV2: p2.scoringAreas.offSide, higherIsBetter: true },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-[#0B57D0]" />
            <h3 className="text-lg font-extrabold text-slate-900 font-display">
              Head-to-Head Player Comparison
            </h3>
          </div>
          <button
            onClick={() => setCompareModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2-Player Header */}
        <div className="grid grid-cols-2 gap-3 py-2">
          {/* Player 1 */}
          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex flex-col items-center text-center">
            <img
              src={p1.avatar}
              alt={p1.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500 shadow-xs mb-2"
            />
            <h4 className="font-extrabold text-sm text-slate-900">{p1.name}</h4>
            <span className="text-[10px] font-bold text-blue-700">{p1.district}</span>
          </div>

          {/* Player 2 with Selector */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center">
            <img
              src={p2.avatar}
              alt={p2.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-300 shadow-xs mb-2"
            />
            
            <select
              value={p2.id}
              onChange={(e) => {
                const found = players.find((p) => p.id === e.target.value);
                if (found) setComparePlayer2(found);
              }}
              className="w-full text-center text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded-lg py-1 px-1 outline-none"
            >
              {players.filter((p) => p.id !== p1.id).map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <span className="text-[10px] font-medium text-slate-400 mt-0.5">{p2.district}</span>
          </div>
        </div>

        {/* Comparison Metrics Rows */}
        <div className="space-y-2 pt-1">
          {metrics.map((m, idx) => {
            const raw1 = m.rawV1 !== undefined ? m.rawV1 : m.v1;
            const raw2 = m.rawV2 !== undefined ? m.rawV2 : m.v2;
            const p1Wins = raw1 > raw2;
            const p2Wins = raw2 > raw1;

            return (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div className={`font-extrabold text-sm ${p1Wins ? 'text-blue-700 font-black' : 'text-slate-700'}`}>
                  {m.v1} {p1Wins && '★'}
                </div>

                <div className="font-bold text-slate-400 uppercase tracking-wider text-[11px] text-center">
                  {m.label}
                </div>

                <div className={`font-extrabold text-sm ${p2Wins ? 'text-emerald-700 font-black' : 'text-slate-700'}`}>
                  {p2Wins && '★ '} {m.v2}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Button */}
        <button
          onClick={() => setCompareModalOpen(false)}
          className="w-full py-3 bg-[#0B57D0] hover:bg-blue-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md"
        >
          Close Comparison
        </button>

      </div>
    </div>
  );
}
