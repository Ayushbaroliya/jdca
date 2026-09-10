/**
 * JDCA Derived Scorecard Engine
 * 
 * Supabase is the source of truth. A Delivery is the fundamental scoring event.
 * Do not manually store derived statistics when they can be calculated from deliveries.
 */

export function deriveScorecardFromDeliveries(deliveries, teamBattingId, teamBowlingId) {
  const scorecard = {
    teamBattingId,
    teamBowlingId,
    runs: 0,
    wickets: 0,
    balls: 0, // legal balls
    extras: {
      wides: 0,
      noBalls: 0,
      byes: 0,
      legByes: 0,
      penalty: 0,
      total: 0
    },
    batting: {}, // keyed by playerId/name
    bowling: {}, // keyed by playerId/name
    fielding: {}, // keyed by playerId/name
    wicketkeeping: {}, // keyed by playerId/name
    wicketSummary: {
      'Bowled': 0, 'Caught': 0, 'LBW': 0, 'Run Out': 0, 'Stumped': 0, 'Hit Wicket': 0, 'Other': 0
    },
    fallOfWickets: [],
    partnerships: []
  };

  if (!deliveries || deliveries.length === 0) return scorecard;

  let currentPartnershipRuns = 0;
  let currentPartnershipBalls = 0;
  let currentPartnershipPlayers = new Set();
  
  // Over tracking for Maidens
  let activeOver = { bowlerId: null, runsConceded: 0, legalBalls: 0 };

  deliveries.forEach((delivery, index) => {
    const { 
      type, runs, extraType, extraRuns, dismissalType, outPlayerId, outPlayerName,
      strikerId, nonStrikerId, bowlerId, fielderName, wicketkeeperName
    } = delivery;

    // Initialize players
    if (strikerId && !scorecard.batting[strikerId]) initBatter(scorecard.batting, strikerId);
    if (nonStrikerId && !scorecard.batting[nonStrikerId]) initBatter(scorecard.batting, nonStrikerId);
    if (bowlerId && !scorecard.bowling[bowlerId]) initBowler(scorecard.bowling, bowlerId);

    if (strikerId) currentPartnershipPlayers.add(strikerId);
    if (nonStrikerId) currentPartnershipPlayers.add(nonStrikerId);

    const isWide = extraType === 'wide';
    const isNoBall = extraType === 'no_ball';
    const isBye = extraType === 'bye';
    const isLegBye = extraType === 'leg_bye';
    const isPenalty = extraType === 'penalty';
    const isLegalDelivery = !isWide && !isNoBall && !isPenalty;

    let runsThisBall = 0;
    let runsOffBat = 0;
    let extrasThisBall = 0;

    if (type === 'run') {
      runsOffBat = runs;
      runsThisBall = runs;
    } else if (type === 'extra') {
      if (isWide || isNoBall) {
        extrasThisBall = 1 + extraRuns;
        runsThisBall = extrasThisBall;
      } else if (isBye || isLegBye) {
        extrasThisBall = extraRuns || 1;
        runsThisBall = extrasThisBall;
      } else if (isPenalty) {
        extrasThisBall = extraRuns;
        runsThisBall = extrasThisBall;
      }
    } else if (type === 'wicket') {
      runsOffBat = runs || 0;
      runsThisBall = runs || 0;
    }

    // Update Team Totals
    scorecard.runs += runsThisBall;
    if (isLegalDelivery) scorecard.balls += 1;

    // Update Extras
    if (isWide) scorecard.extras.wides += extrasThisBall;
    if (isNoBall) scorecard.extras.noBalls += extrasThisBall;
    if (isBye) scorecard.extras.byes += extrasThisBall;
    if (isLegBye) scorecard.extras.legByes += extrasThisBall;
    if (isPenalty) scorecard.extras.penalty += extrasThisBall;
    scorecard.extras.total += extrasThisBall;

    // Update Batter
    if (strikerId && (runsOffBat > 0 || isLegalDelivery || isNoBall)) {
      scorecard.batting[strikerId].runs += runsOffBat;
      if (isLegalDelivery || isNoBall) scorecard.batting[strikerId].balls += 1;
      if (runsOffBat === 4) scorecard.batting[strikerId].fours += 1;
      if (runsOffBat === 6) scorecard.batting[strikerId].sixes += 1;
    }

    // Update Bowler & Maidens
    let bowlerChargeableRuns = 0;
    if (!isBye && !isLegBye) {
      bowlerChargeableRuns = runsThisBall;
    }

    if (bowlerId && !isPenalty) {
      if (activeOver.bowlerId !== bowlerId) {
        // Change of bowler mid-over or start of new over
        if (activeOver.legalBalls === 6 && activeOver.runsConceded === 0 && activeOver.bowlerId) {
          if (scorecard.bowling[activeOver.bowlerId]) scorecard.bowling[activeOver.bowlerId].maidens += 1;
        }
        activeOver = { bowlerId, runsConceded: 0, legalBalls: 0 };
      }

      activeOver.runsConceded += bowlerChargeableRuns;
      
      if (isLegalDelivery) {
        scorecard.bowling[bowlerId].balls += 1;
        activeOver.legalBalls += 1;
      }
      
      scorecard.bowling[bowlerId].runs += bowlerChargeableRuns;
      if (isWide) scorecard.bowling[bowlerId].wides += extrasThisBall;
      if (isNoBall) scorecard.bowling[bowlerId].noBalls += extrasThisBall;

      if (activeOver.legalBalls === 6) {
        if (activeOver.runsConceded === 0) {
          scorecard.bowling[bowlerId].maidens += 1;
        }
        activeOver = { bowlerId: null, runsConceded: 0, legalBalls: 0 };
      }
    }

    // Partnership Tracker
    currentPartnershipRuns += runsThisBall;
    if (isLegalDelivery || isNoBall) currentPartnershipBalls += 1;

    // Handle Wickets
    if (type === 'wicket') {
      scorecard.wickets += 1;
      
      const outId = outPlayerId || outPlayerName || strikerId;
      if (outId && scorecard.batting[outId]) {
        scorecard.batting[outId].dismissalType = dismissalType || 'Caught';
        scorecard.batting[outId].bowlerId = bowlerId;
        scorecard.batting[outId].fielderName = fielderName;
        scorecard.batting[outId].wicketkeeperName = wicketkeeperName;
        
        // Format dismissal text properly based on type
        scorecard.batting[outId].dismissal = formatDismissalText(dismissalType, fielderName, wicketkeeperName, bowlerId);
      }

      // Wicket Summary
      const sumType = scorecard.wicketSummary[dismissalType] !== undefined ? dismissalType : 'Other';
      scorecard.wicketSummary[sumType] += 1;

      // Bowler Wickets
      const isBowlerWicket = !['Run Out', 'Obstructing Field', 'Retired Out'].includes(dismissalType);
      if (isBowlerWicket && bowlerId) {
        scorecard.bowling[bowlerId].wickets += 1;
      }

      // Fielding & Wicketkeeping Stats
      if (dismissalType === 'Caught' && fielderName) {
        if (!scorecard.fielding[fielderName]) initFielder(scorecard.fielding, fielderName);
        scorecard.fielding[fielderName].catches += 1;
        scorecard.fielding[fielderName].totalDismissals += 1;
      } else if (dismissalType === 'Stumped' && wicketkeeperName) {
        if (!scorecard.wicketkeeping[wicketkeeperName]) initWicketkeeper(scorecard.wicketkeeping, wicketkeeperName);
        scorecard.wicketkeeping[wicketkeeperName].stumpings += 1;
        scorecard.wicketkeeping[wicketkeeperName].totalDismissals += 1;
      } else if (dismissalType === 'Run Out' && fielderName) {
        if (!scorecard.fielding[fielderName]) initFielder(scorecard.fielding, fielderName);
        scorecard.fielding[fielderName].runOuts += 1;
        scorecard.fielding[fielderName].totalDismissals += 1;
      }

      // FOW
      scorecard.fallOfWickets.push({
        wicket: scorecard.wickets,
        score: scorecard.runs,
        over: formatOvers(scorecard.balls),
        playerId: outId
      });

      // Partnership
      scorecard.partnerships.push({
        runs: currentPartnershipRuns,
        balls: currentPartnershipBalls,
        players: Array.from(currentPartnershipPlayers)
      });

      currentPartnershipRuns = 0;
      currentPartnershipBalls = 0;
      currentPartnershipPlayers.clear();
      if (strikerId !== outId) currentPartnershipPlayers.add(strikerId);
      if (nonStrikerId !== outId) currentPartnershipPlayers.add(nonStrikerId);
    }
  });

  // Calculate Strike Rates & Economy
  Object.values(scorecard.batting).forEach(b => {
    b.strikeRate = b.balls > 0 ? ((b.runs / b.balls) * 100).toFixed(2) : '0.00';
  });

  Object.values(scorecard.bowling).forEach(b => {
    b.overs = formatOvers(b.balls);
    const totalOversDec = b.balls / 6;
    b.economy = totalOversDec > 0 ? (b.runs / totalOversDec).toFixed(2) : '0.00';
  });

  // Push unbroken partnership if match ends
  if (currentPartnershipRuns > 0 || currentPartnershipBalls > 0) {
    scorecard.partnerships.push({
      runs: currentPartnershipRuns,
      balls: currentPartnershipBalls,
      players: Array.from(currentPartnershipPlayers),
      unbroken: true
    });
  }

  scorecard.batting = Object.values(scorecard.batting);
  scorecard.bowling = Object.values(scorecard.bowling);
  scorecard.fielding = Object.values(scorecard.fielding);
  scorecard.wicketkeeping = Object.values(scorecard.wicketkeeping);

  scorecard.overs = formatOvers(scorecard.balls);
  return scorecard;
}

function initBatter(map, id) {
  map[id] = { id, runs: 0, balls: 0, fours: 0, sixes: 0, dismissal: 'Not Out', dismissalType: null, bowlerId: null, fielderName: null, wicketkeeperName: null, strikeRate: '0.00' };
}

function initBowler(map, id) {
  map[id] = { id, balls: 0, overs: '0.0', maidens: 0, runs: 0, wickets: 0, wides: 0, noBalls: 0, economy: '0.00' };
}

function initFielder(map, id) {
  map[id] = { id, catches: 0, runOuts: 0, totalDismissals: 0 };
}

function initWicketkeeper(map, id) {
  map[id] = { id, catches: 0, stumpings: 0, runOuts: 0, totalDismissals: 0 };
}

function formatDismissalText(type, fielder, wk, bowler) {
  if (type === 'Caught') return `c ${fielder || 'Unknown'} b ${bowler || 'Unknown'}`;
  if (type === 'Stumped') return `st ${wk || 'Unknown'} b ${bowler || 'Unknown'}`;
  if (type === 'Run Out') return `run out (${fielder || 'Unknown'})`;
  if (type === 'Bowled') return `b ${bowler || 'Unknown'}`;
  if (type === 'LBW') return `lbw b ${bowler || 'Unknown'}`;
  if (type === 'Hit Wicket') return `hit wicket b ${bowler || 'Unknown'}`;
  return type || 'Out';
}

export function formatOvers(balls) {
  const overs = Math.floor(balls / 6);
  const rem = balls % 6;
  return `${overs}.${rem}`;
}
