import { esbuildCommonjs } from "@originjs/vite-plugin-commonjs";
import replace from "@rollup/plugin-replace";
import react from "@vitejs/plugin-react";
import { readFileSync } from "fs";
import { internalIpV4 } from "internal-ip";
import { resolve } from "path";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

function getGitRevision() {
	try {
		const rev = readFileSync(".git/HEAD").toString().trim();
		if (rev.indexOf(":") === -1) {
			return rev;
		}

		return readFileSync(`.git/${rev.substring(5)}`)
			.toString()
			.trim();
	} catch (err) {
		console.error("Failed to get Git revision.");
		return "?";
	}
}

function getGitBranch() {
	try {
		const rev = readFileSync(".git/HEAD").toString().trim();
		if (rev.indexOf(":") === -1) {
			return "DETACHED";
		}

		return rev.split("/").pop();
	} catch (err) {
		console.error("Failed to get Git branch.");
		return "?";
	}
}

function getVersion() {
	return JSON.parse(readFileSync("package.json").toString()).version;
}

const mobile = !!/android|ios/.exec(process.env.TAURI_PLATFORM);

// https://vitejs.dev/config/
export default defineConfig(async () => ({
	plugins: [
		react(),
		svgr(),
		replace({
			__GIT_REVISION__: getGitRevision(),
			__GIT_BRANCH__: getGitBranch(),
			__APP_VERSION__: getVersion(),
			preventAssignment: true,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		}) as any,
	],

	// Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
	//
	// 1. prevent vite from obscuring rust errors
	clearScreen: false,
	// 2. tauri expects a fixed port, fail if that port is not available
	server: {
		host: mobile ? "0.0.0.0" : false,
		port: 1420,
		hmr: mobile
			? {
					protocol: "ws",
					host: await internalIpV4(),
					port: 1421,
			  }
			: undefined,
		strictPort: true,
	},
	optimizeDeps: {
		esbuildOptions: {
			plugins: [esbuildCommonjs(["react-moment"])],
		},
	},
	// 3. to make use of `TAURI_DEBUG` and other env variables
	// https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
	envPrefix: ["VITE_", "TAURI_"],
	build: {
		sourcemap: true,
		rollupOptions: {
			input: {
				main: resolve(__dirname, "index.html"),
			},
			output: {
				dir: "build",
				chunkFileNames: "[hash:20].js",
			},
		},
	},
}));
