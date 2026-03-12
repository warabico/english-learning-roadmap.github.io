import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { Map, BarChart3, Award, Settings } from "lucide-react";

const navItems = [
    { path: "/", icon: Map, labelKey: "nav.map" },
    { path: "/dashboard", icon: BarChart3, labelKey: "nav.dashboard" },
    { path: "/badges", icon: Award, labelKey: "nav.badges" },
    { path: "/settings", icon: Settings, labelKey: "nav.settings" },
] as const;

export function BottomNav() {
    const { t } = useTranslation();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-700 bg-slate-900/95 backdrop-blur-sm lg:hidden">
            <div className="flex justify-around">
                {navItems.map(({ path, icon: Icon, labelKey }) => (
                    <NavLink
                        key={path}
                        to={path}
                        end={path === "/"}
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-0.5 px-3 py-2 text-xs transition-colors ${
                                isActive
                                    ? "text-sky-400"
                                    : "text-slate-400 hover:text-slate-200"
                            }`
                        }
                    >
                        <Icon size={20} />
                        <span>{t(labelKey)}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
