import * as Icons from "@mdi/js";
import { APIAttachment, EmbedType } from "@spacebarchat/spacebar-api-types/v9";
import Channel from "../stores/objects/Channel";
import { ARCHIVE_MIMES, EMBEDDABLE_AUDIO_MIMES, EMBEDDABLE_IMAGE_MIMES, EMBEDDABLE_VIDEO_MIMES } from "./constants";

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

export const isImage = (fileOrAttachment: File | APIAttachment) => {
	const contentType = "type" in fileOrAttachment ? fileOrAttachment.type : fileOrAttachment.content_type;
	return (
		contentType?.startsWith("image/") ||
		("content_type" in fileOrAttachment && fileOrAttachment.content_type === EmbedType.Image)
	);
};

export const isVideo = (fileOrAttachment: File | APIAttachment) => {
	const contentType = "type" in fileOrAttachment ? fileOrAttachment.type : fileOrAttachment.content_type;
	return (
		contentType?.startsWith("video/") ||
		("content_type" in fileOrAttachment && fileOrAttachment.content_type === EmbedType.Video)
	);
};

export const isAudio = (fileOrAttachment: File | APIAttachment) => {
	const contentType = "type" in fileOrAttachment ? fileOrAttachment.type : fileOrAttachment.content_type;
	return contentType?.startsWith("audio/");
};

export const isArchive = (fileOrAttachment: File | APIAttachment) => {
	const name = "name" in fileOrAttachment ? fileOrAttachment.name : fileOrAttachment.filename;
	return ARCHIVE_MIMES.includes(name.split(".").pop() || "");
};

type IconsType = keyof typeof Icons;
// returns the icon for a file based on its mimetype
export const getFileIcon = (fileOrAttachment: File | APIAttachment): IconsType => {
	if (isImage(fileOrAttachment)) return "mdiFileImage";
	if (isVideo(fileOrAttachment)) return "mdiFileVideo";
	if (isAudio(fileOrAttachment)) return "mdiFileMusic";
	if (isArchive(fileOrAttachment)) return "mdiFolderZip";
	return "mdiFile";
};

export const isFileEmbeddable = (fileOrAttachment: File | APIAttachment) => {
	const contentType = "type" in fileOrAttachment ? fileOrAttachment.type : fileOrAttachment.content_type;

	const image =
		contentType === EmbedType.Image ||
		EMBEDDABLE_IMAGE_MIMES.includes(contentType?.toLowerCase().split("/").pop() || "");
	const video =
		contentType === EmbedType.Video ||
		EMBEDDABLE_VIDEO_MIMES.includes(contentType?.toLowerCase().split("/").pop() || "");
	const audio = EMBEDDABLE_AUDIO_MIMES.includes(contentType?.toLowerCase().split("/").pop() || "");
	return (
		(isImage(fileOrAttachment) && image) ||
		(isVideo(fileOrAttachment) && video) ||
		(isAudio(fileOrAttachment) && audio)
	);
};

export const getFileDetails = (fileOrAttachment: File | APIAttachment) => {
	return {
		icon: getFileIcon(fileOrAttachment),
		isEmbeddable: isFileEmbeddable(fileOrAttachment),
		isVideo: isVideo(fileOrAttachment),
		isImage: isImage(fileOrAttachment),
		isAudio: isAudio(fileOrAttachment),
		isArchive: isArchive(fileOrAttachment),
	};
};

// @ts-ignore
export const isTauri = !!window.__TAURI__;

export function rgbToHsl(r: number, g: number, b: number) {
	(r /= 255), (g /= 255), (b /= 255);

	const max = Math.max(r, g, b),
		min = Math.min(r, g, b);
	let h,
		s,
		l = (max + min) / 2;

	if (max == min) {
		h = s = 0; // achromatic
	} else {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}

		h! /= 6;
	}

	h = Math.round(h! * 360);
	s = Math.round(s * 100);
	l = Math.round(l * 100);

	return `${h} ${s}% ${l}%`;
}

export function hexToRGB(hex: string) {
	const m = hex.match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
	if (!m) return null;

	return {
		r: parseInt(m[1], 16),
		g: parseInt(m[2], 16),
		b: parseInt(m[3], 16),
	};
}

export function compareChannels(a: Channel, b: Channel): number {
	return (a.position ?? 0) - (b.position ?? 0);
}

export function doFit(width: number, height: number, maxWidth: number, maxHeight: number, minWidth = 0, minHeight = 0) {
	if (width !== maxWidth || height !== maxHeight) {
		const widthScalingFactor = width > maxWidth ? maxWidth / width : 1;
		width = Math.max(Math.round(width * widthScalingFactor), minWidth);
		height = Math.max(Math.round(height * widthScalingFactor), minHeight);

		const heightScalingFactor = height > maxHeight ? maxHeight / height : 1;
		width = Math.max(Math.round(width * heightScalingFactor), minWidth);
		height = Math.max(Math.round(height * heightScalingFactor), minHeight);
	}

	return {
		width,
		height,
	};
}

export function zoomFit(width: number, height: number) {
	const maxHeight = Math.min(Math.round(0.65 * window.innerHeight), 2e3);
	const maxWidth = Math.min(Math.round(0.75 * window.innerWidth), 2e3);

	return doFit(width, height, maxWidth, maxHeight);
}
