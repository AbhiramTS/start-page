export type Theme = "light" | "dark";

export interface Link {
	id: string;
	title: string;
	url: string;
	icon?: string;
	tags?: string[];
	isCustom: boolean;
}
