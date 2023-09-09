import React from "react";
import styled from "styled-components";
import useLogger from "../../../hooks/useLogger";
import { MAX_UPLOAD_SIZE } from "../../../utils/constants";
import Icon from "../../Icon";

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

interface Props {
	append: (files: File[]) => void;
}

function FileUpload({ append }: Props) {
	const logger = useLogger("FileUpload");

	const onClick = () => {
		// TODO:
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
							// TODO: show error modal
							logger.error("File too large");
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
						// TODO: show error modal
						logger.error("File too large");
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

export default FileUpload;
