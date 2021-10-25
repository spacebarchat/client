module.exports = {
	presets: ["@babel/preset-react", "module:metro-react-native-babel-preset"],
	plugins: [
		[
			"react-native-classname-to-dynamic-style",
			{
				extensions: ["css"],
			},
		],
		[
			"react-native-platform-specific-extensions",
			{
				extensions: ["css"],
			},
		],
	],
};
