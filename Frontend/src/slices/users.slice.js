import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { sendLogin } from '../services/http'

const initialState = {
    authToken: null,
    id: "",
    user: "",
    loading: false,
    role: "",
}

export const userLogin = createAsyncThunk(
  'users/login',
  async (userData) => {
    return await sendLogin(userData);
  }
)

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: builder => {

    builder.addCase(userLogin.pending, (state) => {
        state.loading = true
    });

    builder.addCase(userLogin.fulfilled, (state, action) => {
        const {token, username, id, role} = action.payload.data
        state.loading = false
        state.authToken = token
        state.user = username
        state.id = id
        state.role = role
    });

    builder.addCase(userLogin.rejected, (state) => {
        state.loading = false;
    });
  }
})

export default userSlice.reducer