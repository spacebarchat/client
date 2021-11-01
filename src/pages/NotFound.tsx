import React, { useEffect } from "react";
import Link from "../components/Link";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import { useDispatch } from "react-redux";
import { useGetPokemonByNameQuery } from "../reducers/instances";

export default function NotFound() {
	const { data, error, isLoading } = useGetPokemonByNameQuery("bulbasaur");

	return (
		<SafeAreaView>
			<Text className="heading">Home</Text>
			<View>
				<Link to="/login">Login</Link>
				<Link to="/register">Register</Link>
				<Link to="/themes/editor">Theme Editor</Link>
				<Link to="/instances">Instances</Link>
				<Button>Test</Button>
			</View>
		</SafeAreaView>
	);
}
