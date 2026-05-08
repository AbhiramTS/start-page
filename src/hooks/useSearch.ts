import { useState, useMemo } from "react";
import type { Link } from "../types";

export interface SearchEngine {
	name: string;
	url: string;
}

const DEFAULT_ENGINES: SearchEngine[] = [
	{ name: "Google", url: "https://google.com/search?q=" },
	{ name: "DDG", url: "https://duckduckgo.com/?q=" },
	{ name: "Bing", url: "https://bing.com/search?q=" },
];

export function useSearch(links: Link[]) {
	const [query, setQuery] = useState("");
	const [engines] = useState<SearchEngine[]>(DEFAULT_ENGINES);
	const [activeEngine, setActiveEngine] = useState(0);

	const filteredLinks = useMemo(() => {
		if (!query.trim()) return links;

		const lowerQuery = query.toLowerCase();
		return links.filter((link) => {
			const titleMatch = link.title.toLowerCase().includes(lowerQuery);
			const urlMatch = link.url.toLowerCase().includes(lowerQuery);
			const tagsMatch = link.tags?.some((tag) =>
				tag.toLowerCase().includes(lowerQuery),
			);
			return titleMatch || urlMatch || tagsMatch;
		});
	}, [query, links]);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (query.trim()) {
			const searchUrl = engines[activeEngine].url + encodeURIComponent(query);
			window.location.href = searchUrl;
		}
	};

	return {
		query,
		setQuery,
		engines,
		activeEngine,
		setActiveEngine,
		filteredLinks,
		handleSearch,
	};
}
