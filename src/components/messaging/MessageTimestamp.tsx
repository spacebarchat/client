import dayjs from "dayjs";
import styled from "styled-components";
import { calendarStrings } from "../../utils/i18n";
import Tooltip from "../Tooltip";

const Container = styled.div`
	font-size: 14px;
	font-weight: var(--font-weight-regular);
	margin-left: 10px;
	color: var(--text-secondary);
	user-select: none;
`;

interface Props {
	date: string | number | Date | dayjs.Dayjs;
	children?: React.ReactElement;
}

function MessageTimestamp({ date, children }: Props) {
	return (
		<Tooltip title={dayjs(date).format("dddd, MMMM MM, h:mm A")} placement="top">
			{children ? children : <Container>{dayjs(date).calendar(undefined, calendarStrings)}</Container>}
		</Tooltip>
	);
}

export default MessageTimestamp;
