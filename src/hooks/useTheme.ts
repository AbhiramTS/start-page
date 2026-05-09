import { useEffect } from "react";
import { useSharedPreferences } from "../contexts/PreferencesContext";

export function useTheme() {
	const { preferences, updateTheme } = useSharedPreferences();
	const theme = preferences.theme;

	useEffect(() => {
		document.body.setAttribute("data-theme", theme);
	}, [theme]);

	const toggleTheme = () => {
		updateTheme(theme === "dark" ? "light" : "dark");
	};

	return { theme, toggleTheme };
}
