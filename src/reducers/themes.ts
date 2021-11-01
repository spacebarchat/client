import { createEntityAdapter, createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit";
import { Rules } from "../util/CSSToRN";

const slice = createSlice({
	name: "themes",
	initialState: ((global as any).themeCache || []) as Rules[],
	reducers: {
		set(state, action: PayloadAction<Rules[]>) {
			return action.payload;
		},
	},
});

export default slice.actions;
export const reducer = slice.reducer;
