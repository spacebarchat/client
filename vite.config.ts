import replace from "@rollup/plugin-replace";
import react from "@vitejs/plugin-react";
import fs, { readFileSync } from "fs";
import { internalIpV4 } from "internal-ip";
import path, { resolve } from "path";
import type { Plugin } from "vite";
import { defineConfig } from "vite";
import { chunkSplitPlugin } from "vite-plugin-chunk-split";
import cleanPlugin from "vite-plugin-clean";
import progress from "vite-plugin-progress";
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
		cleanPlugin(),
		reactVirtualized(),
		react(),
		svgr(),
		chunkSplitPlugin({
			strategy: "unbundle",
		}),
		progress(),
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

	// 3. to make use of `TAURI_DEBUG` and other env variables
	// https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
	envPrefix: ["VITE_", "TAURI_"],
	build: {
		outDir: "build",
		sourcemap: true,
		rollupOptions: {
			input: {
				main: resolve(__dirname, "index.html"),
			},
			output: {
				entryFileNames: "asset/[hash:20].js",
				chunkFileNames: "asset/[hash:20].js",
				assetFileNames: "asset/[hash:20].[ext]",
			},
		},
	},
}));

const WRONG_CODE = `import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";`;
export function reactVirtualized(): Plugin {
	return {
		name: "flat:react-virtualized",
		// Note: we cannot use the `transform` hook here
		//       because libraries are pre-bundled in vite directly,
		//       plugins aren't able to hack that step currently.
		//       so instead we manually edit the file in node_modules.
		//       all we need is to find the timing before pre-bundling.
		configResolved() {
			const file = path.join(
				"node_modules",
				"react-virtualized",
				"dist",
				"es",
				"WindowScroller",
				"utils",
				"onScroll.js",
			);

			const code = fs.readFileSync(file, "utf-8");
			const modified = code.replace(WRONG_CODE, "");
			fs.writeFileSync(file, modified);
		},
	};
}
