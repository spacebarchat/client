import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createEntityAdapter, createSlice, configureStore, PayloadAction, EntityStateAdapter, createAsyncThunk } from "@reduxjs/toolkit";
import request from "../util/request";
// import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Instance {
	name: string;
	url?: string;
	description?: string;
	image?: string;
	official?: boolean;
}

const defaultInstances = [
	{
		name: "Discord",
		url: "https://discord.com",
		image: "https://logodownload.org/wp-content/uploads/2017/11/discord-logo-0.png",
		official: true,
	},
] as Instance[];

const load = createAsyncThunk("instances", async (_, {}) =>
	request("https://raw.githubusercontent.com/fosscord/fosscord-community-instances/main/instances.json")
);

const entity = createEntityAdapter<Instance>({
	selectId: (x) => x.name,
	sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const slice = createSlice({
	name: "instances",
	initialState: entity.getInitialState({ loading: false, error: null }),
	reducers: {
		addOne: entity.addOne,
		addMany: entity.addMany,
		removeAll: entity.removeAll,
		removeMany: entity.removeMany,
		removeOne: entity.removeOne,
		setAll: entity.setAll,
		setMany: entity.setMany,
		setOne: entity.setOne,
		updateMany: entity.updateMany,
		updateOne: entity.updateOne,
		upsertMany: entity.upsertMany,
		upsertOne: entity.upsertOne,
	},
	extraReducers: (builder) => {
		builder.addCase(load.pending, (state, action) => {
			state.loading = true;
			state.error = null;
		});

		builder.addCase(load.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload as any;
		});

		builder.addCase(load.fulfilled, (state, action) => {
			state.loading = false;
			state.entities = action.payload;
		});
	},
});

export default { ...slice.actions, load, ...slice, ...entity.getSelectors() };
