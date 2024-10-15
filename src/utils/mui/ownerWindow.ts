import ownerDocument from "./ownerDocument";

// https://github.com/mui/material-ui/blob/master/packages/mui-utils/src/ownerWindow/ownerWindow.ts
export default function ownerWindow(node: Node | undefined): Window {
	const doc = ownerDocument(node);
	return doc.defaultView || window;
}
