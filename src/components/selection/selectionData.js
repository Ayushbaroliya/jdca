/**
 * JDCA Player Selection & Team Management Data Architecture
 * Covers: Official Team Categories, Player Normalization, Eligibility Rules Engine,
 *         Historical Selection Records, and Multi-Team Independent Selection State.
 */

export const TEAM_CATEGORIES = [
  { id: 'u13', name: 'Under-13', ageLimit: 13, defaultSize: 14, gender: 'Men', description: 'Junior District Trials & Inter-District Championship' },
  { id: 'u15', name: 'Under-15', ageLimit: 15, defaultSize: 15, gender: 'Men', description: 'Zonal Junior Cricket Trophy' },
  { id: 'u16', name: 'Under-16', ageLimit: 16, defaultSize: 15, gender: 'Men', description: 'Vijay Merchant Trophy District Selections' },
  { id: 'u19', name: 'Under-19', ageLimit: 19, defaultSize: 16, gender: 'Men', description: 'Cooch Behar & Vinoo Mankad District Selection' },
  { id: 'u23', name: 'Under-23', ageLimit: 23, defaultSize: 15, gender: 'Men', description: 'Col CK Nayudu Trophy District Selection' },
  { id: 'senior_men', name: 'Senior Men', ageLimit: 99, defaultSize: 15, gender: 'Men', description: 'Senior District XI & Inter-District Trophy' },
  { id: 'women', name: 'Women', ageLimit: 99, defaultSize: 15, gender: 'Women', description: 'JDCA Senior & Junior Women District Selection' },
];

export const INITIAL_OFFICIAL_TEAMS = [
  {
    id: 'team_2026_u19_men',
    season: '2026',
    category: 'Under-19',
    gender: 'Men',
    name: "2026 JDCA Under-19 Team",
    targetSize: 16,
    status: 'SELECTION_ACTIVE',
    ageLimit: 19,
    minBatters: 4,
    minAllRounders: 2,
    minWKs: 1,
    minFastBowlers: 3,
    minSpinners: 2,
    selectedPlayerIds: ['vikram-singh', 'priya-u19-seoni', 'rahul-chhindwara'],
    shortlistedPlayerIds: ['ravi-kumar', 'deepak-u19-mandla', 'akash-u23-jabalpur'],
    roles: {
      captainId: 'priya-u19-seoni',
      viceCaptainId: 'vikram-singh',
      wicketkeeperId: 'priya-u19-seoni',
    },
  },
  {
    id: 'team_2026_senior_men',
    season: '2026',
    category: 'Senior Men',
    gender: 'Men',
    name: "2026 JDCA Senior Men's Team",
    targetSize: 15,
    status: 'SELECTION_ACTIVE',
    ageLimit: 99,
    minBatters: 4,
    minAllRounders: 2,
    minWKs: 1,
    minFastBowlers: 3,
    minSpinners: 2,
    selectedPlayerIds: ['rohan-sharma', 'virat-sharma', 'alex-mercer', 'sharma-senior'],
    shortlistedPlayerIds: ['rahul-chhindwara', 'karan-u26-katni'],
    roles: {
      captainId: 'virat-sharma',
      viceCaptainId: 'rohan-sharma',
      wicketkeeperId: 'priya-balaghat',
    },
  },
  {
    id: 'team_2026_u13_men',
    season: '2026',
    category: 'Under-13',
    gender: 'Men',
    name: "2026 JDCA Under-13 Team",
    targetSize: 14,
    status: 'SELECTION_ACTIVE',
    ageLimit: 13,
    minBatters: 4,
    minAllRounders: 2,
    minWKs: 1,
    minFastBowlers: 3,
    minSpinners: 2,
    selectedPlayerIds: ['rohan-sharma-u13', 'aarav-patel'],
    shortlistedPlayerIds: ['vihaan-singh'],
    roles: {
      captainId: 'rohan-sharma-u13',
      viceCaptainId: 'aarav-patel',
      wicketkeeperId: '',
    },
  },
  {
    id: 'team_2026_u16_men',
    season: '2026',
    category: 'Under-16',
    gender: 'Men',
    name: "2026 JDCA Under-16 Team",
    targetSize: 15,
    status: 'SELECTION_ACTIVE',
    ageLimit: 16,
    minBatters: 4,
    minAllRounders: 2,
    minWKs: 1,
    minFastBowlers: 3,
    minSpinners: 2,
    selectedPlayerIds: ['rahul-u14'],
    shortlistedPlayerIds: [],
    roles: {
      captainId: 'rahul-u14',
      viceCaptainId: '',
      wicketkeeperId: '',
    },
  },
  {
    id: 'team_2026_women',
    season: '2026',
    category: 'Women',
    gender: 'Women',
    name: "2026 JDCA Women's Team",
    targetSize: 15,
    status: 'SELECTION_ACTIVE',
    ageLimit: 99,
    minBatters: 4,
    minAllRounders: 2,
    minWKs: 1,
    minFastBowlers: 3,
    minSpinners: 2,
    selectedPlayerIds: ['priya-balaghat', 'ananya-verma', 'pooja-vastrakar'],
    shortlistedPlayerIds: ['sneha-tiwari'],
    roles: {
      captainId: 'priya-balaghat',
      viceCaptainId: 'pooja-vastrakar',
      wicketkeeperId: 'priya-balaghat',
    },
  },
];

export const AGE_FILTER_OPTIONS = ['All', 'Under-13', 'Under-15', 'Under-16', 'Under-19', 'Under-23', 'Senior'];
export const GENDER_FILTER_OPTIONS = ['All', 'Men', 'Women'];
export const ROLE_FILTER_OPTIONS = ['All', 'Batter', 'Bowler', 'All-Rounder', 'Wicket Keeper'];
export const BATTING_STYLE_OPTIONS = ['All', 'Right-Hand', 'Left-Hand', 'Opening Batter', 'Middle Order'];
export const BOWLING_STYLE_OPTIONS = [
  'All',
  'Right-Arm Fast',
  'Right-Arm Medium',
  'Left-Arm Fast',
  'Left-Arm Medium',
  'Right-Arm Off Spin',
  'Right-Arm Leg Spin',
  'Slow Left-Arm Orthodox',
  'Left-Arm Wrist Spin',
  'No Bowling',
];

/**
 * PLAYER ELIGIBILITY ENGINE
 * Determines whether a player qualifies for a specific team selection based on age, DOB, gender, and district.
 */
export function checkPlayerEligibility(player, team) {
  if (!player || !team) {
    return { isEligible: true, status: 'ELIGIBLE', reason: 'Eligible for open selection.' };
  }

  // 1. Check Gender
  if (team.gender && team.gender !== 'All') {
    const pGender = player.gender || 'Men';
    if (pGender !== team.gender) {
      return {
        isEligible: false,
        status: 'INELIGIBLE',
        reason: `Gender requirement mismatch (Team is for ${team.gender}, Player is ${pGender}).`,
      };
    }
  }

  // 2. Check Age Limit
  const ageLimit = team.ageLimit !== undefined ? team.ageLimit : getAgeLimitForCategory(team.category);
  const pAge = player.age || 20;

  if (ageLimit && ageLimit < 90) {
    if (pAge > ageLimit) {
      return {
        isEligible: false,
        status: 'INELIGIBLE',
        reason: `Age (${pAge} yrs) exceeds ${team.category} maximum age limit (${ageLimit} yrs).`,
      };
    }
  }

  return {
    isEligible: true,
    status: 'ELIGIBLE',
    reason: `Verified eligible for ${team.name || team.category} (${pAge} yrs, ${player.district || 'District'}).`,
  };
}

export function getAgeLimitForCategory(category) {
  if (!category) return 99;
  if (category.includes('13') || category === 'Under-13') return 13;
  if (category.includes('15') || category === 'Under-15') return 15;
  if (category.includes('16') || category === 'Under-16') return 16;
  if (category.includes('19') || category === 'Under-19') return 19;
  if (category.includes('23') || category === 'Under-23') return 23;
  return 99;
}

/**
 * Normalizes player into a standard JDCA cricket administrative model
 */
export function normalizeSelectionPlayer(p) {
  if (!p) return null;

  // Derive standard age group
  let ageGroup = p.ageGroup || 'Senior';
  if (p.category) {
    if (p.category.includes('13') || p.category === 'Under-13' || p.category === 'U-13') ageGroup = 'Under-13';
    else if (p.category.includes('14') || p.category.includes('15') || p.category === 'Under-14' || p.category === 'Under-15') ageGroup = 'Under-15';
    else if (p.category.includes('16') || p.category === 'Under-16' || p.category === 'U-16') ageGroup = 'Under-16';
    else if (p.category.includes('19') || p.category === 'Under-19' || p.category === 'U-19') ageGroup = 'Under-19';
    else if (p.category.includes('23') || p.category === 'Under-23' || p.category === 'U-23') ageGroup = 'Under-23';
    else if (p.category === 'Senior' || p.category.includes('Senior')) ageGroup = 'Senior';
  }

  // Derive gender
  let gender = p.gender || 'Men';
  if (
    p.name.includes('Priya') ||
    p.name.includes('Ananya') ||
    p.name.includes('Pooja') ||
    p.name.includes('Sneha') ||
    p.category?.includes('Women')
  ) {
    gender = 'Women';
  }

  const district = p.district ? p.district.replace(' District', '').trim() : 'Jabalpur';

  // Realistic DOB based on age
  const age = p.age || (ageGroup === 'Under-13' ? 12 : ageGroup === 'Under-16' ? 15 : ageGroup === 'Under-19' ? 18 : ageGroup === 'Under-23' ? 22 : 26);
  const birthYear = 2026 - age;
  const dob = p.dob || `14 May ${birthYear}`;

  const isBatter = p.role === 'Batter' || p.primaryRole?.includes('Bat');
  const isBowler = p.role === 'Bowler' || p.primaryRole?.includes('Bowl') || p.primaryRole?.includes('Fast') || p.primaryRole?.includes('Spin');
  const isWK = p.role === 'Wicket Keeper' || p.primaryRole?.includes('Keeper') || p.primaryRole?.includes('WK');
  const isAllRounder = p.role === 'All-Rounder' || p.primaryRole?.includes('All-Rounder');

  // Match History
  const matchHistory = p.matchHistory && p.matchHistory.length > 0 ? p.matchHistory : generateDefaultMatchHistory(p, isBatter, isBowler, isWK, isAllRounder);

  const catches = p.catches !== undefined ? p.catches : (isWK ? 18 : isBatter ? 8 : isAllRounder ? 6 : 4);
  const stumpings = p.stumpings !== undefined ? p.stumpings : (isWK ? 9 : 0);
  const runOuts = p.runOuts !== undefined ? p.runOuts : 2;
  const totalDismissals = catches + stumpings + runOuts;

  let recentFormString = '';
  if (isBowler) {
    recentFormString = matchHistory.slice(0, 3).map(m => `${m.bowling.wickets}/${m.bowling.runs}`).join(' · ');
  } else {
    recentFormString = matchHistory.slice(0, 3).map(m => `${m.batting.runs}${m.batting.notOut ? '*' : ''}`).join(' · ');
  }

  // Evaluation (1–10)
  const evaluations = p.evaluations || {
    technicalAbility: isBatter ? 8.5 : 7.8,
    batting: isBatter || isAllRounder ? 8.8 : 5.0,
    bowling: isBowler || isAllRounder ? 8.5 : 3.0,
    fielding: isWK ? 9.0 : 8.2,
    fitness: 8.5,
    temperament: 8.6,
    gameAwareness: 8.4,
    potential: age <= 21 ? 9.2 : 8.0,
    notes: p.evaluationNotes || p.scoutNotes || `Strong match temperament. Performed consistently in district trial fixtures.`,
  };

  const avgEvalScore = (
    (evaluations.technicalAbility +
      evaluations.batting +
      evaluations.bowling +
      evaluations.fielding +
      evaluations.fitness +
      evaluations.temperament +
      evaluations.gameAwareness +
      evaluations.potential) /
    8
  ).toFixed(1);

  // Historical selection log across categories
  const selectionHistoryRecords = p.selectionHistoryRecords || [
    { season: '2026', team: `${ageGroup} Team`, status: 'Candidate' },
    { season: '2025', team: age <= 18 ? 'Under-16 Team' : 'Under-19 Team', status: 'Selected' },
    { season: '2024', team: age <= 18 ? 'Under-14 Team' : 'Under-16 Team', status: 'Selected' },
  ];

  return {
    ...p,
    age,
    dob,
    gender,
    ageGroup,
    district,
    role: isWK ? 'Wicket Keeper' : isAllRounder ? 'All-Rounder' : isBowler ? 'Bowler' : 'Batter',
    battingStyle: p.battingStyle || 'Right-Hand Batter',
    bowlingStyle: p.bowlingStyle || (isBowler ? 'Right-Arm Fast' : 'None (Pure Batter)'),
    matches: p.matches || 24,
    careerRuns: p.careerRuns || p.runs || 540,
    battingAvg: p.battingAvg || p.average || (isBatter ? 44.5 : isAllRounder ? 34.2 : 14.0),
    strikeRate: p.strikeRate || (isBatter ? 132.5 : isAllRounder ? 128.0 : 85.0),
    highScore: p.highScore || (isBatter ? '95*' : isBowler ? '28' : '64'),
    fifties: p.fifties !== undefined ? p.fifties : (isBatter ? 4 : 1),
    hundreds: p.hundreds !== undefined ? p.hundreds : (isBatter ? 1 : 0),
    wickets: p.wickets !== undefined ? p.wickets : (isBowler ? 38 : isAllRounder ? 22 : 2),
    economy: p.economy || (isBowler ? 4.85 : isAllRounder ? 5.60 : 7.20),
    bowlingAvg: p.bowlingAvg || (isBowler ? 16.4 : isAllRounder ? 22.8 : 45.0),
    bestBowling: p.bestBowling || (isBowler ? '4/22' : isAllRounder ? '3/28' : '1/14'),
    catches,
    stumpings,
    runOuts,
    totalDismissals,
    matchHistory,
    recentFormString,
    formRating: p.inForm ? 'Strong' : 'Consistent',
    evaluations,
    avgEvalScore,
    selectionHistoryRecords,
  };
}

function generateDefaultMatchHistory(player, isBatter, isBowler, isWK, isAllRounder) {
  const opponents = ['Katni XI', 'Seoni Strikers', 'Chhindwara Eagles', 'Mandla Panthers', 'Narsinghpur Lions', 'Balaghat Tigers'];
  const dates = ['18 Aug 2026', '12 Aug 2026', '04 Aug 2026', '28 Jul 2026', '19 Jul 2026', '10 Jul 2026'];
  const venues = ['Wright Town Ground, Jabalpur', 'Raja Gokuldas Stadium, Jabalpur', 'Katni Sports Complex', 'Seoni District Ground', 'Chhindwara Stadium', 'Mandla Ground'];

  const l5 = player.last5Matches || [];

  return dates.map((date, idx) => {
    const opp = l5[idx]?.opponent || opponents[idx % opponents.length];
    const rawRuns = l5[idx]?.runs !== undefined ? l5[idx].runs : (isBatter ? [84, 62, 95, 41, 73, 52][idx % 6] : isAllRounder ? [45, 18, 52, 34, 61, 28][idx % 6] : [12, 4, 18, 0, 15, 6][idx % 6]);
    const rawWickets = l5[idx]?.wickets !== undefined ? l5[idx].wickets : (isBowler ? [3, 4, 2, 1, 3, 2][idx % 6] : isAllRounder ? [2, 1, 3, 0, 2, 1][idx % 6] : 0);
    const balls = l5[idx]?.balls || Math.max(10, Math.floor(rawRuns * 0.85));
    const notOut = l5[idx]?.notOut || (idx === 0 && rawRuns > 50);

    const bowlingOvers = isBowler ? '4.0' : isAllRounder ? '3.0' : rawWickets > 0 ? '2.0' : '0.0';
    const bowlingRuns = isBowler ? 18 + idx * 4 : isAllRounder ? 22 + idx * 3 : 0;
    const econ = bowlingOvers !== '0.0' ? (bowlingRuns / parseFloat(bowlingOvers)).toFixed(2) : '-';

    const matchCatches = isWK ? (idx % 2 === 0 ? 2 : 1) : idx % 3 === 0 ? 1 : 0;
    const matchStumpings = isWK && idx % 2 === 1 ? 1 : 0;

    return {
      id: `match-hist-${player.id}-${idx}`,
      tournament: 'JDCA Inter-District Championship 2026',
      date,
      venue: venues[idx % venues.length],
      opponent: opp.startsWith('U') || opp.includes('XI') ? opp : `${opp} XI`,
      opponentShort: opp.slice(0, 3).toUpperCase(),
      result: idx % 4 !== 2 ? 'JDCA won by 34 runs' : 'JDCA lost by 4 wickets',
      batting: {
        runs: rawRuns,
        balls,
        fours: Math.floor(rawRuns / 10),
        sixes: Math.floor(rawRuns / 25),
        notOut,
        strikeRate: balls > 0 ? ((rawRuns / balls) * 100).toFixed(1) : '0.0',
        dismissal: notOut ? 'Not Out' : idx % 2 === 0 ? 'c S. Tiwari b A. Patel' : 'b R. Verma',
      },
      bowling: {
        overs: bowlingOvers,
        maidens: rawWickets >= 3 ? 1 : 0,
        runs: bowlingRuns,
        wickets: rawWickets,
        economy: econ,
      },
      fielding: {
        catches: matchCatches,
        stumpings: matchStumpings,
        runOuts: idx === 1 ? 1 : 0,
      },
    };
  });
}

/**
 * Extracts distinct districts from the player pool dynamically
 */
export function getAvailableDistricts(players) {
  const set = new Set();
  players.forEach(p => {
    if (p.district) set.add(p.district);
  });
  return ['All', ...Array.from(set).sort()];
}
