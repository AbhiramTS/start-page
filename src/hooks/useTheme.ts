import { useState, useEffect } from "react";
import type { Theme } from "../types";

export function useTheme() {
	const [theme, setTheme] = useState<Theme>(() => {
		const stored = localStorage.getItem("theme-preference");
		if (stored === "light" || stored === "dark") return stored;
		return window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
	});

	useEffect(() => {
		document.body.setAttribute("data-theme", theme);
		localStorage.setItem("theme-preference", theme);
	}, [theme]);

	const toggleTheme = () => {
		setTheme((prev) => (prev === "dark" ? "light" : "dark"));
	};

	return { theme, toggleTheme };
}
