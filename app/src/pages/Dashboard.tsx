import { useTranslation } from "react-i18next";
import { Flame } from "lucide-react";
import { useProgressStore } from "../store/progressStore";
import { skillNodes } from "../data/nodes";
import { SKILL_CATEGORIES } from "../types";

export function Dashboard() {
    const { t } = useTranslation();
    const { profile, progress } = useProgressStore();

    const getStreakDisplay = () => {
        if (profile.streak.current === 0) return null;
        return (
            <div className="flex items-center gap-2 text-orange-400">
                <Flame size={20} />
                <span className="font-semibold">
                    {t("dashboard.currentStreak", {
                        days: profile.streak.current,
                    })}
                </span>
            </div>
        );
    };

    const categoryProgress = SKILL_CATEGORIES.map((category) => {
        const nodes = skillNodes.filter((n) => n.category === category);
        const verified = nodes.filter(
            (n) => progress[n.id]?.status === "verified"
        ).length;
        const selfReported = nodes.filter(
            (n) => progress[n.id]?.status === "self_reported"
        ).length;
        const percent = Math.round(
            ((verified * 2 + selfReported) / (nodes.length * 2)) * 100
        );
        return {
            category,
            percent,
            verified,
            selfReported,
            total: nodes.length,
        };
    });

    const totalVerified = Object.values(progress).filter(
        (p) => p.status === "verified"
    ).length;
    const totalSelfReported = Object.values(progress).filter(
        (p) => p.status === "self_reported"
    ).length;

    return (
        <div className="min-h-screen bg-slate-950 pb-20 lg:pb-6 lg:ml-56">
            <div className="max-w-4xl mx-auto px-4 py-6">
                <h1 className="text-3xl font-bold text-slate-100 mb-8">
                    {t("dashboard.title")}
                </h1>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
                        <p className="text-slate-400 text-sm">
                            {t("dashboard.totalXp")}
                        </p>
                        <p className="text-3xl font-bold text-sky-400 mt-2">
                            {profile.xp}
                        </p>
                    </div>

                    <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
                        {getStreakDisplay() ? (
                            getStreakDisplay()
                        ) : (
                            <p className="text-slate-400 text-sm">
                                No active streak
                            </p>
                        )}
                    </div>
                </div>

                {/* Overall Progress */}
                <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 mb-8">
                    <h2 className="font-semibold text-slate-100 mb-4">
                        {t("dashboard.skillBalance")}
                    </h2>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-emerald-400">
                                {t("dashboard.verified")}:{" "}
                                {totalVerified}
                            </span>
                            <span className="text-sky-400">
                                {t("dashboard.selfReported")}:{" "}
                                {totalSelfReported}
                            </span>
                        </div>
                        <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full flex">
                                <div
                                    className="bg-emerald-500"
                                    style={{
                                        width: `${(totalVerified / (totalVerified + totalSelfReported + 1)) * 100}%`,
                                    }}
                                />
                                <div
                                    className="bg-sky-500"
                                    style={{
                                        width: `${(totalSelfReported / (totalVerified + totalSelfReported + 1)) * 100}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
                    <h2 className="font-semibold text-slate-100 mb-4">
                        Category Progress
                    </h2>
                    <div className="space-y-3">
                        {categoryProgress.map(
                            ({
                                category,
                                percent,
                                verified,
                                selfReported,
                                total,
                            }) => (
                                <div
                                    key={category}
                                    className="space-y-1"
                                >
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="capitalize text-slate-300">
                                            {t(`categories.${category}` as any)}
                                        </span>
                                        <span className="text-slate-400">
                                            {percent}%
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-emerald-500 to-sky-500"
                                            style={{
                                                width: `${percent}%`,
                                            }}
                                        />
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        {verified} verified, {selfReported}{" "}
                                        self-reported / {total} total
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
