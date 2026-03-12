import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
    AppSettings,
    Badge,
    ExportData,
    NodeProgress,
    NodeStatus,
    SkillCategory,
    SkillNode,
    Streak,
    UserProfile,
} from "../types";
import { XP_RULES } from "../types";

/* ------------------------------------------------------------------ */
/*  Helper: detect UI language from browser / navigator                */
/* ------------------------------------------------------------------ */
function detectLanguage(): "en" | "ja" {
    if (typeof navigator !== "undefined") {
        const lang = navigator.language || "";
        if (lang.startsWith("ja")) return "ja";
    }
    return "en";
}

/* ------------------------------------------------------------------ */
/*  Default values                                                     */
/* ------------------------------------------------------------------ */
const defaultStreak: Streak = {
    current: 0,
    longest: 0,
    lastActiveDate: "",
    freezesRemaining: 0,
};

const defaultProfile: UserProfile = {
    name: "Learner",
    createdAt: new Date().toISOString(),
    xp: 0,
    streak: defaultStreak,
    badges: [] as Badge[],
    placementQuizCompleted: false,
    placementQuizLevel: null,
};

const defaultSettings: AppSettings = {
    theme: "dark",
    uiLanguage: detectLanguage(),
    radarShowVerifiedOnly: false,
};

/* ------------------------------------------------------------------ */
/*  Store types                                                        */
/* ------------------------------------------------------------------ */
interface ProgressState {
    profile: UserProfile;
    progress: Record<string, NodeProgress>;
    settings: AppSettings;

    // Actions
    selfReportNode: (nodeId: string) => void;
    submitQuizResult: (nodeId: string, score: number) => void;
    recordActivity: () => void;
    getNodeStatus: (nodeId: string) => NodeStatus;
    updateSettings: (settings: Partial<AppSettings>) => void;
    exportData: () => ExportData;
    importData: (data: ExportData) => void;
    resetProgress: () => void;
}

/* ------------------------------------------------------------------ */
/*  Helpers (internal)                                                 */
/* ------------------------------------------------------------------ */
function todayDateString(): string {
    return new Date().toISOString().slice(0, 10);
}

function isYesterday(dateStr: string): boolean {
    if (!dateStr) return false;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return dateStr === yesterday.toISOString().slice(0, 10);
}

function isToday(dateStr: string): boolean {
    if (!dateStr) return false;
    return dateStr === todayDateString();
}

/* ------------------------------------------------------------------ */
/*  Store                                                              */
/* ------------------------------------------------------------------ */
export const useProgressStore = create<ProgressState>()(
    persist(
        (set, get) => ({
            profile: defaultProfile,
            progress: {},
            settings: defaultSettings,

            /* ----- selfReportNode ----- */
            selfReportNode: (nodeId: string) => {
                set((state) => {
                    const existing = state.progress[nodeId];

                    // Don't downgrade if already verified
                    if (existing?.status === "verified") {
                        return state;
                    }

                    const now = new Date().toISOString();
                    const nodeProgress: NodeProgress = {
                        nodeId,
                        status: "self_reported",
                        selfReportedAt: now,
                        quizPassedAt: existing?.quizPassedAt ?? null,
                        bestScore: existing?.bestScore ?? null,
                        attempts: existing?.attempts ?? 0,
                    };

                    return {
                        progress: {
                            ...state.progress,
                            [nodeId]: nodeProgress,
                        },
                        profile: {
                            ...state.profile,
                            xp: state.profile.xp + XP_RULES.selfReport,
                        },
                    };
                });
            },

            /* ----- submitQuizResult ----- */
            submitQuizResult: (nodeId: string, score: number) => {
                set((state) => {
                    const existing = state.progress[nodeId];
                    const now = new Date().toISOString();
                    const attempts = (existing?.attempts ?? 0) + 1;
                    const prevBest = existing?.bestScore ?? 0;
                    const bestScore = Math.max(prevBest, score);

                    let status: NodeStatus = existing?.status ?? "unlocked";

                    if (bestScore >= 70) {
                        status = "verified";
                    }

                    let xpGain: number = XP_RULES.quizAttempt;
                    if (score >= 90) {
                        xpGain = XP_RULES.quizPass90;
                    } else if (score >= 70) {
                        xpGain = XP_RULES.quizPass70;
                    }

                    const nodeProgress: NodeProgress = {
                        nodeId,
                        status,
                        selfReportedAt: existing?.selfReportedAt ?? null,
                        quizPassedAt:
                            score >= 70
                                ? now
                                : (existing?.quizPassedAt ?? null),
                        bestScore,
                        attempts,
                    };

                    return {
                        progress: {
                            ...state.progress,
                            [nodeId]: nodeProgress,
                        },
                        profile: {
                            ...state.profile,
                            xp: state.profile.xp + xpGain,
                        },
                    };
                });
            },

            /* ----- recordActivity ----- */
            recordActivity: () => {
                set((state) => {
                    const streak = { ...state.profile.streak };
                    const today = todayDateString();

                    if (isToday(streak.lastActiveDate)) {
                        // Already recorded today
                        return state;
                    }

                    if (isYesterday(streak.lastActiveDate)) {
                        streak.current += 1;
                    } else {
                        streak.current = 1;
                    }

                    streak.longest = Math.max(streak.longest, streak.current);
                    streak.lastActiveDate = today;

                    return {
                        profile: {
                            ...state.profile,
                            streak,
                        },
                    };
                });
            },

            /* ----- getNodeStatus ----- */
            getNodeStatus: (nodeId: string): NodeStatus => {
                const state = get();
                const nodeProgress = state.progress[nodeId];

                if (!nodeProgress) {
                    return "locked";
                }

                return nodeProgress.status;
            },

            /* ----- updateSettings ----- */
            updateSettings: (partial: Partial<AppSettings>) => {
                set((state) => ({
                    settings: { ...state.settings, ...partial },
                }));
            },

            /* ----- exportData ----- */
            exportData: (): ExportData => {
                const state = get();
                return {
                    version: 1,
                    exportedAt: new Date().toISOString(),
                    data: {
                        profile: state.profile,
                        progress: state.progress,
                        settings: state.settings,
                    },
                };
            },

            /* ----- importData ----- */
            importData: (data: ExportData) => {
                set({
                    profile: data.data.profile,
                    progress: data.data.progress,
                    settings: data.data.settings,
                });
            },

            /* ----- resetProgress ----- */
            resetProgress: () => {
                set((state) => ({
                    profile: {
                        ...defaultProfile,
                        createdAt: new Date().toISOString(),
                    },
                    progress: {},
                    // Keep settings
                    settings: state.settings,
                }));
            },
        }),
        {
            name: "elt_store",
        },
    ),
);

/* ------------------------------------------------------------------ */
/*  Exported helper: category progress calculation                     */
/* ------------------------------------------------------------------ */

/**
 * Calculate the progress percentage (0–100) for a given skill category.
 *
 * Formula: (self_reported * 1 + verified * 2) / (total * 2) * 100
 *
 * @param progress - The current progress record from the store
 * @param nodes    - The full list of skill nodes (passed in, not imported)
 * @param category - The category to compute progress for
 */
export function calcCategoryProgress(
    progress: Record<string, NodeProgress>,
    nodes: SkillNode[],
    category: SkillCategory,
): number {
    const categoryNodes = nodes.filter((n) => n.category === category);
    const total = categoryNodes.length;

    if (total === 0) return 0;

    let score = 0;
    for (const node of categoryNodes) {
        const np = progress[node.id];
        if (!np) continue;
        if (np.status === "verified") {
            score += 2;
        } else if (np.status === "self_reported") {
            score += 1;
        }
    }

    return (score / (total * 2)) * 100;
}
