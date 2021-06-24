import React from "react";
import { NativeBaseProvider, extendTheme, useColorMode } from "native-base";
import { useColorScheme } from "react-native";
import Test from "./Test";

const theme = extendTheme({
    colors: {
        brand: {
            900: "#8287af",
            800: "#7c83db",
            700: "#b3bef6",
        },
        backgroundColor: "white",
    },
    config: {
        initialColorMode: "dark",
        useSystemColorMode: true,
    },
});

export default function App() {
    return (
        <NativeBaseProvider theme={theme}>
            <Test />
        </NativeBaseProvider>
    );
}
