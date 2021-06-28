import React, { useState } from "react";
import Theme from "./components/Theme";
import Routes from "./components/Routes";
import Boundary from "./components/Boundary";
import { Client } from "fosscord.js";
const client = new Client();

export default function App() {
    return (
        <Theme>
            <Boundary>
                <Routes></Routes>
            </Boundary>
        </Theme>
    );
}
