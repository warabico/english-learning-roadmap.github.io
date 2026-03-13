import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useProgressStore } from "../store/progressStore";
import { skillNodes } from "../data/nodes";
import type { CEFRLevel } from "../types";
import { CEFR_LEVELS } from "../types";

interface PlacementQuestion {
    level: CEFRLevel;
    question: string;
    options: string[];
    answer: string;
}

const placementQuestions: PlacementQuestion[] = [
    // A1
    {
        level: "A1",
        question: 'What is the English word for "cat"?',
        options: ["Cat", "Dog", "Bird", "Fish"],
        answer: "Cat",
    },
    {
        level: "A1",
        question: 'Choose the correct sentence: "I ___ a student."',
        options: ["am", "is", "are", "be"],
        answer: "am",
    },
    {
        level: "A1",
        question: "Which word means the opposite of 'big'?",
        options: ["Tall", "Small", "Fast", "Long"],
        answer: "Small",
    },
    // A2
    {
        level: "A2",
        question: "She ___ to the store yesterday.",
        options: ["go", "goes", "went", "going"],
        answer: "went",
    },
    {
        level: "A2",
        question: "Which sentence is correct?",
        options: [
            "There are some milk.",
            "There is some milk.",
            "There be some milk.",
            "There have some milk.",
        ],
        answer: "There is some milk.",
    },
    {
        level: "A2",
        question: "I have been living here ___ five years.",
        options: ["since", "for", "from", "during"],
        answer: "for",
    },
    // B1
    {
        level: "B1",
        question:
            "If I ___ rich, I would travel around the world.",
        options: ["am", "was", "were", "be"],
        answer: "were",
    },
    {
        level: "B1",
        question: "She suggested that he ___ a doctor.",
        options: ["sees", "saw", "see", "seeing"],
        answer: "see",
    },
    {
        level: "B1",
        question:
            'Which word best completes: "The movie was so ___ that I fell asleep."',
        options: ["bored", "boring", "bore", "boredom"],
        answer: "boring",
    },
    // B2
    {
        level: "B2",
        question:
            "___ the rain, the match continued.",
        options: ["Despite", "Although", "However", "Because"],
        answer: "Despite",
    },
    {
        level: "B2",
        question:
            "She ___ have left already; her car is gone.",
        options: ["must", "should", "would", "could"],
        answer: "must",
    },
    {
        level: "B2",
        question:
            'Choose the correct word: "The government plans to ___ new regulations."',
        options: ["implement", "implicate", "imply", "impose"],
        answer: "implement",
    },
    // C1
    {
        level: "C1",
        question:
            "Hardly ___ the door when the phone rang.",
        options: [
            "had I opened",
            "I had opened",
            "I opened",
            "did I open",
        ],
        answer: "had I opened",
    },
    {
        level: "C1",
        question:
            'The word "ubiquitous" most closely means:',
        options: [
            "Found everywhere",
            "Very large",
            "Extremely rare",
            "Highly dangerous",
        ],
        answer: "Found everywhere",
    },
    {
        level: "C1",
        question:
            "Which sentence uses the subjunctive correctly?",
        options: [
            "I insist that he goes.",
            "I insist that he go.",
            "I insist he is going.",
            "I insist he will go.",
        ],
        answer: "I insist that he go.",
    },
    // C2
    {
        level: "C2",
        question:
            'What does the idiom "to have a bee in one\'s bonnet" mean?',
        options: [
            "To be obsessed with something",
            "To be very busy",
            "To feel ill",
            "To be confused",
        ],
        answer: "To be obsessed with something",
    },
    {
        level: "C2",
        question:
            'The phrase "notwithstanding the foregoing" is most common in:',
        options: [
            "Legal documents",
            "Casual emails",
            "Poetry",
            "News headlines",
        ],
        answer: "Legal documents",
    },
    {
        level: "C2",
        question:
            'Choose the most precise synonym for "perspicacious":',
        options: ["Astute", "Persistent", "Generous", "Anxious"],
        answer: "Astute",
    },
];

export function PlacementQuiz() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { selfReportNode, recordActivity } = useProgressStore();
    const profile = useProgressStore((s) => s.profile);

    const [started, setStarted] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, boolean>>({});
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

    // Already completed
    if (profile.placementQuizCompleted) {
        navigate("/");
        return null;
    }

    const handleSkip = () => {
        useProgressStore.setState((state) => ({
            profile: {
                ...state.profile,
                placementQuizCompleted: true,
                placementQuizLevel: "A1",
            },
        }));
        navigate("/");
    };

    const handleAnswer = () => {
        if (!selectedAnswer) return;
        const q = placementQuestions[currentIndex];
        const correct = selectedAnswer === q.answer;
        setAnswers((a) => ({ ...a, [q.level]: correct || (a[q.level] ?? false) }));
        setSelectedAnswer(null);

        if (currentIndex + 1 >= placementQuestions.length) {
            finishQuiz({ ...answers, [q.level]: correct || (answers[q.level] ?? false) });
        } else {
            setCurrentIndex((i) => i + 1);
        }
    };

    const finishQuiz = (finalAnswers: Record<string, boolean>) => {
        // Determine highest level where at least 2/3 correct
        let assessedLevel: CEFRLevel = "A1";
        const levelCorrects: Record<string, number> = {};

        for (const q of placementQuestions) {
            levelCorrects[q.level] =
                (levelCorrects[q.level] ?? 0) +
                (finalAnswers[q.level] ? 1 : 0);
        }

        // Simple approach: highest level where user got majority correct
        for (const level of CEFR_LEVELS) {
            const total = placementQuestions.filter(
                (q) => q.level === level
            ).length;
            const correct = levelCorrects[level] ?? 0;
            if (correct >= Math.ceil(total * 0.6)) {
                assessedLevel = level;
            } else {
                break;
            }
        }

        // Auto-unlock all nodes at or below the assessed level
        const levelIndex = CEFR_LEVELS.indexOf(assessedLevel);
        const nodesToUnlock = skillNodes.filter(
            (n) => CEFR_LEVELS.indexOf(n.cefrLevel) <= levelIndex
        );
        for (const node of nodesToUnlock) {
            selfReportNode(node.id);
        }

        recordActivity();
        useProgressStore.setState((state) => ({
            profile: {
                ...state.profile,
                placementQuizCompleted: true,
                placementQuizLevel: assessedLevel,
            },
        }));
        navigate("/");
    };

    if (!started) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full text-center"
                >
                    <h1
                        className="text-3xl font-bold text-sky-400 mb-4"
                        style={{ fontFamily: "'Orbitron', sans-serif" }}
                    >
                        {t("placement.title")}
                    </h1>
                    <p className="text-slate-400 mb-8">
                        {t("placement.description")}
                    </p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => setStarted(true)}
                            className="w-full py-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-lg transition-colors"
                        >
                            {t("placement.start")}
                        </button>
                        <button
                            onClick={handleSkip}
                            className="w-full py-3 rounded-lg border border-slate-600 text-slate-400 hover:text-slate-200 hover:border-slate-400 transition-colors"
                        >
                            {t("placement.skip")}
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    const question = placementQuestions[currentIndex];

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="max-w-lg w-full">
                <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm text-slate-400">
                        {t("quiz.question", {
                            current: currentIndex + 1,
                            total: placementQuestions.length,
                        })}
                    </span>
                    <span className="text-xs text-slate-500">
                        {question.level}
                    </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full mb-6 overflow-hidden">
                    <div
                        className="h-full bg-sky-500 transition-all"
                        style={{
                            width: `${((currentIndex + 1) / placementQuestions.length) * 100}%`,
                        }}
                    />
                </div>

                <p className="text-slate-100 font-medium text-lg mb-6">
                    {question.question}
                </p>

                <div className="space-y-2 mb-6">
                    {question.options.map((opt) => (
                        <button
                            key={opt}
                            onClick={() => setSelectedAnswer(opt)}
                            className={`w-full text-left p-3 rounded-lg border text-sm text-slate-200 transition-colors ${
                                selectedAnswer === opt
                                    ? "border-sky-500 bg-sky-950/30"
                                    : "border-slate-600 hover:border-slate-400"
                            }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleAnswer}
                    disabled={!selectedAnswer}
                    className="w-full py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold transition-colors"
                >
                    {currentIndex + 1 >= placementQuestions.length
                        ? "Finish"
                        : "Next"}
                </button>
            </div>
        </div>
    );
}
