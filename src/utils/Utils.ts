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
