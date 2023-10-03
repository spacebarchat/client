import { APIAttachment } from "@spacebarchat/spacebar-api-types/v9";
import styled from "styled-components";
import { bytesToSize } from "../../utils/Utils";
import Icon from "../Icon";
import Link from "../Link";

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

const FileInfo = styled.div`
	display: flex;
`;

const FileMetadata = styled.div`
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	align-self: center;
	color: var(--text-link);
`;

const FileSize = styled.div`
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

function File({ attachment }: Props) {
	const url = attachment.proxy_url && attachment.proxy_url.length > 0 ? attachment.proxy_url : attachment.url;

	return (
		<Container>
			<FileInfo>
				<Icon icon="mdiFile" size={2} />
				<FileMetadata>
					<Link href={url} target="_blank" rel="noreferer noopener" color="var(--text-link)">
						{attachment.filename}
					</Link>
					<FileSize>{bytesToSize(attachment.size)}</FileSize>
				</FileMetadata>
			</FileInfo>
		</Container>
	);
}

export default File;
