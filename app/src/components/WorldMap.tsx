import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    BookOpen,
    PenTool,
    Volume2,
    BookMarked,
    Edit3,
    Headphones,
    MessageCircle,
} from "lucide-react";
import type { SkillCategory } from "../types";
import { SKILL_CATEGORIES } from "../types";
import { skillNodes } from "../data/nodes";
import { useProgressStore } from "../store/progressStore";

const CATEGORY_META: Record<
    SkillCategory,
    { icon: React.ElementType; gradient: string; border: string }
> = {
    vocabulary: {
        icon: BookOpen,
        gradient: "from-emerald-600/20 to-emerald-900/40",
        border: "border-emerald-500/40",
    },
    grammar: {
        icon: PenTool,
        gradient: "from-sky-600/20 to-sky-900/40",
        border: "border-sky-500/40",
    },
    pronunciation: {
        icon: Volume2,
        gradient: "from-violet-600/20 to-violet-900/40",
        border: "border-violet-500/40",
    },
    reading: {
        icon: BookMarked,
        gradient: "from-amber-600/20 to-amber-900/40",
        border: "border-amber-500/40",
    },
    writing: {
        icon: Edit3,
        gradient: "from-rose-600/20 to-rose-900/40",
        border: "border-rose-500/40",
    },
    listening: {
        icon: Headphones,
        gradient: "from-cyan-600/20 to-cyan-900/40",
        border: "border-cyan-500/40",
    },
    speaking: {
        icon: MessageCircle,
        gradient: "from-orange-600/20 to-orange-900/40",
        border: "border-orange-500/40",
    },
};

function CategoryCard({ category }: { category: SkillCategory }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const progress = useProgressStore((s) => s.progress);

    const meta = CATEGORY_META[category];
    const Icon = meta.icon;
    const nodes = skillNodes.filter((n) => n.category === category);
    const total = nodes.length;
    const verified = nodes.filter(
        (n) => progress[n.id]?.status === "verified"
    ).length;
    const selfReported = nodes.filter(
        (n) => progress[n.id]?.status === "self_reported"
    ).length;
    const percent =
        total > 0
            ? Math.round(
                  ((selfReported * 1 + verified * 2) / (total * 2)) * 100
              )
            : 0;

    return (
        <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(`/skill/${category}`)}
            className={`w-full rounded-xl border bg-gradient-to-br p-4 text-left transition-shadow hover:shadow-lg hover:shadow-sky-500/10 ${meta.gradient} ${meta.border}`}
        >
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800/60">
                    <Icon size={20} className="text-slate-200" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-100">
                        {t(`categories.${category}`)}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                        {t("worldMap.verified", { count: verified })} /{" "}
                        {t("worldMap.selfReported", { count: selfReported })}
                    </p>
                </div>
                <div className="text-right">
                    <span className="text-lg font-bold text-slate-100">
                        {t("worldMap.progress", { percent })}
                    </span>
                </div>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-slate-800/80 overflow-hidden">
                <motion.div
                    className="h-full rounded-full bg-sky-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                />
            </div>
        </motion.button>
    );
}

export function WorldMap() {
    const { t } = useTranslation();
    const profile = useProgressStore((s) => s.profile);

    return (
        <div className="px-4 pt-4 pb-24 lg:pb-8">
            <div className="mb-6">
                <h1
                    className="text-xl font-bold text-slate-100 tracking-wide"
                    style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                    {t("worldMap.title")}
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                    {profile.xp} XP
                </p>
            </div>
            <div className="flex flex-col gap-3">
                {SKILL_CATEGORIES.map((cat) => (
                    <CategoryCard key={cat} category={cat} />
                ))}
            </div>
        </div>
    );
}
