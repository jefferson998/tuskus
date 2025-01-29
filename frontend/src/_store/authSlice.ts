import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { URL_API } from '../config';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

interface AuthState {
  token: string | null;
  error: string | null;
  success: string | null;
  loading: boolean;
}

export const login = createAsyncThunk<LoginResponse, LoginCredentials, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post<LoginResponse>(
        `${URL_API}/api/auth/login`,
        credentials,
        { withCredentials: true } 
      );

      localStorage.setItem('token', response.data.token);

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;

      return rejectWithValue(
        axiosError.response?.data?.message || "Login failed! Please try again."
      );
    }
  }
);

const initialState: AuthState = {
  token: localStorage.getItem('token') || null, 
  error: null,
  success: null,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
    logout: (state) => {
      state.token = null;
      state.error = null;
      state.success = null;
      localStorage.removeItem('token'); 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.success = "Login successful!";
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed!";
      });
  },
});

export const { clearMessages, logout } = authSlice.actions;
export default authSlice.reducer;
