import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { supabase } from '../lib/supabase';
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
  POINTS_TABLE,
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
    'home': 'home',
    'scoring': 'scoring',
    'scorecard': 'scoring',
    'scouting': 'players',
    'players': 'players',
    'selectors': 'selection',
    'selection': 'selection',
    'player-profile': 'players',
    'player-registration': 'players',
    'matches': 'matches',
    'match-overview': 'matches',
    'match-setup': 'matches',
    'match-result': 'matches',
    'innings-break': 'matches',
    'tournaments': 'tournaments',
    'administration': 'administration',
    'access-control': 'administration',
  };
  const activeTab = activeTabMap[currentScreen] || 'home';

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('Admin'); // SuperAdmin, Admin, Scorer, Selector, Player

  // Dark Mode Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return localStorage.getItem('jdca-dark-mode') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('jdca-dark-mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('jdca-dark-mode', 'false');
    }
  }, [isDarkMode]);

  // Registered Users (Super Admin access)
  const [registeredUsers, setRegisteredUsers] = useState([
    { id: 'usr_001', name: 'Rohan (Super Admin)', email: 'superadmin@jdca.com', password: 'password123', role: 'SuperAdmin' },
    { id: 'usr_002', name: 'Admin User', email: 'admin@jdca.com', password: 'password123', role: 'Admin' },
    { id: 'usr_003', name: 'Scorer One', email: 'scorer@jdca.com', password: 'password123', role: 'Scorer' },
    { id: 'usr_004', name: 'Selector Lead', email: 'selector@jdca.com', password: 'password123', role: 'Selector' },
    { id: 'usr_005', name: 'Player Virat', email: 'player@jdca.com', password: 'password123', role: 'Player' }
  ]);

  // Players & Scouting
  const [players, setPlayers] = useState(INITIAL_PLAYERS);
  const [selectedPlayer, setSelectedPlayer] = useState(INITIAL_PLAYERS[0]); // default Rohan Sharma
  const [shortlistedIds, setShortlistedIds] = useState(['rohan-sharma-u13']);

  // Matches State
  const [matches, setMatches] = useState(INITIAL_MATCHES);
  const [activeMatchId, setActiveMatchId] = useState('match-live-1');

  // Fetch Supabase Data
  useEffect(() => {
    const fetchSupabaseData = async () => {
      try {
        // Fetch Players
        const { data: supabasePlayers, error: playerError } = await supabase.from('players').select('*');
        if (!playerError && supabasePlayers && supabasePlayers.length > 0) {
          // Map backend schema to frontend model if necessary, or just set it
          // setPlayers(supabasePlayers);
          console.log('Fetched players from Supabase:', supabasePlayers);
        }

        // Fetch Matches
        const { data: supabaseMatches, error: matchError } = await supabase.from('matches').select('*');
        if (!matchError && supabaseMatches && supabaseMatches.length > 0) {
          // setMatches(supabaseMatches);
          console.log('Fetched matches from Supabase:', supabaseMatches);
        }
      } catch (err) {
        console.error('Error fetching Supabase data:', err);
      }
    };

    fetchSupabaseData();
  }, []);

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
  // Permanent-in-session delivery events: the raw source for scorecards and future analytics.
  const [deliveryLog, setDeliveryLog] = useState([]);
  const [lastOverBowlerId, setLastOverBowlerId] = useState(null);
  const [scoringFirstRunDone, setScoringFirstRunDone] = useState(() => {
    try { return localStorage.getItem('jdca-scoring-first-run') === '1'; } catch { return false; }
  });
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
      'home': '/home',
      'matches': '/matches',
      'match-setup': '/match-setup',
      'scoring': '/scoring',
      'scorecard': '/scorecard',
      'match-overview': '/match-overview',
      'innings-break': '/innings-break',
      'match-result': '/match-result',
      'tournaments': '/tournaments',
      'players': '/players',
      'scouting': '/players',
      'player-profile': '/player-profile',
      'player-registration': '/player-registration',
      'selection': '/selection',
      'selectors': '/selection',
      'administration': '/administration',
      'access-control': '/administration',
    };
    navigate(routeMap[screenName] || '/home');
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
    lastOverBowlerId,
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
    if (newState.lastOverBowlerId !== undefined) setLastOverBowlerId(newState.lastOverBowlerId);
    setValidationError(null);

    // Check innings or match termination
    if (newState.matchStatus === MATCH_STATES.INNINGS_BREAK) {
      setTimeout(() => navigateTo('innings-break'), 600);
    } else if (newState.matchStatus === MATCH_STATES.MATCH_FINISHED) {
      setTimeout(() => navigateTo('match-result'), 600);
    }

    return true;
  };

  const recordDeliveryEvent = (event) => {
    const eventId = `delivery-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setDeliveryLog((prev) => [...prev, {
      id: eventId,
      timestamp: new Date().toISOString(),
      matchId: activeMatchId,
      innings,
      over: formatOvers(balls),
      strikerId: striker.id,
      striker: striker.name,
      nonStrikerId: nonStriker.id,
      nonStriker: nonStriker.name,
      bowlerId: currentBowler.id,
      bowler: currentBowler.name,
      ...event,
    }]);
  };

  const markScoringFirstRunDone = () => {
    setScoringFirstRunDone(true);
    try { localStorage.setItem('jdca-scoring-first-run', '1'); } catch {}
  };

  const replaceStriker = (player) => {
    if (!player) return;
    setStriker((prev) => ({
      id: player.id || prev.id,
      name: player.name || prev.name,
      runs: Number.isFinite(player.runs) ? player.runs : 0,
      balls: Number.isFinite(player.balls) ? player.balls : 0,
      fours: Number.isFinite(player.fours) ? player.fours : 0,
      sixes: Number.isFinite(player.sixes) ? player.sixes : 0,
      strikeRate: player.strikeRate || '0.0',
    }));
  };

  const replaceBatter = (isStriker, player) => {
    if (!player) return;
    const newBatter = {
      id: player.id || `temp-${Date.now()}`,
      name: player.name || 'Unknown',
      runs: Number.isFinite(player.runs) ? player.runs : 0,
      balls: Number.isFinite(player.balls) ? player.balls : 0,
      fours: Number.isFinite(player.fours) ? player.fours : 0,
      sixes: Number.isFinite(player.sixes) ? player.sixes : 0,
      strikeRate: player.strikeRate || '0.0',
    };
    if (isStriker) {
      setStriker(newBatter);
    } else {
      setNonStriker(newBatter);
    }
  };

  const handleRetireBatter = (isStriker, isRetiredOut) => {
    const outName = isStriker ? striker.name : nonStriker.name;
    const dismissalType = isRetiredOut ? 'Retired Out' : 'Retired Hurt';
    
    setBallHistory((prev) => [...prev, captureSnapshot()]);
    
    if (isRetiredOut) {
      setWickets((prev) => prev + 1);
      recordDeliveryEvent({ type: 'wicket', wicket: true, dismissalType, outPlayerName: outName, totalRuns: 0, label: 'W' });
    } else {
      recordDeliveryEvent({ type: 'retire', dismissalType, outPlayerName: outName, totalRuns: 0, label: 'RH' });
    }
  };

  const continueAfterOver = (bowler) => {
    if (!bowler) return;
    setCurrentBowler((prev) => ({
      id: bowler.id,
      name: bowler.name,
      overs: 0,
      ballsBowled: 0,
      maidens: 0,
      runs: 0,
      wickets: 0,
      economy: '0.00',
      wk: '',
    }));
    setMatchStatus(MATCH_STATES.IN_PROGRESS);
    setCurrentOverBalls([]);
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
      lastOverBowlerId,
    };

    const result = processDelivery(currentState, {
      type: 'run',
      runs: runAmount,
      wagonZone: direction,
    });

    const ok = applyStateResult(result);
    if (ok) {
      recordDeliveryEvent({ type: 'run', runs: runAmount, runsOffBat: runAmount, totalRuns: runAmount, label: String(runAmount), wagonZone: direction });
    }
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
      lastOverBowlerId,
    };

    const result = processDelivery(currentState, {
      type: 'extra',
      extraType: type,
      extraRuns: runsWithExtra,
    });

    const ok = applyStateResult(result);
    if (ok) {
      const totalRuns = type === 'wide' || type === 'no_ball' ? 1 + runsWithExtra : runsWithExtra;
      recordDeliveryEvent({ type: 'extra', extraType: type, extraRuns: runsWithExtra, totalRuns, label: type === 'wide' ? `${totalRuns}Wd` : type === 'no_ball' ? `${totalRuns}Nb` : `${totalRuns}${type === 'bye' ? 'B' : 'Lb'}` });
    }
  };

  // 3. Record Wicket / Dismissal (Bowled, Caught, LBW, Run Out, Stumped, etc.)
  const recordWicket = (dismissalType, outPlayerName = striker.name, fielder = '', wicketkeeper = '') => {
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
      lastOverBowlerId,
    };

    const result = processDelivery(currentState, {
      type: 'wicket',
      dismissalType,
      outPlayerName,
      fielderName: fielder,
      wicketkeeperName: wicketkeeper,
    });

    const ok = applyStateResult(result);
    if (ok) {
      recordDeliveryEvent({ type: 'wicket', wicket: true, dismissalType, outPlayerName, fielderName: fielder, wicketkeeperName: wicketkeeper, totalRuns: 0, label: 'W' });
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
    setLastOverBowlerId(previousState.lastOverBowlerId || null);
    setDeliveryLog((prev) => prev.slice(0, -1));
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
        isDarkMode,
        setIsDarkMode,
        registeredUsers,
        setRegisteredUsers,
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
        deliveryLog,
        lastOverBowlerId,
        replaceStriker,
        replaceBatter,
        handleRetireBatter,
        continueAfterOver,
        scoringFirstRunDone,
        markScoringFirstRunDone,
        officials: OFFICIALS,
        tournaments: TOURNAMENTS,
        districtStats: DISTRICT_STATS,
        selectionHistory: SELECTION_HISTORY,
        announcements: ANNOUNCEMENTS,
        pointsTable: POINTS_TABLE,
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
