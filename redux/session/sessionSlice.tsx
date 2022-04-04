import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import API from '../../components/shared/api'
import { RootState } from '../store';

export interface User {
  readonly id: string
  isEmailVerified: boolean
  name: string
  role: string
  email: string
}

export interface UserState {
  loggedIn: boolean
  value: User
  status: 'idle' | 'loading' | 'failed'
  error: string
}

const initialState: UserState = {
  loggedIn: false,
  value: {} as User,
  status: 'idle',
  error: ''
};

export const fetchUser = createAsyncThunk('session/getCurrentUser', async () => {
  const response = await API.get(`/users/${localStorage.getItem('userID')}`)
  return response;
});

export const sessionSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchUser.fulfilled, (state, action: any) => {
        state.status = 'idle'
        state.loggedIn = true
        state.value = action.payload
        state.error = ''
      })
      .addCase(fetchUser.rejected, (state, action: any) => {
        state.status = 'idle'
        state.loggedIn = false
        state.value = {} as User
        state.error = action.payload
      });
  },
});

export const selectUser = (state: RootState) => state.session;

export default sessionSlice.reducer;
