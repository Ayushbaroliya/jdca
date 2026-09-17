# JDCA Cricket Management & Scoring App - Design Document

## 1. Overview
The **JDCA (Jabalpur Division Cricket Association) App** is a comprehensive, mobile-first web application designed to manage cricket tournaments, player registrations, live scoring, and team selection across 9 districts. 

The application provides role-based experiences for **Scorers**, **Selectors**, **Players**, and **Administrators**.

## 2. Technology Stack
- **Framework**: React 19 (via Vite)
- **Styling**: Tailwind CSS v4, custom CSS utility classes (`index.css`)
- **Icons**: `lucide-react`
- **Charts/Data Vis**: `recharts`
- **Animations**: `motion` (Framer Motion)
- **State Management**: React Context API (`CricketContext`)
- **Routing**: Internal state-based routing or `react-router-dom`

## 3. Architecture & State Management
The application relies heavily on `CricketContext` to manage global state, providing a single source of truth for:
- `currentScreen`: The active view (e.g., 'home', 'scoring', 'players')
- `userRole`: The current active role (Scorer, Selector, Player, Admin)
- `players`: Global registry of all JDCA players
- `shortlistedIds`: Players shortlisted by selectors
- Navigation helpers (`navigateTo`, `setDrawerOpen`)

## 4. UI/UX Design System
The app follows a modern, clean, mobile-first aesthetic tailored for field usage (e.g., scorers logging data on tablets/phones).

### 4.1. Color Palette
- **Primary Brand (JDCA Blue)**: `#2457D6` - Used for primary actions, active tabs, highlights.
- **Success / In-Form**: `#0FA968` - Indicates player form or positive stats.
- **Danger / Wickets**: `#F05A47` - Highlights wickets, dismissals, or critical alerts.
- **Warning / Shortlist**: `#F4B942` - Used for star icons, shortlisting, and warnings.
- **Neutrals**: Tailwind `slate` palette (`slate-50` to `slate-900`) for text, borders, and backgrounds.

### 4.2. Typography
- Standard system sans-serif fonts (via Tailwind).
- Heavy use of tabular numerals (`font-tabular`) for statistics (Runs, Wickets, Averages) to ensure alignment.

### 4.3. Core Components
- **`PageHeader`**: Standardized header for screens, featuring a title, subtitle, and optional primary action button.
- **`BottomNav`**: Mobile navigation bar mapping primary routes to icons. Dynamically adjusts available tabs based on `userRole`.
- **`Badge`**: Status indicators (e.g., upcoming matches, player categories).
- **Cards**: `.jdca-card` and `.jdca-card-hover` provide consistent border-radius, shadows, and padding.

## 5. Key Screens & Features

### 5.1. Player Management (`PlayersScreen`)
- **Purpose**: Directory of all registered cricketers across the 9 JDCA districts.
- **Features**:
  - Filter by Name/Search, District, Age Category (Under 13 to Senior), and Playing Role.
  - Toggle between Table View (dense data) and Card View (visual profiles).
  - Quick stats display (Runs, Avg, Wickets).
  - Selectors can "Shortlist" players (Star icon).

### 5.2. Live Scoring (`scoring`)
- **Purpose**: Real-time match scoring interface for official scorers.
- **Features**:
  - Live indicator dot on the navigation bar.
  - Intuitive controls to log deliveries, boundaries, wickets, and extras.

### 5.3. Role-Based Access
- **Scorer**: Focused on Home, Matches, and Live Scoring.
- **Selector**: Focused on Home, Player Scouting/Shortlisting, and Selection.
- **Player**: Focused on Home, Match Schedules, and Player Profiles.
- **Administrator**: Full access to all modules including Tournaments, Access Control, and Settings.

## 6. Layout Strategy
- **Mobile-First**: Bottom navigation (`BottomNav`) is sticky on mobile and hidden on large screens (`lg:hidden`).
- **Responsive Grids**: Player cards and statistics adapt from 1 column on mobile to 3-4 columns on desktop/tablet.
- **Safe Areas**: Padding applied to the bottom of screens (`pb-[100px]`) to prevent content from being hidden behind the bottom navigation.
