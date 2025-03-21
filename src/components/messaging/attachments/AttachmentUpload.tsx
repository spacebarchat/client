import { modalController } from "@/controllers/modals/ModalController";
import Icon from "@components/Icon";
import useLogger from "@hooks/useLogger";
import { MAX_UPLOAD_SIZE, bytesToSize } from "@utils";
import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";

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
	clearInput: () => void;
}

function AttachmentUpload({ append, clearInput }: Props) {
	const logger = useLogger("AttachmentUpload");

	const fileTooLarge = () => {
		modalController.push({
			type: "error",
			title: "File Too Large",
			error: `Max file size is ${bytesToSize(MAX_UPLOAD_SIZE)}.`,
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
						//console.log(blob); //TODO: DELETE LINE
						files.push(blob);
					}
				}
				else if (item.kind === "string") {
					
					console.log(item) // TODO: DELETE LINE
					item.getAsString((s) => {
						if (s.length > 4000) { // TODO: Get this character limit from server (if it's there)
							e.preventDefault();
							console.log("Pasted text exceeds character limit") // TODO:DELETE LINE
							const blob = new File([s], "message.txt", {type: "text/plain"});
							//console.log(blob); TODO:DELETE LINE
							append([blob]);
							clearInput()
							// TODO: Clear the MessageInput element after this
						}
					})
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
