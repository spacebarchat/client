// module.exports = {
// 	presets: ["@babel/preset-react", "module:metro-react-native-babel-preset"],
// 	plugins: [],
// };
module.exports = {
	presets: ["@babel/preset-react", "module:metro-react-native-babel-preset"],
	plugins: [
		["@babel/plugin-proposal-decorators", { legacy: true }],
		// ["@babel/plugin-proposal-class-properties", { loose: false }],
	],
	assumptions: {
		setPublicClassFields: false,
		// privateFieldsAsProperties: true,
	},
};
