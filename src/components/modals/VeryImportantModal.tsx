import { useContext } from "react";
import styled from "styled-components";
import { BannerContext } from "../../contexts/BannerContext";
import { ModalProps } from "../../controllers/modals/types";
import { Modal } from "./ModalComponents";

const Text = styled.span`
	padding: 10px;
	justify-content: center;
	align-items: center;
	display: flex;
	flex: 1;
`;

export function VeryImportantModal({ ...props }: ModalProps<"very_important">) {
	const bannerContext = useContext(BannerContext);
	return (
		<Modal
			{...props}
			actions={[
				{
					onClick: () => {
						localStorage.setItem("very_important_banner_dismissed", "true");
						bannerContext.close();
						return true;
					},
					confirmation: true,
					children: <span>I've been clowned</span>,
					palette: "primary",
				},
			]}
		>
			<Text>April fools! 🤡</Text>
		</Modal>
	);
}
