import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, XCircle } from "lucide-react";
import type { QuizQuestion } from "../types";
import { useProgressStore } from "../store/progressStore";

interface QuizModalProps {
    nodeId: string;
    nodeName: string;
    questions: QuizQuestion[];
    onClose: () => void;
}

export function QuizModal({
    nodeId,
    nodeName,
    questions,
    onClose,
}: QuizModalProps) {
    const { t } = useTranslation();
    const { submitQuizResult, recordActivity } = useProgressStore();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [finished, setFinished] = useState(false);
    const [fillBlankInput, setFillBlankInput] = useState("");

    const question = questions[currentIndex];
    const isCorrect = selectedAnswer === question?.answer;

    const handleAnswer = useCallback(() => {
        if (!selectedAnswer) return;
        setShowResult(true);
        if (selectedAnswer === question.answer) {
            setCorrectCount((c) => c + 1);
        }
    }, [selectedAnswer, question]);

    const handleNext = useCallback(() => {
        setSelectedAnswer(null);
        setShowResult(false);
        setFillBlankInput("");

        if (currentIndex + 1 >= questions.length) {
            const score = Math.round(
                (correctCount / questions.length) * 100
            );
            submitQuizResult(nodeId, score);
            recordActivity();
            setFinished(true);
        } else {
            setCurrentIndex((i) => i + 1);
        }
    }, [
        currentIndex,
        questions.length,
        correctCount,
        isCorrect,
        showResult,
        nodeId,
        submitQuizResult,
        recordActivity,
    ]);

    const finalScore = Math.round((correctCount / questions.length) * 100);
    const passed = finalScore >= 70;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => {
                    if (e.target === e.currentTarget) onClose();
                }}
            >
                <motion.div
                    className="w-full max-w-lg rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-100">
                            {nodeName}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-200 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {finished ? (
                        /* Results Screen */
                        <div className="text-center py-8">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 200,
                                }}
                            >
                                {passed ? (
                                    <CheckCircle2
                                        size={64}
                                        className="mx-auto text-emerald-400 mb-4"
                                    />
                                ) : (
                                    <XCircle
                                        size={64}
                                        className="mx-auto text-red-400 mb-4"
                                    />
                                )}
                            </motion.div>

                            <p className="text-2xl font-bold text-slate-100 mb-2">
                                {passed
                                    ? t("quiz.passed")
                                    : t("quiz.failed")}
                            </p>
                            <p className="text-slate-400 mb-2">
                                {t("quiz.score", { score: finalScore })}
                            </p>
                            <p className="text-sky-400 font-semibold mb-8">
                                {t("quiz.xpEarned", {
                                    xp:
                                        finalScore >= 90
                                            ? 35
                                            : finalScore >= 70
                                              ? 20
                                              : 5,
                                })}
                            </p>

                            <button
                                onClick={onClose}
                                className="px-6 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold transition-colors"
                            >
                                OK
                            </button>
                        </div>
                    ) : (
                        /* Question Screen */
                        <>
                            <div className="text-sm text-slate-400 mb-4">
                                {t("quiz.question", {
                                    current: currentIndex + 1,
                                    total: questions.length,
                                })}
                            </div>

                            <p className="text-slate-100 font-medium text-lg mb-6">
                                {question.question}
                            </p>

                            {/* Multiple Choice */}
                            {question.type === "multiple_choice" &&
                                question.options && (
                                    <div className="space-y-2 mb-6">
                                        {question.options.map((opt) => {
                                            const isSelected =
                                                selectedAnswer === opt;
                                            const isAnswerOpt =
                                                opt === question.answer;
                                            let optClass =
                                                "border-slate-600 hover:border-slate-400";
                                            if (showResult && isAnswerOpt) {
                                                optClass =
                                                    "border-emerald-500 bg-emerald-950/30";
                                            } else if (
                                                showResult &&
                                                isSelected &&
                                                !isAnswerOpt
                                            ) {
                                                optClass =
                                                    "border-red-500 bg-red-950/30";
                                            } else if (isSelected) {
                                                optClass =
                                                    "border-sky-500 bg-sky-950/30";
                                            }

                                            return (
                                                <button
                                                    key={opt}
                                                    disabled={showResult}
                                                    onClick={() =>
                                                        setSelectedAnswer(opt)
                                                    }
                                                    className={`w-full text-left p-3 rounded-lg border text-sm text-slate-200 transition-colors ${optClass}`}
                                                >
                                                    {opt}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

                            {/* True/False */}
                            {question.type === "true_false" && (
                                <div className="flex gap-3 mb-6">
                                    {["True", "False"].map((opt) => {
                                        const isSelected =
                                            selectedAnswer === opt;
                                        const isAnswerOpt =
                                            opt === question.answer;
                                        let optClass =
                                            "border-slate-600 hover:border-slate-400";
                                        if (showResult && isAnswerOpt) {
                                            optClass =
                                                "border-emerald-500 bg-emerald-950/30";
                                        } else if (
                                            showResult &&
                                            isSelected &&
                                            !isAnswerOpt
                                        ) {
                                            optClass =
                                                "border-red-500 bg-red-950/30";
                                        } else if (isSelected) {
                                            optClass =
                                                "border-sky-500 bg-sky-950/30";
                                        }

                                        return (
                                            <button
                                                key={opt}
                                                disabled={showResult}
                                                onClick={() =>
                                                    setSelectedAnswer(opt)
                                                }
                                                className={`flex-1 p-3 rounded-lg border text-sm font-semibold text-slate-200 transition-colors ${optClass}`}
                                            >
                                                {opt}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Fill in the Blank */}
                            {question.type === "fill_blank" && (
                                <div className="mb-6">
                                    <input
                                        type="text"
                                        value={fillBlankInput}
                                        onChange={(e) => {
                                            setFillBlankInput(e.target.value);
                                            setSelectedAnswer(
                                                e.target.value.trim().toLowerCase()
                                            );
                                        }}
                                        disabled={showResult}
                                        placeholder="Type your answer..."
                                        className="w-full p-3 rounded-lg border border-slate-600 bg-slate-800 text-slate-100 text-sm focus:border-sky-500 focus:outline-none"
                                    />
                                    {showResult && (
                                        <p className="mt-2 text-sm text-emerald-400">
                                            Answer: {question.answer}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Explanation */}
                            {showResult && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-3 rounded-lg mb-4 text-sm ${
                                        isCorrect
                                            ? "bg-emerald-950/30 border border-emerald-500/30 text-emerald-300"
                                            : "bg-red-950/30 border border-red-500/30 text-red-300"
                                    }`}
                                >
                                    <p className="font-semibold mb-1">
                                        {isCorrect
                                            ? t("quiz.correct")
                                            : t("quiz.incorrect")}
                                    </p>
                                    <p className="text-slate-300">
                                        {question.explanation}
                                    </p>
                                </motion.div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3">
                                {!showResult ? (
                                    <button
                                        onClick={handleAnswer}
                                        disabled={!selectedAnswer}
                                        className="flex-1 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold transition-colors"
                                    >
                                        {t("quiz.submit")}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleNext}
                                        className="flex-1 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold transition-colors"
                                    >
                                        {currentIndex + 1 >= questions.length
                                            ? "Finish"
                                            : "Next"}
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
