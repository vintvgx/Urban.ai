// store.ts

import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import userReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

// Define a type for the slice state
export type RootState = ReturnType<typeof store.getState>;

// Define the AppDispatch types
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
