import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const login = createAsyncThunk('auth/login', async (credentials: { email: string; password: string }) => {
  const response = await axios.post('http://localhost:4000/api/auth/login', credentials);
  return response.data; // Devuelve los datos del token
});

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