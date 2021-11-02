import React, { useEffect } from "react";
import Link from "../components/Link";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import { useDispatch } from "react-redux";
import { useGetPokemonByNameQuery } from "../reducers/instances";
import Svg, { Circle } from "react-native-svg";

export default function NotFound() {
	const { data, error, isLoading } = useGetPokemonByNameQuery("bulbasaur");

	return (
		<SafeAreaView>
			<Text className="heading">Home</Text>

			<View>
				<Link to="/introduction">Introduction</Link>
				<Link to="/login">Login</Link>
				<Link to="/register">Register</Link>
				<Link to="/instances">Instances</Link>
				<Button>Test</Button>
			</View>
		</SafeAreaView>
	);
}
