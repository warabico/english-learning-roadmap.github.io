import { Routes, Route } from "react-router-dom";
import { BottomNav } from "./components/common/BottomNav";
import { SideNav } from "./components/common/SideNav";
import { WorldMap } from "./components/WorldMap";
import { SkillMap } from "./components/SkillMap";
import { Dashboard } from "./components/Dashboard";
import { BadgesPage } from "./components/BadgesPage";
import { SettingsPage } from "./components/SettingsPage";

function App() {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-100">
            <SideNav />
            <main className="lg:ml-56">
                <div className="mx-auto max-w-2xl">
                    <Routes>
                        <Route path="/" element={<WorldMap />} />
                        <Route
                            path="/skill/:category"
                            element={<SkillMap />}
                        />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/badges" element={<BadgesPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                    </Routes>
                </div>
            </main>
            <BottomNav />
        </div>
    );
}

export default App;
