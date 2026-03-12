import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Award, Lock } from "lucide-react";
import { useProgressStore } from "../store/progressStore";

export function BadgesPage() {
    const { t } = useTranslation();
    const badges = useProgressStore((s) => s.profile.badges);

    return (
        <div className="px-4 pt-4 pb-24 lg:pb-8">
            <h1
                className="text-xl font-bold text-slate-100 tracking-wide mb-6"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
                {t("badges.title")}
            </h1>

            {badges.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                    <Lock size={48} className="mb-4 opacity-50" />
                    <p className="text-sm">
                        Complete skills to earn your first badge!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {badges.map((badge, i) => (
                        <motion.div
                            key={badge.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex flex-col items-center rounded-xl border border-amber-500/30 bg-amber-900/10 p-4"
                        >
                            <Award
                                size={32}
                                className="text-amber-400 mb-2"
                            />
                            <span className="text-sm font-medium text-slate-200 text-center">
                                {badge.name}
                            </span>
                            <span className="text-xs text-slate-400 mt-1">
                                {badge.description}
                            </span>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
