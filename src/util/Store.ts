import { configureStore } from "@reduxjs/toolkit";
import { instances } from "../reducers/instances";
import { reducer as themes } from "../reducers/themes";

export default configureStore({
	reducer: {
		[instances.reducerPath]: instances.reducer,
		themes,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(instances.middleware),
});
