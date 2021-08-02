import React from "react";
import { AddIcon, Box, Button, Heading, HStack } from "native-base";

export default function () {
	return (
		<Box>
			<Heading size="2xl">Buttons</Heading>
			<HStack space={3}>
				<Button>Primary</Button>
				<Button colorScheme="secondary">Secondary</Button>
				<Button colorScheme="success">Success</Button>
				<Button colorScheme="danger">Danger</Button>
			</HStack>

			<Heading size="md">Sizes</Heading>
			<HStack space={3} alignItems="center">
				<Button size="xs">Very small</Button>
				<Button size="sm">Small</Button>
				<Button size="md">Medium</Button>
				<Button size="lg">Large</Button>
			</HStack>

			<Heading size="md">Variants</Heading>
			<HStack space={3} alignItems="center">
				<Button variant="solid">Solid</Button>
				<Button variant="outline">Outline</Button>
				<Button variant="ghost">Ghost</Button>
				<Button variant="link">Link</Button>
				<Button variant="unstyled">Unstyled</Button>
			</HStack>

			<Heading size="md">States</Heading>
			<HStack space={3} alignItems="center">
				<Button>Default</Button>
				<Button isLoading>Loading</Button>
				<Button isDisabled>Disabled</Button>
				<Button startIcon={<AddIcon size={5}></AddIcon>}>Icon</Button>
			</HStack>
		</Box>
	);
}
