import styled from "styled-components";

export const HorizontalDivider = styled.div`
	width: 100%;
	margin-top: 24px;
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
