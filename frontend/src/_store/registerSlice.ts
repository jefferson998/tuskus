import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { URL_API } from '../config';


interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}


interface RegisterResponse {
  token: string; 
}


interface RegisterState {
  token: string | null;
  error: string | null;
  success: string | null;
  loading: boolean;
}

interface AxiosErrorResponse {
    message: string;
  }


export const registerUser = createAsyncThunk<RegisterResponse, RegisterCredentials, { rejectValue: string }>(
    'register/registerUser',
    async (credentials, { rejectWithValue }) => {
      try {
        const api = URL_API;
        const response = await axios.post<RegisterResponse>(`${api}/api/auth/register`, credentials);
        return response.data; 
      } catch (error: unknown) {
        const axiosError = error as AxiosError<AxiosErrorResponse>; 
        return rejectWithValue(axiosError?.response?.data?.message || "Registration failed!");
      }
    }
  );

const registerSlice = createSlice({
  name: 'register',
  initialState: {
    token: null,
    error: null,
    success: null,
    loading: false,
  } as RegisterState, 
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<RegisterResponse>) => {
        state.loading = false;
        state.token = action.payload.token; 
        state.success = "Registration successful!";
      })
      .addCase(registerUser.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || "Registration failed!";
      });
  },
});


export const { clearMessages } = registerSlice.actions;
export default registerSlice.reducer;
