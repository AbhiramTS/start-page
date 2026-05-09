import type { Link } from "../types";
import { useSharedPreferences } from "../contexts/PreferencesContext";

export function useQuickLinks() {
	const { preferences, updateQuickLinks } = useSharedPreferences();
	const links = preferences.quickLinks;

	const addLink = (link: Omit<Link, "id" | "isCustom">) => {
		const newLink: Link = {
			...link,
			id:
				crypto.randomUUID?.() ||
				`${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
			isCustom: true,
		};
		updateQuickLinks([...links, newLink]);
	};

	const removeLink = (id: string) => {
		updateQuickLinks(links.filter((link) => link.id !== id));
	};

	const updateLink = (id: string, updates: Partial<Link>) => {
		updateQuickLinks(
			links.map((link) => (link.id === id ? { ...link, ...updates } : link)),
		);
	};

	return { links, addLink, removeLink, updateLink };
}
