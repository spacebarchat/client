import React from "react";
import { KeyboardAvoidingView, ScrollView, KeyboardAvoidingViewProps } from "react-native";

type Props = KeyboardAvoidingViewProps & { children: React.ReactNode };

const KeyboardAwareScrollView = (props: Props): JSX.Element => {
	const { children } = props;

	return (
		<KeyboardAvoidingView style={{ flex: 1 }} {...props}>
			<ScrollView contentContainerStyle={{ flexGrow: 1 }}>{children}</ScrollView>
		</KeyboardAvoidingView>
	);
};

export default KeyboardAwareScrollView;
