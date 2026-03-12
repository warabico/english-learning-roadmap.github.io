# 05 - UI/UX Design Specification

## Color Palette

### Dark Theme (Default)

| Role       | Color     | Tailwind     | Usage                            |
|------------|-----------|--------------|----------------------------------|
| Background | `#0F172A` | `slate-900`  | Page background                  |
| Surface    | `#1E293B` | `slate-800`  | Cards, modals, panels            |
| Border     | `#334155` | `slate-700`  | Card borders, dividers           |
| Primary    | `#38BDF8` | `sky-400`    | Links, active states, highlights |
| Success    | `#34D399` | `emerald-400`| Verified nodes, correct answers  |
| Warning    | `#FBBF24` | `amber-400`  | Self-reported nodes              |
| Gold       | `#FCD34D` | `amber-300`  | Gold nodes, star badges          |
| Danger     | `#F87171` | `red-400`    | Wrong answers, errors            |
| Text       | `#F1F5F9` | `slate-100`  | Primary text                     |
| Muted      | `#94A3B8` | `slate-400`  | Secondary text, labels           |

### Light Theme

Inverted palette using corresponding Tailwind light variants. To be defined during implementation.

---

## Typography

| Role         | Font Family | Weight     | Usage                        |
|--------------|-------------|------------|------------------------------|
| Display/Logo | `Orbitron`  | 700        | App title, CEFR badges       |
| Body/UI      | `Exo 2`    | 400/600    | All body text, buttons, labels|

Both fonts loaded from Google Fonts.

---

## Screen Designs

### Layer 1: World Map (Category Cards)

Card layout in a responsive grid:

```
+----------------------------------+
|  [icon]  Grammar          [B1]  |
|  ==================----   62%   |
|  8 verified   4 self-reported   |
+----------------------------------+
```

- **Mobile:** Single column (1 card per row)
- **Tablet (md:):** 2-column grid
- **Desktop (lg:):** 2-column grid within a sidebar layout

Card interactions:
- Tap/click navigates to Layer 2 Skill Map for that category
- CEFR badge color reflects current assessed level

### Layer 2: Skill Map (Hex Tree)

- Organic hex tiles expanding in 6 directions from root nodes
- NOT a grid/table - positions determined by prerequisite graph
- SVG connector lines between prerequisite and dependent nodes
- Pan and zoom support for navigation

#### Hex Node Visual States

| State         | Fill Color | Border    | Effect                |
|---------------|------------|-----------|-----------------------|
| Locked        | `#1a2535`  | `#243447` | None                  |
| Unlocked      | `#0f3460`  | `#38bdf8` | Pulse animation       |
| Self-reported | `#7c3a00`  | `#fbbf24` | Amber glow            |
| Verified      | `#064e35`  | `#34d399` | Green glow            |
| Gold          | `#7a4f00`  | `#fcd34d` | Gold glow + particles |

Each hex tile displays:
- Skill name (abbreviated if needed)
- CEFR level badge
- Status icon

Tapping a hex opens a detail panel or quiz modal depending on state.

### Quiz Modal

Overlays on the Skill Map screen:

```
+----------------------------------+
|  Grammar > Conditionals   [B1]  |
|  Question 2/5    ====--   40%   |
+----------------------------------+
|                                  |
|  "If I ___ more time,           |
|   I would study harder."        |
|                                  |
|  ( ) have                       |
|  ( ) had                        |
|  ( ) has                        |
|  ( ) will have                  |
|                                  |
+----------------------------------+
|  [Skip]            [Answer ->]  |
+----------------------------------+
```

- 5 questions per quiz
- Pass threshold: 70% (>= 4/5 correct for Verified, >= 5/5 for Gold potential)
- Correct answer: green flash + `+20 XP!` float animation
- Wrong answer: red flash + explanation shown below
- Results screen shows score, XP earned, and status change

### Dashboard

- **Radar Chart:** 7-axis spider chart (one axis per category)
  - Two overlaid lines: Self-Reported (dashed) vs Verified (solid)
  - Weakest skill highlighted with visual nudge
- **Badge Grid:** Collection of earned badges, greyed placeholders for unearned
- **XP Stats:** Total XP, current streak, longest streak
- **CEFR Progress:** Quick view of current level per category

### Settings

- Theme toggle (Dark/Light)
- UI Language (EN/JA)
- Radar chart filter (show verified only toggle)
- Export button -> downloads JSON backup
- Import button -> file upload with confirmation
- Data warning: device/browser limitations explained

---

## Navigation (Bottom Bar)

Fixed bottom navigation bar with 4 tabs:

```
  Map   |   Dashboard   |   Badges   |   Settings
```

- Active tab highlighted with Primary color
- Icon + label for each tab
- Visible on all screens

---

## Animation Plan (Framer Motion)

| Event                   | Animation                        | Duration |
|-------------------------|----------------------------------|----------|
| Node unlock             | Scale up (0.8 -> 1) + glow pulse | 500ms    |
| XP gained               | Number floats upward and fades   | 800ms    |
| Quiz correct answer     | Green flash + confetti burst     | 600ms    |
| Quiz wrong answer       | Red flash + shake                | 400ms    |
| CEFR level complete     | Full-screen celebration + badge  | 1500ms   |
| Layer 1 -> 2 transition | Slide-in from card position      | 300ms    |
| Hex hover               | Subtle scale up (1 -> 1.05)     | 200ms    |
| Card hover              | Lift shadow + slight scale       | 200ms    |
| Modal open              | Fade in + slide up               | 300ms    |
| Modal close             | Fade out + slide down            | 200ms    |

---

## Responsive Layout

```
Mobile  (< 768px)  : Single column cards, compact hex tree, full-width modals
Tablet  (768px+)   : 2-column cards, full hex tree, centered modals
Desktop (1024px+)  : Sidebar nav + main content area, larger hex nodes
```

### Breakpoints (Tailwind default)

| Name | Min Width | Layout Change                     |
|------|-----------|-----------------------------------|
| sm   | 640px     | Minor padding adjustments         |
| md   | 768px     | 2-column card grid, wider modals  |
| lg   | 1024px    | Sidebar navigation appears        |
| xl   | 1280px    | Max content width applied         |
