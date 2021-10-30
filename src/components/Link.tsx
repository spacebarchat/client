import React, { ReactNode } from "react";
import { useHistory } from "react-router";
import Button, { ButtonProps } from "./Button";

export default function Link(props: { to: string; children: ReactNode } & ButtonProps) {
	const history = useHistory();

	return <Button className="link" onPress={() => history.push(props.to)} {...props}></Button>;
}
