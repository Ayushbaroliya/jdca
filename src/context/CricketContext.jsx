import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  INITIAL_PLAYERS,
  INITIAL_MATCHES,
  OFFICIALS,
  INITIAL_SCORECARD,
  FIELD_DIRECTIONS,
  TOURNAMENTS,
  DISTRICT_STATS,
  SELECTION_HISTORY,
  ANNOUNCEMENTS,
} from '../data/mockData';

const CricketContext = createContext();

export function CricketProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation & Screen routing derived from URL
  const pathParts = location.pathname.split('/').filter(Boolean);
  let currentScreen = pathParts.length > 0 ? pathParts[0] : 'welcome';
  if (currentScreen === '') currentScreen = 'welcome';
  
  const activeTabMap = {
    'scoring': 'scoring',
    'scorecard': 'scorecard',
    'scouting': 'analysis',
    'selectors': 'analysis',
    'player-profile': 'analysis',
    'player-registration': 'analysis',
    'matches': 'matches',
    'match-overview': 'matches',
    'match-setup': 'matches',
    'match-result': 'matches',
    'innings-break': 'matches'
  };
  const activeTab = activeTabMap[currentScreen] || 'matches';

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userMobile, setUserMobile] = useState('');
  const [userRole, setUserRole] = useState('Admin'); // Admin, Scorer, Selector, Player

  // Players & Scouting
  const [players, setPlayers] = useState(INITIAL_PLAYERS);
  const [selectedPlayer, setSelectedPlayer] = useState(INITIAL_PLAYERS[0]); // default Rohan Sharma
  const [shortlistedIds, setShortlistedIds] = useState(['rohan-sharma-u13']);

  // Matches State
  const [matches, setMatches] = useState(INITIAL_MATCHES);
  const [activeMatchId, setActiveMatchId] = useState('match-live-1');

  // Match Setup State
  const [matchSetup, setMatchSetup] = useState({
    teamA: 'Royal Challengers',
    teamB: 'Super Kings',
    teamAShort: 'RC',
    teamBShort: 'CS',
    tossWinner: 'Royal Challengers',
    electedTo: 'Bat',
    totalOvers: 20,
    widePenalty: 1,
    noBallPenalty: 1,
    playingXI: [
      { id: 'p1', name: 'V. Kohli', role: 'Batter', isCaptain: true },
      { id: 'p2', name: 'F. du Plessis', role: 'Batter', isCaptain: false },
      { id: 'p3', name: 'G. Maxwell', role: 'All-Rounder', isCaptain: false },
      { id: 'p4', name: 'R. Patidar', role: 'Batter', isCaptain: false },
      { id: 'p5', name: 'D. Karthik', role: 'Wicket Keeper', isCaptain: false },
      { id: 'p6', name: 'C. Green', role: 'All-Rounder', isCaptain: false },
      { id: 'p7', name: 'M. Lomror', role: 'All-Rounder', isCaptain: false },
      { id: 'p8', name: 'K. Sharma', role: 'Bowler', isCaptain: false },
      { id: 'p9', name: 'M. Siraj', role: 'Bowler', isCaptain: false },
      { id: 'p10', name: 'L. Ferguson', role: 'Bowler', isCaptain: false },
      { id: 'p11', name: 'Y. Dayal', role: 'Bowler', isCaptain: false },
    ]
  });

  // Live Scoring Engine State
  const [innings, setInnings] = useState(1); // 1 or 2
  const [matchFormat, setMatchFormat] = useState('T20');
  const [totalMatchOvers, setTotalMatchOvers] = useState(20);
  const [runs, setRuns] = useState(142);
  const [wickets, setWickets] = useState(4);
  const [balls, setBalls] = useState(94); // 15.4 overs = 15*6 + 4 = 94 balls
  const [currentOverBalls, setCurrentOverBalls] = useState([
    { type: 'run', value: 1, label: '1' },
    { type: 'run', value: 4, label: '4' },
    { type: 'run', value: 0, label: '0' },
    { type: 'wicket', value: 'W', label: 'W', player: 'K. Rahul' }
  ]);
  const [extras, setExtras] = useState({
    wides: 6,
    noBalls: 2,
    legByes: 3,
    byes: 1,
    penalty: 0
  });

  // Current Batters & Bowler on Pitch
  const [striker, setStriker] = useState({
    id: 's1',
    name: 'V. Kohli',
    runs: 64,
    balls: 42,
    fours: 5,
    sixes: 2,
    strikeRate: 152.4
  });

  const [nonStriker, setNonStriker] = useState({
    id: 's2',
    name: 'S. Yadav',
    runs: 12,
    balls: 8,
    fours: 1,
    sixes: 0,
    strikeRate: 150.0
  });

  const [currentBowler, setCurrentBowler] = useState({
    id: 'bw1',
    name: 'P. Cummins',
    overs: 3.4,
    maidens: 0,
    runs: 28,
    wickets: 1,
    economy: 7.64,
    wk: 'A. Carey'
  });

  // Ball Direction / Shot Sector
  const [selectedDirection, setSelectedDirection] = useState('Cover');
  const [ballHistory, setBallHistory] = useState([]);

  // Modals & Sheets
  const [dismissalModalOpen, setDismissalModalOpen] = useState(false);
  const [extrasModalOpen, setExtrasModalOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [comparePlayer2, setComparePlayer2] = useState(INITIAL_PLAYERS[1]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Scorecard detailed tables
  const [scorecard, setScorecard] = useState(INITIAL_SCORECARD);

  // Navigation helpers
  const navigateTo = (screenName, tabName = null) => {
    const routeMap = {
      'welcome': '/',
      'matches': '/matches',
      'match-setup': '/match-setup',
      'scoring': '/scoring',
      'scorecard': '/scorecard',
      'match-overview': '/match-overview',
      'innings-break': '/innings-break',
      'match-result': '/match-result',
      'scouting': '/scouting',
      'selectors': '/selectors',
      'player-profile': '/player-profile',
      'player-registration': '/player-registration'
    };
    navigate(routeMap[screenName] || '/matches');
  };

  const goBack = () => {
    navigate(-1);
  };

  // Convert raw ball count to cricket overs string (e.g. 94 balls -> 15.4)
  const formatOvers = (ballCount) => {
    const fullOvers = Math.floor(ballCount / 6);
    const remainder = ballCount % 6;
    return `${fullOvers}.${remainder}`;
  };

  // Current Run Rate (CRR)
  const calculateCRR = () => {
    if (balls === 0) return '0.00';
    const totalOvers = balls / 6;
    return (runs / totalOvers).toFixed(2);
  };

  // Projected Score
  const calculateProjectedScore = () => {
    const crr = parseFloat(calculateCRR());
    if (isNaN(crr) || crr === 0) return runs;
    return Math.round(crr * totalMatchOvers);
  };

  // Switch striker
  const toggleStriker = () => {
    const temp = striker;
    setStriker(nonStriker);
    setNonStriker(temp);
  };

  // Add runs action (0, 1, 2, 3, 4, 5, 6)
  const recordRuns = (runAmount, direction = selectedDirection) => {
    // Snapshot for Undo
    const snapshot = {
      runs,
      wickets,
      balls,
      currentOverBalls: [...currentOverBalls],
      striker: { ...striker },
      nonStriker: { ...nonStriker },
      currentBowler: { ...currentBowler },
      extras: { ...extras },
      innings,
    };
    setBallHistory((prev) => [...prev, snapshot]);

    const newRuns = runs + runAmount;
    const newBalls = balls + 1;
    setRuns(newRuns);
    setBalls(newBalls);

    // Update striker stats
    const updatedStriker = {
      ...striker,
      runs: striker.runs + runAmount,
      balls: striker.balls + 1,
      fours: runAmount === 4 ? striker.fours + 1 : striker.fours,
      sixes: runAmount === 6 ? striker.sixes + 1 : striker.sixes,
    };
    updatedStriker.strikeRate = ((updatedStriker.runs / updatedStriker.balls) * 100).toFixed(1);

    // Update bowler stats
    const newBowlerBalls = Math.round((currentBowler.overs % 1) * 10) + 1;
    const newBowlerOvers = newBowlerBalls === 6 
      ? Math.floor(currentBowler.overs) + 1 
      : Math.floor(currentBowler.overs) + (newBowlerBalls / 10);
    
    const updatedBowler = {
      ...currentBowler,
      runs: currentBowler.runs + runAmount,
      overs: Number(newBowlerOvers.toFixed(1)),
      economy: (((currentBowler.runs + runAmount) / (newBalls / 6))).toFixed(2)
    };
    setCurrentBowler(updatedBowler);

    // Update current over pills
    const ballLabel = runAmount.toString();
    const newOverBalls = [...currentOverBalls, { type: 'run', value: runAmount, label: ballLabel, direction }];
    
    // 1. Determine ends based on runs scored
    let nextStriker, nextNonStriker;
    if (runAmount % 2 !== 0) {
      nextStriker = nonStriker;
      nextNonStriker = updatedStriker;
    } else {
      nextStriker = updatedStriker;
      nextNonStriker = nonStriker;
    }

    // 2. Check if over finished (6 legal deliveries)
    if (newBalls > 0 && newBalls % 6 === 0) {
      setCurrentOverBalls([]);
      setStriker(nextNonStriker);
      setNonStriker(nextStriker);
    } else {
      setCurrentOverBalls(newOverBalls);
      setStriker(nextStriker);
      setNonStriker(nextNonStriker);
    }

    // Trigger celebration confetti for milestone
    if (runAmount === 6) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#FABB05', '#1D4ED8', '#10B981']
      });
    }

    // Check if 1st innings target reached or completed
    if (newBalls >= totalMatchOvers * 6 || (innings === 2 && newRuns > 185)) {
      if (innings === 1) {
        setTimeout(() => {
          navigateTo('innings-break');
        }, 600);
      } else {
        setTimeout(() => {
          navigateTo('match-result');
        }, 600);
      }
    }
  };

  // Record Extra (Wide, No Ball, Leg Bye, Bye, Penalty)
  const recordExtra = (type, runsWithExtra = 0) => {
    const snapshot = {
      runs,
      wickets,
      balls,
      currentOverBalls: [...currentOverBalls],
      striker: { ...striker },
      nonStriker: { ...nonStriker },
      currentBowler: { ...currentBowler },
      extras: { ...extras },
      innings,
    };
    setBallHistory((prev) => [...prev, snapshot]);

    if (type === 'wide') {
      const extraRuns = 1 + runsWithExtra;
      setRuns((r) => r + extraRuns);
      setExtras((e) => ({ ...e, wides: e.wides + extraRuns }));
      setCurrentBowler((b) => ({ ...b, runs: b.runs + extraRuns }));
      setCurrentOverBalls((prev) => [...prev, { type: 'extra', value: 'Wd', label: runsWithExtra > 0 ? `${runsWithExtra}Wd` : 'Wd' }]);
      if (runsWithExtra % 2 !== 0) {
        toggleStriker();
      }
    } else if (type === 'no_ball') {
      const extraRuns = 1 + runsWithExtra;
      setRuns((r) => r + extraRuns);
      setExtras((e) => ({ ...e, noBalls: e.noBalls + extraRuns }));
      setCurrentBowler((b) => ({ ...b, runs: b.runs + extraRuns }));
      setCurrentOverBalls((prev) => [...prev, { type: 'extra', value: 'Nb', label: runsWithExtra > 0 ? `${runsWithExtra}Nb` : 'Nb' }]);
      if (runsWithExtra % 2 !== 0) {
        toggleStriker();
      }
    } else if (type === 'leg_bye' || type === 'bye') {
      const extraRuns = runsWithExtra || 1;
      setRuns((r) => r + extraRuns);
      
      const newBalls = balls + 1;
      setBalls(newBalls);
      setExtras((e) => ({ ...e, legByes: e.legByes + extraRuns }));
      
      let nextStriker = striker;
      let nextNonStriker = nonStriker;
      if (extraRuns % 2 !== 0) {
        nextStriker = nonStriker;
        nextNonStriker = striker;
      }
      
      if (newBalls > 0 && newBalls % 6 === 0) {
        setCurrentOverBalls([]);
        setStriker(nextNonStriker);
        setNonStriker(nextStriker);
      } else {
        setCurrentOverBalls((prev) => [...prev, { type: 'extra', value: type === 'bye' ? 'B' : 'Lb', label: `${extraRuns}${type === 'bye' ? 'B' : 'Lb'}` }]);
        setStriker(nextStriker);
        setNonStriker(nextNonStriker);
      }
    }
  };

  // Record Wicket / Dismissal (Bowled, Caught, LBW, Run Out, Stumped, Other)
  const recordWicket = (dismissalType, outPlayerName = striker.name, fielder = '') => {
    const snapshot = {
      runs,
      wickets,
      balls,
      currentOverBalls: [...currentOverBalls],
      striker: { ...striker },
      nonStriker: { ...nonStriker },
      currentBowler: { ...currentBowler },
      extras: { ...extras },
      innings,
    };
    setBallHistory((prev) => [...prev, snapshot]);

    const newWickets = wickets + 1;
    const newBalls = balls + 1;
    setWickets(newWickets);
    setBalls(newBalls);

    // Update bowler wickets
    const isBowlerWicket = dismissalType !== 'Run Out';
    setCurrentBowler((b) => ({
      ...b,
      wickets: isBowlerWicket ? b.wickets + 1 : b.wickets,
      overs: Number((Math.floor(b.overs) + ((Math.round((b.overs % 1) * 10) + 1) === 6 ? 1 : (Math.round((b.overs % 1) * 10) + 1) / 10)).toFixed(1))
    }));

    // Add Wicket ball to over
    setCurrentOverBalls((prev) => [
      ...prev,
      { type: 'wicket', value: 'W', label: 'W', dismissalType, player: outPlayerName }
    ]);

    // Fall of wicket entry
    const newFOW = {
      wicketNumber: newWickets,
      score: runs,
      player: outPlayerName,
      over: `${formatOvers(newBalls)} ov`
    };
    setScorecard((sc) => ({
      ...sc,
      fallOfWickets: [...sc.fallOfWickets, newFOW]
    }));

    // Bring in new batter
    const nextBatterName = newWickets === 5 ? 'D. Karthik' : newWickets === 6 ? 'C. Green' : 'R. Patidar';
    const newBatter = {
      id: `bat-${newWickets + 2}`,
      name: nextBatterName,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      strikeRate: '0.0'
    };

    if (newBalls > 0 && newBalls % 6 === 0) {
      setCurrentOverBalls([]);
      // Over ends, new batter goes to non-striker end
      setStriker(nonStriker);
      setNonStriker(newBatter);
    } else {
      // Normal wicket mid-over, new batter takes strike (new rules)
      setStriker(newBatter);
    }

    setDismissalModalOpen(false);

    // Check all out
    if (newWickets >= 10) {
      if (innings === 1) {
        navigateTo('innings-break');
      } else {
        navigateTo('match-result');
      }
    }
  };

  // Undo Last Action
  const undoLastAction = () => {
    if (ballHistory.length === 0) return;
    const previousState = ballHistory[ballHistory.length - 1];
    setRuns(previousState.runs);
    setWickets(previousState.wickets);
    setBalls(previousState.balls);
    setCurrentOverBalls(previousState.currentOverBalls);
    setStriker(previousState.striker);
    setNonStriker(previousState.nonStriker);
    setCurrentBowler(previousState.currentBowler);
    setExtras(previousState.extras);
    setInnings(previousState.innings);
    setBallHistory((prev) => prev.slice(0, -1));
  };

  // Shortlist toggle for scouting
  const toggleShortlist = (playerId) => {
    setShortlistedIds((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId]
    );
  };

  // Register new player
  const registerPlayer = (playerData) => {
    const newPlayer = {
      id: `player-${Date.now()}`,
      name: playerData.name || 'New Player',
      avatar: playerData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      team: playerData.team || 'Local Club',
      club: playerData.district || 'District XI',
      role: playerData.role || 'Batter',
      primaryRole: playerData.role || 'Top Order Batter',
      battingStyle: playerData.battingStyle || 'Right-Hand Batter',
      bowlingStyle: playerData.bowlingStyle || 'None (Pure Batter)',
      age: playerData.age || 20,
      isPro: false,
      tags: [playerData.role || 'Batter', 'Registered'],
      careerRuns: 0,
      battingAvg: 0.0,
      strikeRate: 0.0,
      highScore: '0',
      matches: 0,
      innings: 0,
      notOuts: 0,
      fifties: 0,
      hundreds: 0,
      fours: 0,
      sixes: 0,
      last5Matches: [],
      scoringAreas: {
        offSide: 50,
        legSide: 50,
        behindSquare: 0,
        fine: 0,
      },
      district: playerData.district || 'Indore District',
      category: playerData.category || 'Senior',
      inForm: false,
    };

    setPlayers((prev) => [newPlayer, ...prev]);
    setSelectedPlayer(newPlayer);
    navigateTo('player-profile');
  };

  return (
    <CricketContext.Provider
      value={{
        currentScreen,
        activeTab,
        navigateTo,
        goBack,
        isAuthenticated,
        setIsAuthenticated,
        userMobile,
        setUserMobile,
        userRole,
        setUserRole,
        players,
        setPlayers,
        selectedPlayer,
        setSelectedPlayer,
        shortlistedIds,
        toggleShortlist,
        registerPlayer,
        matches,
        activeMatchId,
        setActiveMatchId,
        matchSetup,
        setMatchSetup,
        innings,
        setInnings,
        matchFormat,
        totalMatchOvers,
        runs,
        wickets,
        balls,
        formatOvers,
        calculateCRR,
        calculateProjectedScore,
        currentOverBalls,
        extras,
        striker,
        nonStriker,
        currentBowler,
        toggleStriker,
        recordRuns,
        recordExtra,
        recordWicket,
        undoLastAction,
        selectedDirection,
        setSelectedDirection,
        dismissalModalOpen,
        setDismissalModalOpen,
        extrasModalOpen,
        setExtrasModalOpen,
        compareModalOpen,
        setCompareModalOpen,
        comparePlayer2,
        setComparePlayer2,
        drawerOpen,
        setDrawerOpen,
        scorecard,
        setScorecard,
        officials: OFFICIALS,
        tournaments: TOURNAMENTS,
        districtStats: DISTRICT_STATS,
        selectionHistory: SELECTION_HISTORY,
        announcements: ANNOUNCEMENTS,
      }}
    >
      {children}
    </CricketContext.Provider>
  );
}

export function useCricket() {
  const context = useContext(CricketContext);
  if (!context) {
    throw new Error('useCricket must be used within a CricketProvider');
  }
  return context;
}
