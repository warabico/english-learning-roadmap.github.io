# 02 - Gamification Rules

## Node Completion States

Each sub-skill node progresses through 5 states:

| State         | Meaning               | Trigger                           | Visual                     |
|---------------|-----------------------|-----------------------------------|----------------------------|
| Locked        | Prerequisites not met | (default)                         | Dark/greyed hex            |
| Unlocked      | Available to study    | All prereqs at least Self-Reported| Dim color, pulsing outline |
| Self-Reported | "I've studied this"   | User marks manually               | Half-filled hex, amber     |
| Verified      | Quiz passed >= 70%    | Quiz score >= 70                  | Fully glowing hex, green   |
| Gold          | Quiz passed >= 90%    | Quiz score >= 90                  | Gold glowing hex + star    |

### State Transition Diagram

```
Locked ──► Unlocked ──► Self-Reported ──► Verified ──► Gold
                              ▲                ▲
                              │                │
                              └── Quiz < 70% ──┘ (stays Self-Reported after marking)
                                                  (Verified if >= 70%, Gold if >= 90%)
```

---

## XP Rules

| Action                      | XP Earned |
|-----------------------------|-----------|
| Self-report a node          | +10 XP    |
| Quiz attempt (any result)   | +5 XP     |
| Quiz passed (>= 70%)       | +20 XP bonus |
| Quiz passed (>= 90%)       | +35 XP bonus (replaces +20, not stacked) |

### XP Constants

```typescript
const XP_RULES = {
    selfReport: 10,
    quizAttempt: 5,
    quizPass70: 20,
    quizPass90: 35,
} as const;
```

### XP Calculation Example

- Self-report a node: +10 XP
- Take quiz and score 75%: +5 (attempt) + 20 (pass) = +25 XP
- Take quiz and score 95%: +5 (attempt) + 35 (gold) = +40 XP
- Take quiz and score 50%: +5 (attempt only)

---

## Prerequisite & Unlock Logic

### Node Unlock Rule
A node becomes **Unlocked** when ALL of its prerequisite nodes are at least **Self-Reported**.

### Manual Override Policy
- Manual override of prerequisites is **NOT allowed**
- Exception: Placement quiz result can auto-unlock nodes

### Placement Quiz

```
New user arrives
  └─► Optional Placement Quiz (20-30 questions, A1 to B2 range)
        └─► Result determines assessed CEFR level
              └─► All nodes BELOW assessed level auto-set to Self-Reported
                    └─► User can then Verify any node via individual quizzes
```

---

## Layer 1 Progress Calculation

### Completion Condition

A Layer 1 category+CEFR tile is considered "complete" when:
1. ALL Layer 2 nodes for that category+level are at least Self-Reported
2. AND >= 50% of those nodes are Verified

### Progress Bar Formula

```
Progress % = (self_reported_count * 1 + verified_count * 2) / (total_nodes * 2) * 100
```

| Scenario                | Progress |
|-------------------------|----------|
| All locked              | 0%       |
| All self-reported only  | ~50%     |
| Half verified, half SR  | ~75%     |
| All verified            | 100%     |

This ensures verified effort is visually rewarded over self-reporting alone.

---

## Three Motivation Pillars

### 1. Daily Streak (Habit Building)

**Counting rule:** Any of the following counts as daily activity:
- Marking a node as self-reported
- Taking a quiz (any result)
- Opening the app (counts once per day)

**Streak freeze:**
- 1 freeze available per week
- Auto-applied if user misses a day and has a freeze remaining
- Resets to 1 every Monday

**Milestone streaks:**
| Days | Reward              |
|------|---------------------|
| 7    | "Week Warrior" badge |
| 30   | "Monthly Master" badge |
| 100  | "Century Learner" badge |

### 2. Badges & Certificates (Milestone Rewards)

| Badge Type    | Condition                                    | Example ID             |
|---------------|----------------------------------------------|------------------------|
| Category      | All nodes in one category+level complete      | `grammar_b1_master`    |
| CEFR          | All 7 categories complete at one CEFR level   | `cefr_b1_certificate`  |
| Streak        | Streak milestones (7, 30, 100 days)          | `streak_7_days`        |
| Secret        | Hidden achievements                          | `speed_demon_10_nodes` |

**CEFR Certificate:** Completing all 7 categories at one level generates a shareable certificate card.

**Secret badge examples:**
- "Speed Demon" - Verified 10 nodes in one day
- "Perfect Score" - Scored 100% on a quiz
- "Night Owl" - Completed a quiz after midnight
- "Polymath" - Reached B1 in all 7 categories

### 3. Radar Chart (Balance Visualization)

- Spider/radar chart displaying all 7 skill categories
- Two overlaid lines:
  - Self-Reported progress (lighter/dashed)
  - Verified progress (solid/brighter)
- Visually highlights the weakest skill with a nudge indicator
- Encourages balanced skill development
