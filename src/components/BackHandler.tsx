import React, { ReactNode, useEffect } from "react";
import { BackHandler as BH } from "react-native";
import { useNavigate } from "react-router";

export default function BackHandler(props: { children?: ReactNode }) {
	const navigate = useNavigate();

	useEffect(() => {
		const listener = BH.addEventListener("hardwareBackPress", function () {
			navigate(-1);
			return true;
		});

		return () => listener.remove();
	}, []);

	return <>{props.children}</>;
}
