interface ThemeToggleProps {
	theme: "light" | "dark";
	onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
	return (
		<button
			className="tb-btn has-tooltip"
			onClick={onToggle}
			aria-label="Toggle dark/light"
			data-tooltip="Toggle dark/light"
		>
			{theme === "dark" ? "☾" : "☀"}
		</button>
	);
}
