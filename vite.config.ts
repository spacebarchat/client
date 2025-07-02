import replace from "@rollup/plugin-replace";
// import react from "@vitejs/plugin-react";
import react from "@vitejs/plugin-react-swc";
import fs, { readFileSync } from "fs";
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

const PATH_ALIASES = {
	"@": path.resolve(__dirname, "src"),
	"@utils": path.resolve(__dirname, "src", "utils"),
	"@components": path.resolve(__dirname, "src", "components"),
	"@assets": path.resolve(__dirname, "src", "assets"),
	"@modals": path.resolve(__dirname, "src", "modals"),
	"@pages": path.resolve(__dirname, "src", "pages"),
	"@stores": path.resolve(__dirname, "src", "stores"),
	"@hooks": path.resolve(__dirname, "src", "hooks"),
	"@contexts": path.resolve(__dirname, "src", "contexts"),
	"@structures": path.resolve(__dirname, "src", "stores", "objects"),
};

const host = process.env.TAURI_DEV_HOST;
const isDevBuild = !!process.env.VITE_ENV_DEV || !!process.env.TAURI_ENV_DEBUG;

console.log(`Sourcemaps: ${isDevBuild}`);
console.log(`Minification: ${isDevBuild ? false : "esbuild"}`);
console.log(
	`Target: ${
		process.env.TAURI_ENV_PLATFORM !== undefined
			? process.env.TAURI_ENV_PLATFORM == "windows"
				? "chrome105"
				: "safari13"
			: "modules"
	}`,
);

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: PATH_ALIASES,
	},
	plugins: [
		cleanPlugin(),
		reactVirtualized(),
		react({ tsDecorators: true /*, plugins: [["@swc/plugin-styled-components", {}]]*/ }),
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
	// prevent vite from obscuring rust errors
	clearScreen: false,
	server: {
		// Tauri expects a fixed port, fail if that port is not available
		host: host || false,
		port: 1420,
		hmr: host
			? {
					protocol: "ws",
					host: host,
					port: 1430,
			  }
			: undefined,
		// Tauri expects a fixed port, fail if that port is not available
		strictPort: true,
	},

	// Env variables starting with the item of `envPrefix` will be exposed in tauri's source code through `import.meta.env`.
	// https://v2.tauri.app/reference/config/buildconfig.beforedevcommand
	envPrefix: ["VITE_", "TAURI_"],
	build: {
		outDir: "dist",
		// produce sourcemaps for debug builds
		sourcemap: isDevBuild,
		// don't minify for debug builds
		minify: isDevBuild ? false : "esbuild",
		// Tauri uses Chromium on Windows and WebKit on macOS and Linux
		target:
			process.env.TAURI_ENV_PLATFORM !== undefined
				? process.env.TAURI_ENV_PLATFORM == "windows"
					? "chrome105"
					: "safari15"
				: "modules",
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
});

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
