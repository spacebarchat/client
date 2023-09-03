import styled from "styled-components";

export const HorizontalDivider = styled.div<{ nomargin?: boolean }>`
	width: 100%;
	margin-top: ${(props) => (props.nomargin ? "0" : "8px")};
	z-index: 1;
	height: 0;
	border-top: thin solid var(--text-disabled);
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
`;

export const TextDivider = styled.span`
	padding: 0 4px;
`;
