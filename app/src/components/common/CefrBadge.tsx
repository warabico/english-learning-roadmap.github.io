import type { CEFRLevel } from "../../types";

const CEFR_COLORS: Record<CEFRLevel, string> = {
    A1: "bg-emerald-900/60 text-emerald-400 border-emerald-500/50",
    A2: "bg-emerald-900/60 text-emerald-300 border-emerald-400/50",
    B1: "bg-sky-900/60 text-sky-400 border-sky-500/50",
    B2: "bg-sky-900/60 text-sky-300 border-sky-400/50",
    C1: "bg-purple-900/60 text-purple-400 border-purple-500/50",
    C2: "bg-amber-900/60 text-amber-400 border-amber-500/50",
};

export function CefrBadge({
    level,
    size = "sm",
}: {
    level: CEFRLevel;
    size?: "sm" | "md";
}) {
    const sizeClass =
        size === "md" ? "px-2.5 py-1 text-sm" : "px-1.5 py-0.5 text-xs";

    return (
        <span
            className={`inline-block rounded border font-bold tracking-wider ${sizeClass} ${CEFR_COLORS[level]}`}
            style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
            {level}
        </span>
    );
}
