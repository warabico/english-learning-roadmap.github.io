# English Learning Roadmap – Project Planning

> This document summarizes all design decisions made across Milestones 1–7.
> Use this as the single source of truth when implementing the application.

---

## Project Overview

A gamified English learning progress tracker published on GitHub Pages.  
No backend. No accounts. Fully client-side with localStorage persistence.

**Live URL:** `https://<username>.github.io/english-learning-roadmap.github.io/`

---

## Milestone 1: Learning Taxonomy

### Two-Layer Architecture

The app uses a **two-layer roadmap system** to balance simplicity and depth.

#### Layer 1 – World Map (Simple Overview)

- 7 skill categories × 6 CEFR levels
- Displayed as **category cards** (not hex tiles)
- Each card shows: category name, current CEFR level badge, progress bar, verified/self-reported counts
- Purpose: "Where am I overall?" at a glance

#### Layer 2 – Skill Map (Deep Detail)

- Accessed by tapping a Layer 1 category card
- Displayed as an **organic hex tile tree** expanding in 6 directions
- Each hex = one specific sub-skill node
- Connected by lines showing prerequisite relationships
- Purpose: "What exactly do I need to work on?"

### 7 Skill Categories

| #   | Category      | Type      | Icon |
| --- | ------------- | --------- | ---- |
| 1   | Vocabulary    | Basic     | 📖   |
| 2   | Grammar       | Basic     | ⚙️   |
| 3   | Pronunciation | Basic     | 🔊   |
| 4   | Reading       | Practical | 📚   |
| 5   | Writing       | Practical | 📝   |
| 6   | Listening     | Practical | 👂   |
| 7   | Speaking      | Practical | 🗣️   |

### CEFR Levels

`A1 → A2 → B1 → B2 → C1 → C2`

### Layer 2 Sub-skill Taxonomy (CEFR assigned per node)

#### Grammar

| Sub-skill                   | CEFR |
| --------------------------- | ---- |
| Basic Sentence Structure    | A1   |
| Nouns & Pronouns            | A1   |
| Present Simple & Continuous | A1   |
| Past Simple                 | A2   |
| Articles & Determiners      | A2   |
| Modal Verbs (basic)         | A2   |
| Future Forms                | B1   |
| Conditionals                | B1   |
| Passive Voice               | B1   |
| Relative Clauses            | B2   |
| Reported Speech             | B2   |
| Inversion                   | C1   |
| Cleft Sentences             | C1   |
| Advanced Clause Structure   | C2   |

#### Vocabulary

| Sub-skill                  | CEFR |
| -------------------------- | ---- |
| Core 500 Words             | A1   |
| Word Classes               | A1   |
| Core 1000 Words            | A2   |
| Collocations (basic)       | A2   |
| Core 2000 Words            | B1   |
| Phrasal Verbs              | B1   |
| Academic Word List         | B2   |
| Collocations (advanced)    | B2   |
| Idioms                     | C1   |
| Register (Formal/Informal) | C1   |
| Near-native Lexical Range  | C2   |

#### Pronunciation

| Sub-skill                    | CEFR |
| ---------------------------- | ---- |
| Individual Sounds (Phonemes) | A1   |
| Word Stress                  | A1   |
| Sentence Stress              | A2   |
| Basic Intonation             | A2   |
| Connected Speech             | B1   |
| Weak Forms                   | B1   |
| Accent Awareness             | B2   |
| Rhythm & Chunking            | B2   |
| Advanced Intonation          | C1   |
| Style & Register in Speech   | C2   |

#### Reading

| Sub-skill                   | CEFR |
| --------------------------- | ---- |
| Simple Texts (signs, menus) | A1   |
| Short Paragraphs            | A2   |
| Main Idea Comprehension     | B1   |
| Skimming & Scanning         | B1   |
| Inference                   | B2   |
| Vocabulary in Context       | B2   |
| Text Structure Awareness    | C1   |
| Critical Reading            | C1   |
| Academic Texts              | C2   |

#### Writing

| Sub-skill                 | CEFR |
| ------------------------- | ---- |
| Sentence Construction     | A1   |
| Simple Messages & Forms   | A2   |
| Paragraph Structure       | B1   |
| Cohesion & Coherence      | B1   |
| Essay Structure           | B2   |
| Formal Writing            | B2   |
| Academic Writing          | C1   |
| Argumentation             | C1   |
| Advanced Style & Rhetoric | C2   |

#### Listening

| Sub-skill                    | CEFR |
| ---------------------------- | ---- |
| Gist Listening (slow, clear) | A1   |
| Key Information Extraction   | A2   |
| Detail Listening             | B1   |
| Inference from Tone          | B1   |
| Accents & Varieties          | B2   |
| Fast Speech Comprehension    | B2   |
| Lecture Comprehension        | C1   |
| Conversational Nuance        | C1   |
| Native-speed Comprehension   | C2   |

#### Speaking

| Sub-skill                 | CEFR |
| ------------------------- | ---- |
| Basic Conversation        | A1   |
| Familiar Topic Discussion | A2   |
| Discourse Markers         | B1   |
| Pronunciation Fluency     | B1   |
| Expressing Opinion        | B2   |
| Debate & Argument         | B2   |
| Presentation Skills       | C1   |
| Spontaneous Speech        | C1   |
| Native-like Fluency       | C2   |

---

## Milestone 2: Gamification Rules

### Node Completion States

| State            | Meaning               | Visual                     |
| ---------------- | --------------------- | -------------------------- |
| 🔒 Locked        | Prerequisites not met | Dark/greyed hex            |
| 🔵 Unlocked      | Available to study    | Dim color, pulsing outline |
| 📖 Self-Reported | "I've studied this"   | Half-filled hex            |
| ✅ Verified      | Quiz passed (≥70%)    | Fully glowing hex          |
| ⭐ Gold          | Quiz passed (≥90%)    | Gold glowing hex + star    |

### XP Rules

```
Self-report completion     → +10 XP
Quiz attempt               → +5 XP  (regardless of result)
Quiz passed (≥70%)         → +20 XP bonus
Quiz passed (≥90%)         → +35 XP bonus + Gold star ⭐
```

### Layer 1 Unlock Condition

```
A Layer 1 category+CEFR tile is "complete" when:
  → All Layer 2 nodes for that category+level are at least Self-Reported
  AND
  → ≥ 50% of those nodes are Verified
```

### Layer 1 Progress Calculation

```
Progress % = (self_reported × 1 + verified × 2) / (total_nodes × 2) × 100
```

This means:

- All self-reported only → ~50% fill
- All verified → 100% fill
- Verified effort is visually rewarded

### Prerequisite & Unlock Logic

- A node unlocks when all prerequisite nodes are at least Self-Reported
- Manual override of prerequisites is **NOT allowed** without placement quiz
- Placement quiz result auto-unlocks all nodes below the assessed level as Self-Reported

### Placement Quiz

```
New user → Optional Placement Quiz (20–30 questions, A1→B2)
         → Result auto self-reports all nodes below assessed level
         → User can then Verify any node via individual quizzes
```

### Three Motivation Pillars

#### 🔥 Daily Streak (Habit building)

- Any activity counts (marking a node, taking a quiz, opening app)
- Streak freeze: 1 per week
- Milestone streaks: 7 days, 30 days, 100 days → special badges

#### 🏆 Badges & Certificates (Milestone rewards)

- Category badge: all nodes in one category+level complete
- CEFR certificate: all 7 categories complete at one level → shareable card
- Secret badges: hidden achievements (e.g., "Verified 10 nodes in one day")

#### 📈 Radar Chart (Balance visualization)

- Spider chart across all 7 categories
- Separate lines: Self-Reported vs Verified
- Highlights weakest skill with visual nudge

---

## Milestone 3: Data & Storage Strategy

**Choice: localStorage** (no backend, no accounts, GitHub Pages compatible)

### localStorage Keys

```
elt_user_profile    → UserProfile object
elt_progress        → Record<nodeId, NodeProgress>
elt_placement_quiz  → placement quiz result
elt_settings        → theme, language, preferences
```

Prefix `elt_` (English Learning Tracker) prevents collision with other apps.

### Export / Import (Essential Feature)

Since localStorage is device-locked:

- **Export button** → downloads `elt_backup_YYYY-MM-DD.json`
- **Import button** → restores all progress from JSON file
- Shown prominently in Settings

### Limitations to Communicate to User

| Limitation                        | Mitigation                       |
| --------------------------------- | -------------------------------- |
| Device-locked progress            | Export/Import feature            |
| Browser-locked (Chrome ≠ Firefox) | Clear warning in UI              |
| Clearable by browser              | Confirm dialog + backup reminder |

---

## Milestone 4: Tech Stack

| Layer            | Choice                | Reason                                             |
| ---------------- | --------------------- | -------------------------------------------------- |
| UI Framework     | React 18 + TypeScript | Component-based, type-safe                         |
| Styling          | Tailwind CSS v4       | Utility-first, game UI friendly                    |
| Build Tool       | Vite                  | Fast dev server, easy GitHub Pages config          |
| State Management | Zustand               | Minimal boilerplate, easy localStorage persistence |
| Animations       | Framer Motion         | Declarative, React-native                          |
| Charts           | Recharts              | Radar chart, React-native                          |
| Icons            | Lucide React          | Clean, tree-shakeable                              |
| Deployment       | GitHub Actions        | Auto-deploy on push to main                        |

### Key Libraries

```bash
npm install tailwindcss @tailwindcss/vite
npm install framer-motion recharts lucide-react zustand
npm install -D typescript @types/react @types/react-dom
```

### Project Structure

```
english-learning-roadmap.github.io/
├── public/
│   ├── index.html
│   └── 404.html              ← SPA routing fix for GitHub Pages
├── src/
│   ├── data/
│   │   ├── nodes.ts          ← All Layer 2 skill node definitions
│   │   └── quizzes.ts        ← Quiz questions per node
│   ├── components/
│   │   ├── Layer1/           ← Category cards (World Map)
│   │   ├── Layer2/           ← Hex skill tree (Skill Map)
│   │   ├── Quiz/             ← Quiz modal
│   │   ├── Dashboard/        ← Radar chart + badges + stats
│   │   └── Settings/         ← Export/Import + theme
│   ├── hooks/
│   │   ├── useProgress.ts    ← localStorage read/write
│   │   └── useStreak.ts      ← Streak calculation logic
│   ├── store/
│   │   └── progressStore.ts  ← Zustand global state
│   └── App.tsx
├── vite.config.ts
├── tailwind.config.ts
└── package.json
```

---

## Milestone 5: GitHub Pages Pipeline

### vite.config.ts

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    base: "/english-learning-roadmap.github.io/",
    plugins: [react(), tailwindcss()],
});
```

### GitHub Actions: `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
    push:
        branches: [main]
    workflow_dispatch:

permissions:
    contents: read
    pages: write
    id-token: write

concurrency:
    group: pages
    cancel-in-progress: true

jobs:
    build:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4
            - uses: actions/setup-node@v4
              with:
                  node-version: 20
                  cache: npm
            - run: npm ci
            - run: npm run build
            - uses: actions/upload-pages-artifact@v3
              with:
                  path: dist

    deploy:
        needs: build
        runs-on: ubuntu-latest
        environment:
            name: github-pages
            url: ${{ steps.deployment.outputs.page_url }}
        steps:
            - uses: actions/deploy-pages@v4
```

### GitHub Pages Settings

- Repository → Settings → Pages → Source: **GitHub Actions**

---

## Milestone 6: Data Model Design

### Core TypeScript Types

```typescript
type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

type SkillCategory =
    | "vocabulary"
    | "grammar"
    | "pronunciation"
    | "reading"
    | "writing"
    | "listening"
    | "speaking";

type NodeStatus = "locked" | "unlocked" | "self_reported" | "verified";

interface SkillNode {
    id: string; // e.g. "grammar-conditionals"
    name: string; // e.g. "Conditionals"
    category: SkillCategory;
    cefrLevel: CEFRLevel;
    prerequisites: string[]; // array of node ids
    description: string;
    estimatedHours: number;
    tips: string[];
}

interface NodeProgress {
    nodeId: string;
    status: NodeStatus;
    selfReportedAt: string | null; // ISO date string
    quizPassedAt: string | null;
    bestScore: number | null; // 0–100
    attempts: number;
}

interface QuizQuestion {
    id: string;
    nodeId: string;
    type: "multiple_choice" | "fill_blank" | "true_false";
    question: string;
    options?: string[];
    answer: string;
    explanation: string;
}

interface Badge {
    id: string; // e.g. "grammar_b1_master"
    name: string;
    description: string;
    earnedAt: string;
    type: "category" | "cefr" | "streak" | "secret";
}

interface Streak {
    current: number;
    longest: number;
    lastActiveDate: string; // "YYYY-MM-DD"
    freezesRemaining: number; // resets weekly
}

interface UserProfile {
    name: string;
    createdAt: string;
    xp: number;
    streak: Streak;
    badges: Badge[];
    placementQuizCompleted: boolean;
    placementQuizLevel: CEFRLevel | null;
}

interface AppStorage {
    elt_user_profile: UserProfile;
    elt_progress: Record<string, NodeProgress>;
    elt_placement_quiz: {
        completed: boolean;
        resultLevel: CEFRLevel | null;
        completedAt: string | null;
    };
    elt_settings: {
        theme: "dark" | "light";
        uiLanguage: "en" | "ja";
        radarShowVerifiedOnly: boolean;
    };
}
```

### XP Calculation Constants

```typescript
const XP_RULES = {
    selfReport: 10,
    quizAttempt: 5,
    quizPass70: 20,
    quizPass90: 35,
} as const;
```

### Progress Aggregation

```typescript
function calcLayerOneProgress(nodes: NodeProgress[]): number {
    const total = nodes.length * 2;
    const earned = nodes.reduce((sum, n) => {
        if (n.status === "verified") return sum + 2;
        if (n.status === "self_reported") return sum + 1;
        return sum;
    }, 0);
    return Math.round((earned / total) * 100);
}
```

---

## Milestone 7: UI/UX Design

### Screen Architecture (5 screens)

| Screen       | Role                                         |
| ------------ | -------------------------------------------- |
| 🗺️ World Map | Layer 1 — 7 category cards                   |
| 🔷 Skill Map | Layer 2 — organic hex tile tree per category |
| 📝 Quiz      | Mini quiz modal                              |
| 📊 Dashboard | Radar chart + badges + XP stats              |
| ⚙️ Settings  | Theme / Export / Import                      |

### Layer 1: World Map (Category Cards)

Simple card-based layout. Each card shows:

```
┌─────────────────────────────────┐
│  ⚙️  Grammar             [B1]  │
│  ████████████░░░░░░░░░   62%   │
│  ✅ 8 verified   📖 4 self     │
└─────────────────────────────────┘
```

- 2-column grid on mobile, wider on desktop
- Tapping a card navigates to Layer 2 Skill Map
- CEFR badge color reflects current level

### Layer 2: Skill Map (Hex Tree)

- Organic hex tiles expanding **6 directions** from a root node
- NOT a grid/table — nodes are positioned by prerequisite graph
- Connector lines between prerequisite → dependent nodes
- Each hex shows: skill name, CEFR level, status color

#### Hex Node States

| State            | Fill Color | Border    | Effect                |
| ---------------- | ---------- | --------- | --------------------- |
| 🔒 Locked        | `#1a2535`  | `#243447` | None                  |
| 🔵 Unlocked      | `#0f3460`  | `#38bdf8` | Pulse animation       |
| 📖 Self-reported | `#7c3a00`  | `#fbbf24` | Amber glow            |
| ✅ Verified      | `#064e35`  | `#34d399` | Green glow            |
| ⭐ Gold          | `#7a4f00`  | `#fcd34d` | Gold glow + particles |

### Quiz Modal

```
┌─────────────────────────────────┐
│  Grammar > Conditionals  [B1]  │
│  Question 2/5    ████░░  40%   │
├─────────────────────────────────┤
│  "If I ___ more time,           │
│   I would study harder."        │
│                                 │
│  ○ have                         │
│  ○ had                          │
│  ○ has                          │
│  ○ will have                    │
├─────────────────────────────────┤
│  [Skip]          [Answer →]     │
└─────────────────────────────────┘
```

- Correct answer → ✅ green flash + `+20 XP!` float animation
- Wrong answer → ❌ red flash + explanation shown

### Color Palette (Dark Theme — Default)

```
Background:  #0F172A  (slate-900)
Surface:     #1E293B  (slate-800)
Border:      #334155  (slate-700)
Primary:     #38BDF8  (sky-400)
Success:     #34D399  (emerald-400)
Warning:     #FBBF24  (amber-400)
Gold:        #FCD34D  (amber-300)
Danger:      #F87171  (red-400)
Text:        #F1F5F9  (slate-100)
Muted:       #94A3B8  (slate-400)
```

### Typography

```
Display / Logo:  'Orbitron'  (game feel, CEFR badges)
Body / UI:       'Exo 2'     (clean, modern, readable)
```

### Animation Plan (Framer Motion)

| Event                  | Animation                       |
| ---------------------- | ------------------------------- |
| Node unlock            | Scale up + glow pulse           |
| XP gained              | Number floats upward and fades  |
| Quiz correct           | Green flash + confetti burst    |
| CEFR level complete    | Full-screen celebration + badge |
| Layer 1 → 2 transition | Slide-in from card position     |
| Hex hover              | Subtle scale up + brightness    |

### Responsive Layout

```
Mobile  (default) : Single column cards, compact hex tree
Tablet  (md:)     : 2-column cards, full hex tree
Desktop (lg:)     : Sidebar nav + main content 2-column
```

### Navigation (Bottom Bar)

```
🗺️ Map  |  📊 Dashboard  |  🏆 Badges  |  ⚙️ Settings
```

---

## Summary: Key Design Decisions

| Decision              | Choice                                | Reason                        |
| --------------------- | ------------------------------------- | ----------------------------- |
| Layer 2 CEFR mapping  | One node = one CEFR level             | Simplest to understand        |
| Progress marking      | Hybrid (self-report + optional quiz)  | Low friction + credibility    |
| Prerequisite override | Only via placement quiz               | Integrity without friction    |
| Motivation mechanics  | All three (streak + badges + radar)   | Appeals to all learner types  |
| Storage               | localStorage + Export/Import          | No backend needed             |
| Layer 1 UI            | Category cards with progress bars     | Simple, readable at a glance  |
| Layer 2 UI            | Organic hex tile tree (6-directional) | Game-like, visually engaging  |
| Framework             | React 18 + TypeScript + Tailwind v4   | Modern, type-safe, productive |
| Deployment            | GitHub Actions → GitHub Pages         | Free, automatic               |

---

_Generated from planning conversation — March 2026_
