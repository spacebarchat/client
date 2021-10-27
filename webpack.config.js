const webpack = require("webpack");
const autoprefixer = require("autoprefixer");

var babelLoader = {
	loader: "babel-loader",
	query: {
		// configFile: false,
		babelrc: false,
		presets: [],
		plugins: ["react-hot-loader/babel", "@babel/plugin-syntax-dynamic-import"],
	},
};

module.exports = {
	entry: ["./src/polyfills", "react-hot-loader/patch", "./index.web.js"],
	devServer: {
		hot: true,
	},
	plugins: [new webpack.NamedModulesPlugin(), new webpack.HotModuleReplacementPlugin()],
	module: {
		rules: [
			{
				test: /\.ts(x?)$/,
				exclude: /node_modules/,
				use: [
					babelLoader,
					{
						loader: "ts-loader",
						options: {
							compilerOptions: {
								target: "es5",
								noEmit: false,
							},
						},
					},
				],
			},
			{
				test: /\.js(x?)$/,
				exclude: /node_modules/,
				...babelLoader,
			},
			{
				test: /\.(jpg|png|svg)$/,
				use: {
					loader: "file-loader",
					options: {
						name: "[path][name].[hash].[ext]",
					},
				},
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: "@teamthread/strict-css-modules-loader",
					},
					{
						loader: "style-loader",
					},
					{
						loader: "dts-css-modules-loader",
						options: {
							namedExport: true,
							camelCase: true,
							modules: true,
							localIdentName: "[path]___[name]__[local]___[hash:base64:5]",
						},
					},
					{
						loader: "css-loader",
						options: {
							modules: {
								exportLocalsConvention: "camelCaseOnly",
								localIdentName: "[path]___[name]__[local]___[hash:base64:5]",
							},
						},
					},
					{
						loader: "postcss-loader",
						options: {
							plugins: () => [autoprefixer()],
						},
					},
				],
			},
			{
				test: /\.scss$/,
				use: [
					{
						loader: "@teamthread/strict-css-modules-loader",
					},
					{
						loader: "style-loader",
					},
					{
						loader: "dts-css-modules-loader",
						options: {
							namedExport: true,
							camelCase: true,
							modules: true,
							localIdentName: "[path]___[name]__[local]___[hash:base64:5]",
						},
					},
					{
						loader: "css-loader",
						options: {
							modules: {
								exportLocalsConvention: "camelCaseOnly",
								localIdentName: "[path]___[name]__[local]___[hash:base64:5]",
							},
						},
					},
					{
						loader: "postcss-loader",
						options: {
							plugins: () => [autoprefixer()],
						},
					},
					{
						loader: "sass-loader",
					},
				],
			},
		],
	},
	resolve: {
		alias: {
			"react-native": "react-native-web",
		},
		extensions: [".ts", ".web.tsx", ".tsx", ".js", ".jsx"],
		mainFields: ["browser", "main"],
	},
};
