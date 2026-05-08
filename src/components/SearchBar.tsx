import type { SearchEngine } from "../hooks/useSearch";

interface SearchBarProps {
	query: string;
	onQueryChange: (query: string) => void;
	engines: SearchEngine[];
	activeEngine: number;
	onEngineChange: (index: number) => void;
	onSubmit: (e: React.FormEvent) => void;
}

export function SearchBar({
	query,
	onQueryChange,
	engines,
	activeEngine,
	onEngineChange,
	onSubmit,
}: SearchBarProps) {
	return (
		<div className="search-block">
			<form className="search-row" onSubmit={onSubmit}>
				<span className="s-icon" aria-hidden="true">
					<svg
						width="16"
						height="16"
						viewBox="0 0 16 16"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<circle cx="7" cy="7" r="4.5" />
						<line x1="10.5" y1="10.5" x2="14" y2="14" />
					</svg>
				</span>
				<input
					id="search"
					type="text"
					placeholder="Search..."
					autoComplete="off"
					spellCheck="false"
					autoFocus
					value={query}
					onChange={(e) => onQueryChange(e.target.value)}
				/>
				<div className="engines">
					{engines.map((engine, index) => (
						<button
							key={engine.name}
							type="button"
							className={`eng ${index === activeEngine ? "on" : ""}`}
							onClick={() => onEngineChange(index)}
						>
							{engine.name}
						</button>
					))}
				</div>
			</form>
		</div>
	);
}
