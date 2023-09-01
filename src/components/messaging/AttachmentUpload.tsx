import styled from "styled-components";
import Icon from "../Icon";
import IconButton from "../IconButton";

const Container = styled.li`
	flex-direction: column;
	position: relative;
	display: inline-flex;
	background-color: var(--background-secondary);
	border-radius: 4px;
	margin: 0;
	padding: 8px;
	min-width: 200px;
	max-width: 200px;
	min-height: 200px;
	max-height: 200px;
`;

const MediaContainer = styled.div`
	position: relative;
	margin-top: auto;
	min-height: 0;
`;

const ActionsContainer = styled.div`
	position: absolute;
	top: 0;
	right: 0;
	transform: translate(25%, -25%);
	z-index: 1;
`;

const ActionBarWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background-color: var(--background-secondary);
`;

const FileDetails = styled.div`
	margin-top: auto;
`;

interface Props {
	file: File;
	remove: () => void;
}

function AttachmentUpload({ file, remove }: Props) {
	// create a preview url for the file
	const previewUrl = URL.createObjectURL(file);

	return (
		<Container>
			<div
				style={{
					display: "flex",
					height: "100%",
					flexDirection: "column",
					position: "relative",
				}}
			>
				<MediaContainer>
					<img
						src={previewUrl}
						style={{
							borderRadius: "3px",
							maxWidth: "100%",
							objectFit: "contain",
						}}
					/>
				</MediaContainer>
				<ActionsContainer>
					<ActionBarWrapper>
						<IconButton onClick={remove}>
							<Icon size="24px" icon="mdiTrashCan" color="var(--danger)" />
						</IconButton>
					</ActionBarWrapper>
				</ActionsContainer>
				<FileDetails>
					<div
						style={{
							marginTop: "8px",
							overflow: "hidden",
							whiteSpace: "nowrap",
							fontSize: "16px",
							fontWeight: "var(--font-weight-regular)",
						}}
					>
						{file.name}
					</div>
				</FileDetails>
			</div>
		</Container>
	);
}

export default AttachmentUpload;
