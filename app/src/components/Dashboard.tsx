import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    ResponsiveContainer,
} from "recharts";
import { Flame, Zap } from "lucide-react";
import { SKILL_CATEGORIES } from "../types";
import { skillNodes } from "../data/nodes";
import { useProgressStore, calcCategoryProgress } from "../store/progressStore";

export function Dashboard() {
    const { t } = useTranslation();
    const profile = useProgressStore((s) => s.profile);
    const progress = useProgressStore((s) => s.progress);

    const radarData = SKILL_CATEGORIES.map((cat) => ({
        category: t(`categories.${cat}`),
        value: calcCategoryProgress(progress, skillNodes, cat),
    }));

    const totalVerified = Object.values(progress).filter(
        (p) => p.status === "verified"
    ).length;
    const totalSelfReported = Object.values(progress).filter(
        (p) => p.status === "self_reported"
    ).length;

    return (
        <div className="px-4 pt-4 pb-24 lg:pb-8">
            <h1
                className="text-xl font-bold text-slate-100 tracking-wide mb-6"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
                {t("dashboard.title")}
            </h1>

            <div className="grid grid-cols-2 gap-3 mb-6">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-sky-500/30 bg-sky-900/20 p-4"
                >
                    <div className="flex items-center gap-2 text-sky-400 mb-1">
                        <Zap size={16} />
                        <span className="text-xs font-medium">
                            {t("dashboard.totalXp")}
                        </span>
                    </div>
                    <span className="text-2xl font-bold text-slate-100">
                        {profile.xp}
                    </span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="rounded-xl border border-orange-500/30 bg-orange-900/20 p-4"
                >
                    <div className="flex items-center gap-2 text-orange-400 mb-1">
                        <Flame size={16} />
                        <span className="text-xs font-medium">Streak</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-100">
                        {profile.streak.current}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">days</span>
                </motion.div>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-4 mb-6">
                <h2 className="text-sm font-semibold text-slate-200 mb-3">
                    {t("dashboard.skillBalance")}
                </h2>
                <ResponsiveContainer width="100%" height={260}>
                    <RadarChart data={radarData} cx="50%" cy="50%">
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis
                            dataKey="category"
                            tick={{ fill: "#94a3b8", fontSize: 11 }}
                        />
                        <Radar
                            dataKey="value"
                            stroke="#38bdf8"
                            fill="#38bdf8"
                            fillOpacity={0.2}
                            strokeWidth={2}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-4 text-center">
                    <span className="text-2xl font-bold text-emerald-400">
                        {totalVerified}
                    </span>
                    <p className="text-xs text-slate-400 mt-1">
                        {t("dashboard.verified")}
                    </p>
                </div>
                <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-4 text-center">
                    <span className="text-2xl font-bold text-sky-400">
                        {totalSelfReported}
                    </span>
                    <p className="text-xs text-slate-400 mt-1">
                        {t("dashboard.selfReported")}
                    </p>
                </div>
            </div>
        </div>
    );
}
