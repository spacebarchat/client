import styled from "styled-components";

// TODO: migrate some things from AuthComponents

export const InputSelect = styled.select`
	background-color: var(--background-secondary-alt);
	color: var(--text);
	outline: none;
	border: 1px solid transparent;
	padding: 8px;
	height: 42px;
	font-weight: var(--font-weight-medium);
	cursor: pointer;
	border-radius: 12px;
	width: 100%;
`;

export const InputSelectOption = styled.option`
	background-color: var(--background-secondary);
	color: var(--text);

	&:hover {
		background-color: var(--background-secondary-highlight);
	}
`;
