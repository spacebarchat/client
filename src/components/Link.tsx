import styled from "styled-components";

export const Link = styled.a`
	// remove the default underline
	text-decoration: none;
	// set the color to the primary color
	color: var(--primary-light);
	// remove the color when already visited because ew
	&:visited {
		color: var(--primary-light);
	}
	// when hovered, add underline
	&:hover {
		text-decoration: underline;
	}
`;
