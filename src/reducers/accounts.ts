import { createEntityAdapter, createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit";

interface Account {
	id: string;
}

const adapter = createEntityAdapter<Account>({
	// Assume IDs are stored in a field other than `book.id`
	selectId: (x) => x.id,
	// Keep the "all IDs" array sorted based on book titles
	sortComparer: (a, b) => a.id.localeCompare(b.id),
});

const slice = createSlice({
	name: "accounts",
	initialState: adapter.getInitialState({ selected: undefined as Account | undefined }),
	reducers: {
		add: adapter.addOne,
		push: adapter.addMany,
		set: adapter.setAll,
		remove: adapter.removeOne,
		purge: adapter.removeMany,
		clear: adapter.removeAll,
		update: adapter.upsertOne,
		bulk: adapter.upsertMany,
		select: (state, action: PayloadAction<string>) => {
			state.selected = state.entities[action.payload];
		},
	},
});

export default slice.actions;
export const reducer = slice.reducer;
