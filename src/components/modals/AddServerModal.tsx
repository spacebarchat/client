import React from "react";
import { useModals } from "@mattjennings/react-modal-stack";
import styled from "styled-components";
import Icon from "../Icon";

const Container = styled.div`
	z-index: 100;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	&::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.8);
	}
`;

const Wrapper = styled.div`
	width: calc(100% / 2.932);
	border-radius: 10px;
	padding: 10px;
	background-color: var(--background-secondary);
	box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05),
		0 1px 3px 1px rgba(0, 0, 0, 0.05);
	position: relative;
	display: flex;
	justify-content: center;
	flex-direction: column;
`;

const CloseWrapper = styled.div`
	position: absolute;
	top: 10px;
	right: 10px;
`;

const HeaderContainer = styled.div`
	margin-bottom: 30px;
`;

const HeaderText = styled.h1`
	font-size: 24px;
	font-weight: 700;
	color: var(--text);
	text-align: center;
`;

const SubHeaderText = styled.div`
	font-size: 16px;
	font-weight: 400;
	color: var(--text);
	text-align: center;
`;

const ActionItemContainer = styled.div`
	display: flex;
	flex-direction: column;
`

const ActionItem = styled.button`
	background-color: var(--background-secondary);
	border-radius: 8px;
	padding: 10px;
	margin-bottom: 10px;
	border: 1px solid var(--background-tertiary);
	outline: none;
	cursor: pointer;
	box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05),
		0 1px 3px 1px rgba(0, 0, 0, 0.05);

	&:hover {
		background-color: var(--background-primary);
	}

	& > div {
		font-size: 16px;
		font-weight: 500;
		color: var(--text);
	}
`

function AddServerModal() {
	const { closeModal } = useModals();

	if (!open) {
		return null;
	}

	return (
		<Container>
			<Wrapper>
				<CloseWrapper>
					<button
						onClick={closeModal}
						style={{
							background: "none",
							border: "none",
							outline: "none",
						}}
					>
						<Icon
							icon="mdiClose"
							size={1}
							style={{
								cursor: "pointer",
								color: "var(--text)",
							}}
						/>
					</button>
				</CloseWrapper>

				<HeaderContainer>
					<HeaderText>Add a Guild</HeaderText>
					<SubHeaderText>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
					</SubHeaderText>
				</HeaderContainer>

				<ActionItemContainer>
					<ActionItem>
						<div>Create a Guild</div>
					</ActionItem>

					<ActionItem>
						<div>Join a Guild</div>
					</ActionItem>
				</ActionItemContainer>
			</Wrapper>
		</Container>
	);
}

export default AddServerModal;
