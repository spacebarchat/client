import React from "react";
import { Box, Checkbox, Heading, HStack } from "native-base";

export default function () {
    return (
        <Box marginTop={5}>
            <Heading size="2xl">Checkboxes</Heading>

            <HStack space={5}>
                <Checkbox
                    accessibilityLabel="dummy"
                    value=""
                    defaultIsChecked
                />
                <Checkbox accessibilityLabel="dummy" value="" />
            </HStack>

            <Heading size="md" marginTop={5}>
                Labels
            </Heading>
            <HStack size="md" space={5}>
                <Checkbox defaultIsChecked value="">
                    One
                </Checkbox>
                <Checkbox value="">Two</Checkbox>
            </HStack>

            <Heading size="md" marginTop={5}>
                Disabled
            </Heading>
            <HStack space={5}>
                <Checkbox value="" isDisabled defaultIsChecked>
                    One
                </Checkbox>
                <Checkbox value="" isDisabled>
                    Two
                </Checkbox>
            </HStack>
        </Box>
    );
}
