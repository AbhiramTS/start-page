import { useState, useEffect } from "react";
import type { DateTimeFormat } from "../types";

interface ClockProps {
	dateTimeFormat: DateTimeFormat;
	fontFamily: string;
	fontSize: number;
}

export function Clock({ dateTimeFormat, fontFamily, fontSize }: ClockProps) {
	const [time, setTime] = useState(new Date());

	useEffect(() => {
		const interval = setInterval(() => {
			setTime(new Date());
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: dateTimeFormat === "12h",
		});
	};

	const formatDate = (date: Date) => {
		return date.toLocaleDateString("en-US", {
			weekday: "long",
			month: "long",
			day: "numeric",
			year: "numeric",
		});
	};

	return (
		<div className="clock-block" style={{ fontFamily }}>
			<div id="clock" style={{ fontFamily, fontSize }}>
				{formatTime(time)}
			</div>
			<div id="datestr">{formatDate(time)}</div>
		</div>
	);
}
