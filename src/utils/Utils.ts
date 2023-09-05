export const decimalColorToHex = (decimal: number) => {
	return `#${decimal.toString(16)}`;
};

export const isTauri = !!window.__TAURI__;
