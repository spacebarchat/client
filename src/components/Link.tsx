import React, { ReactNode } from "react";
import { useNavigate } from "react-router";
import Button, { ButtonProps } from "./Button";

export default function Link(props: { to: string; children: ReactNode } & ButtonProps) {
	const navigate = useNavigate();

	return <Button className="link" onPress={() => navigate(props.to)} {...props} />;
}
