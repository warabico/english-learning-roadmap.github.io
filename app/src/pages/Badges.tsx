import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Award, Lock, Star, Flame, Trophy, Zap } from "lucide-react";
import { useProgressStore } from "../store/progressStore";
import { skillNodes } from "../data/nodes";
import { SKILL_CATEGORIES, CEFR_LEVELS } from "../types";

interface BadgeDefinition {
    id: string;
    name: string;
    description: string;
    icon: typeof Award;
    type: "category" | "cefr" | "streak" | "secret";
    check: (
        progress: Record<string, any>,
        profile: any
    ) => boolean;
}

function buildBadgeDefinitions(): BadgeDefinition[] {
    const defs: BadgeDefinition[] = [];

    // Category completion badges per CEFR level
    for (const category of SKILL_CATEGORIES) {
        for (const level of CEFR_LEVELS) {
            const nodes = skillNodes.filter(
                (n) => n.category === category && n.cefrLevel === level
            );
            if (nodes.length === 0) continue;

            defs.push({
                id: `cat_${category}_${level}`,
                name: `${capitalize(category)} ${level}`,
                description: `Complete all ${capitalize(category)} skills at ${level}`,
                icon: Star,
                type: "category",
                check: (progress) =>
                    nodes.every(
                        (n) =>
                            progress[n.id]?.status === "verified" ||
                            progress[n.id]?.status === "self_reported"
                    ),
            });
        }
    }

    // CEFR level certificates
    for (const level of CEFR_LEVELS) {
        defs.push({
            id: `cefr_${level}`,
            name: `${level} Certificate`,
            description: `Complete all 7 categories at ${level}`,
            icon: Trophy,
            type: "cefr",
            check: (progress) => {
                const nodes = skillNodes.filter((n) => n.cefrLevel === level);
                return nodes.every(
                    (n) =>
                        progress[n.id]?.status === "verified" ||
                        progress[n.id]?.status === "self_reported"
                );
            },
        });
    }

    // Streak badges
    for (const days of [7, 30, 100]) {
        defs.push({
            id: `streak_${days}`,
            name: `${days}-Day Streak`,
            description: `Maintain a ${days}-day learning streak`,
            icon: Flame,
            type: "streak",
            check: (_progress, profile) => profile.streak.longest >= days,
        });
    }

    // Secret badges
    defs.push({
        id: "perfect_score",
        name: "Perfect Score",
        description: "Score 100% on any quiz",
        icon: Zap,
        type: "secret",
        check: (progress) =>
            Object.values(progress).some(
                (p: any) => p.bestScore === 100
            ),
    });

    defs.push({
        id: "polymath",
        name: "Polymath",
        description: "Complete at least one node in every category",
        icon: Award,
        type: "secret",
        check: (progress) =>
            SKILL_CATEGORIES.every((cat) =>
                skillNodes
                    .filter((n) => n.category === cat)
                    .some(
                        (n) =>
                            progress[n.id]?.status === "verified" ||
                            progress[n.id]?.status === "self_reported"
                    )
            ),
    });

    return defs;
}

function capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

const badgeDefinitions = buildBadgeDefinitions();

export function Badges() {
    const { t } = useTranslation();
    const progress = useProgressStore((s) => s.progress);
    const profile = useProgressStore((s) => s.profile);

    const earned = badgeDefinitions.filter((b) =>
        b.check(progress, profile)
    );
    const locked = badgeDefinitions.filter(
        (b) => !b.check(progress, profile)
    );

    return (
        <div className="min-h-screen bg-slate-950 pb-20 lg:pb-6 lg:ml-56">
            <div className="max-w-4xl mx-auto px-4 py-6">
                <h1 className="text-3xl font-bold text-slate-100 mb-8">
                    {t("badges.title")}
                </h1>

                {/* Earned Badges */}
                {earned.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-emerald-400 mb-4">
                            {t("badges.earned")} ({earned.length})
                        </h2>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {earned.map((badge, i) => (
                                <motion.div
                                    key={badge.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="flex flex-col items-center rounded-xl border border-amber-500/30 bg-amber-900/10 p-4"
                                >
                                    <badge.icon
                                        size={32}
                                        className="text-amber-400 mb-2"
                                    />
                                    <span className="text-sm font-medium text-slate-200 text-center">
                                        {badge.name}
                                    </span>
                                    <span className="text-xs text-slate-400 mt-1 text-center">
                                        {badge.description}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Locked Badges */}
                <div>
                    <h2 className="text-lg font-semibold text-slate-400 mb-4">
                        {t("badges.locked")} ({locked.length})
                    </h2>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {locked.map((badge) => (
                            <div
                                key={badge.id}
                                className="flex flex-col items-center rounded-xl border border-slate-700 bg-slate-800/30 p-4 opacity-50"
                            >
                                <Lock
                                    size={32}
                                    className="text-slate-500 mb-2"
                                />
                                <span className="text-sm font-medium text-slate-400 text-center">
                                    {badge.type === "secret"
                                        ? "???"
                                        : badge.name}
                                </span>
                                <span className="text-xs text-slate-500 mt-1 text-center">
                                    {badge.type === "secret"
                                        ? "Secret badge"
                                        : badge.description}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
