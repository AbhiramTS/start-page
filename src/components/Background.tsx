import { useEffect, useRef } from "react";

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

export const Background = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const isDark = document.body.getAttribute("data-theme") === "dark";

		const lightPalette = [
			"rgba(147, 197, 253, 0.35)",
			"rgba(196, 181, 253, 0.32)",
			"rgba(252, 231, 243, 0.38)",
			"rgba(167, 243, 208, 0.30)",
		];

		const darkPalette = [
			"rgba(59, 130, 246, 0.45)",
			"rgba(139, 92, 246, 0.42)",
			"rgba(236, 72, 153, 0.48)",
			"rgba(34, 197, 94, 0.40)",
		];

		const palette = isDark ? darkPalette : lightPalette;

		const resizeCanvas = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);

		const blobs: Blob[] = [];
		const blobCount = 5;

		for (let i = 0; i < blobCount; i++) {
			blobs.push({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				size: 200 + Math.random() * 300,
				vx: 0,
				vy: 0,
				phase: Math.random() * Math.PI * 2,
				speed: 0.3 + Math.random() * 0.4,
				color: palette[i % palette.length],
			});
		}

		let animationId: number;
		let time = 0;

		const animate = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			time += 0.008;

			blobs.forEach((blob, i) => {
				const offsetPhase = blob.phase + i * 0.7;

				blob.vx = Math.sin(time * blob.speed + offsetPhase) * 0.5;
				blob.vy = Math.cos(time * blob.speed * 0.8 + offsetPhase * 1.3) * 0.4;

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
	}, []);

	return <canvas ref={canvasRef} className="bg-canvas" aria-hidden="true" />;
};
