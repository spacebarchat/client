const CracoEsbuildPlugin = require("craco-esbuild");

module.exports = {
	plugins: [
		{
			plugin: CracoEsbuildPlugin,
			options: {
				esbuildMinimizerOptions: {
					target: "ES2020",
				},
				esbuildLoaderOptions: {
					loader: "tsx",
					target: "ES2020",
				},
			},
		},
	],
};
