var upstreamTransformer = require("metro-react-native-babel-transformer");
var sassTransformer = require("react-native-sass-transformer");
var postCSSTransformer = require("react-native-typed-postcss-transformer");

module.exports.transform = function ({ src, filename, options }) {
	if (filename.endsWith(".scss")) {
		return sassTransformer
			.renderToCSS({ src, filename, options })
			.then((css) => postCSSTransformer.transform({ src: css, filename, options }));
	} else if (filename.endsWith(".css")) {
		return postCSSTransformer.transform({ src, filename, options });
	} else {
		return upstreamTransformer.transform({ src, filename, options });
	}
};
