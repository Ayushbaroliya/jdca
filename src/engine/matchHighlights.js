/**
 * JDCA Match Highlights Engine
 * Calculates deterministic highlights based on structured scorecard data.
 */

export function calculateMatchHighlights(scorecard1, scorecard2) {
  const allBatters = [];
  const allBowlers = [];

  if (scorecard1) {
    allBatters.push(...Object.values(scorecard1.batting));
    allBowlers.push(...Object.values(scorecard1.bowling));
  }
  if (scorecard2) {
    allBatters.push(...Object.values(scorecard2.batting));
    allBowlers.push(...Object.values(scorecard2.bowling));
  }

  // Top Batter: Sort by runs, then strike rate
  const sortedBatters = allBatters.sort((a, b) => {
    if (b.runs !== a.runs) return b.runs - a.runs;
    return parseFloat(b.strikeRate) - parseFloat(a.strikeRate);
  });
  const topBatter = sortedBatters.length > 0 ? sortedBatters[0] : null;

  // Top Bowler: Sort by wickets, then economy
  const sortedBowlers = allBowlers.sort((a, b) => {
    if (b.wickets !== a.wickets) return b.wickets - a.wickets;
    return parseFloat(a.economy) - parseFloat(b.economy);
  });
  const topBowler = sortedBowlers.length > 0 ? sortedBowlers[0] : null;

  // Simple POTM heuristic (can be expanded)
  // Give points: 1 point per run, 20 points per wicket
  let potm = null;
  let maxPoints = -1;

  const playerPoints = {};
  allBatters.forEach(b => {
    playerPoints[b.id] = (playerPoints[b.id] || 0) + b.runs;
  });
  allBowlers.forEach(b => {
    playerPoints[b.id] = (playerPoints[b.id] || 0) + (b.wickets * 20);
  });

  Object.entries(playerPoints).forEach(([id, points]) => {
    if (points > maxPoints) {
      maxPoints = points;
      potm = id;
    }
  });

  // Collect match facts
  const mostBoundaries = sortedBatters.sort((a, b) => ((b.fours + b.sixes) - (a.fours + a.sixes)))[0];
  const mostSixes = sortedBatters.sort((a, b) => b.sixes - a.sixes)[0];

  return {
    topBatter,
    topBowler,
    playerOfMatch: potm,
    mostBoundaries: mostBoundaries && (mostBoundaries.fours + mostBoundaries.sixes) > 0 ? mostBoundaries : null,
    mostSixes: mostSixes && mostSixes.sixes > 0 ? mostSixes : null,
  };
}
