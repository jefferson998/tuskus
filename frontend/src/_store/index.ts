import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import taskReducer from './tasksSlice'
import registerReducer from './registerSlice'
const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks:taskReducer,
    register: registerReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;