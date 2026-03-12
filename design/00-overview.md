# 00 - Project Overview & Architecture

## Project Summary

English Learning Roadmap is a gamified English learning progress tracker published on GitHub Pages.
It provides a visual skill tree system where learners can track their progress across all English skills from A1 to C2.

- **No backend / No accounts** - Fully client-side with localStorage persistence
- **GitHub Pages deployment** - Static site, free hosting
- **Live URL:** `https://<username>.github.io/english-learning-roadmap.github.io/`

## Two-Layer Architecture

The core concept is a **two-layer roadmap system** that balances overview simplicity with detailed tracking.

```
Layer 1: World Map (Overview)          Layer 2: Skill Map (Detail)
┌──────────────────────┐               ┌──────────────────────────┐
│  7 Category Cards    │   tap card    │  Hex Tile Skill Tree     │
│  × 6 CEFR Levels     │ ──────────►  │  per category            │
│                      │               │  with prerequisites      │
│  "Where am I?"       │   ◄ back     │  "What to work on next?" │
└──────────────────────┘               └──────────────────────────┘
```

### Layer 1 - World Map
- 7 skill category cards displayed in a responsive grid
- Each card shows: category name, current CEFR level badge, progress bar, verified/self-reported counts
- Purpose: At-a-glance overview of overall English ability

### Layer 2 - Skill Map
- Organic hex tile tree expanding in 6 directions from root nodes
- Each hex = one specific sub-skill node with a CEFR level
- Connected by lines showing prerequisite relationships
- Purpose: Granular view for learning planning

## Screen Architecture (5 Screens)

| Screen       | Path          | Role                                         |
| ------------ | ------------- | -------------------------------------------- |
| World Map    | `/`           | Layer 1 - 7 category cards                   |
| Skill Map    | `/skill/:cat` | Layer 2 - hex tile tree per category          |
| Quiz         | (modal)       | Mini quiz overlay on Skill Map                |
| Dashboard    | `/dashboard`  | Radar chart + badges + XP stats               |
| Settings     | `/settings`   | Theme / Export / Import                       |

## Navigation

Bottom navigation bar with 4 tabs:

```
Map  |  Dashboard  |  Badges  |  Settings
```

## Design Document Index

| Document                                    | Contents                                   |
| ------------------------------------------- | ------------------------------------------ |
| [01-taxonomy.md](./01-taxonomy.md)          | Skill categories, CEFR levels, sub-skills  |
| [02-gamification.md](./02-gamification.md)  | XP, streaks, badges, progression rules     |
| [03-data-model.md](./03-data-model.md)      | TypeScript types, localStorage, export     |
| [04-tech-stack.md](./04-tech-stack.md)      | Framework, libraries, project structure    |
| [05-ui-ux.md](./05-ui-ux.md)                | Colors, typography, animations, responsive |
| [06-deployment.md](./06-deployment.md)      | GitHub Actions, Pages configuration        |
