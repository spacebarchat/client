import React, { ReactNode } from "react";

import { Box, StatusBar, KeyboardAvoidingView, useTheme } from "native-base";

export default function ({ children }: { children: ReactNode }) {
    const theme = useTheme();

    console.log(theme.colors.backgroundColor);

    return (
        <Box height="100%" backgroundColor={theme.colors.backgroundColor[400]}>
            <StatusBar></StatusBar>
            <Box safeArea margin="5">
                <KeyboardAvoidingView behavior="padding">
                    {children}
                </KeyboardAvoidingView>
            </Box>
        </Box>
    );
}
