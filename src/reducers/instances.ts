import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createEntityAdapter, createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit";

interface Instance {
	id: string;
}

// https://raw.githubusercontent.com/fosscord/fosscord-community-instances/main/instances.json

export const instances = createApi({
	reducerPath: "instances",
	baseQuery: fetchBaseQuery({ baseUrl: "https://pokeapi.co/api/v2/" }),
	endpoints: (builder) => ({
		getPokemonByName: builder.query<Instance, string>({
			query: (name) => `pokemon/${name}`,
		}),
	}),
});

export const { useGetPokemonByNameQuery } = instances;
