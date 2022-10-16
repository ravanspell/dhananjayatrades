import {createSlice} from '@reduxjs/toolkit'
import {createAsyncThunk} from '@reduxjs/toolkit'
import {loadSearchItems} from '../services/http'

const initialState = {
    items: [],
    loading: false,
}

export const getAllItems = createAsyncThunk(
    'stock/get_items',
    async () => {
        return await loadSearchItems();
    }
)

export const itemsSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {},
    extraReducers: builder => {

        builder.addCase(getAllItems.pending, (state) => {
            state.loading = true
        });

        builder.addCase(getAllItems.fulfilled, (state, action) => {
            state.items = action.payload.data
        });

        builder.addCase(getAllItems.rejected, (state) => {
            state.loading = false;
        });
    }
})

export default itemsSlice.reducer