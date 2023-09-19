import styled from "styled-components";

export const LinkElement = styled.a<{ color?: string }>`
	// remove the default underline
	text-decoration: none;
	// set the color to the primary color
	color: ${(props) => props.color || "var(--primary-light)"};
	cursor: pointer;

	// remove the color when already visited because ew
	&:visited {
		color: ${(props) => props.color || "var(--primary-light)"};
	}

	// when hovered, add underline
	&:hover {
		text-decoration: underline;
	}
`;

export default function Link(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
	return (
		<LinkElement
			onContextMenu={(e) => {
				// allow the default context menu to open
				e.stopPropagation();
			}}
			{...props}
		/>
	);
}
