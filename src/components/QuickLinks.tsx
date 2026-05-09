import type { Link } from "../types";
import { SiteIcon } from "./SiteIcon";

interface QuickLinksProps {
	links: Link[];
	fontFamily: string;
	fontSize: number;
}

const CARD_COLORS = [
	"#f87171",
	"#fb923c",
	"#fbbf24",
	"#a3e635",
	"#34d399",
	"#22d3ee",
	"#818cf8",
	"#e879f9",
	"#f472b6",
	"#94a3b8",
];

export function QuickLinks({ links, fontFamily, fontSize }: QuickLinksProps) {
	const getCardColor = (index: number) => {
		return CARD_COLORS[index % CARD_COLORS.length];
	};

	return (
		<div className="links-block" style={{ fontFamily, fontSize }}>
			<div className="links-header">
				<div className="links-label">Quick access</div>
			</div>
			<div id="links-grid">
				{links.map((link, index) => (
					<a
						key={link.id}
						href={link.url}
						className="link-card has-tooltip"
						aria-label={`Open ${link.title}`}
						data-tooltip={`Open ${link.title}`}
						style={{ "--card-color": getCardColor(index) } as React.CSSProperties}
					>
						<SiteIcon
							url={link.url}
							label={link.title}
							className="card-icon"
							size={20}
							fallbackGlyph={link.icon}
						/>
						<div className="card-text">
							<div className="card-name">{link.title}</div>
							{link.tags && link.tags.length > 0 && (
								<div className="card-tag">{link.tags[0]}</div>
							)}
						</div>
					</a>
				))}
			</div>
		</div>
	);
}
