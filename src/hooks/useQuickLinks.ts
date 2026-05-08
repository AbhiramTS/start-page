import { useState, useEffect } from "react";
import type { Link } from "../types";

const DEFAULT_LINKS: Link[] = [
	{
		id: "1",
		title: "GitHub",
		url: "https://github.com",
		icon: "🐙",
		tags: ["dev"],
		isCustom: false,
	},
	{
		id: "2",
		title: "Gmail",
		url: "https://mail.google.com",
		icon: "📧",
		tags: ["mail"],
		isCustom: false,
	},
	{
		id: "3",
		title: "YouTube",
		url: "https://youtube.com",
		icon: "▶️",
		tags: ["media"],
		isCustom: false,
	},
	{
		id: "4",
		title: "Twitter",
		url: "https://twitter.com",
		icon: "🐦",
		tags: ["social"],
		isCustom: false,
	},
	{
		id: "5",
		title: "NSE India",
		url: "https://nseindia.com",
		icon: "📈",
		tags: ["finance"],
		isCustom: false,
	},
	{
		id: "6",
		title: "Claude",
		url: "https://claude.ai",
		icon: "🤖",
		tags: ["ai"],
		isCustom: false,
	},
	{
		id: "7",
		title: "Vercel",
		url: "https://vercel.com",
		icon: "🚀",
		tags: ["dev"],
		isCustom: false,
	},
	{
		id: "8",
		title: "Linear",
		url: "https://linear.app",
		icon: "📋",
		tags: ["work"],
		isCustom: false,
	},
];

export function useQuickLinks() {
	const [links, setLinks] = useState<Link[]>(() => {
		try {
			const stored = localStorage.getItem("custom-links");
			if (stored) {
				return JSON.parse(stored);
			}
		} catch (e) {
			console.error("Failed to load custom links:", e);
		}
		return DEFAULT_LINKS;
	});

	useEffect(() => {
		localStorage.setItem("custom-links", JSON.stringify(links));
	}, [links]);

	const addLink = (link: Omit<Link, "id" | "isCustom">) => {
		const newLink: Link = {
			...link,
			id:
				crypto.randomUUID?.() ||
				`${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
			isCustom: true,
		};
		setLinks((prev) => [...prev, newLink]);
	};

	const removeLink = (id: string) => {
		setLinks((prev) => prev.filter((link) => link.id !== id));
	};

	const updateLink = (id: string, updates: Partial<Link>) => {
		setLinks((prev) =>
			prev.map((link) => (link.id === id ? { ...link, ...updates } : link)),
		);
	};

	return { links, addLink, removeLink, updateLink };
}
