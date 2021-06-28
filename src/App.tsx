import React, { useState } from "react";
import Theme from "./components/Theme";
import Routes from "./components/Routes";
import Boundary from "./components/Boundary";

export default function App() {
    return (
        <Theme>
            <Boundary>
                <Routes></Routes>
            </Boundary>
        </Theme>
    );
}
