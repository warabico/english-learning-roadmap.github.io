# 04 - Tech Stack & Project Structure

## Technology Choices

| Layer            | Choice                | Reason                                             |
|------------------|-----------------------|----------------------------------------------------|
| UI Framework     | React 18 + TypeScript | Component-based, type-safe                         |
| Styling          | Tailwind CSS v4       | Utility-first, game UI friendly                    |
| Build Tool       | Vite                  | Fast dev server, easy GitHub Pages config          |
| State Management | Zustand               | Minimal boilerplate, easy localStorage persistence |
| Animations       | Framer Motion         | Declarative, React-native animation library        |
| Charts           | Recharts              | Radar chart, React-native charting library         |
| Icons            | Lucide React          | Clean, tree-shakeable icon set                     |
| Deployment       | GitHub Actions        | Auto-deploy on push to main                        |

---

## Dependencies

### Production

```bash
npm install react react-dom
npm install tailwindcss @tailwindcss/vite
npm install framer-motion recharts lucide-react zustand
```

### Development

```bash
npm install -D typescript @types/react @types/react-dom
npm install -D vite @vitejs/plugin-react
```

---

## Project Structure

```
english-learning-roadmap.github.io/
├── public/
│   ├── index.html
│   └── 404.html                    # SPA routing fix for GitHub Pages
├── src/
│   ├── data/
│   │   ├── nodes.ts                # All Layer 2 skill node definitions (SkillNode[])
│   │   └── quizzes.ts              # Quiz questions per node (QuizQuestion[])
│   ├── components/
│   │   ├── Layer1/                 # Category cards (World Map)
│   │   │   ├── WorldMap.tsx        # Main grid of category cards
│   │   │   └── CategoryCard.tsx    # Single category card component
│   │   ├── Layer2/                 # Hex skill tree (Skill Map)
│   │   │   ├── SkillMap.tsx        # Hex tree container with pan/zoom
│   │   │   ├── HexNode.tsx         # Single hex tile component
│   │   │   └── ConnectorLine.tsx   # SVG line between prerequisite nodes
│   │   ├── Quiz/                   # Quiz modal
│   │   │   ├── QuizModal.tsx       # Quiz overlay container
│   │   │   └── QuestionCard.tsx    # Single question display
│   │   ├── Dashboard/              # Radar chart + badges + stats
│   │   │   ├── Dashboard.tsx       # Main dashboard layout
│   │   │   ├── RadarChart.tsx      # 7-axis radar chart
│   │   │   ├── BadgeGrid.tsx       # Badge collection display
│   │   │   └── XpStats.tsx         # XP and streak summary
│   │   ├── Settings/               # Export/Import + theme
│   │   │   └── Settings.tsx        # Settings page
│   │   └── common/                 # Shared UI components
│   │       ├── BottomNav.tsx       # Bottom navigation bar
│   │       └── CefrBadge.tsx       # CEFR level badge component
│   ├── hooks/
│   │   ├── useProgress.ts          # localStorage read/write for progress
│   │   └── useStreak.ts            # Streak calculation logic
│   ├── store/
│   │   └── progressStore.ts        # Zustand global state
│   ├── types/
│   │   └── index.ts                # All TypeScript type definitions
│   ├── utils/
│   │   ├── xp.ts                   # XP calculation helpers
│   │   ├── progress.ts             # Progress aggregation functions
│   │   └── storage.ts              # localStorage helpers, export/import
│   ├── App.tsx                     # Root component with routing
│   └── main.tsx                    # Entry point
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions deployment
├── design/                         # Design documents (this directory)
├── plan/                           # Planning documents
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Key Configuration Files

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

- `base` is set to the repository name for correct asset paths on GitHub Pages

### Zustand Store Design

The Zustand store (`progressStore.ts`) is the single source of truth for app state.
It wraps localStorage read/write operations and provides actions for:

- Updating node status (self-report, quiz result)
- Calculating XP
- Managing streak
- Checking/granting badges
- Export/Import operations

```typescript
// Conceptual store structure
interface ProgressStore {
    // State
    profile: UserProfile;
    progress: Record<string, NodeProgress>;
    settings: AppSettings;

    // Actions
    selfReportNode: (nodeId: string) => void;
    submitQuizResult: (nodeId: string, score: number) => void;
    recordActivity: () => void;  // for streak tracking
    exportData: () => ExportData;
    importData: (data: ExportData) => void;
}
```

---

## Routing

Client-side routing with URL hash or a simple state-based approach:

| Route             | Component    |
|-------------------|--------------|
| `/`               | WorldMap     |
| `/skill/:category`| SkillMap     |
| `/dashboard`      | Dashboard    |
| `/settings`       | Settings     |

Note: GitHub Pages does not support server-side routing. A `404.html` redirect trick or hash-based routing is needed for SPA support.
