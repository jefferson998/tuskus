import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Acción asíncrona para obtener tareas
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (token:string) => {
  const response = await axios.get("http://localhost:4000/api/tasks", {
    headers: {
      token, // Aquí se envía el token directamente en los headers
    },
  });
  return response.data; // Devuelve la lista de tareas
});

// Acción asíncrona para agregar una nueva tarea
export const addTask = createAsyncThunk('tasks/addTask', async ({ title, description, progress, token }:{ title:string, description:string, progress:string, token:string }) => {
  const response = await axios.post(
    "http://localhost:4000/api/tasks",
    { title, description, progress },
    { headers: { token } }
  );
  return response.data; // Devuelve la tarea agregada
});

// Slice de tareas
const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearTasks: (state) => {
      state.tasks = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state:any, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTask.fulfilled, (state:any, action:any) => {
        state.loading = false;
        state.tasks.push(action.payload); // Agrega la nueva tarea al estado
      })
      .addCase(addTask.rejected, (state:any, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearTasks } = tasksSlice.actions;
export default tasksSlice.reducer;