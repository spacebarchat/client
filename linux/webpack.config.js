const path = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const spawn = require("child_process").spawn;

const mode = "production";
process.env.NODE_ENV = mode;
process.env.BABEL_ENV = mode;

module.exports = (env, argv) => {
	const config = {
		mode: mode,
		entry: [path.join(__dirname, "..", "index.js")],
		target: "node",
		output: {
			path: path.resolve(__dirname, "dist"),
			filename: "index.js",
		},
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					use: "ts-loader",
				},
				{
					test: /\.jsx?$/,
					use: {
						loader: "babel-loader",
						options: { cacheDirectory: true, cacheCompression: false },
					},
				},
				{
					test: /\.(png|jpe?g|gif|svg|bmp)$/i,
					use: [{ loader: "file-loader" }],
				},
				{
					test: /\.node/i,
					use: [{ loader: "node-loader" }, { loader: "file-loader" }],
				},
			],
		},
		plugins: [
			new webpack.NormalModuleReplacementPlugin(
				/react-native/g,
				"valence-native"
			),
		],
		// plugins: [
		// 	{
		// 		apply: (compiler) => {
		// 			let instance = null;
		// 			compiler.hooks.afterEmit.tap("AfterEmitPlugin", (compilation) => {
		// 				if (instance) {
		// 					return;
		// 				}
		// 				instance = spawn("npm", ["run", "webpackRun"]);
		// 				instance.stdout.on("data", function (data) {
		// 					console.log(data.toString());
		// 				});

		// 				instance.stderr.on("data", function (data) {
		// 					console.log(data.toString());
		// 				});

		// 				instance.on("exit", function (code) {
		// 					console.log("child process exited with code " + code.toString());
		// 					process.exit(code);
		// 				});
		// 			});
		// 		},
		// 	},
		// ],
		resolve: {
			extensions: [".tsx", ".ts", ".js", ".jsx", ".json"],
			alias: {
				"react-native$": "valence-native",
			},
		},
		externals: [nodeExternals()],
		// externals: [
		// 	nodeExternals({
		// 		whitelist: ["webpack/hot/dev-server", "webpack/hot/poll?100"],
		// 	}),
		// ],
	};

	if (argv.mode === "development") {
		config.mode = "development";
		config.plugins.push(new webpack.HotModuleReplacementPlugin());
		config.devtool = "source-map";
		config.watch = true;
		config.stats = "errors-only";
		config.entry.unshift("webpack/hot/poll?100");
	}

	return config;
};
