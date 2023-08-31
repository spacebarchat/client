export function calculateImageRatio(width: number, height: number, maxWidth?: number, maxHeight?: number) {
	const mw = maxWidth ?? 400;
	const mh = maxHeight ?? 300;

	let o = 1;
	width > mw && (o = mw / width);
	width = Math.round(width * o);
	let a = 1;
	(height = Math.round(height * o)) > mh && (a = mh / height);
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
