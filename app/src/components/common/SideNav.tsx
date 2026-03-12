import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { Map, BarChart3, Award, Settings } from "lucide-react";

const navItems = [
    { path: "/", icon: Map, labelKey: "nav.map" },
    { path: "/dashboard", icon: BarChart3, labelKey: "nav.dashboard" },
    { path: "/badges", icon: Award, labelKey: "nav.badges" },
    { path: "/settings", icon: Settings, labelKey: "nav.settings" },
] as const;

export function SideNav() {
    const { t } = useTranslation();

    return (
        <nav className="hidden lg:flex lg:flex-col lg:w-56 lg:fixed lg:inset-y-0 lg:left-0 lg:border-r lg:border-slate-700 lg:bg-slate-900">
            <div className="px-4 py-6">
                <h1
                    className="text-lg font-bold text-sky-400 tracking-wider"
                    style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                    ELR
                </h1>
            </div>
            <div className="flex flex-col gap-1 px-2">
                {navItems.map(({ path, icon: Icon, labelKey }) => (
                    <NavLink
                        key={path}
                        to={path}
                        end={path === "/"}
                        className={({ isActive }) =>
                            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                                isActive
                                    ? "bg-sky-400/10 text-sky-400"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                            }`
                        }
                    >
                        <Icon size={18} />
                        <span>{t(labelKey)}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
