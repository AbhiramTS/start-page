import { useState } from "react";
import "./styles/variables.css";
import "./styles/App.css";
import "./styles/components.css";
import { useTheme } from "./hooks/useTheme";
import { useQuickLinks } from "./hooks/useQuickLinks";
import { useSearch } from "./hooks/useSearch";
import { Background } from "./components/Background";
import { Clock } from "./components/Clock";
import { ThemeToggle } from "./components/ThemeToggle";
import { SearchBar } from "./components/SearchBar";
import { QuickLinks } from "./components/QuickLinks";
import { SettingsPanel } from "./components/SettingsPanel";

function App() {
	const { theme, toggleTheme } = useTheme();
	const { links } = useQuickLinks();
	const {
		query,
		setQuery,
		engines,
		activeEngine,
		setActiveEngine,
		filteredLinks,
		handleSearch,
	} = useSearch(links);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);

	return (
		<>
		<Background theme={theme} />

			<div className="topbar">
				<ThemeToggle theme={theme} onToggle={toggleTheme} />
				<button
					className="tb-btn has-tooltip"
					aria-label="Settings"
					data-tooltip="Settings"
					onClick={() => setIsSettingsOpen(true)}
				>
					⚙
				</button>
			</div>

			<div className="wrap">
				<Clock />

				<SearchBar
					query={query}
					onQueryChange={setQuery}
					engines={engines}
					activeEngine={activeEngine}
					onEngineChange={setActiveEngine}
					onSubmit={handleSearch}
				/>

				<QuickLinks links={filteredLinks} />
			</div>

			<SettingsPanel
				isOpen={isSettingsOpen}
				onClose={() => setIsSettingsOpen(false)}
			/>
		</>
	);
}

export default App;
