import { useModals } from "@mattjennings/react-modal-stack";
import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";
import useLogger from "../../../hooks/useLogger";
import { bytesToSize } from "../../../utils/Utils";
import { MAX_UPLOAD_SIZE } from "../../../utils/constants";
import Icon from "../../Icon";
import ErrorModal from "../../modals/ErrorModal";

const Container = styled.button`
	height: 45px;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: transparent;
	outline: none;
	border: none;
	cursor: pointer;
`;

const HoverIcon = styled(Icon)`
	color: var(--text-secondary);
	&:hover {
		color: var(--text);
	}
`;

// https://github.com/revoltchat/revite/blob/master/src/controllers/client/jsx/legacy/FileUploads.tsx#L81
let input: HTMLInputElement;
export function fileUpload(cb: (files: File[]) => void, onFileTooLarge: () => void) {
	if (input) input.remove();

	input = document.createElement("input");

	input.accept = "*";
	input.type = "file";
	input.multiple = true;
	input.style.display = "none";

	input.addEventListener("change", async (e) => {
		const files = (e.currentTarget as HTMLInputElement)?.files;
		if (!files) return;

		for (const file of files) {
			if (file.size > MAX_UPLOAD_SIZE) {
				return onFileTooLarge();
			}
		}

		cb(Array.from(files));
	});

	// iOS requires us to append the file input
	// to DOM to allow us to add any images
	document.body.appendChild(input);
	input.click();
}

interface Props {
	append: (files: File[]) => void;
}

function AttachmentUpload({ append }: Props) {
	const logger = useLogger("AttachmentUpload");
	const { openModal } = useModals();

	const fileTooLarge = () => {
		openModal(ErrorModal, {
			title: "File Too Large",
			message: (
				<div style={{ justifyContent: "center", display: "flex" }}>
					Max file size is {bytesToSize(MAX_UPLOAD_SIZE)}.
				</div>
			),
		});
		return;
	};

	const onClick = () => {
		fileUpload(append, fileTooLarge);
	};

	React.useEffect(() => {
		function paste(e: ClipboardEvent) {
			const items = e.clipboardData?.items;
			if (typeof items === "undefined") return;

			const files = [];
			for (const item of items) {
				if (!item.type.startsWith("text/")) {
					const blob = item.getAsFile();
					if (blob) {
						if (blob.size > MAX_UPLOAD_SIZE) {
							fileTooLarge();
							continue;
						}

						files.push(blob);
					}
				}
			}

			append(files);
		}

		function dragover(e: DragEvent) {
			e.stopPropagation();
			e.preventDefault();
			if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
		}

		function drop(e: DragEvent) {
			e.preventDefault();

			const dropped = e.dataTransfer?.files;
			if (dropped) {
				const files = [];
				for (const item of dropped) {
					if (item.size > MAX_UPLOAD_SIZE) {
						fileTooLarge();
						continue;
					}

					files.push(item);
				}

				append(files);
			}
		}

		document.addEventListener("paste", paste);
		document.addEventListener("dragover", dragover);
		document.addEventListener("drop", drop);

		return () => {
			document.removeEventListener("paste", paste);
			document.removeEventListener("dragover", dragover);
			document.removeEventListener("drop", drop);
		};
	}, []);

	return (
		<Container onClick={onClick}>
			<HoverIcon icon="mdiPlusCircle" size="24px" />
		</Container>
	);
}

export default observer(AttachmentUpload);
