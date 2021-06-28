import React, { ReactNode, useState } from "react";
import { NativeBaseProvider, extendTheme, useColorMode } from "native-base";

export const Theme = React.createContext<
    [any, React.Dispatch<React.SetStateAction<any>>]
    // @ts-ignore
>([]);

export default function ({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState(
        extendTheme({
            components: {
                HStack: {
                    baseStyle: {
                        flexWrap: "wrap",
                    },
                },
                ZStack: {
                    baseStyle: {
                        flexWrap: "wrap",
                    },
                },
                Button: {
                    defaultProps: {
                        _text: { color: "lightText", fontSize: 14 },
                        _hover: { backgroundColor: "primary.500" },
                        _pressed: { backgroundColor: "primary.600" },
                    },
                    baseStyle: {
                        width: "auto",
                        backgroundColor: "black",
                        paddingHorizontal: 16,
                        paddingVertical: 2,
                    },
                },
                Box: {
                    defaultProps: {
                        _text: { color: "text" },
                    },
                    baseStyle: {
                        // width: "100%",
                        flexWrap: "wrap",
                    },
                },
                Text: {
                    baseStyle: {
                        color: "text",
                        fontSize: 18,
                    },
                },
                Heading: {
                    baseStyle: {
                        color: "text",
                    },
                },
            },
            colors: {
                text: "white",
                backgroundColor: {
                    300: "#383C41",
                    400: "#36393F",
                    500: "#292B2F",
                    600: "#1D1F21",
                    700: "#18191c",
                    800: "#17181A",
                    900: "#000000",
                },
                primary: {
                    50: "#f7f7fe",
                    100: "#dee0fc",
                    200: "#bcc1fa",
                    300: "#7983f5",
                    400: "#5865f2",
                    500: "#4752c4",
                    600: "#3c45a5",
                    700: "#1a1e49",
                    800: "#04050c",
                },
                // Redefinig only one shade, rest of the color will remain same.
                amber: {
                    400: "#d97706",
                },
            },
            config: {
                initialColorMode: "dark",
                useSystemColorMode: true,
            },
        })
    );

    return (
        <Theme.Provider value={[theme, setTheme]}>
            <NativeBaseProvider theme={theme}>{children}</NativeBaseProvider>
        </Theme.Provider>
    );
}
