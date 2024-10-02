import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {URL_API} from '../config'


export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (token:string) => {
  const response = await axios.get(URL_API+"/api/tasks", {
    headers: {
      token, 
    },
  });
  return response.data; 
});


export const addTask = createAsyncThunk('tasks/addTask', async ({ title, description, progress, token }:{ title:string, description:string, progress:string, token:string }) => {
  const response = await axios.post(
    URL_API+"/api/tasks",
    { title, description, progress },
    { headers: { token } }
  );
  return response.data; 
});


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
        state.tasks.push(action.payload); 
      })
      .addCase(addTask.rejected, (state:any, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearTasks } = tasksSlice.actions;
export default tasksSlice.reducer;