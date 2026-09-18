export const FIELD_DIRECTIONS = [
  { id: 'third_man',   name: 'Third Man',   angle: 45,  label: 'Third Man',   sector: 'Off Side' },
  { id: 'point',       name: 'Point',       angle: 90,  label: 'Point',       sector: 'Off Side' },
  { id: 'cover',       name: 'Cover',       angle: 120, label: 'Cover',       sector: 'Off Side' },
  { id: 'mid_off',     name: 'Mid Off',     angle: 150, label: 'Mid Off',     sector: 'Off Side' },
  { id: 'long_off',    name: 'Long Off',    angle: 170, label: 'Long Off',    sector: 'Off Side' },
  { id: 'long_on',     name: 'Long On',     angle: 190, label: 'Long On',     sector: 'Leg Side' },
  { id: 'mid_on',      name: 'Mid On',      angle: 210, label: 'Mid On',      sector: 'Leg Side' },
  { id: 'mid_wicket',  name: 'Mid Wicket',  angle: 240, label: 'Mid Wicket',  sector: 'Leg Side' },
  { id: 'square_leg',  name: 'Square Leg',  angle: 270, label: 'Square Leg',  sector: 'Leg Side' },
  { id: 'fine_leg',    name: 'Fine Leg',    angle: 315, label: 'Fine Leg',    sector: 'Leg Side' }
];

export const INITIAL_SCORECARD = {
  batting: [
    { id: 'b1', name: 'V. Sharma',  status: 'not out',           isStriker: true,  runs: 78,  balls: 42, fours: 6, sixes: 4, strikeRate: 185.7 },
    { id: 'b2', name: 'R. Sharma',  status: 'not out',           isStriker: false, runs: 42,  balls: 28, fours: 4, sixes: 2, strikeRate: 150.0 },
    { id: 'b3', name: 'A. Dubey',   status: 'c Pathak b Zaheer', isStriker: false, runs: 12,  balls: 15, fours: 1, sixes: 0, strikeRate: 80.0  },
    { id: 'b4', name: 'K. Pathak',  status: 'lbw b S.Sharma',    isStriker: false, isCaptain: true, runs: 8, balls: 10, fours: 0, sixes: 0, strikeRate: 80.0 },
    { id: 'b5', name: 'P. Kashyap', status: 'run out (Dubey)',   isStriker: false, isWK: true, runs: 2, balls: 4, fours: 0, sixes: 0, strikeRate: 50.0 },
  ],
  extras: { total: 17, byes: 2, legByes: 4, wides: 10, noBalls: 1 },
  bowling: [
    { id: 'bw1', name: 'Z. Khan Jr', overs: 4.0, maidens: 0, runs: 28, wickets: 2, economy: 7.00, isCurrent: true },
    { id: 'bw2', name: 'D. Pawar',   overs: 4.0, maidens: 1, runs: 22, wickets: 1, economy: 5.50, isCurrent: false },
    { id: 'bw3', name: 'N. Shukla',  overs: 3.0, maidens: 0, runs: 32, wickets: 0, economy: 10.67, isCurrent: false },
    { id: 'bw4', name: 'S. Verma',   overs: 3.2, maidens: 0, runs: 28, wickets: 1, economy: 8.40, isCurrent: false },
  ],
  fallOfWickets: [
    { wicketNumber: 1, score: 42,  player: 'A. Dubey',   over: '5.2 ov' },
    { wicketNumber: 2, score: 88,  player: 'K. Pathak',  over: '10.4 ov' },
    { wicketNumber: 3, score: 105, player: 'P. Kashyap', over: '13.1 ov' },
  ],
};
