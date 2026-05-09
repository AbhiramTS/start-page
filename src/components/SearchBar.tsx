import { useEffect, useRef, useState } from "react";
import type { SearchEngine } from "../types";
import { SiteIcon } from "./SiteIcon";

interface SearchBarProps {
	query: string;
	onQueryChange: (query: string) => void;
	engines: SearchEngine[];
	activeEngine: number;
	onEngineChange: (index: number) => void;
	onSubmit: (e: React.FormEvent) => void;
	fontFamily: string;
	fontSize: number;
}

export function SearchBar({
	query,
	onQueryChange,
	engines,
	activeEngine,
	onEngineChange,
	onSubmit,
	fontFamily,
	fontSize,
}: SearchBarProps) {
	const [isOpen, setIsOpen] = useState(false);
	const switcherRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const onDocumentClick = (event: MouseEvent) => {
			if (
				switcherRef.current &&
				!switcherRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		const onEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") setIsOpen(false);
		};

		document.addEventListener("mousedown", onDocumentClick);
		document.addEventListener("keydown", onEscape);

		return () => {
			document.removeEventListener("mousedown", onDocumentClick);
			document.removeEventListener("keydown", onEscape);
		};
	}, []);

	const active = engines[activeEngine];

	return (
		<div className="search-block" style={{ fontFamily, fontSize }}>
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
					style={{ fontFamily, fontSize }}
				/>
				<div className="engine-switcher" ref={switcherRef}>
					<button
						type="button"
						className="engine-trigger has-tooltip"
						aria-label={`Search with ${active.name}`}
						aria-haspopup="listbox"
						aria-expanded={isOpen}
						data-tooltip={`Search with ${active.name}`}
						onClick={() => setIsOpen((v) => !v)}
					>
						<SiteIcon
							url={active.url}
							label={active.name}
							className="engine-icon"
							size={18}
							fallbackGlyph={active.name[0]}
						/>
						<span className="engine-trigger-label">{active.name}</span>
						<svg
							className="engine-caret"
							width="12"
							height="12"
							viewBox="0 0 12 12"
							fill="none"
							aria-hidden="true"
						>
							<path
								d="M3 4.5L6 7.5L9 4.5"
								stroke="currentColor"
								strokeWidth="1.4"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</button>
					<div className={`engine-menu ${isOpen ? "open" : ""}`} role="listbox">
						{engines.map((engine, index) => (
							<button
								key={engine.name}
								type="button"
								className={`engine-option ${index === activeEngine ? "active" : ""}`}
								role="option"
								aria-selected={index === activeEngine}
								onClick={() => {
									onEngineChange(index);
									setIsOpen(false);
								}}
							>
								<SiteIcon
									url={engine.url}
									label={engine.name}
									className="engine-menu-icon"
									size={18}
									fallbackGlyph={engine.name[0]}
								/>
								<span>{engine.name}</span>
							</button>
						))}
					</div>
				</div>
			</form>
		</div>
	);
}
