import { useEffect, useRef } from "react";
import type { Theme } from "../types";

interface Blob {
	x: number;
	y: number;
	size: number;
	vx: number;
	vy: number;
	phase: number;
	speed: number;
	color: string;
}

interface BackgroundProps {
	theme: Theme;
}

export const Background = ({ theme }: BackgroundProps) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const isDark = theme === "dark";

		const lightPalette = [
			"rgba(96, 165, 250, 0.68)",
			"rgba(168, 85, 247, 0.60)",
			"rgba(244, 114, 182, 0.58)",
			"rgba(56, 189, 248, 0.52)",
			"rgba(251, 191, 36, 0.42)",
		];

		const darkPalette = [
			"rgba(59, 130, 246, 0.78)",
			"rgba(139, 92, 246, 0.72)",
			"rgba(236, 72, 153, 0.74)",
			"rgba(34, 197, 94, 0.60)",
			"rgba(14, 165, 233, 0.70)",
		];

		const palette = isDark ? darkPalette : lightPalette;

		const resizeCanvas = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);

		const blobs: Blob[] = [];
		const blobCount = 7;

		for (let i = 0; i < blobCount; i++) {
			blobs.push({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				size: 260 + Math.random() * 360,
				vx: 0,
				vy: 0,
				phase: Math.random() * Math.PI * 2,
				speed: 0.18 + Math.random() * 0.42,
				color: palette[i % palette.length],
			});
		}

		let animationId: number;
		let time = 0;

		const animate = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.globalCompositeOperation = isDark ? "screen" : "source-over";

			const baseGradient = ctx.createRadialGradient(
				canvas.width * 0.5,
				canvas.height * 0.35,
				0,
				canvas.width * 0.5,
				canvas.height * 0.5,
				Math.max(canvas.width, canvas.height) * 0.8,
			);
			if (isDark) {
				baseGradient.addColorStop(0, "rgba(15, 23, 42, 0.92)");
				baseGradient.addColorStop(0.42, "rgba(17, 24, 39, 0.62)");
				baseGradient.addColorStop(1, "rgba(5, 8, 22, 0.12)");
			} else {
				baseGradient.addColorStop(0, "rgba(186, 216, 255, 0.9)");
				baseGradient.addColorStop(0.42, "rgba(248, 214, 255, 0.76)");
				baseGradient.addColorStop(1, "rgba(219, 255, 239, 0.42)");
			}
			ctx.fillStyle = baseGradient;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			time += 0.007;

			blobs.forEach((blob, i) => {
				const offsetPhase = blob.phase + i * 0.8;

				blob.vx = Math.sin(time * blob.speed + offsetPhase) * 0.8;
				blob.vy = Math.cos(time * blob.speed * 0.82 + offsetPhase * 1.35) * 0.7;

				blob.x += blob.vx;
				blob.y += blob.vy;

				if (blob.x < -blob.size) blob.x = canvas.width + blob.size;
				if (blob.x > canvas.width + blob.size) blob.x = -blob.size;
				if (blob.y < -blob.size) blob.y = canvas.height + blob.size;
				if (blob.y > canvas.height + blob.size) blob.y = -blob.size;

				const gradient = ctx.createRadialGradient(
					blob.x,
					blob.y,
					0,
					blob.x,
					blob.y,
					blob.size,
				);
				gradient.addColorStop(0, blob.color);
				gradient.addColorStop(0.45, blob.color.replace(/0\.\d+\)$/, "0.18)"));
				gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

				ctx.fillStyle = gradient;
				ctx.fillRect(
					blob.x - blob.size,
					blob.y - blob.size,
					blob.size * 2,
					blob.size * 2,
				);
			});

			animationId = requestAnimationFrame(animate);
		};

		animate();

		return () => {
			window.removeEventListener("resize", resizeCanvas);
			cancelAnimationFrame(animationId);
		};
	}, [theme]);

	return <canvas ref={canvasRef} className="bg-canvas" aria-hidden="true" />;
};
