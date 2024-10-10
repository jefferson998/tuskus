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
      const api = URL_API;
      console.log("🚀 ~ api:", api)
      
      const response = await axios.post<LoginResponse>(`${api}/api/auth/login`, credentials);
      return response.data; 
    } catch (error:any) {
    
      const axiosError:any = error as AxiosError;
      return rejectWithValue(axiosError.response?.data.message || "Login failed!");
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    error: null,
    success: null,
    loading: false,
  } as AuthState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
    logout: (state) => {
      state.token = null; 
      state.error = null; 
      state.success = null;
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
      })
      .addCase(login.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;

        state.error = action.payload || "Login failed!";
      });
  },
});

export const { clearMessages, logout } = authSlice.actions;
export default authSlice.reducer;