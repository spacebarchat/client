import { esbuildCommonjs } from "@originjs/vite-plugin-commonjs";
import replace from "@rollup/plugin-replace";
import react from "@vitejs/plugin-react";
import { readFileSync } from "fs";
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

export default defineConfig({
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
	optimizeDeps: {
		esbuildOptions: {
			plugins: [esbuildCommonjs(["react-moment"])],
		},
	},
	build: {
		sourcemap: true,
		rollupOptions: {
			input: {
				main: resolve(__dirname, "index.html"),
			},
			output: {
				dir: "build",
				chunkFileNames: "[hash:20].js",
				entryFileNames: "[hash:20].js",
				inlineDynamicImports: false,
				experimentalMinChunkSize: 500_000,
				manualChunks(id) {
					if (id.includes("node_modules")) {
						return id.toString().split("node_modules/")[1].split("/")[0].toString();
					}
				},
			},
		},
	},
});
