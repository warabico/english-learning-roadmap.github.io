export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type SkillCategory =
    | "vocabulary"
    | "grammar"
    | "pronunciation"
    | "reading"
    | "writing"
    | "listening"
    | "speaking";

export type NodeStatus = "locked" | "unlocked" | "self_reported" | "verified";

export interface SkillNode {
    id: string;
    name: string;
    category: SkillCategory;
    cefrLevel: CEFRLevel;
    prerequisites: string[];
    description: string;
    estimatedHours: number;
    tips: string[];
}

export interface NodeProgress {
    nodeId: string;
    status: NodeStatus;
    selfReportedAt: string | null;
    quizPassedAt: string | null;
    bestScore: number | null;
    attempts: number;
}

export interface QuizQuestion {
    id: string;
    nodeId: string;
    type: "multiple_choice" | "fill_blank" | "true_false";
    question: string;
    options?: string[];
    answer: string;
    explanation: string;
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    earnedAt: string;
    type: "category" | "cefr" | "streak" | "secret";
}

export interface Streak {
    current: number;
    longest: number;
    lastActiveDate: string;
    freezesRemaining: number;
}

export interface UserProfile {
    name: string;
    createdAt: string;
    xp: number;
    streak: Streak;
    badges: Badge[];
    placementQuizCompleted: boolean;
    placementQuizLevel: CEFRLevel | null;
}

export interface AppSettings {
    theme: "dark" | "light";
    uiLanguage: "en" | "ja";
    radarShowVerifiedOnly: boolean;
}

export interface ExportData {
    version: 1;
    exportedAt: string;
    data: {
        profile: UserProfile;
        progress: Record<string, NodeProgress>;
        settings: AppSettings;
    };
}

export const XP_RULES = {
    selfReport: 10,
    quizAttempt: 5,
    quizPass70: 20,
    quizPass90: 35,
} as const;

export const CEFR_LEVELS: CEFRLevel[] = [
    "A1",
    "A2",
    "B1",
    "B2",
    "C1",
    "C2",
];

export const SKILL_CATEGORIES: SkillCategory[] = [
    "vocabulary",
    "grammar",
    "pronunciation",
    "reading",
    "writing",
    "listening",
    "speaking",
];
