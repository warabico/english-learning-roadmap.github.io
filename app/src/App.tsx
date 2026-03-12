function App() {
    const categories = [
        { name: "Vocabulary", icon: "book", color: "sky" },
        { name: "Grammar", icon: "cog", color: "violet" },
        { name: "Pronunciation", icon: "mic", color: "rose" },
        { name: "Reading", icon: "book-open", color: "emerald" },
        { name: "Writing", icon: "pen", color: "amber" },
        { name: "Listening", icon: "headphones", color: "cyan" },
        { name: "Speaking", icon: "message", color: "orange" },
    ];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
            <h1
                className="text-4xl md:text-6xl font-bold text-sky-400 mb-4 tracking-wider"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
                English Learning Roadmap
            </h1>
            <p className="text-slate-400 text-lg md:text-xl mb-12 text-center">
                Track your English skills from A1 to C2 with a gamified skill
                tree
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12 max-w-xl">
                {categories.map((cat) => (
                    <div
                        key={cat.name}
                        className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-center text-sm text-slate-300 hover:border-sky-400 hover:text-sky-400 transition-colors"
                    >
                        {cat.name}
                    </div>
                ))}
            </div>

            <p className="text-slate-500 text-sm">Coming soon...</p>
        </div>
    );
}

export default App;
