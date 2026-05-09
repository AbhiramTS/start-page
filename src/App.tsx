import { useState } from "react";
import "./styles/variables.css";
import "./styles/App.css";
import "./styles/components.css";
import { useSharedPreferences } from "./contexts/PreferencesContext";
import { useTheme } from "./hooks/useTheme";
import { useQuickLinks } from "./hooks/useQuickLinks";
import { useSearch } from "./hooks/useSearch";
import {
	getActiveFontStyles,
	getFontSize,
	resolveFontFamily,
} from "./utils/sectionTypography";
import { Background } from "./components/Background";
import { Clock } from "./components/Clock";
import { ThemeToggle } from "./components/ThemeToggle";
import { SearchBar } from "./components/SearchBar";
import { QuickLinks } from "./components/QuickLinks";
import { SettingsPanel } from "./components/SettingsPanel";

function App() {
	const { preferences } = useSharedPreferences();
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
	const importedFontStyles = getActiveFontStyles(preferences.importedFonts);
	const clockFontFamily = resolveFontFamily(
		"clock",
		preferences.fontAssignments,
		preferences.importedFonts,
	);
	const searchFontFamily = resolveFontFamily(
		"search",
		preferences.fontAssignments,
		preferences.importedFonts,
	);
	const quickLinksFontFamily = resolveFontFamily(
		"quickLinks",
		preferences.fontAssignments,
		preferences.importedFonts,
	);
	const settingsFontFamily = resolveFontFamily(
		"settings",
		preferences.fontAssignments,
		preferences.importedFonts,
	);

	return (
		<>
			{importedFontStyles && <style>{importedFontStyles}</style>}
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
				<Clock
					dateTimeFormat={preferences.dateTimeFormat}
					fontFamily={clockFontFamily}
					fontSize={getFontSize("clock", preferences.fontSizes)}
				/>

				<SearchBar
					query={query}
					onQueryChange={setQuery}
					engines={engines}
					activeEngine={activeEngine}
					onEngineChange={setActiveEngine}
					onSubmit={handleSearch}
					fontFamily={searchFontFamily}
					fontSize={getFontSize("search", preferences.fontSizes)}
				/>

				<QuickLinks
					links={filteredLinks}
					fontFamily={quickLinksFontFamily}
					fontSize={getFontSize("quickLinks", preferences.fontSizes)}
				/>
			</div>

			<SettingsPanel
				isOpen={isSettingsOpen}
				onClose={() => setIsSettingsOpen(false)}
				fontFamily={settingsFontFamily}
				fontSize={getFontSize("settings", preferences.fontSizes)}
			/>
		</>
	);
}

export default App;
