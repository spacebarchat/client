import {
	Avatar,
	Button,
	Center,
	Heading,
	HStack,
	Input,
	KeyboardAvoidingView,
	Modal,
	Stack,
	Text,
	VStack,
} from "native-base";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useState } from "react";
import { Image } from "react-native";
import { useDesktop } from "../../util/MediaQuery";
import DeviceInfo from "react-native-device-info";

const settingsModal = ({
	open,
	setOpen,
}: {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
	const [show, setShow] = React.useState(false);
	const handleClick = () => setShow(!show);
	const isDesktop = useDesktop();

	const [newUsername, setNewUsername] = useState("");
	const [newEmail, setNewEmail] = useState("");
	const [newPassword, setNewPassword] = useState("");

	return (
		<Modal isOpen={open} onClose={() => setOpen(false)} size={isDesktop ? "md" : "full"}>
			<Modal.Content>
				<Modal.CloseButton />
				<Modal.Header>Settings</Modal.Header>
				<Modal.Body style={{ justifyContent: "center", alignItems: "center" }}>
					<VStack mb={5} style={{ justifyContent: "center", alignItems: "center" }}>
						<Avatar
							size="xl"
							source={{
								uri: "https://avatars.githubusercontent.com/u/53957363?v=4",
							}}
						>
							{/* TODO: Anfangsbuchstaben wörter in name */}
						</Avatar>
						<Heading mt={2} size="md">
							Stefan080106
						</Heading>
					</VStack>
					<HStack>
						<Input
							my={1}
							variant="outline"
							placeholder="Username"
							_light={{
								placeholderTextColor: "blueGray.400",
							}}
							_dark={{
								placeholderTextColor: "blueGray.50",
							}}
							onChangeText={(x) => setNewUsername(x)}
						/>
						<Button
							size="sm"
							disabled={newUsername === ""}
							onPress={() => console.log("Save new username")}
						>
							Save new username
						</Button>
						<Input
							my={1}
							variant="outline"
							placeholder="Email"
							_light={{
								placeholderTextColor: "blueGray.400",
							}}
							_dark={{
								placeholderTextColor: "blueGray.50",
							}}
							onChangeText={(x) => setNewEmail(x)}
						/>
						<Button
							size="sm"
							disabled={newEmail === ""}
							onPress={() => console.log("Save new email")}
						>
							Save new email
						</Button>
						<Input
							my={1}
							variant="outline"
							type={show ? "text" : "password"}
							InputRightElement={
								<Button
									ml={1}
									roundedLeft={0}
									roundedRight="md"
									onPress={handleClick}
									width="100px"
								>
									{show ? "Hide" : "Show"}
								</Button>
							}
							placeholder="Password"
							onChangeText={(x) => setNewPassword(x)}
						/>
						<Button
							size="sm"
							disabled={newPassword === ""}
							onPress={() => console.log("Save new Password")}
						>
							Save new Password
						</Button>
					</HStack>
				</Modal.Body>
				<Modal.Footer style={{ justifyContent: "center", alignItems: "center" }}>
					<Text style={{ opacity: 0.5 }}>
						{DeviceInfo.getBuildNumber() != "unknown" &&
							"Buildnumber: " + DeviceInfo.getBuildNumber()}
					</Text>
				</Modal.Footer>
			</Modal.Content>
		</Modal>
	);
};

export default settingsModal;
