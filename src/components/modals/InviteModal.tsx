import { ModalProps } from "@/controllers/modals";
import REST from "@utils/REST";
import styled from "styled-components";
import { Modal, ModalHeader, ModalHeaderText, ModalSubHeaderText } from "./ModalComponents";

const ActionWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;
export function InviteModal({ inviteData, ...props }: ModalProps<"invite">) {
	const splashUrl = REST.makeCDNUrl(`/splashes/${inviteData.guild?.id}/${inviteData.guild?.splash}.png`, {
		size: 2048,
	});

	return (
		<Modal nonDismissable padding="0" maxWidth="920">
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					maxHeight: "100%",
				}}
			>
				<div
					style={{
						height: "100%",
					}}
				>
					<div
						style={{
							overflow: "hidden scroll",
							paddingRight: 24,
							width: 400,
							padding: 32,
						}}
					>
						<ModalHeader>
							<ModalSubHeaderText>You've been invited to join</ModalSubHeaderText>
							<ModalHeaderText>{inviteData.guild?.name}</ModalHeaderText>
						</ModalHeader>
					</div>
				</div>
				<div
					style={{
						width: "520px",
						backgroundImage: `url(${splashUrl})`,
						backgroundSize: "cover",
						backgroundPosition: "100%",
						borderRadius: "0 5px 5px 0",
					}}
				></div>
			</div>
		</Modal>
	);
}
