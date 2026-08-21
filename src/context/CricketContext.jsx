import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  processDelivery,
  formatOvers,
  calculateCRR,
  calculateProjectedScore,
  canBowlerBowlNextOver,
  MATCH_STATES,
} from '../engine/cricketStateMachine';
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
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
    umpires: {
      umpire1: '',
      umpire2: '',
      tvUmpire: '',
      referee: ''
    },
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
    strikeRate: '152.4'
  });

  const [nonStriker, setNonStriker] = useState({
    id: 's2',
    name: 'S. Yadav',
    runs: 12,
    balls: 8,
    fours: 1,
    sixes: 0,
    strikeRate: '150.0'
  });

  const [currentBowler, setCurrentBowler] = useState({
    id: 'bw1',
    name: 'P. Cummins',
    overs: 3.4,
    ballsBowled: 22,
    maidens: 0,
    runs: 28,
    wickets: 1,
    economy: '7.64',
    wk: 'A. Carey'
  });

  // Ball Direction / Shot Sector & State Machine Attributes
  const [selectedDirection, setSelectedDirection] = useState('Cover');
  const [ballHistory, setBallHistory] = useState([]);
  const [isFreeHit, setIsFreeHit] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [matchStatus, setMatchStatus] = useState('IN_PROGRESS');

  // Modals & Sheets
  const [dismissalModalOpen, setDismissalModalOpen] = useState(false);
  const [extrasModalOpen, setExtrasModalOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [comparePlayer2, setComparePlayer2] = useState(INITIAL_PLAYERS[1]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Scorecard detailed tables
  const [scorecard, setScorecard] = useState(INITIAL_SCORECARD);

  // Auto-clear validation errors after 3 seconds
  useEffect(() => {
    if (validationError) {
      const timer = setTimeout(() => setValidationError(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [validationError]);

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

  // Convert raw ball count to cricket overs string
  const formatOversDisplay = (ballCount = balls) => {
    return formatOvers(ballCount);
  };

  // Current Run Rate (CRR)
  const getCRR = () => {
    return calculateCRR(runs, balls);
  };

  // Projected Score
  const getProjectedScore = () => {
    return calculateProjectedScore(runs, balls, matchSetup.totalOvers);
  };

  // Switch striker manually
  const toggleStriker = () => {
    const temp = striker;
    setStriker(nonStriker);
    setNonStriker(temp);
  };

  // Helper to snapshot current state for deterministic Undo
  const captureSnapshot = () => ({
    runs,
    wickets,
    balls,
    currentOverBalls: [...currentOverBalls],
    striker: { ...striker },
    nonStriker: { ...nonStriker },
    currentBowler: { ...currentBowler },
    extras: { ...extras },
    isFreeHit,
    innings,
    matchStatus,
    scorecard: JSON.parse(JSON.stringify(scorecard)),
  });

  // Apply State Machine Result
  const applyStateResult = (result) => {
    if (!result.success) {
      setValidationError(result.error);
      return false;
    }

    const { newState } = result;
    setBallHistory((prev) => [...prev, captureSnapshot()]);

    setRuns(newState.runs);
    setWickets(newState.wickets);
    setBalls(newState.balls);
    setCurrentOverBalls(newState.currentOverBalls);
    setStriker(newState.striker);
    setNonStriker(newState.nonStriker);
    setCurrentBowler(newState.currentBowler);
    setExtras(newState.extras);
    setIsFreeHit(newState.isFreeHit);
    setScorecard(newState.scorecard);
    setMatchStatus(newState.matchStatus);
    setValidationError(null);

    // Check innings or match termination
    if (newState.matchStatus === MATCH_STATES.INNINGS_BREAK) {
      setTimeout(() => navigateTo('innings-break'), 600);
    } else if (newState.matchStatus === MATCH_STATES.MATCH_FINISHED) {
      setTimeout(() => navigateTo('match-result'), 600);
    }

    return true;
  };

  // 1. Add Runs Action (0..6)
  const recordRuns = (runAmount, direction = selectedDirection) => {
    const currentState = {
      runs,
      wickets,
      balls,
      currentOverBalls,
      striker,
      nonStriker,
      currentBowler,
      extras,
      isFreeHit,
      innings,
      totalMatchOvers: matchSetup.totalOvers,
      scorecard,
    };

    const result = processDelivery(currentState, {
      type: 'run',
      runs: runAmount,
      wagonZone: direction,
    });

    const ok = applyStateResult(result);
    if (ok && runAmount === 6) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#FABB05', '#1D4ED8', '#10B981']
      });
    }
  };

  // 2. Record Extra (Wide, No Ball, Leg Bye, Bye, Penalty)
  const recordExtra = (type, runsWithExtra = 0) => {
    const currentState = {
      runs,
      wickets,
      balls,
      currentOverBalls,
      striker,
      nonStriker,
      currentBowler,
      extras,
      isFreeHit,
      innings,
      totalMatchOvers: matchSetup.totalOvers,
      scorecard,
    };

    const result = processDelivery(currentState, {
      type: 'extra',
      extraType: type,
      extraRuns: runsWithExtra,
    });

    applyStateResult(result);
  };

  // 3. Record Wicket / Dismissal (Bowled, Caught, LBW, Run Out, Stumped, etc.)
  const recordWicket = (dismissalType, outPlayerName = striker.name, fielder = '') => {
    const currentState = {
      runs,
      wickets,
      balls,
      currentOverBalls,
      striker,
      nonStriker,
      currentBowler,
      extras,
      isFreeHit,
      innings,
      totalMatchOvers: matchSetup.totalOvers,
      scorecard,
    };

    const result = processDelivery(currentState, {
      type: 'wicket',
      dismissalType,
      outPlayerName,
      fielderName: fielder,
    });

    const ok = applyStateResult(result);
    if (ok) {
      setDismissalModalOpen(false);
    }
  };

  // 4. Undo Last Action (Zero-Drift Event Reversal)
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
    setIsFreeHit(previousState.isFreeHit);
    setInnings(previousState.innings);
    setMatchStatus(previousState.matchStatus || 'IN_PROGRESS');
    if (previousState.scorecard) {
      setScorecard(previousState.scorecard);
    }
    setBallHistory((prev) => prev.slice(0, -1));
    setValidationError(null);
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
        userEmail,
        setUserEmail,
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
        isFreeHit,
        validationError,
        setValidationError,
        matchStatus,
        canBowlerBowlNextOver,
        MATCH_STATES,
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
