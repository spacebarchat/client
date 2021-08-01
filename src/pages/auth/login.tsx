import React, { useState } from "react";
import { useTranslation } from "react-i18next";
// import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { Box, Text, Heading, VStack, FormControl, Input, Button, HStack } from "native-base";
import { Link } from "../../util/Router";

//TODO: Sociallmedia Icons

export default function App() {
	const { t } = useTranslation("login");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	return (
		<Box p={2} w="80%" mx="auto">
			<Heading size="lg">{t("login")}</Heading>
			<VStack space={2} mt={5}>
				<FormControl>
					<FormControl.Label _text={{ fontSize: "sm", fontWeight: 600 }}>
						<Text>{t("emailTelephone")}</Text>
					</FormControl.Label>
					<Input onChangeText={(t) => setUsername(t)} />
				</FormControl>
				<FormControl mb={5}>
					<FormControl.Label _text={{ fontSize: "sm", fontWeight: 600 }}>
						{t("password")}
					</FormControl.Label>
					<Input type="password" onChangeText={(t) => setPassword(t)} />
					<Link to="/forgot-password">
						<Text fontSize="xs" fontWeight="700" color="primary.500">
							{t("forgotPassword")}
						</Text>
					</Link>
				</FormControl>
				<VStack space={2}>
					<Heading color="red.400" size="xs">
						{errorMessage}
					</Heading>
					<Button colorScheme="primary">{t("login")}</Button>

					<HStack justifyContent="center" alignItems="center">
						{/* <Icon as={Ionicons} name="home" /> */}
						{/* <IconButton
								icon={"facebook"}
								variant="unstyled"
								startIcon={
									<Icon as={<MaterialCommunityIcons name="facebook" />} color="muted.700" size="sm" />
								}
							/>
							<IconButtonc
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
							/> */}
					</HStack>
				</VStack>
				<HStack justifyContent="center">
					<Link to="/register">
						<Text color="primary.500" bold={true} fontSize="sm">
							{t("registerNotice")}
						</Text>
					</Link>
				</HStack>
			</VStack>
		</Box>
	);
}
