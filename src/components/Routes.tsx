import React from "react";
import { Platform } from "react-native";
import { Route, Routes as RR } from "./Router";

var Introduction: any;
var LoginPage: any;
var RegisterPage: any;
var NotFoundPage: any;
var InstancesPage: any;

if (Platform.OS === "macos") {
	Introduction = require("../pages/Introduction/index").default;
	LoginPage = require("../pages/Login").default;
	RegisterPage = require("../pages/Register").default;
	NotFoundPage = require("../pages/NotFound").default;
	InstancesPage = React.lazy(() => import("../pages/Instances"));
} else {
	Introduction = React.lazy(() => import("../pages/Introduction/index"));
	LoginPage = React.lazy(() => import("../pages/Login"));
	RegisterPage = React.lazy(() => import("../pages/Register"));
	NotFoundPage = React.lazy(() => import("../pages/NotFound"));
	InstancesPage = React.lazy(() => import("../pages/Instances"));
}

export default function Routes() {
	return (
		<RR>
			<Route path="/introduction" element={<Introduction />}></Route>
			<Route path="/login" element={<LoginPage />}></Route>
			<Route path="/register" element={<RegisterPage />}></Route>
			<Route path="/instances" element={<InstancesPage />}></Route>
			<Route path="*" element={<NotFoundPage />}></Route>
		</RR>
	);
}
