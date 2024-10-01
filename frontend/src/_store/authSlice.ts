import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {URL_API} from '../config'


interface LoginResponse {
  token: string;
  // otros posibles datos que devuelve el login
}

interface LoginCredentials {
  email: string;
  password: string;
}

export const login = createAsyncThunk<LoginResponse, LoginCredentials>(
  'auth/login',
  async (credentials) => {
    const api = URL_API
    const response = await axios.post(api+'/api/auth/login', credentials);
    return response.data as LoginResponse; // Devuelve los datos del token
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    error: null,
    success: null,
    loading: false,
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
    logout: (state) => {
      state.token = null; // Elimina el token al cerrar sesión
      state.error = null; // Limpia cualquier error
      state.success = null; // Limpia el mensaje de éxito
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(login.fulfilled, (state:any, action) => {
        state.loading = false;
        state.token = action.payload.token; // Almacena el token
        state.success = "Login successful!";
      })
      .addCase(login.rejected, (state:any, action) => {
        state.loading = false;
        state.error = action.error.message || "Login failed!";
      });
  },
});

export const { clearMessages,logout } = authSlice.actions;
export default authSlice.reducer;