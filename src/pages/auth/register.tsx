import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
	NativeBaseProvider,
	Box,
	Text,
	Heading,
	VStack,
	FormControl,
	Input,
	Button,
	Icon,
	IconButton,
	HStack,
	Divider,
} from "native-base";
import { Link } from "../../util/Router";

//TODO: Sociallmedia Icons

export default function () {
	const { t } = useTranslation("register");

	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	return (
		<Box flex={1} p={2} w="90%" mx="auto">
			<Heading size="lg">{t("register")}</Heading>

			<VStack space={2} mt={5} width="100%">
				<FormControl>
					<FormControl.Label _text={{ fontSize: "sm", fontWeight: 600 }}>
						{t("email")}
					</FormControl.Label>
					<Input onChangeText={(t) => setEmail(t)} />
				</FormControl>
				<FormControl>
					<FormControl.Label _text={{ fontSize: "sm", fontWeight: 600 }}>
						{t("username")}
					</FormControl.Label>
					<Input onChangeText={(t) => setUsername(t)} />
				</FormControl>
				<FormControl>
					<FormControl.Label _text={{ fontSize: "sm", fontWeight: 600 }}>
						{t("password")}
					</FormControl.Label>
					<Input type="password" onChangeText={(t) => setPassword(t)}></Input>
				</FormControl>
				<VStack space={2} mt={5}>
					<Button>{t("submit")}</Button>
					{/* 
						<HStack justifyContent="center" alignItem="center">
							<IconButton
								variant="unstyled"
								startIcon={
									<Icon as={<MaterialCommunityIcons name="facebook" />} color="muted.700" size="sm" />
								}
							/>
							<IconButton
								variant="unstyled"
								startIcon={
									<Icon as={<MaterialCommunityIcons name="google" />} color="muted.700" size="sm" />
								}
							/>
							<IconButton
								variant="unstyled"
								startIcon={
									<Icon as={<MaterialCommunityIcons name="github" />} color="muted.700" size="sm" />
								}
							/>
						</HStack>
							*/}
				</VStack>
				<HStack justifyContent="center">
					<Link to="/login">
						<Text color="primary.500" bold={true} fontSize="sm">
							{t("loginNotice")}
						</Text>
					</Link>
				</HStack>
			</VStack>
		</Box>
	);
}
