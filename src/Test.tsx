import React, { useEffect } from "react";
import {
    Input,
    StatusBar,
    Box,
    KeyboardAvoidingView,
    useColorMode,
    useTheme,
    useColorModeValue,
} from "native-base";
import { useColorScheme } from "react-native";

export default function Test() {
    const { setColorMode } = useColorMode();
    const colorScheme = useColorScheme() || "white";
    const theme = useTheme();
    const backgroundColor = useColorModeValue("white", "black");
    theme.colors.backgroundColor = backgroundColor;

    useEffect(() => {
        setColorMode(colorScheme);
    }, [colorScheme, setColorMode]);

    console.log(colorScheme, theme.colors.backgroundColor);

    return (
        <>
            <StatusBar></StatusBar>
            <Box
                safeArea
                backgroundColor={theme.colors.backgroundColor}
                height="100%"
            >
                <KeyboardAvoidingView behavior="padding">
                    <Input />
                </KeyboardAvoidingView>
            </Box>
        </>
    );
}
