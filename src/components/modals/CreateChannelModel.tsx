import { yupResolver } from "@hookform/resolvers/yup";
import {
	ChannelType,
	RESTPostAPIGuildChannelJSONBody,
	RESTPostAPIGuildChannelResult,
	Routes,
} from "@spacebarchat/spacebar-api-types/v9";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import * as yup from "yup";
import { ModalProps, modalController } from "../../controllers/modals";
import { useAppStore } from "../../stores/AppStore";
import { messageFromFieldError } from "../../utils/messageFromFieldError";
import { Input, InputErrorText } from "../AuthComponents";
import { TextDivider } from "../Divider";
import Icon, { IconType } from "../Icon";
import { Modal } from "./ModalComponents";

const CHANNEL_OPTIONS: {
	label: string;
	description: string;
	icon: IconType;
	type: ChannelType;
	note?: string;
	canBePrivate?: boolean;
}[] = [
	{
		label: "Text",
		description: "Send messages, images, and GIFs",
		icon: "mdiPound",
		type: ChannelType.GuildText,
	},
	{
		label: "Voice",
		description: "Hang out and talk with friends",
		icon: "mdiVolumeHigh",
		type: ChannelType.GuildVoice,
	},
	{
		label: "Announcement",
		description: "Important updates for people in and out of the server",
		icon: "mdiBullhorn",
		type: ChannelType.GuildAnnouncement,
		note: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
		canBePrivate: false,
	},
];

const TitleText = styled.h1`
	font-size: 20px;
	font-weight: var(--font-weight-medium);
`;

const DescriptionText = styled.p`
	font-size: 16px;
	font-weight: var(--font-weight-regular);
	color: var(--text-header-secondary);
`;

const Form = styled.form`
	width: 100%;
	margin-top: 10px;
`;

const List = styled.ul`
	list-style: none;
	padding: 0;
	margin: 0;
	gap: 10px;
	display: flex;
	flex-direction: column;
`;

const ListItem = styled.li<{ active: boolean }>`
	padding: 10px;
	border-radius: 10px;
	background-color: ${(props) =>
		props.active ? "var(--background-secondary-highlight)" : "var(--background-secondary)"};
	filter: brightness(${(props) => (props.active ? 1.3 : 1.1)});
	display: flex;
	flex-direction: column;
	gap: 3px;

	&:hover {
		cursor: pointer;
		background-color: var(--background-secondary-highlight);
		filter: ${(props) => (props.active ? "brightness(1.3)" : "brightness(1.1)")};
	}

	& span {
		color: var(--text-header-secondary);
		font-size: 16px;
		font-weight: var(--font-weight-medium);
	}

	& span:nth-child(2) {
		font-size: 14px;
		font-weight: var(--font-weight-regular);
	}
`;

const Label = styled.label`
	font-weight: var(--font-weight-medium);
	font-size: 14px;
	color: var(--text-header-secondary);
`;

const Section = styled.div<{ row?: boolean }>`
	margin: 10px 0;
	display: flex;
	flex-direction: ${(props) => (props.row ? "row" : "column")};
	align-items: ${(props) => (props.row ? "center" : "stretch")};
	justify-content: space-between;
	gap: 10px;
`;

export const LabelWrapper = styled.div<{ error?: boolean }>`
	& label,
	span {
		color: ${(props) => (props.error ? "var(--error)" : "var(--text-header-secondary)")};
	}
`;

const schema = yup
	.object({
		type: yup
			.number()
			.oneOf(Object.values(ChannelType).filter((x) => typeof x === "number") as number[])
			.required(),
		name: yup.string().required(),
		private: yup.boolean(),
	})
	.required();

export function CreateChannelModel({ guild, category, ...props }: ModalProps<"create_channel">) {
	const app = useAppStore();
	const navigate = useNavigate();

	const [isLoading, setLoading] = React.useState(false);
	const [selectedIndex, setSelectedIndex] = React.useState(0);
	const {
		formState: { disabled, isSubmitting, isValid, errors },
		register,
		handleSubmit,
		setValue,
		setError,
		watch,
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: {
			type: CHANNEL_OPTIONS[0].type,
			private: false,
		},
	});

	const isDisabled = disabled || isLoading || isSubmitting || !isValid;

	const onSubmit = handleSubmit((data) => {
		// set form loading
		setLoading(true);
		app.rest
			.post<RESTPostAPIGuildChannelJSONBody, RESTPostAPIGuildChannelResult>(Routes.guildChannels(guild.id), {
				name: data.name,
				type: data.type,
				parent_id: category?.id,
				// permission_overwrites: []
			})
			.then((channel) => {
				// add the new channel to the guild
				app.channels.add(channel);
				guild.channels_.add(channel.id);

				// navigate to the new channel
				navigate(`/channels/${guild.id}/${channel.id}`);
				modalController.pop("close");
			})
			.catch((e) => {
				console.error(e);
				// error
				if (e.errors) {
					const t = messageFromFieldError(e.errors);
					if (t) {
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						setError(t.field as any, {
							type: "manual",
							message: t.error,
						});
					} else {
						setError("type", {
							type: "manual",
							message: e.message,
						});
					}
				} else {
					setError("type", {
						type: "manual",
						message: e.message,
					});
				}
				// only do this here because if successful there is no reason to re-enable the button
				setLoading(false);
			});
	});

	const nameProps = register("name", {
		required: true,
	});

	return (
		<Modal
			{...props}
			title={<TitleText>Create Channel</TitleText>}
			description={<DescriptionText>in {category ? category.name : guild.name}</DescriptionText>}
			actions={[
				{
					onClick: onSubmit,
					children: <span>Create Channel</span>,
					palette: "primary",
					size: "small",
					disabled: isDisabled,
				},
				{
					onClick: () => {
						modalController.pop("close");
					},
					children: <span>Cancel</span>,
					palette: "link",
					size: "small",
					confirmation: true,
				},
			]}
		>
			<Form>
				<List>
					<Section>
						<LabelWrapper error={!!errors.type}>
							<Label>Channel Type</Label>
							{errors.type && (
								<>
									<TextDivider>-</TextDivider>
									<InputErrorText>{errors.type.message}</InputErrorText>
								</>
							)}
						</LabelWrapper>
						{CHANNEL_OPTIONS.map((option, index) => (
							<ListItem
								active={index === selectedIndex}
								key={index}
								onClick={() => {
									setValue("type", option.type);
									setSelectedIndex(index);
								}}
								style={{
									display: "flex",
									alignItems: "center",
									flexDirection: "row",
								}}
							>
								{option.icon && <Icon icon={option.icon} color="var(--text-disabled)" size="24px" />}
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										gap: "3px",
										marginLeft: 10,
									}}
								>
									<span>{option.label}</span>
									<span>{option.description}</span>
								</div>
							</ListItem>
						))}
					</Section>
					<Section>
						<LabelWrapper error={!!errors.name}>
							<Label>Channel Name</Label>
							{errors.name && (
								<>
									<TextDivider>-</TextDivider>
									<InputErrorText>{errors.name.message}</InputErrorText>
								</>
							)}
						</LabelWrapper>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								backgroundColor: "var(--background-secondary)",
								borderRadius: 8,
								padding: "0 10px",
							}}
						>
							<Icon icon={CHANNEL_OPTIONS[selectedIndex].icon} size="16px" color="var(--text)" />
							<Input
								{...nameProps}
								onChange={(e) => {
									e.target.value = e.target.value.replace(" ", "-");
									nameProps.onChange(e);
								}}
								disableFocusRing
								style={{
									borderRadius: 8,
								}}
								placeholder="new-channel"
								error={!!errors.name}
							/>
						</div>
					</Section>
					{/* // TODO: Add private channel support */}
					{/* {(CHANNEL_OPTIONS[selectedIndex].canBePrivate ?? true) && (
						<Section row>
							<Label>Private Channel</Label>
							<Input {...register("private", { required: false })} type="checkbox" />
						</Section>
					)} */}
				</List>
			</Form>
		</Modal>
	);
}
