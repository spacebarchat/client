import { parseEmojiString } from "@/utils/emojiParser";
import Link from "@components/Link";
import { FormattingPatterns } from "@spacebarchat/spacebar-api-types/v9";
import Marked, { ReactRenderer } from "marked-react";
import React from "react";
import reactStringReplace from "react-string-replace";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import styled from "styled-components";
import EmojiRenderer from "../EmojiRenderer";
import CodeBlock from "./components/Codeblock";
import Mention from "./components/Mention";
import Spoiler from "./components/Spoiler";
import Timestamp from "./components/Timestamp";
import { MarkdownProps } from "./Markdown";

const Container = styled.div`
	// remove the excessive left padding, and margin in lists
	ul,
	ol {
		padding: 0 0 0 15px;
		margin: 0;
	}

	blockquote {
		margin: 2px 0;
		padding: 5px 15px;
		background-color: transparent;
		width: fit-content;
		border-radius: 4px;
		border-inline-start: 4px solid var(--interactive);
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

const customRenderer: Partial<ReactRenderer> = {
	code: (content: string, lang: string) => (
		<CodeBlock lang={lang}>
			<SyntaxHighlighter
				className="syntaxHighlighter"
				children={content}
				language={lang}
				style={materialDark}
				showLineNumbers={true}
				showInlineLineNumbers={true}
				PreTag="div"
			/>
		</CodeBlock>
	),
	codespan: (content: string) => <code className="inline">{content}</code>,
	link: (href, text) => (
		<Link href={href} target="_blank" rel="noreferrer noopener">
			{text}
		</Link>
	),
	// prevent renderer from wrapping everything in a <p> tag
	paragraph: (content: React.ReactNode[]) => {
		if (
			content.length === 1 &&
			Array.isArray(content[0]) &&
			content[0].length === 1 &&
			typeof content[0][0] === "string"
		) {
			return <span>{content}</span>;
		}

		return <>{content}</>;
	},
	text: (text: string) => {
		let replaced: string | React.ReactNode[] = text;
		const SpoilerRegex = /\|\|(?<content>[\s\S]+?)\|\|/;

		const emojiParts = parseEmojiString(text);
		if (emojiParts.length > 1 || (emojiParts.length === 1 && typeof emojiParts[0] !== "string")) {
			replaced = emojiParts.map((part, index) => {
				if (typeof part === "string") {
					return part;
				}
				return <EmojiRenderer key={`emoji-${index}`} emoji={part} />;
			});
		}

		replaced = reactStringReplace(replaced, SpoilerRegex, (match, i) => {
			return <Spoiler key={`spoiler-${i}`} children={match} />;
		});

		replaced = reactStringReplace(replaced, FormattingPatterns.DefaultStyledTimestamp, (match, i) => (
			<Timestamp key={`timestamp-${i}`} timestamp={match} />
		));

		replaced = reactStringReplace(replaced, /<t:-?(\d{1,13}:[tTdDfFR])>/, (match, i) => {
			const parts = match.split(":");
			const timestamp = parts[0];
			const style = parts[1];

			return <Timestamp key={`timestamp-styled-${i}`} timestamp={timestamp} style={style} />;
		});

		replaced = reactStringReplace(replaced, FormattingPatterns.Channel, (match, i) => (
			<Mention key={`channel-${i}`} type="channel" id={match} />
		));

		replaced = reactStringReplace(replaced, FormattingPatterns.User, (match, i) => (
			<Mention key={`user-${i}`} type="user" id={match} />
		));

		replaced = reactStringReplace(replaced, FormattingPatterns.Role, (match, i) => (
			<Mention key={`role-${i}`} type="role" id={match} />
		));

		replaced = reactStringReplace(replaced, /(@everyone|@here)/, (match, i) => (
			<Mention key={`mention-${i}`} type="text" id={match} />
		));

		return replaced;
	},
};

export default React.memo(({ content }: MarkdownProps) => {
	const sanitizedContent = React.useMemo(() => sanitize(content), [content]);

	return (
		<Container>
			<Marked breaks gfm openLinksInNewTab renderer={customRenderer}>
				{sanitizedContent}
			</Marked>
		</Container>
	);
});
