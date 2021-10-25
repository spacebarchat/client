#!/usr/bin/env node
"use strict";
const path = require("path");
const fs = require("fs");
const postcss = require("postcss");
const tailwind = require("tailwindcss");
const build = require("tailwind-rn/build");
const tailwindConfig = require("../tailwind.config");

const source = `
@tailwind components;
@tailwind utilities;
`;

postcss([tailwind(tailwindConfig)])
	.process(source, { from: undefined })
	.then(({ css }) => {
		const styles = build(css);
		fs.writeFileSync(
			path.join(__dirname, "..", "src", "assets", "themes", "fosscord_tailwind.json"),
			JSON.stringify(styles, null, "\t")
		);
	})
	.catch((error) => {
		console.error("> Error occurred while generating styles");
		console.error(error.stack);
		process.exit(1);
	});
