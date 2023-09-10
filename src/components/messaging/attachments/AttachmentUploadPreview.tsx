import React, { Fragment } from "react";
import styled from "styled-components";
import { bytesToSize } from "../../../utils/Utils";
import { HorizontalDivider } from "../../Divider";
import Icon from "../../Icon";
import IconButton from "../../IconButton";
import { UploadState, UploadStateType } from "../MessageInput";

const Container = styled.ul`
	display: flex;
	gap: 8px;
	padding: 10px;
	overflow-x: auto;
	list-style: none;
	margin: 0;
`;

const FileContainer = styled.li`
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
	margin-top: auto;
	min-height: 0;
	display: flex;
	justify-content: center;
`;

const Image = styled.img`
	border-radius: 3px;
	max-width: 100%;
	object-fit: contain;
`;

const Video = styled.video`
	border-radius: 3px;
	max-width: 100%;
	object-fit: contain;
	height: 100%;
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

const FileName = styled.div`
	margin-top: 8px;
	overflow: hidden;
	white-space: nowrap;
	font-size: 16px;
	font-weight: var(--font-weight-regular);
	text-overflow: ellipsis;
`;

const FileSize = styled.div`
	margin-top: 8px;
	overflow: hidden;
	white-space: nowrap;
	font-size: 14px;
	font-weight: var(--font-weight-regular);
`;

interface FileProps {
	file: File;
	remove: () => void;
}

function File({ file, remove }: FileProps) {
	const generatePreviewElement = React.useCallback(() => {
		const previewUrl = URL.createObjectURL(file);
		if (file.type.startsWith("image")) return <Image src={previewUrl} />;
		else if (file.type.startsWith("video"))
			return <Video preload="metadata" aria-hidden="true" src={previewUrl}></Video>;
		else
			return (
				<div>
					<Icon size="48px" icon="mdiFile" />
				</div>
			);
	}, [file]);

	return (
		<FileContainer>
			<InnerWrapper>
				<MediaContainer>{generatePreviewElement()}</MediaContainer>
				<ActionsContainer>
					<ActionBarWrapper>
						<IconButton onClick={remove}>
							<Icon size="24px" icon="mdiTrashCan" color="var(--danger)" />
						</IconButton>
					</ActionBarWrapper>
				</ActionsContainer>
				<FileDetails>
					<FileName>{file.name}</FileName>
					<FileSize>{bytesToSize(file.size)}</FileSize>
				</FileDetails>
			</InnerWrapper>
		</FileContainer>
	);
}

interface Props {
	state: UploadState;
	remove: (index: number) => void;
}

function AttachmentUploadList({ state, remove }: Props) {
	if (state.type === UploadStateType.NONE) return null;

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Container>
				{state.files.map((file, index) => (
					<Fragment key={index}>
						<File file={file} remove={() => remove(index)} />
					</Fragment>
				))}
			</Container>

			<HorizontalDivider />
		</div>
	);
}

export default AttachmentUploadList;
