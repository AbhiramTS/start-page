import { useState, useMemo } from "react";
import type { Link } from "../types";
import { useSharedPreferences } from "../contexts/PreferencesContext";

export function useSearch(links: Link[]) {
	const { preferences, updateDefaultSearchEngineIndex } = useSharedPreferences();
	const engines = preferences.searchEngines;
	const activeEngine = preferences.defaultSearchEngineIndex;

	const [query, setQuery] = useState("");

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
		setActiveEngine: updateDefaultSearchEngineIndex,
		filteredLinks,
		handleSearch,
	};
}
