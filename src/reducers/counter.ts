import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
	name: "counter",
	initialState: 0,
	reducers: {
		increment: (state) => {
			return (state += 1);
		},
		decrement: (state) => {
			return (state -= 1);
		},
		incrementByAmount: (state, action) => {
			return (state += action.payload);
		},
	},
});

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export default counterSlice.reducer;
