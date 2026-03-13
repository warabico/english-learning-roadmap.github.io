import { useTranslation } from "react-i18next";
import { useProgressStore } from "../store/progressStore";

export function Settings() {
    const { t, i18n } = useTranslation();
    const { profile, settings, updateSettings, exportData, importData } =
        useProgressStore();

    const handleLanguageChange = (lang: string) => {
        i18n.changeLanguage(lang);
        updateSettings({ uiLanguage: lang as "en" | "ja" });
    };

    const handleThemeChange = (theme: string) => {
        updateSettings({
            theme: theme as "dark" | "light",
        });
        if (theme === "light") {
            document.documentElement.classList.remove("dark");
        } else {
            document.documentElement.classList.add("dark");
        }
    };

    const handleExport = () => {
        const data = exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `english-learning-backup-${new Date().toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            const data = JSON.parse(text);
            if (!data.version || data.version !== 1) {
                alert(t("settings.importFailed"));
                return;
            }
            if (
                confirm(
                    t("settings.importConfirm")
                )
            ) {
                importData(data);
                alert("Import successful!");
            }
        } catch {
            alert(t("settings.importFailed"));
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 pb-20 lg:pb-6 lg:ml-56">
            <div className="max-w-2xl mx-auto px-4 py-6">
                <h1 className="text-3xl font-bold text-slate-100 mb-8">
                    {t("settings.title")}
                </h1>

                {/* User Profile */}
                <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 mb-6">
                    <h2 className="font-semibold text-slate-100 mb-4">
                        Profile
                    </h2>
                    <div>
                        <p className="text-slate-400 text-sm">Name</p>
                        <p className="text-slate-100 text-lg font-semibold">
                            {profile.name}
                        </p>
                    </div>
                </div>

                {/* Language */}
                <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 mb-6">
                    <h2 className="font-semibold text-slate-100 mb-4">
                        {t("settings.language")}
                    </h2>
                    <div className="flex gap-3">
                        {["en", "ja"].map((lang) => (
                            <button
                                key={lang}
                                onClick={() => handleLanguageChange(lang)}
                                className={`px-4 py-2 rounded transition-colors ${
                                    settings.uiLanguage === lang
                                        ? "bg-sky-600 text-white"
                                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                                }`}
                            >
                                {lang === "en" ? "English" : "日本語"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Theme */}
                <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 mb-6">
                    <h2 className="font-semibold text-slate-100 mb-4">
                        {t("settings.theme")}
                    </h2>
                    <div className="flex gap-3">
                        {["dark", "light"].map((theme) => (
                            <button
                                key={theme}
                                onClick={() => handleThemeChange(theme)}
                                className={`px-4 py-2 rounded transition-colors capitalize ${
                                    settings.theme === theme
                                        ? "bg-sky-600 text-white"
                                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                                }`}
                            >
                                {t(`settings.${theme}` as any)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Data Management */}
                <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 mb-6">
                    <h2 className="font-semibold text-slate-100 mb-4">
                        {t("settings.data")}
                    </h2>
                    <p className="text-slate-400 text-sm mb-4">
                        {t("settings.warning")}
                    </p>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleExport}
                            className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded transition-colors font-semibold"
                        >
                            {t("settings.export")}
                        </button>
                        <label className="w-full px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded transition-colors font-semibold cursor-pointer text-center">
                            {t("settings.import")}
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleImport}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
