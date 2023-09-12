import * as Icons from "@mdi/js";
import { ARCHIVE_MIMES, EMBEDDABLE_IMAGE_MIMES, EMBEDDABLE_VIDEO_MIMES } from "./constants";

export const decimalColorToHex = (decimal: number) => {
	return `#${decimal.toString(16)}`;
};

// function to convert bytes to human readable format
export const bytesToSize = (bytes: number) => {
	const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
	if (bytes === 0) return "0 Byte";
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`;
};

type IconsType = keyof typeof Icons;
// returns the icon for a file based on its mimetype
export const getFileIcon = (file: File): IconsType => {
	const isImage = file.type.startsWith("image/");
	const isVideo = file.type.startsWith("video/");
	const isAudio = file.type.startsWith("audio/");
	// check if the file is an archive based on its extension
	const isArchive = ARCHIVE_MIMES.includes(file.name.split(".").pop() || "");

	if (isImage) return "mdiFileImage";
	if (isVideo) return "mdiFileVideo";
	if (isAudio) return "mdiFileMusic";
	if (isArchive) return "mdiFolderZip";
	return "mdiFile";
};

export const isFileEmbeddable = (file: File) => {
	return (
		(file.type.startsWith("image/") &&
			EMBEDDABLE_IMAGE_MIMES.includes(file.type.toLowerCase().split("/").pop() || "")) ||
		(file.type.startsWith("video/") &&
			EMBEDDABLE_VIDEO_MIMES.includes(file.type.toLowerCase().split("/").pop() || ""))
	);
};

export const getFileDetails = (file: File) => {
	return {
		icon: getFileIcon(file),
		isEmbeddable: isFileEmbeddable(file),
		isVideo: file.type.startsWith("video/"),
		isImage: file.type.startsWith("image/"),
		isAudio: file.type.startsWith("audio/"),
	};
};
