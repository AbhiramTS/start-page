import { useMemo, useState } from "react";
import { useSharedPreferences } from "../contexts/PreferencesContext";
import type { FontSection, Link } from "../types";

interface SettingsPanelProps {
	isOpen: boolean;
	onClose: () => void;
	fontFamily: string;
	fontSize: number;
}

const SECTION_LABELS: Record<FontSection, string> = {
	clock: "Clock",
	search: "Search",
	quickLinks: "Quick links",
	settings: "Settings",
};
const SAMPLE_FONT_URL =
	"https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap";

export function SettingsPanel({
	isOpen,
	onClose,
	fontFamily,
	fontSize,
}: SettingsPanelProps) {
	const {
		preferences,
		updateTheme,
		updateDefaultSearchEngineIndex,
		updateDateTimeFormat,
		updateQuickLinks,
		importFont,
		removeFont,
		assignFont,
		updateFontSize,
		resetToDefaults,
	} = useSharedPreferences();
	const [newLinkTitle, setNewLinkTitle] = useState("");
	const [newLinkUrl, setNewLinkUrl] = useState("");
	const [newLinkTag, setNewLinkTag] = useState("");
	const [fontUrl, setFontUrl] = useState("");
	const [fontImportError, setFontImportError] = useState("");

	const canAddLink = newLinkTitle.trim() && newLinkUrl.trim();

	const sections = useMemo(
		() => Object.keys(SECTION_LABELS) as FontSection[],
		[],
	);

	const handleAddQuickLink = () => {
		if (!canAddLink) return;
		const next: Link = {
			id: crypto.randomUUID?.() || `${Date.now()}`,
			title: newLinkTitle.trim(),
			url: newLinkUrl.trim(),
			icon: "🔗",
			tags: newLinkTag.trim() ? [newLinkTag.trim()] : [],
			isCustom: true,
		};
		updateQuickLinks([...preferences.quickLinks, next]);
		setNewLinkTitle("");
		setNewLinkUrl("");
		setNewLinkTag("");
	};

	const handleImportFont = () => {
		const ok = importFont(fontUrl);
		if (!ok) {
			setFontImportError(
				"Enter a valid Google Fonts CSS URL or a fonts.google.com/share URL.",
			);
			return;
		}
		setFontImportError("");
		setFontUrl("");
	};

	return (
		<>
			<div id="overlay" className={isOpen ? "show" : ""} onClick={onClose} />
			<div
				id="settings-panel"
				className={isOpen ? "open" : ""}
				style={{ fontFamily, fontSize }}
			>
				<div className="sp-head">
					<div className="sp-title">Settings</div>
					<button className="sp-close" onClick={onClose}>
						×
					</button>
				</div>
				<div className="sp-body">
					<section className="sp-section">
						<h3 className="sp-section-title">Theme</h3>
						<div className="sp-inline">
							<button
								className={`sp-chip ${preferences.theme === "light" ? "active" : ""}`}
								onClick={() => updateTheme("light")}
								type="button"
							>
								Light
							</button>
							<button
								className={`sp-chip ${preferences.theme === "dark" ? "active" : ""}`}
								onClick={() => updateTheme("dark")}
								type="button"
							>
								Dark
							</button>
						</div>
					</section>

					<section className="sp-section">
						<h3 className="sp-section-title">Search Engine</h3>
						<label className="sp-label" htmlFor="default-engine">
							Default engine
						</label>
						<select
							id="default-engine"
							className="sp-select"
							value={preferences.defaultSearchEngineIndex}
							onChange={(e) => updateDefaultSearchEngineIndex(Number(e.target.value))}
						>
							{preferences.searchEngines.map((engine, index) => (
								<option key={engine.name} value={index}>
									{engine.name}
								</option>
							))}
						</select>
					</section>

					<section className="sp-section">
						<h3 className="sp-section-title">Date & Time</h3>
						<div className="sp-inline">
							<button
								className={`sp-chip ${preferences.dateTimeFormat === "12h" ? "active" : ""}`}
								onClick={() => updateDateTimeFormat("12h")}
								type="button"
							>
								12h
							</button>
							<button
								className={`sp-chip ${preferences.dateTimeFormat === "24h" ? "active" : ""}`}
								onClick={() => updateDateTimeFormat("24h")}
								type="button"
							>
								24h
							</button>
						</div>
					</section>

					<section className="sp-section">
						<h3 className="sp-section-title">Quick Links</h3>
						<div className="sp-form-grid">
							<input
								className="sp-input"
								placeholder="Title"
								value={newLinkTitle}
								onChange={(e) => setNewLinkTitle(e.target.value)}
							/>
							<input
								className="sp-input"
								placeholder="URL"
								value={newLinkUrl}
								onChange={(e) => setNewLinkUrl(e.target.value)}
							/>
							<input
								className="sp-input"
								placeholder="Tag (optional)"
								value={newLinkTag}
								onChange={(e) => setNewLinkTag(e.target.value)}
							/>
							<button
								type="button"
								className="sp-btn"
								disabled={!canAddLink}
								onClick={handleAddQuickLink}
							>
								Add link
							</button>
						</div>
						<div className="sp-list">
							{preferences.quickLinks.map((link) => (
								<div key={link.id} className="sp-list-item">
									<div className="sp-list-text">
										<strong>{link.title}</strong>
										<span>{link.url}</span>
									</div>
									<button
										type="button"
										className="sp-btn subtle"
										onClick={() =>
											updateQuickLinks(
												preferences.quickLinks.filter((item) => item.id !== link.id),
											)
										}
									>
										Remove
									</button>
								</div>
							))}
						</div>
					</section>

					<section className="sp-section">
						<h3 className="sp-section-title">Fonts</h3>
						<label className="sp-label" htmlFor="font-url">
							Add Google Fonts CSS URL
						</label>
						<div className="sp-sample-row">
							<span className="sp-sample-text">{SAMPLE_FONT_URL}</span>
							<button
								type="button"
								className="sp-btn subtle"
								onClick={() => setFontUrl(SAMPLE_FONT_URL)}
							>
								Use sample URL
							</button>
						</div>
						<div className="sp-inline">
							<input
								id="font-url"
								className="sp-input"
								placeholder="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"
								value={fontUrl}
								onChange={(e) => setFontUrl(e.target.value)}
							/>
							<button type="button" className="sp-btn" onClick={handleImportFont}>
								Import
							</button>
						</div>
						{fontImportError && <p className="sp-error">{fontImportError}</p>}
						{preferences.importedFonts.length > 0 && (
							<div className="sp-list">
								{preferences.importedFonts.map((font) => (
									<div key={font.id} className="sp-list-item">
										<div className="sp-list-text">
											<strong>{font.family}</strong>
											<span>{font.cssUrl}</span>
										</div>
										<button
											type="button"
											className="sp-btn subtle"
											onClick={() => removeFont(font.id)}
										>
											Remove
										</button>
									</div>
								))}
							</div>
						)}
						<div className="sp-typography-grid">
							{sections.map((section) => (
								<div className="sp-typography-row" key={section}>
									<label className="sp-label">{SECTION_LABELS[section]}</label>
									<select
										className="sp-select"
										value={preferences.fontAssignments[section] || "default"}
										onChange={(e) => assignFont(section, e.target.value)}
									>
										<option value="default">Default</option>
										{preferences.importedFonts.map((font) => (
											<option key={font.id} value={font.id}>
												{font.family}
											</option>
										))}
									</select>
									<input
										className="sp-input"
										type="number"
										min={8}
										max={160}
										step={1}
										value={preferences.fontSizes[section]}
										onChange={(e) => {
											const next = Number(e.target.value);
											if (Number.isFinite(next)) {
												updateFontSize(section, next);
											}
										}}
									/>
								</div>
							))}
						</div>
					</section>

					<div className="sp-actions">
						<button type="button" className="sp-btn subtle" onClick={resetToDefaults}>
							Reset all
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
