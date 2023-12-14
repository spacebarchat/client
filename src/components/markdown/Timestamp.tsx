import dayjs from "dayjs";
import { memo } from "react";
import styled from "styled-components";
import Floating from "../floating/Floating";
import FloatingTrigger from "../floating/FloatingTrigger";

const Container = styled.div`
	background-color: hsl(var(--background-tertiary-hsl) / 0.3);
	padding: 2px;
	border-radius: 4px;
	width: fit-content;
`;

interface Props {
	timestamp: string;
	style?: string;
}

function Timestamp({ timestamp, style }: Props) {
	const date = dayjs.unix(Number(timestamp));

	let value = "";
	switch (style) {
		case "t":
			value = date.format("hh:mm");
			break;
		case "T":
			value = date.format("hh:mm:ss");
			break;
		case "R":
			value = date.fromNow();
			break;
		case "D":
			value = date.format("DD MMMM YYYY");
			break;
		case "F":
			value = date.format("dddd, DD MMMM YYYY hh:mm");
			break;
		case "f":
		default:
			value = date.format("DD MMMM YYYY hh:mm");
			break;
	}

	return (
		<Container>
			<Floating
				placement="top"
				type="tooltip"
				props={{
					content: <span>{date.format("dddd, MMMM MM, h:mm A")}</span>,
				}}
			>
				<FloatingTrigger>
					<span>{value}</span>
				</FloatingTrigger>
			</Floating>
		</Container>
	);
}

export default memo(Timestamp);
