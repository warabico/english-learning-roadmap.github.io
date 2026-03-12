# 03 - Data Model & Storage Design

## Storage Strategy

**Choice: localStorage** - No backend, no accounts, GitHub Pages compatible.

All keys are prefixed with `elt_` (English Learning Tracker) to prevent collision with other apps on the same domain.

### localStorage Keys

| Key                | Type                            | Description                    |
|--------------------|---------------------------------|--------------------------------|
| `elt_user_profile` | `UserProfile`                   | User name, XP, streak, badges |
| `elt_progress`     | `Record<string, NodeProgress>`  | Per-node progress data         |
| `elt_placement_quiz` | `PlacementQuizResult`         | Placement quiz result          |
| `elt_settings`     | `AppSettings`                   | Theme, language, preferences   |

---

## Core TypeScript Types

### Enums & Unions

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
```

Note: "Gold" is not a separate status - it is `verified` with `bestScore >= 90`.

### SkillNode (Static Data)

```typescript
interface SkillNode {
    id: string;                // e.g. "grammar-conditionals"
    name: string;              // e.g. "Conditionals"
    category: SkillCategory;
    cefrLevel: CEFRLevel;
    prerequisites: string[];   // array of node IDs
    description: string;
    estimatedHours: number;
    tips: string[];
}
```

- Defined in `src/data/nodes.ts` as a static array
- Node IDs follow the pattern: `{category}-{kebab-case-name}`

### NodeProgress (User Data)

```typescript
interface NodeProgress {
    nodeId: string;
    status: NodeStatus;
    selfReportedAt: string | null;   // ISO 8601 date string
    quizPassedAt: string | null;     // ISO 8601 date string
    bestScore: number | null;        // 0-100
    attempts: number;
}
```

### QuizQuestion (Static Data)

```typescript
interface QuizQuestion {
    id: string;
    nodeId: string;
    type: "multiple_choice" | "fill_blank" | "true_false";
    question: string;
    options?: string[];       // for multiple_choice
    answer: string;
    explanation: string;
}
```

- Defined in `src/data/quizzes.ts`
- Each node has 5 quiz questions
- Questions are shuffled on each attempt

### Badge

```typescript
interface Badge {
    id: string;                // e.g. "grammar_b1_master"
    name: string;
    description: string;
    earnedAt: string;          // ISO 8601 date string
    type: "category" | "cefr" | "streak" | "secret";
}
```

### Streak

```typescript
interface Streak {
    current: number;
    longest: number;
    lastActiveDate: string;    // "YYYY-MM-DD"
    freezesRemaining: number;  // resets weekly (max 1)
}
```

### UserProfile

```typescript
interface UserProfile {
    name: string;
    createdAt: string;               // ISO 8601
    xp: number;
    streak: Streak;
    badges: Badge[];
    placementQuizCompleted: boolean;
    placementQuizLevel: CEFRLevel | null;
}
```

### AppSettings

```typescript
interface AppSettings {
    theme: "dark" | "light";
    uiLanguage: "en" | "ja";
    radarShowVerifiedOnly: boolean;
}
```

### AppStorage (Full Schema)

```typescript
interface AppStorage {
    elt_user_profile: UserProfile;
    elt_progress: Record<string, NodeProgress>;
    elt_placement_quiz: {
        completed: boolean;
        resultLevel: CEFRLevel | null;
        completedAt: string | null;
    };
    elt_settings: AppSettings;
}
```

---

## Progress Aggregation Functions

### Layer 1 Progress Calculation

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

### Current CEFR Level for a Category

Determined by the highest CEFR level where the completion condition is met:
- All nodes at that level are at least Self-Reported
- >= 50% of nodes at that level are Verified

---

## Export / Import

Since localStorage is device-locked and browser-locked:

### Export
- Button in Settings screen
- Downloads `elt_backup_YYYY-MM-DD.json`
- Contains all 4 localStorage keys as a single JSON object

### Import
- Button in Settings screen
- Accepts `.json` file upload
- Validates schema before overwriting
- Confirmation dialog before applying

### Data Schema Version

```typescript
interface ExportData {
    version: 1;
    exportedAt: string;
    data: AppStorage;
}
```

Including a `version` field enables future migration support.

---

## Limitations & Mitigations

| Limitation                        | Mitigation                         |
|-----------------------------------|------------------------------------|
| Device-locked progress            | Export/Import feature              |
| Browser-locked (Chrome != Firefox)| Clear warning in Settings UI       |
| Clearable by browser data cleanup | Confirm dialog + backup reminder   |
| localStorage size limit (~5MB)    | Sufficient for this use case       |
