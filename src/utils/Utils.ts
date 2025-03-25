import * as Icons from "@mdi/js";
import { APIAttachment, EmbedType } from "@spacebarchat/spacebar-api-types/v9";
import { Channel } from "@structures";
import { isDesktop, isMobile, isTablet } from "react-device-detect";
import {
	ARCHIVE_MIMES,
	DISCORD_INVITE_REGEX,
	EMBEDDABLE_AUDIO_MIMES,
	EMBEDDABLE_IMAGE_MIMES,
	EMBEDDABLE_VIDEO_MIMES,
	EMBEDDABLE_TEXT_MIMES,
	SPACEBAR_INVITE_REGEX,
} from "./constants";

/**
 * @param decimal
 * @returns hex color string
 */
export const decimalColorToHex = (decimal: number) => {
	return `#${decimal.toString(16)}`;
};

/**
 * Function to convert bytes to human readable format
 * @param bytes
 * @returns Friendly string
 */
export const bytesToSize = (bytes: number) => {
	const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
	if (bytes === 0) return "0 Byte";
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`;
};

/**
 * @param fileOrAttachment
 * @returns True if the file is an image
 */
export const isImage = (fileOrAttachment: File | APIAttachment) => {
	const contentType = "type" in fileOrAttachment ? fileOrAttachment.type : fileOrAttachment.content_type;
	return (
		contentType?.startsWith("image/") ||
		("content_type" in fileOrAttachment && fileOrAttachment.content_type === EmbedType.Image)
	);
};

/**
 * @param fileOrAttachment
 * @returns True if the file is a video
 */
export const isVideo = (fileOrAttachment: File | APIAttachment) => {
	const contentType = "type" in fileOrAttachment ? fileOrAttachment.type : fileOrAttachment.content_type;
	return (
		contentType?.startsWith("video/") ||
		("content_type" in fileOrAttachment && fileOrAttachment.content_type === EmbedType.Video)
	);
};

/**
 * @param fileOrAttachment
 * @returns True if the file is audio
 */
export const isAudio = (fileOrAttachment: File | APIAttachment) => {
	const contentType = "type" in fileOrAttachment ? fileOrAttachment.type : fileOrAttachment.content_type;
	return contentType?.startsWith("audio/");
};

/**
 * @param fileOrAttachment
 * @returns True if the file is text
 */
export const isText = (fileOrAttachment: File | APIAttachment) => {
	const contentType = "type" in fileOrAttachment ? fileOrAttachment.type : fileOrAttachment.content_type;
	return contentType?.startsWith("text/");
};

/**
 * @param fileOrAttachment
 * @returns True if the file is an archive
 */
export const isArchive = (fileOrAttachment: File | APIAttachment) => {
	const name = "name" in fileOrAttachment ? fileOrAttachment.name : fileOrAttachment.filename;
	return ARCHIVE_MIMES.includes(name.split(".").pop() || "");
};

type IconsType = keyof typeof Icons;

/**
 * @param fileOrAttachment
 * @returns An icon string for the file type
 */
export const getFileIcon = (fileOrAttachment: File | APIAttachment): IconsType => {
	if (isImage(fileOrAttachment)) return "mdiFileImage";
	if (isVideo(fileOrAttachment)) return "mdiFileVideo";
	if (isAudio(fileOrAttachment)) return "mdiFileMusic";
	if (isArchive(fileOrAttachment)) return "mdiFolderZip";
	return "mdiFile";
};

/**
 * @param fileOrAttachment
 * @returns True if the file can be embedded
 */
export const isFileEmbeddable = (fileOrAttachment: File | APIAttachment) => {
	const contentType = "type" in fileOrAttachment ? fileOrAttachment.type : fileOrAttachment.content_type;

	const image =
		contentType === EmbedType.Image ||
		EMBEDDABLE_IMAGE_MIMES.includes(contentType?.toLowerCase().split("/").pop() || "");
	const video =
		contentType === EmbedType.Video ||
		EMBEDDABLE_VIDEO_MIMES.includes(contentType?.toLowerCase().split("/").pop() || "");
	const audio = EMBEDDABLE_AUDIO_MIMES.includes(contentType?.toLowerCase().split("/").pop() || "");
	const text = EMBEDDABLE_TEXT_MIMES.includes(contentType?.toLowerCase().split("/").pop() || "");
	return (
		(isImage(fileOrAttachment) && image) ||
		(isVideo(fileOrAttachment) && video) ||
		(isAudio(fileOrAttachment) && audio) ||
		(isText(fileOrAttachment) && text)
	);
};

export const getFileDetails = (fileOrAttachment: File | APIAttachment) => {
	return {
		icon: getFileIcon(fileOrAttachment),
		isEmbeddable: isFileEmbeddable(fileOrAttachment),
		isVideo: isVideo(fileOrAttachment),
		isImage: isImage(fileOrAttachment),
		isAudio: isAudio(fileOrAttachment),
		isText: isText(fileOrAttachment),
		isArchive: isArchive(fileOrAttachment),
	};
};

/**
 * Returns a boolan indicating if we are running in a tauri context
 */
// @ts-expect-error no types
export const isTauri = !!window.__TAURI_INTERNALS__;

/**
 * Converts an RGB color to HSL
 * @param r
 * @param g
 * @param b
 * @returns an HSL string
 */
export function rgbToHsl(r: number, g: number, b: number) {
	r /= 255;
	g /= 255;
	b /= 255;

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

/**
 * Converts a hex color to an RGB object
 * @param hex
 * @returns an object containing the RGB values
 */
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
	return (a.position ?? -1) - (b.position ?? -1);
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

/**
 * Checks if a string contains an invite
 * @param text
 * @returns True if the string contains one or more invites
 */
export function textHasInvite(text: string) {
	return DISCORD_INVITE_REGEX.test(text) || SPACEBAR_INVITE_REGEX.test(text);
}

/**
 * Extracts invite codes from a string
 * @param text
 * @returns Array of invite codes
 */
export function extractInvites(text: string): string[] {
	const invites: string[] = [];

	let match;
	// while ((match = DISCORD_INVITE_REGEX.exec(text))) {
	// 	if (match.groups?.code) invites.push({ host: "discord.com", code: match.groups?.code || "" });
	// }

	while ((match = SPACEBAR_INVITE_REGEX.exec(text))) {
		if (match.groups?.code) invites.push(match.groups?.code);
	}

	return invites;
}

/**
 * Creates an acronym from a string
 */
export function asAcronym(text: string): string {
	return text
		.split(" ")
		.map((word) => word.substring(0, 1))
		.join("");
}

// https://github.com/revoltchat/revite/blob/master/src/lib/isTouchscreenDevice.ts
export const isTouchscreenDevice =
	isDesktop || isTablet ? false : (typeof window !== "undefined" ? navigator.maxTouchPoints > 0 : false) || isMobile;

export function calculateImageRatio(width: number, height: number, maxWidth?: number, maxHeight?: number) {
	const mw = maxWidth ?? 400;
	const mh = maxHeight ?? 300;

	let o = 1;
	if (width > mw) o = mw / width;
	width = Math.round(width * o);
	let a = 1;
	if ((height = Math.round(height * o)) > mh) a = mh / height;
	return Math.min(o * a, 1);
}

export function calculateScaledDimensions(
	originalWidth: number,
	originalHeight: number,
	ratio: number,
	maxWidth?: number,
	maxHeight?: number,
): { scaledWidth: number; scaledHeight: number } {
	const mw = maxWidth ?? 400;
	const mh = maxHeight ?? 300;

	const deviceResolution = window.devicePixelRatio ?? 1;
	let scaledWidth = originalWidth;
	let scaledHeight = originalHeight;

	if (ratio < 1) {
		scaledWidth = Math.round(originalWidth * ratio);
		scaledHeight = Math.round(originalHeight * ratio);
	}

	scaledWidth = Math.min(scaledWidth, mw);
	scaledHeight = Math.min(scaledHeight, mh);

	if (scaledWidth !== originalWidth || scaledHeight !== originalHeight) {
		scaledWidth |= 0;
		scaledHeight |= 0;
	}

	scaledWidth *= deviceResolution;
	scaledHeight *= deviceResolution;

	return { scaledWidth, scaledHeight };
}

/**
 * extracts error message from field errors
 * @param e the error
 * @param prevKey
 * @returns
 */
export function messageFromFieldError(
	e:
		| {
				[key: string]: {
					_errors: {
						code: string;
						message: string;
					}[];
				};
		  }
		| {
				[key: string]: {
					code: string;
					message: string;
				}[];
		  },
	prevKey?: string,
): { field: string | undefined; error: string } | null {
	for (const key in e) {
		const obj = e[key];
		if (obj) {
			if (key === "_errors" && Array.isArray(obj)) {
				const r = obj[0];
				return r ? { field: prevKey, error: r.message } : null;
			}
			if (typeof obj === "object") {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				return messageFromFieldError(obj as any, key);
			}
		}
	}
	return null;
}
