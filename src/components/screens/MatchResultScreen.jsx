import React, { useMemo } from 'react';
import { Trophy, ArrowRight, Newspaper, ShieldCheck } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import MatchScorecard from '../ui/MatchScorecard';
import MatchMediaReport from '../ui/MatchMediaReport';
import { calculateMatchHighlights } from '../../engine/matchSummaryEngine';

export default function MatchResultScreen() {
  const { matches = [], activeMatchId, navigateTo } = useCricket();
  const match = matches.find(m => m.id === activeMatchId) || matches.find(m => ['COMPLETED','FINISHED'].includes(m.status)) || matches[0];
  const highlights = useMemo(() => calculateMatchHighlights(match || {}), [match]);
  if (!match) return null;

  return <div className="match-result-page matches-directory-page">
    <div className="result-hero-light">
      <div><span className="result-hero-light__kicker"><Trophy size={14}/> OFFICIAL MATCH RESULT</span><h1>{match.resultText || match.result || 'Match completed'}</h1><p>{match.tournament || 'JDCA Fixture'} Â· {match.venue || 'JDCA Ground'} Â· {match.date || 'Match Day'}</p></div>
      <div className="result-hero-light__scores"><span>{match.teamA?.name}</span><strong>{match.teamA?.score || '—'}</strong><small>{match.teamA?.overs || ''}</small><i>VS</i><span>{match.teamB?.name}</span><strong>{match.teamB?.score || '—'}</strong><small>{match.teamB?.overs || ''}</small></div>
    </div>

    <div className="result-section"><div className="section-kicker"><Trophy size={15}/> COMPLETE SCORECARD</div><MatchScorecard match={match}/></div>

    <div className="result-section"><div className="section-kicker"><ShieldCheck size={15}/> MATCH HIGHLIGHTS</div><div className="result-highlight-row">
      <div><small>TOP BATTER</small><b>{highlights.topBatter?.name || '—'}</b><span>{highlights.topBatter?.stat || 'Derived from scorecard'}</span></div>
      <div><small>TOP BOWLER</small><b>{highlights.topBowler?.name || '—'}</b><span>{highlights.topBowler?.stat || 'Derived from scorecard'}</span></div>
      <div><small>BEST PARTNERSHIP</small><b>{highlights.bestPartnership?.names || '—'}</b><span>{highlights.bestPartnership?.stat || 'Derived from scorecard'}</span></div>
      <div><small>PLAYER OF THE MATCH</small><b>{highlights.playerOfMatch?.name || 'Official selection'}</b><span>{highlights.playerOfMatch?.batting || highlights.playerOfMatch?.bowling || 'Official award'}</span></div>
      <div><small>RESULT</small><b>{match.resultText || match.result || 'Match completed'}</b><span>Official Final Status</span></div>
    </div></div>
    <div className="result-section"><div className="section-kicker"><Newspaper size={15}/> MEDIA REPORT</div><MatchMediaReport match={match}/></div>
    <div className="result-actions"><button onClick={() => navigateTo('matches')} className="btn-secondary">Back to Matches Directory</button><button onClick={() => navigateTo('scorecard')} className="btn-primary">Open Official Scorecard <ArrowRight size={15}/></button></div>
  </div>;
}
