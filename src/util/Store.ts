import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector, useStore } from "react-redux";
import instances from "../reducers/instances";
import { reducer as themes } from "../reducers/themes";

const store = configureStore({
	reducer: {
		instances: instances.reducer,
		themes,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppStore = () => useStore<RootState>();

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
