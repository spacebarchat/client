import { useModals } from "@mattjennings/react-modal-stack";
import { APIGuild, Routes } from "@spacebarchat/spacebar-api-types/v9";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import useLogger from "../../hooks/useLogger";
import { useAppStore } from "../../stores/AppStore";
import { messageFromFieldError } from "../../utils/messageFromFieldError";
import { Input, InputErrorText, InputLabel, InputWrapper, LabelWrapper } from "../AuthComponents";
import { Divider } from "../Divider";
import Icon from "../Icon";
import AddServerModal from "./AddServerModal";
import {
	ModalActionItem,
	ModalCloseWrapper,
	ModalContainer,
	ModalFooter,
	ModalHeaderText,
	ModalSubHeaderText,
	ModalWrapper,
	ModelContentContainer,
} from "./ModalComponents";

export const ModalHeader = styled.div`
	margin-bottom: 30px;
	padding: 24px 24px 0;
`;

const UploadIcon = styled.div`
	padding-top: 4;
	display: flex;
	justify-content: center;
	// color: var(--text);
	color: var(--text-disabled);
`;

const IconContainer = styled.div`
	height: 80px;
	position: relative;
	width: 80px;
`;

const IconInput = styled.input`
	display: none;
`;

const FileInput = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	opacity: 0;
	// cursor: pointer;
	cursor: not-allowed;
	font-size: 0px;
`;

const InputContainer = styled.div`
	margin-top: 24px;
	display: flex;
	flex-direction: column;
`;

type FormValues = {
	name: string;
};

function CreateServerModal() {
	const app = useAppStore();
	const logger = useLogger("CreateServerModal");
	const { openModal, closeModal } = useModals();
	const [selectedFile, setSelectedFile] = React.useState<File>();
	const fileInputRef = React.useRef<HTMLInputElement>(null);
	const navigate = useNavigate();

	if (!open) {
		return null;
	}

	const {
		register,
		handleSubmit,
		formState: { errors, isLoading },
		setError,
		setValue,
	} = useForm<FormValues>();

	React.useEffect(() => {
		setValue("name", `${app.account?.username}'s guild`);
	}, []);

	const onIconChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files) return;
		setSelectedFile(event.target.files[0]);
	};

	const onSubmit = handleSubmit((data) => {
		app.rest
			.post<Partial<APIGuild>, APIGuild>(Routes.guilds(), {
				name: data.name,
			})
			.then((r) => {
				navigate(`/channels/${r.id}`);
				closeModal();
			})
			.catch((r) => {
				if ("message" in r) {
					if (r.errors) {
						const t = messageFromFieldError(r.errors);
						if (t) {
							setError(t.field as keyof FormValues, {
								type: "manual",
								message: t.error,
							});
						} else {
							setError("name", {
								type: "manual",
								message: r.message,
							});
						}
					} else {
						setError("name", {
							type: "manual",
							message: r.message,
						});
					}
				} else {
					// unknown error
					logger.error(r);
					setError("name", {
						type: "manual",
						message: "Unknown Error",
					});
				}
			});
	});

	return (
		<ModalContainer>
			<ModalWrapper>
				<ModalCloseWrapper>
					<button
						onClick={closeModal}
						style={{
							background: "none",
							border: "none",
							outline: "none",
						}}
					>
						<Icon
							icon="mdiClose"
							size={1}
							style={{
								cursor: "pointer",
								color: "var(--text)",
							}}
						/>
					</button>
				</ModalCloseWrapper>

				<ModalHeader>
					<ModalHeaderText>Customize your guild</ModalHeaderText>
					<ModalSubHeaderText>
						Give your new guild a personality with a name and an icon. You can always change it later.
					</ModalSubHeaderText>
				</ModalHeader>

				<ModelContentContainer>
					<UploadIcon>
						<IconContainer>
							<svg width="80" height="80" viewBox="0 0 80 80" fill="none">
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="m 39.88 78.32 c 4.0666 0 8.0467 -0.648 11.8282 -1.9066 l -0.9101 -2.7331 c -3.4906 1.1606 -7.1626 1.7597 -10.921 1.7597 v 2.88 m 17.4528 -4.3056 c 3.5539 -1.8749 6.7824 -4.3142 9.5645 -7.2115 l -2.0765 -1.993 c -2.569 2.6755 -5.5526 4.9277 -8.833 6.6586 l 1.345 2.5459 m 13.4208 -11.9434 c 2.2752 -3.3091 4.0061 -6.9638 5.1178 -10.8346 l -2.7677 -0.7949 c -1.0253 3.5712 -2.6237 6.9437 -4.7232 9.9965 l 2.3731 1.633 m 6.2899 -16.5917 c 0.1814 -1.4918 0.2765 -2.9981 0.2794 -4.5158 c 0 -2.5805 -0.2448 -5.063 -0.7344 -7.4966 l -2.8224 0.5674 c 0.4522 2.2464 0.6797 4.5389 0.6797 6.9264 c -0.0029 1.3997 -0.0893 2.7936 -0.2592 4.1702 l 2.8598 0.3514 m -2.1254 -17.8243 c -1.4198 -3.7642 -3.4416 -7.2662 -5.976 -10.3824 l -2.2349 1.8173 c 2.3386 2.8771 4.2048 6.1114 5.5181 9.5818 l 2.6928 -1.0166 m -10.1923 -14.783 c -3.0038 -2.6669 -6.4195 -4.8384 -10.1146 -6.4195 l -1.1347 2.6467 c 3.4099 1.4602 6.5635 3.4646 9.337 5.927 l 1.9123 -2.1542 m -15.7334 -8.3117 c -2.9146 -0.7286 -5.927 -1.1059 -8.9827 -1.1174 c -1.0886 0 -2.065 0.0374 -3.0499 0.1123 l 0.2218 2.8714 c 0.9101 -0.0691 1.8115 -0.1037 2.8224 -0.1037 c 2.8195 0.0086 5.5987 0.3571 8.2915 1.031 l 0.6998 -2.7936 m -17.9654 -0.0634 c -3.9197 0.9504 -7.6406 2.5286 -11.0362 4.6627 l 1.5322 2.4394 c 3.1363 -1.9699 6.5693 -3.4243 10.1837 -4.3027 l -0.6797 -2.7994 m -15.889 8.2886 c -3.0154 2.6554 -5.5872 5.7888 -7.6118 9.2506 l 2.4883 1.4515 c 1.8691 -3.2026 4.2451 -6.0883 7.0301 -8.5421 l -1.9037 -2.16 m -10.1952 14.6189 c -1.4371 3.7238 -2.2723 7.6723 -2.4595 11.7274 l 2.8771 0.1325 c 0.1728 -3.744 0.9446 -7.3843 2.2694 -10.823 l -2.687 -1.0368 m -2.2464 17.8618 c 0.4694 4.0205 1.5811 7.9027 3.2832 11.52 l 2.6064 -1.224 c -1.5696 -3.3408 -2.5978 -6.9235 -3.0298 -10.633 l -2.8598 0.3341 m 6.2698 16.7443 c 2.2694 3.3149 5.0573 6.2467 8.2541 8.6688 l 1.7453 -2.2925 c -2.952 -2.2464 -5.5267 -4.9565 -7.6205 -8.015 l -2.376 1.6272 m 13.4352 11.9923 c 3.5424 1.872 7.3699 3.168 11.3558 3.8246 l 0.4666 -2.8426 c -3.6806 -0.6048 -7.2086 -1.8 -10.4774 -3.528 l -1.3478 2.5459 m 17.3376 4.3229 c 0.0691 0 0.0691 0 0.1382 0 v -2.88 c -0.0634 0 -0.0634 0 -0.1267 0 l -0.0115 2.88"
									fill="currentColor"
								></path>
								<path
									d="M40 29C37.794 29 36 30.794 36 33C36 35.207 37.794 37 40 37C42.206 37 44 35.207 44 33C44 30.795 42.206 29 40 29Z"
									fill="currentColor"
								></path>
								<path
									d="M48 26.001H46.07C45.402 26.001 44.777 25.667 44.406 25.111L43.594 23.891C43.223 23.335 42.598 23 41.93 23H38.07C37.402 23 36.777 23.335 36.406 23.89L35.594 25.11C35.223 25.667 34.598 26 33.93 26H32C30.895 26 30 26.896 30 28V39C30 40.104 30.895 41 32 41H48C49.104 41 50 40.104 50 39V28C50 26.897 49.104 26.001 48 26.001ZM40 39C36.691 39 34 36.309 34 33C34 29.692 36.691 27 40 27C43.309 27 46 29.692 46 33C46 36.31 43.309 39 40 39Z"
									fill="currentColor"
								></path>
								<path
									d="M24.6097 52.712V47.72H22.5457V52.736C22.5457 53.792 22.0777 54.404 21.1417 54.404C20.2177 54.404 19.7377 53.78 19.7377 52.712V47.72H17.6737V52.724C17.6737 55.04 19.0897 56.132 21.1177 56.132C23.1217 56.132 24.6097 55.016 24.6097 52.712ZM26.0314 56H28.0834V53.252H28.6114C30.6154 53.252 31.9474 52.292 31.9474 50.42C31.9474 48.62 30.7114 47.72 28.6954 47.72H26.0314V56ZM29.9554 50.456C29.9554 51.308 29.4514 51.704 28.5394 51.704H28.0594V49.268H28.5754C29.4874 49.268 29.9554 49.664 29.9554 50.456ZM37.8292 56L37.5532 54.224H35.0092V47.72H32.9572V56H37.8292ZM45.9558 51.848C45.9558 49.292 44.4078 47.564 42.0078 47.564C39.6078 47.564 38.0478 49.304 38.0478 51.872C38.0478 54.428 39.6078 56.156 41.9838 56.156C44.3958 56.156 45.9558 54.404 45.9558 51.848ZM43.8918 51.86C43.8918 53.504 43.1958 54.548 41.9958 54.548C40.8078 54.548 40.0998 53.504 40.0998 51.86C40.0998 50.216 40.8078 49.172 41.9958 49.172C43.1958 49.172 43.8918 50.216 43.8918 51.86ZM52.2916 56.084L54.3676 55.748L51.4876 47.684H49.2316L46.2556 56H48.2716L48.8236 54.284H51.6916L52.2916 56.084ZM50.2516 49.796L51.1756 52.676H49.3156L50.2516 49.796ZM62.5174 51.848C62.5174 49.388 61.0174 47.72 58.1374 47.72H55.2814V56H58.1854C60.9814 56 62.5174 54.308 62.5174 51.848ZM60.4534 51.86C60.4534 53.636 59.5414 54.404 58.0774 54.404H57.3334V49.316H58.0774C59.4814 49.316 60.4534 50.12 60.4534 51.86Z"
									fill="currentColor"
								></path>
							</svg>
							<IconInput
								ref={fileInputRef}
								type="file"
								name="icon"
								accept="image/*"
								onChange={onIconChange}
							/>
							<FileInput
								role="button"
								// disabled until I get the motiviation to not make it shit, I don't really want to use an invisible input
								onClick={() => fileInputRef.current?.click()}
							></FileInput>
						</IconContainer>
					</UploadIcon>

					<form>
						<InputContainer>
							<LabelWrapper error={!!errors.name}>
								<InputLabel>Guild Name</InputLabel>
								{errors.name && (
									<InputErrorText>
										<>
											<Divider>-</Divider>
											{errors.name.message}
										</>
									</InputErrorText>
								)}
							</LabelWrapper>
							<InputWrapper>
								<Input
									autoFocus
									{...register("name", { required: true })}
									placeholder="Guild Name"
									error={!!errors.name}
									disabled={isLoading}
								/>
							</InputWrapper>
						</InputContainer>
					</form>
				</ModelContentContainer>

				<ModalFooter>
					<ModalActionItem variant="filled" size="med" onClick={onSubmit} disabled={isLoading}>
						Create
					</ModalActionItem>

					<ModalActionItem
						variant="link"
						size="min"
						onClick={() => {
							closeModal();
							openModal(AddServerModal);
						}}
					>
						Back
					</ModalActionItem>
				</ModalFooter>
			</ModalWrapper>
		</ModalContainer>
	);
}

export default CreateServerModal;
