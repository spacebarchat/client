import React from "react";
import { Platform } from "react-native";
import { Route, Routes as RR } from "./Router";

var Introduction: any;
var LoginPage: any;
var RegisterPage: any;
var NotFoundPage: any;

if (Platform.OS === "macos") {
	Introduction = require("../pages/Introduction/index").default;
	LoginPage = require("../pages/Login").default;
	RegisterPage = require("../pages/Register").default;
	NotFoundPage = require("../pages/NotFound").default;
} else {
	Introduction = React.lazy(() => import("../pages/Introduction/index"));
	LoginPage = React.lazy(() => import("../pages/Login"));
	RegisterPage = React.lazy(() => import("../pages/Register"));
	NotFoundPage = React.lazy(() => import("../pages/NotFound"));
}

console.log("intro", Introduction);

export default function Routes() {
	return (
		<RR>
			<Route path="/introduction" element={<Introduction />}></Route>
			<Route path="/login" element={<LoginPage />}></Route>
			<Route path="/register" element={<RegisterPage />}></Route>
			<Route path="*" element={<NotFoundPage />}></Route>
		</RR>
	);
}
