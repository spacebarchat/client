// adapted from Revite
// https://github.com/revoltchat/revite/blob/fe63c6633f32b54aa1989cb34627e72bb3377efd/src/components/markdown/plugins/Codeblock.tsx

import React from "react";
import styled from "styled-components";
import Tooltip from "../../Tooltip";

/**
 * Base codeblock styles
 */
const Base = styled.pre`
	padding: 1em;
	overflow-x: scroll;
	background: var(--background-secondary);
	border-radius: 4px;
`;

/**
 * Copy codeblock contents button styles
 */
const Lang = styled.div`
	width: fit-content;
	position: absolute;
	right: 60px;

	a {
		color: var(--text);
		cursor: pointer;
		padding: 2px 6px;
		font-weight: 600;
		user-select: none;
		display: inline-block;
		background: var(--background-tertiary);

		font-size: 10px;
		text-transform: uppercase;
	}
`;

interface Props {
	class?: string;
	children: React.ReactNode;
}

/**
 * Render a codeblock with copy text button
 */

function RenderCodeblock(props: Props) {
	const ref = React.useRef<HTMLPreElement>(null);

	let text = "Copy";
	if (props.class) {
		text = props.class.split("-")[1];
	}

	const onCopy = React.useCallback(() => {
		const text = ref.current?.querySelector("code")?.innerText;
		text && navigator.clipboard.writeText(text);
	}, [ref]);

	return (
		<Base ref={ref}>
			<Lang>
				<Tooltip title="Copy to Clipboard" placement="top">
					<a onClick={onCopy}>{text}</a>
				</Tooltip>
			</Lang>
			{props.children}
		</Base>
	);
}

export default RenderCodeblock;
