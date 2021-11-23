import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createEntityAdapter, createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit";

interface Instance {
	id: string;
}

// https://raw.githubusercontent.com/fosscord/fosscord-community-instances/main/instances.json

export const instances = createApi({
	reducerPath: "instances",
	baseQuery: fetchBaseQuery({}),
	endpoints: (builder) => ({
		getInstances: builder.query<Instance[], void>({
			query: () => `https://raw.githubusercontent.com/fosscord/fosscord-community-instances/main/instances.json`,
		}),
	}),
});

export const { useGetInstancesQuery } = instances;
