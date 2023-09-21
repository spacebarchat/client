import React from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import remarkGfm from "remark-gfm";
import styled from "styled-components";
import CodeBlock from "../Codeblock";
import Link from "../Link";
import { MarkdownProps } from "./Markdown";
import style from "./style";

const Container = styled.div`
	// remove the excessive left padding, and margin in lists
	ul,
	ol {
		padding: 0 0 0 15px;
		margin: 0;
	}

	blockquote {
		margin: 2px 0;
		padding: 5px;
		background-color: var(--background-secondary);
		width: fit-content;
		border-radius: 4px;
		border-inline-start: 4px solid var(--background-tertiary);
	}

	code.inline {
		background-color: var(--background-secondary);
		padding: 2px 4px;
		border-radius: 4px;
		font-size: 80%;
		font-family: var(--font-family-code);
	}

	code {
		font-size: 85%;
	}

	.syntaxHighlighter {
		// remove excessive left "padding" in line numbers
		.linenumber {
			min-width: 0 !important;
		}

		// append vertical pipe to line numbers
		.linenumber::after {
			content: " |";
		}
	}
`;

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

	return (
		<Container>
			<ReactMarkdown
				remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
				children={sanitizedContent}
				// @ts-expect-error type issue
				components={{
					code({ node, inline, className, children, ...props }) {
						const match = /language-(\w+)/.exec(className || "");
						return !inline ? (
							<CodeBlock lang={match ? match[1] : undefined}>
								<SyntaxHighlighter
									className="syntaxHighlighter"
									children={String(children).replace(/\n$/, "")}
									language={match ? match[1] : undefined}
									// @ts-expect-error type issue
									style={style}
									showLineNumbers={true}
									showInlineLineNumbers={true}
									PreTag="div"
								/>
							</CodeBlock>
						) : (
							<code className="inline" {...props}>
								{children}
							</code>
						);
					},
					a({ node, href, children, ...props }) {
						return (
							<Link href={href} target="_blank" rel="noopener noreferrer" {...props}>
								{children}
							</Link>
						);
					},
					blockquote({ node, children }) {
						return <blockquote>{children}</blockquote>;
					},
				}}
			/>
		</Container>
	);
});
