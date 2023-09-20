import { Suspense, lazy } from "react";
import { withErrorBoundary } from "react-use-error-boundary";

const Renderer = lazy(() => import("./RemarkRenderer"));

export interface MarkdownProps {
	content: string;
}

function Markdown(props: MarkdownProps) {
	if (!props.content) return null;

	return (
		<Suspense fallback={props.content}>
			<Renderer {...props} />
		</Suspense>
	);
}

export default withErrorBoundary(Markdown);
