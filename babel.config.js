// module.exports = {
// 	presets: ["@babel/preset-react", "module:metro-react-native-babel-preset"],
// 	plugins: [],
// };
module.exports = {
	presets: ["@babel/env", "@babel/react"],
	plugins: ["@babel/plugin-proposal-class-properties"],
};

/*
function loadCSS() {
	return {
		visitor: {
			ImportDeclaration: {
				exit(path, state) {
					const givenPath = path.node.source.value;
					let reference = state && state.file && state.file.opts.filename;
					const extensions = state && state.opts && state.opts.extensions;
				},
			},
		},
	};
},
*/
