import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API from '../../shared/api'

const initialState = {
  loading: false,
  users: [],
  error: ''
};

export const fetchUsers = createAsyncThunk('user/getCurrentUser', async () => {
  const response = await new API().getHttpClient().get('/sessions', { withCredentials: true })
  return response.data;
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  extraReducers: {
    [fetchUsers.pending]: (state) => {
      state.loading = true;
    },
    [fetchUsers.fulfilled]: (state, action) => {
      state.loading = false;
      state.users = action.payload.user;
      state.error = '';
    },
    [fetchUsers.rejected]: (state, action) => {
      state.loading = false;
      state.users = [];
      state.error = action.payload;
    },
  }
})

export const selectCurrentUser = (state) => state.user.users

export default userSlice.reducer;
