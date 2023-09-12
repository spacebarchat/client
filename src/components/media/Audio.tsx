import { APIAttachment } from "@spacebarchat/spacebar-api-types/v9";
import styled from "styled-components";
import { bytesToSize } from "../../utils/Utils";
import Icon from "../Icon";
import { Link } from "../Link";

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
	width: 420px;

	@media only screen and (max-width: 420px) {
		width: 100%;
	}
`;

const AudioInfo = styled.div`
	display: flex;
`;

const AudioMetadata = styled.div`
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	align-self: center;
	flex-direction: column;
`;

const AudioSize = styled.div`
	color: var(--text-secondary);
	font-size: 12px;
	opacity: 0.8;
	font-weight: var(--font-weight-medium);
	text-overflow: ellipsis;
	overflow: hidden;
`;

interface Props {
	attachment: APIAttachment;
}

function Audio({ attachment }: Props) {
	const url = attachment.proxy_url && attachment.proxy_url.length > 0 ? attachment.proxy_url : attachment.url;

	return (
		<Container>
			<AudioInfo>
				<Icon icon="mdiFileMusic" size={2} />
				<AudioMetadata>
					<Link href={url} target="_blank" rel="noreferer noopener" color="var(--text-link)">
						{attachment.filename}
					</Link>
					<AudioSize>{bytesToSize(attachment.size)}</AudioSize>
				</AudioMetadata>
			</AudioInfo>
			<audio style={{ width: "100%", borderRadius: "3px" }} playsInline controls preload="metadata" src={url} />
		</Container>
	);
}

export default Audio;
