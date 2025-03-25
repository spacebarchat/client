import { modalController } from "@/controllers/modals";
import { Floating, FloatingTrigger } from "@components/floating";
import Icon from "@components/Icon";
import Link from "@components/Link";
import * as Icons from "@mdi/js";
import { APIAttachment } from "@spacebarchat/spacebar-api-types/v9";
import { bytesToSize } from "@utils";
import { useEffect, useState } from "react";
import styled from "styled-components";
import IconButton from "../IconButton";

const Container = styled.div`
	margin-top: 10px;
	display: flex;
	background-color: var(--background-secondary);
	padding: 12px;
	border-radius: 5px;
	flex: auto;
	border: 1px solid var(--background-secondary-alt);
	justify-content: space-between;
	box-sizing: border-box;
	flex-direction: column;
	min-width: 300px;
	width: fit-content;
	max-width: 100%;
	white-space: pre-line;
	overflow: hidden;
	@media only screen and (max-width: 420px) {
		width: 100%;
	}
`;

const TextInfo = styled.div`
	display: flex;
`;

const TextMetadata = styled.div`
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	align-self: center;
	flex-direction: column;
`;

const TextSize = styled.div`
	color: var(--text-secondary);
	font-size: 14px;
	font-family: var(--font-family-code);
	font-weight: var(--font-weight-medium);
	overflow: hidden;
	display: block;
	word-wrap: normal;
	overflow: hidden;
	max-height: fit-content;
	line-height: 1.8em;
	overflow-x: scroll;
	width: 100% !important;
`;

const ActionItemsWrapper = styled.div`
	display: flex;
	flex-direction: row-reverse;
	// margin-right: 15%;

	// remove the temporary padding that moves it over the chat area on smaller screens where the member list is hidden
	@media (max-width: 1050px) {
		margin-right: auto;
	}
`;

const IconWrapper = styled.div`
	height: 24px;
	margin-left: 8px;
	flex: 0 0 auto;
`;

const CustomIcon = styled(Icon)<{ $active?: boolean }>`
	color: ${(props) => (props.$active ? "var(--text)" : "var(--text-secondary)")};

	&:hover {
		color: ${(props) => (props.$active ? "var(--text-secondary)" : "var(--text)")};
		cursor: pointer;
	}
`;

interface ActionItemProps {
	icon: keyof typeof Icons;
	active?: boolean;
	ariaLabel?: string;
	tooltip: string;
	onClick?: () => void;
	disabled?: boolean;
	color?: string;
	label?: JSX.Element;
	size?: string;
	iconButtonStyle?: React.CSSProperties;
	iconWrapperStyle?: React.CSSProperties;
}

function ActionItem({
	icon,
	active,
	ariaLabel,
	tooltip,
	disabled,
	color,
	label,
	onClick,
	iconButtonStyle,
	iconWrapperStyle,
	size = "24px",
}: ActionItemProps) {
	return (
		<Floating
			placement="bottom"
			type="tooltip"
			props={{
				content: <span>{tooltip}</span>,
			}}
		>
			<FloatingTrigger style={{ display: "flex", alignItems: "center" }}>
				<IconWrapper style={iconWrapperStyle}>
					<IconButton onClick={onClick} disabled={disabled} style={iconButtonStyle}>
						<CustomIcon
							$active={!disabled && active}
							icon={icon}
							size={size}
							aria-label={ariaLabel}
							color={color}
						/>
					</IconButton>
				</IconWrapper>
				{label}
			</FloatingTrigger>
		</Floating>
	);
}

interface Props {
	attachment: APIAttachment;
}

export function Text({ attachment }: Props) {
	const [textLoading, setTextLoading] = useState(true);
	const [textLines, setTextLines] = useState<string>();
	const [textPreview, setTextPreview] = useState<string>();
	const [textLineCount, setTextLineCount] = useState(0);
	const [expanded, setExpanded] = useState(false);

	const url = attachment.proxy_url && attachment.proxy_url.length > 0 ? attachment.proxy_url : attachment.url;

	const countLines = (fullText: string) => {
		const lineList = fullText.split(/\r?\n/);
		return lineList.length;
	};

	const selectLines = (fullText: string, lineCount: number) => {
		const lineList = fullText.split(/\r?\n/);
		if (lineList.length > lineCount) {
			const previewLines = lineList.slice(0, lineCount);
			const previewString = previewLines.join("\r\n");
			return previewString;
		} else {
			return fullText;
		}
	};

	const toggleExpand = () => {
		if (!textLines) return;

		if (expanded) {
			setExpanded(false);
			setTextPreview(selectLines(textLines, 5));
		} else {
			setExpanded(true);
			if (textLineCount > 100) {
				setTextPreview(selectLines(textLines, 100) + "\n... (" + (textLineCount - 100) + " lines remaining)");
			} else {
				setTextPreview(textLines);
			}
		}
	};

	const popOutFullText = () => {
		if (!textLines) return;

		modalController.push({
			type: "text_viewer",
			text: textLines,
		});
	};

	useEffect(() => {
		fetch(attachment.proxy_url)
			.then((response) => response.text())
			.then((data) => {
				if (typeof data === "string") {
					setTextLines(data);
					setTextPreview(selectLines(data, 5));
					setTextLineCount(countLines(data));
				}
			})
			.catch((error) => {
				console.log(error);
			});
	}, [attachment]);

	return (
		<Container>
			<TextInfo>
				<Icon icon="mdiText" size={1} style={{ marginRight: "5px" }} />
				<TextMetadata>
					<Link href={url} target="_blank" rel="noreferer noopener" color="var(--text-link)">
						{attachment.filename}
					</Link>
					<TextSize style={{ fontSize: "12px" }}>{bytesToSize(attachment.size)}</TextSize>
				</TextMetadata>
			</TextInfo>
			<TextSize>
				<code>{textPreview}</code>
			</TextSize>
			<ActionItemsWrapper>
				<ActionItem
					icon="mdiArrowExpand"
					tooltip="View Full Text"
					ariaLabel="View Full Text"
					onClick={popOutFullText}
					size="16px"
					iconWrapperStyle={{
						display: "flex",
						alignItems: "center",
					}}
				/>
				<ActionItem
					icon={expanded ? "mdiChevronUp" : "mdiChevronDown"}
					tooltip={"Expand (" + textLineCount + " lines)"}
					ariaLabel={"Expand (" + textLineCount + " lines)"}
					onClick={toggleExpand}
					label={<span style={{ fontSize: "14px" }}>{expanded ? "Collapse" : "Expand"}</span>}
					size="24px"
					iconButtonStyle={{
						display: "flex",
						justifyContent: "center",
					}}
				/>
			</ActionItemsWrapper>
		</Container>
	);
}
