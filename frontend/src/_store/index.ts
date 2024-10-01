import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import taskReducer from './tasksSlice'
const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks:taskReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;