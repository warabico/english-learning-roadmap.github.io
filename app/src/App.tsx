import { Routes, Route } from "react-router-dom";
import { BottomNav } from "./components/common/BottomNav";
import { SideNav } from "./components/common/SideNav";
import { WorldMap } from "./pages/WorldMap";
import { SkillMap } from "./pages/SkillMap";
import { Dashboard } from "./pages/Dashboard";
import { Settings } from "./pages/Settings";
import { Badges } from "./pages/Badges";
import { PlacementQuiz } from "./pages/PlacementQuiz";

function App() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <SideNav />
            <BottomNav />
            <Routes>
                <Route path="/" element={<WorldMap />} />
                <Route path="/map/:category" element={<SkillMap />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/badges" element={<Badges />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/placement" element={<PlacementQuiz />} />
            </Routes>
        </div>
    );
}

export default App;
