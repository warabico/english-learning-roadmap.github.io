import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, CheckCircle2, Circle, Play } from "lucide-react";
import { CefrBadge } from "../components/common/CefrBadge";
import { getNodesByCategory } from "../data/nodes";
import { getQuizzesByNodeId } from "../data/quizzes";
import { QuizModal } from "../components/QuizModal";
import { useProgressStore } from "../store/progressStore";
import { CEFR_LEVELS } from "../types";

export function SkillMap() {
    const { t } = useTranslation();
    const { category } = useParams<{ category: string }>();
    const navigate = useNavigate();
    const { progress, selfReportNode } = useProgressStore();
    const [quizNodeId, setQuizNodeId] = useState<string | null>(null);

    if (!category) return null;

    const nodes = getNodesByCategory(category as any);
    const nodesByLevel = CEFR_LEVELS.reduce(
        (acc, level) => {
            acc[level] = nodes.filter((n) => n.cefrLevel === level);
            return acc;
        },
        {} as Record<string, typeof nodes>
    );

    const quizNode = quizNodeId
        ? nodes.find((n) => n.id === quizNodeId)
        : null;
    const quizQuestions = quizNodeId
        ? getQuizzesByNodeId(quizNodeId)
        : [];

    return (
        <div className="min-h-screen bg-slate-950 pb-20 lg:pb-6 lg:ml-56">
            <div className="max-w-4xl mx-auto px-4 py-6">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 text-sky-400 hover:text-sky-300 mb-6 transition-colors"
                >
                    <ChevronLeft size={20} />
                    {t("nav.map")}
                </button>

                <h1 className="text-3xl font-bold text-slate-100 mb-8 capitalize">
                    {t(`categories.${category}` as any)}
                </h1>

                {CEFR_LEVELS.map((level) => {
                    const levelNodes = nodesByLevel[level];
                    if (levelNodes.length === 0) return null;

                    return (
                        <div key={level} className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <CefrBadge level={level} size="md" />
                                <span className="text-slate-400 text-sm">
                                    {levelNodes.length} skills
                                </span>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {levelNodes.map((node, i) => {
                                    const nodeProgress = progress[node.id];
                                    const status =
                                        nodeProgress?.status || "locked";
                                    const isVerified = status === "verified";
                                    const isSelfReported =
                                        status === "self_reported";
                                    const bestScore =
                                        nodeProgress?.bestScore ?? null;
                                    const hasQuiz =
                                        getQuizzesByNodeId(node.id).length > 0;

                                    return (
                                        <motion.div
                                            key={node.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.03 }}
                                            className={`rounded-lg border p-4 transition-all ${
                                                isVerified
                                                    ? "border-emerald-500/50 bg-emerald-950/30"
                                                    : isSelfReported
                                                      ? "border-sky-500/50 bg-sky-950/30"
                                                      : "border-slate-700 bg-slate-800/50"
                                            }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-slate-100">
                                                        {node.name}
                                                    </h3>
                                                    <p className="text-sm text-slate-400 mt-1">
                                                        {node.description}
                                                    </p>
                                                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                                                        <span>
                                                            ~
                                                            {
                                                                node.estimatedHours
                                                            }
                                                            h
                                                        </span>
                                                        {bestScore !== null && (
                                                            <span
                                                                className={
                                                                    bestScore >=
                                                                    90
                                                                        ? "text-amber-400"
                                                                        : bestScore >=
                                                                            70
                                                                          ? "text-emerald-400"
                                                                          : "text-slate-400"
                                                                }
                                                            >
                                                                Best:{" "}
                                                                {bestScore}%
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="ml-4 flex flex-col gap-2 items-end">
                                                    {isVerified && (
                                                        <div className="text-emerald-400 flex items-center gap-1 text-xs font-semibold">
                                                            <CheckCircle2
                                                                size={16}
                                                            />
                                                            {t(
                                                                "skillMap.verified"
                                                            )}
                                                        </div>
                                                    )}
                                                    {isSelfReported && (
                                                        <div className="text-sky-400 flex items-center gap-1 text-xs font-semibold">
                                                            <Circle
                                                                size={16}
                                                            />
                                                            {t(
                                                                "skillMap.selfReported"
                                                            )}
                                                        </div>
                                                    )}
                                                    {!isVerified &&
                                                        !isSelfReported && (
                                                            <button
                                                                onClick={() =>
                                                                    selfReportNode(
                                                                        node.id
                                                                    )
                                                                }
                                                                className="px-3 py-1 text-xs font-semibold rounded bg-sky-600 hover:bg-sky-500 text-white transition-colors"
                                                            >
                                                                {t(
                                                                    "skillMap.markDone"
                                                                )}
                                                            </button>
                                                        )}
                                                    {hasQuiz && (
                                                        <button
                                                            onClick={() =>
                                                                setQuizNodeId(
                                                                    node.id
                                                                )
                                                            }
                                                            className="px-3 py-1 text-xs font-semibold rounded bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1"
                                                        >
                                                            <Play size={12} />
                                                            {t(
                                                                "skillMap.startQuiz"
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quiz Modal */}
            {quizNode && quizQuestions.length > 0 && (
                <QuizModal
                    nodeId={quizNode.id}
                    nodeName={quizNode.name}
                    questions={quizQuestions}
                    onClose={() => setQuizNodeId(null)}
                />
            )}
        </div>
    );
}
