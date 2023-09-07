declare module "*.svg" {
	import React = require("react");
	export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
	const src: string;
	export default src;
}

declare global {
	interface Window {
		__TAURI__: boolean;
	}
}
