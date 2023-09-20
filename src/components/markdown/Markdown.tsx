import { Suspense, lazy } from "react";

const Renderer = lazy(() => import("./RemarkRenderer"));

export interface MarkdownProps {
	content: string;
}

export default function Markdown(props: MarkdownProps) {
	if (!props.content) return null;

	return (
		<Suspense fallback={props.content}>
			<Renderer {...props} />
		</Suspense>
	);
}
