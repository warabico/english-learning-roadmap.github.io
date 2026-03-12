import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Lock, Star } from "lucide-react";
import type { SkillCategory, SkillNode, CEFRLevel } from "../types";
import { CEFR_LEVELS } from "../types";
import { skillNodes } from "../data/nodes";
import { useProgressStore } from "../store/progressStore";
import { CefrBadge } from "./common/CefrBadge";

function NodeCard({
    node,
    onSelfReport,
}: {
    node: SkillNode;
    onSelfReport: (id: string) => void;
}) {
    const { t } = useTranslation();
    const progress = useProgressStore((s) => s.progress);
    const allProgress = useProgressStore((s) => s.progress);

    const nodeProgress = progress[node.id];
    const status = nodeProgress?.status ?? "locked";

    const prerequisitesMet = node.prerequisites.every(
        (pid) =>
            allProgress[pid]?.status === "self_reported" ||
            allProgress[pid]?.status === "verified"
    );
    const effectiveStatus =
        status === "locked" && prerequisitesMet ? "unlocked" : status;

    const statusStyles = {
        locked: "opacity-50 border-slate-700 bg-slate-800/40",
        unlocked: "border-slate-600 bg-slate-800/60 hover:border-sky-500/50",
        self_reported:
            "border-sky-500/50 bg-sky-900/20 hover:border-sky-400/60",
        verified:
            "border-emerald-500/50 bg-emerald-900/20 hover:border-emerald-400/60",
    };

    const StatusIcon = () => {
        switch (effectiveStatus) {
            case "locked":
                return <Lock size={14} className="text-slate-500" />;
            case "verified":
                return nodeProgress?.bestScore != null &&
                    nodeProgress.bestScore >= 90 ? (
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                ) : (
                    <Check size={14} className="text-emerald-400" />
                );
            case "self_reported":
                return <Check size={14} className="text-sky-400" />;
            default:
                return null;
        }
    };

    return (
        <motion.div
            whileTap={effectiveStatus !== "locked" ? { scale: 0.98 } : {}}
            className={`rounded-lg border p-3 transition-colors ${statusStyles[effectiveStatus]}`}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <StatusIcon />
                        <span className="text-sm font-medium text-slate-200 truncate">
                            {node.name}
                        </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {node.description}
                    </p>
                </div>
                <CefrBadge level={node.cefrLevel} />
            </div>
            {effectiveStatus === "unlocked" && (
                <button
                    onClick={() => onSelfReport(node.id)}
                    className="mt-2 w-full rounded-md bg-sky-600/30 px-3 py-1.5 text-xs font-medium text-sky-300 transition-colors hover:bg-sky-600/50"
                >
                    {t("skillMap.markDone")}
                </button>
            )}
            {effectiveStatus === "self_reported" && (
                <div className="mt-2 text-center text-xs text-sky-400/70">
                    {t("skillMap.selfReported")}
                </div>
            )}
            {effectiveStatus === "verified" && (
                <div className="mt-2 flex items-center justify-center gap-1 text-xs text-emerald-400/70">
                    {t("skillMap.verified")}
                    {nodeProgress?.bestScore != null && (
                        <span className="ml-1">({nodeProgress.bestScore}%)</span>
                    )}
                </div>
            )}
        </motion.div>
    );
}

export function SkillMap() {
    const { t } = useTranslation();
    const { category } = useParams<{ category: string }>();
    const navigate = useNavigate();
    const selfReportNode = useProgressStore((s) => s.selfReportNode);

    const cat = category as SkillCategory;
    const nodes = skillNodes.filter((n) => n.category === cat);

    const nodesByLevel = CEFR_LEVELS.reduce(
        (acc, level) => {
            const levelNodes = nodes.filter((n) => n.cefrLevel === level);
            if (levelNodes.length > 0) acc[level] = levelNodes;
            return acc;
        },
        {} as Record<CEFRLevel, SkillNode[]>
    );

    return (
        <div className="px-4 pt-4 pb-24 lg:pb-8">
            <div className="mb-4 flex items-center gap-3">
                <button
                    onClick={() => navigate("/")}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition-colors hover:text-slate-200"
                >
                    <ArrowLeft size={18} />
                </button>
                <h1 className="text-lg font-bold text-slate-100">
                    {t(`categories.${cat}`)} {t("skillMap.title")}
                </h1>
            </div>

            <div className="space-y-6">
                {CEFR_LEVELS.map((level) => {
                    const levelNodes = nodesByLevel[level];
                    if (!levelNodes) return null;
                    return (
                        <section key={level}>
                            <div className="mb-2 flex items-center gap-2">
                                <CefrBadge level={level} size="md" />
                                <div className="h-px flex-1 bg-slate-700" />
                            </div>
                            <div className="grid gap-2 sm:grid-cols-2">
                                {levelNodes.map((node) => (
                                    <NodeCard
                                        key={node.id}
                                        node={node}
                                        onSelfReport={selfReportNode}
                                    />
                                ))}
                            </div>
                        </section>
                    );
                })}
            </div>
        </div>
    );
}
