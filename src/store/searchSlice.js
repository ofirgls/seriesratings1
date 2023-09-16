import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
    name:'srarch',
    initialState: {inputSearch:''},
    reducers: {
        updateSearch: (state, action) => {
            state.inputSearch = action.payload;
        },
    }
})

export const { updateSearch } = searchSlice.actions;
export default searchSlice.reducer;