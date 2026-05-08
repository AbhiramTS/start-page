interface ThemeToggleProps {
	theme: "light" | "dark";
	onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
	return (
		<button className="tb-btn" onClick={onToggle} title="Toggle dark/light">
			{theme === "dark" ? "☾" : "☀"}
		</button>
	);
}
