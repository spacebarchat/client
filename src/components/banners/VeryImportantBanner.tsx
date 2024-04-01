import styled from "styled-components";
import { modalController } from "../../controllers/modals";
import Button from "../Button";

const Wrapper = styled.div`
	display: flex;
	flex-direction: row;
	background-color: var(--primary);
	flex: 1;
	justify-content: center;
	align-items: center;
`;

const Text = styled.span`
	padding: 10px;
`;

function VeryImportantBanner() {
	return (
		<Wrapper>
			<Text>We have a suprise for you!</Text>
			<Button
				onClick={() => {
					modalController.push({
						type: "very_important",
					});
				}}
				style={{
					backgroundColor: "var(--primary-light)",
					border: "1px solid var(--primary-dark)",
				}}
			>
				Show me
			</Button>
		</Wrapper>
	);
}

export default VeryImportantBanner;
