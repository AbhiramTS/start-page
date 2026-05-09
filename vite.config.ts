import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	base: "/start_page/",
	server: {
		watch: {
			// Use polling to ensure file-change events are reliably detected in shared/mounted filesystems
			usePolling: true,
			interval: 100,
		},
	},
});
