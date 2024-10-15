// https://github.com/mui/material-ui/blob/master/packages/mui-utils/src/ownerDocument/ownerDocument.ts
export default function ownerDocument(node: Node | null | undefined): Document {
	return (node && node.ownerDocument) || document;
}
