import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getNodesByCategory } from "../data/nodes";
import { useProgressStore } from "../store/progressStore";
import { SKILL_CATEGORIES } from "../types";

export function WorldMap() {
    const { t } = useTranslation();
    const progress = useProgressStore((s) => s.progress);

    const getCategoryStats = (category: string) => {
        const nodes = getNodesByCategory(category as any);
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
            total: nodes.length,
            verified,
            selfReported,
            percent,
        };
    };

    return (
        <div className="min-h-screen bg-slate-950 pb-20 lg:pb-6 lg:ml-56">
            <div className="max-w-4xl mx-auto px-4 py-6">
                <h1 className="text-3xl font-bold text-slate-100 mb-2">
                    {t("worldMap.title")}
                </h1>
                <p className="text-slate-400 mb-8">
                    {t("app.tagline")}
                </p>

                <div className="grid grid-cols-2 gap-3 lg:gap-4">
                    {SKILL_CATEGORIES.map((category) => {
                        const stats = getCategoryStats(category);
                        return (
                            <Link
                                key={category}
                                to={`/map/${category}`}
                                className="group relative overflow-hidden rounded-lg border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-4 lg:p-6 transition-all hover:border-sky-500/50 hover:shadow-lg hover:shadow-sky-500/20"
                            >
                                <div className="flex flex-col h-full justify-between">
                                    <div>
                                        <h2 className="text-lg lg:text-xl font-bold text-slate-100 capitalize group-hover:text-sky-400 transition-colors">
                                            {t(
                                                `categories.${category}` as any
                                            )}
                                        </h2>
                                        <p className="text-xs lg:text-sm text-slate-500 mt-1">
                                            {stats.total} {t("skillMap.title")}
                                        </p>
                                    </div>

                                    <div className="mt-4 space-y-2">
                                        <div className="text-xs text-slate-400">
                                            <span className="text-emerald-400">
                                                {t("worldMap.verified", {
                                                    count: stats.verified,
                                                })}
                                            </span>
                                            {" / "}
                                            <span className="text-sky-400">
                                                {t("worldMap.selfReported", {
                                                    count: stats.selfReported,
                                                })}
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-emerald-500 to-sky-500"
                                                style={{
                                                    width: `${stats.percent}%`,
                                                }}
                                            />
                                        </div>
                                        <div className="text-right text-xs font-semibold text-slate-300">
                                            {stats.percent}%
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-sky-500/5 rounded-full group-hover:bg-sky-500/10 transition-colors" />
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
