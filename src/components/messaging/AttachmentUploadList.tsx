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

const InnerWrapper = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	position: relative;
`;

const MediaContainer = styled.div`
	position: relative;
	margin-top: auto;
	min-height: 0;
`;

const Image = styled.img`
	border-radius: 3px;
	max-width: 100%;
	object-fit: contain;
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

const FileNameWrapper = styled.div`
	margin-top: 8px;
	overflow: hidden;
	white-space: nowrap;
	font-size: 16px;
	font-weight: var(--font-weight-regular);
`;

interface Props {
	file: File;
	remove: () => void;
}

function AttachmentUploadList({ file, remove }: Props) {
	// create a preview url for the file
	const previewUrl = URL.createObjectURL(file);

	return (
		<Container>
			<InnerWrapper>
				<MediaContainer>
					<Image src={previewUrl} />
				</MediaContainer>
				<ActionsContainer>
					<ActionBarWrapper>
						<IconButton onClick={remove}>
							<Icon size="24px" icon="mdiTrashCan" color="var(--danger)" />
						</IconButton>
					</ActionBarWrapper>
				</ActionsContainer>
				<FileDetails>
					<FileNameWrapper>{file.name}</FileNameWrapper>
				</FileDetails>
			</InnerWrapper>
		</Container>
	);
}

export default AttachmentUploadList;
