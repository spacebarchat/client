// adapted from Revite
// https://github.com/revoltchat/revite/blob/fe63c6633f32b54aa1989cb34627e72bb3377efd/src/components/markdown/RemarkRenderer.tsx

import React from "react";
import * as prod from "react/jsx-runtime";
import rehypePrism from "rehype-prism";
import rehypeReact from "rehype-react";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import styled from "styled-components";
import { unified } from "unified";
import Link from "../Link";
import { MarkdownProps } from "./Markdown";
import RenderCodeblock from "./plugins/Codeblock";
import "./prism";

/**
 * Null element
 */
const Null: React.FC = () => null;

/**
 * Custom Markdown components
 */
const components = {
	// emoji: RenderEmoji,
	// mention: RenderMention,
	// spoiler: RenderSpoiler,
	// channel: RenderChannel,
	a: Link,
	p: styled.p`
		margin: 0;

		> code {
			padding: 1px 4px;
			flex-shrink: 0;
		}
	`,
	h1: styled.h1`
		margin: 0.2em 0;
	`,
	h2: styled.h2`
		margin: 0.2em 0;
	`,
	h3: styled.h3`
		margin: 0.2em 0;
	`,
	h4: styled.h4`
		margin: 0.2em 0;
	`,
	h5: styled.h5`
		margin: 0.2em 0;
	`,
	h6: styled.h6`
		margin: 0.2em 0;
	`,
	pre: RenderCodeblock,
	code: styled.code`
		color: var(--text);
		background: var(--background-secondary);

		font-size: 90%;
		font-family: var(--font-family-code);

		border-radius: 4px;
		box-decoration-break: clone;
	`,
	table: styled.table`
		border-collapse: collapse;

		th,
		td {
			padding: 6px;
			border: 1px solid var(--background-teritary);
		}
	`,
	ul: styled.ul`
		list-style-position: inside;
		padding: 0;
		margin: 0.2em 0;
	`,
	ol: styled.ol`
		list-style-position: inside;
		padding: 0;
		margin: 0.2em 0;
	`,

	blockquote: styled.blockquote`
		margin: 2px 0;
		padding: 2px 0;
		background: red;
		border-radius: 4px;
		border-inline-start: 4px solid var(--background-teritary);

		> * {
			margin: 0 8px;
		}
	`,
	// Block image elements
	img: Null,
	// Catch literally everything else just in case
	video: Null,
	figure: Null,
	picture: Null,
	source: Null,
	audio: Null,
	script: Null,
	style: Null,
};

const render = unified()
	.use(remarkParse)
	.use(remarkGfm)
	.use(remarkRehype)
	.use(rehypePrism)
	// @ts-expect-error typescript doesn't like this
	.use(rehypeReact, { Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs, components });

/**
 * Regex for matching execessive recursion of blockquotes and lists
 */
const RE_RECURSIVE = /(^(?:[>*+-][^\S\r\n]*){5})(?:[>*+-][^\S\r\n]*)+(.*$)/gm;

/**
 * Regex for matching multi-line blockquotes
 */
const RE_BLOCKQUOTE = /^([^\S\r\n]*>[^\n]+\n?)+/gm;

/**
 * Regex for matching HTML tags
 */
const RE_HTML_TAGS = /^(<\/?[a-zA-Z0-9]+>)(.*$)/gm;

/**
 * Regex for matching empty lines
 */
const RE_EMPTY_LINE = /^\s*?$/gm;

/**
 * Regex for matching line starting with plus
 */
const RE_PLUS = /^\s*\+(?:$|[^+])/gm;

/**
 * Sanitise Markdown input before rendering
 * @param content Input string
 * @returns Sanitised string
 */
function sanitize(content: string) {
	return (
		content
			// Strip excessive blockquote or list indentation
			.replace(RE_RECURSIVE, (_, m0, m1) => m0 + m1)

			// Append empty character if string starts with html tag
			// This is to avoid inconsistencies in rendering Markdown inside/after HTML tags
			// https://github.com/revoltchat/revite/issues/733
			.replace(RE_HTML_TAGS, (match) => `\u200E${match}`)

			// Append empty character if line starts with a plus
			// which would usually open a new list but we want
			// to avoid that behaviour in our case.
			.replace(RE_PLUS, (match) => `\u200E${match}`)

			// Replace empty lines with non-breaking space
			// because remark renderer is collapsing empty
			// or otherwise whitespace-only lines of text
			.replace(RE_EMPTY_LINE, "‎")

			// Ensure empty line after blockquotes for correct rendering
			.replace(RE_BLOCKQUOTE, (match) => `${match}\n`)
	);
}

export default React.memo(({ content }: MarkdownProps) => {
	const sanitizedContent = React.useMemo(() => sanitize(content), [content]);

	const [parsedContent, setParsedContent] = React.useState<React.ReactElement>(null!);

	React.useEffect(() => {
		render.process(sanitizedContent).then((file) => setParsedContent(file.result));
	}, [sanitizedContent]);

	return parsedContent;
});
