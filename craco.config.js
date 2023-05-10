const CracoEsbuildPlugin = require("craco-esbuild");

module.exports = {
	plugins: [
		{
			plugin: CracoEsbuildPlugin,
			options: {
				esbuildMinimizerOptions: {
					target: "ESNext",
				},
				esbuildLoaderOptions: {
					loader: "tsx",
					target: "ESNext",
				},
			},
		},
	],
};
