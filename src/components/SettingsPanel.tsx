interface SettingsPanelProps {
	isOpen: boolean;
	onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
	return (
		<>
			<div id="overlay" className={isOpen ? "show" : ""} onClick={onClose} />
			<div id="settings-panel" className={isOpen ? "open" : ""}>
				<div className="sp-head">
					<div className="sp-title">Settings</div>
					<button className="sp-close" onClick={onClose}>
						×
					</button>
				</div>
				<div className="sp-body">
					<p style={{ color: "var(--muted)", fontSize: "13px" }}>
						Settings panel - to be implemented in future tasks
					</p>
				</div>
			</div>
		</>
	);
}
