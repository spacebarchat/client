// adapted from Revite
// https://github.com/revoltchat/revite/blob/fe63c6633f32b54aa1989cb34627e72bb3377efd/src/components/markdown/plugins/Codeblock.tsx

import React from "react";
import styled from "styled-components";
import Tooltip from "./Tooltip";

const Actions = styled.div`
	position: absolute;
	top: 10px;
	right: 10px;
	display: flex;
	gap: 5px;

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
	lang?: string;
	children: React.ReactNode;
}

/**
 * Render a codeblock with copy text button
 */

function CodeBlock(props: Props) {
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
		<pre
			ref={ref}
			style={{
				position: "relative",
			}}
		>
			<Actions>
				<Tooltip title="Copy to Clipboard" placement="top">
					<a onClick={onCopy}>{text}</a>
				</Tooltip>
			</Actions>
			{props.children}
		</pre>
	);
}

export default CodeBlock;
