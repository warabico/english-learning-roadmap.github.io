import { useTranslation } from "react-i18next";
import { Download, Upload, AlertTriangle } from "lucide-react";
import { useProgressStore } from "../store/progressStore";

export function SettingsPage() {
    const { t, i18n } = useTranslation();
    const settings = useProgressStore((s) => s.settings);
    const updateSettings = useProgressStore((s) => s.updateSettings);
    const exportData = useProgressStore((s) => s.exportData);
    const importData = useProgressStore((s) => s.importData);

    const handleLanguageChange = (lang: "en" | "ja") => {
        updateSettings({ uiLanguage: lang });
        i18n.changeLanguage(lang);
    };

    const handleExport = () => {
        const data = exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `elr-backup-${new Date().toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImport = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;
            try {
                const text = await file.text();
                const data = JSON.parse(text);
                if (!confirm(t("settings.importConfirm"))) return;
                importData(data);
                i18n.changeLanguage(data.data?.settings?.uiLanguage ?? "en");
            } catch {
                alert(t("settings.importFailed"));
            }
        };
        input.click();
    };

    return (
        <div className="px-4 pt-4 pb-24 lg:pb-8">
            <h1
                className="text-xl font-bold text-slate-100 tracking-wide mb-6"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
                {t("settings.title")}
            </h1>

            <div className="space-y-6">
                <section className="rounded-xl border border-slate-700 bg-slate-800/40 p-4">
                    <h2 className="text-sm font-semibold text-slate-200 mb-3">
                        {t("settings.language")}
                    </h2>
                    <div className="flex gap-2">
                        {(["en", "ja"] as const).map((lang) => (
                            <button
                                key={lang}
                                onClick={() => handleLanguageChange(lang)}
                                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                    settings.uiLanguage === lang
                                        ? "bg-sky-600 text-white"
                                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                                }`}
                            >
                                {lang === "en" ? "English" : "日本語"}
                            </button>
                        ))}
                    </div>
                </section>

                <section className="rounded-xl border border-slate-700 bg-slate-800/40 p-4">
                    <h2 className="text-sm font-semibold text-slate-200 mb-3">
                        {t("settings.theme")}
                    </h2>
                    <div className="flex gap-2">
                        {(["dark", "light"] as const).map((theme) => (
                            <button
                                key={theme}
                                onClick={() => updateSettings({ theme })}
                                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                    settings.theme === theme
                                        ? "bg-sky-600 text-white"
                                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                                }`}
                            >
                                {t(`settings.${theme}`)}
                            </button>
                        ))}
                    </div>
                </section>

                <section className="rounded-xl border border-slate-700 bg-slate-800/40 p-4">
                    <h2 className="text-sm font-semibold text-slate-200 mb-3">
                        {t("settings.data")}
                    </h2>
                    <div className="space-y-3">
                        <button
                            onClick={handleExport}
                            className="flex w-full items-center gap-3 rounded-lg bg-slate-700 px-4 py-3 text-sm text-slate-200 transition-colors hover:bg-slate-600"
                        >
                            <Download size={18} />
                            <div className="text-left">
                                <div className="font-medium">
                                    {t("settings.export")}
                                </div>
                                <div className="text-xs text-slate-400">
                                    {t("settings.exportDesc")}
                                </div>
                            </div>
                        </button>
                        <button
                            onClick={handleImport}
                            className="flex w-full items-center gap-3 rounded-lg bg-slate-700 px-4 py-3 text-sm text-slate-200 transition-colors hover:bg-slate-600"
                        >
                            <Upload size={18} />
                            <div className="text-left">
                                <div className="font-medium">
                                    {t("settings.import")}
                                </div>
                                <div className="text-xs text-slate-400">
                                    {t("settings.importDesc")}
                                </div>
                            </div>
                        </button>
                    </div>
                </section>

                <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-900/10 p-3">
                    <AlertTriangle
                        size={16}
                        className="mt-0.5 shrink-0 text-amber-400"
                    />
                    <p className="text-xs text-amber-300/80">
                        {t("settings.warning")}
                    </p>
                </div>
            </div>
        </div>
    );
}
