// inspired by revite: https://github.com/revoltchat/revite/blob/master/src/lib/ErrorBoundary.tsx

import React from "react";
import { useErrorBoundary } from "react-use-error-boundary";
import styled from "styled-components";
import Button from "./Button";

const Container = styled.div`
	height: 100%;
	padding: 12px;
	background-color: var(--background-secondary);
	color: var(--text);

	h3 {
		margin: 0;
		margin-bottom: 10px;
	}

	code {
		font-size: 12px;
	}
`;

interface Props {
	children: React.ReactNode;
	section: "app" | "component";
}

function ErrorBoundary({ children, section }: Props) {
	const [error, resetError] = useErrorBoundary();

	// TODO: when v1 is reached, maybe we should add a "report" button here to submit errors to sentry

	if (error) {
		const message = error instanceof Error ? error.message : (error as string);
		const stack = error instanceof Error ? error.stack : undefined;
		return (
			<Container>
				{section === "app" ? (
					<>
						<h3>App Crash</h3>
						<Button onClick={resetError}>Ignore</Button>
						<Button onClick={() => location.reload()}>Reload</Button>
					</>
				) : (
					<>
						<h3>Component Error</h3>
						<Button onClick={resetError}>Ignore</Button>
					</>
				)}
				<br />
				<br />
				{message}
				<br />
				<code>{stack}</code>
			</Container>
		);
	}

	return <>{children}</>;
}

export default ErrorBoundary;
