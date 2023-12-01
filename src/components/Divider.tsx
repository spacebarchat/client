import styled from "styled-components";

export const HorizontalDivider = styled.div<{ nomargin?: boolean }>`
	margin-top: ${(props) => (props.nomargin ? "0" : "8px")};
	z-index: 1;
	height: 1px;
	background-color: var(--text-disabled);
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
`;

export const TextDivider = styled.span`
	padding: 0 4px;
`;
