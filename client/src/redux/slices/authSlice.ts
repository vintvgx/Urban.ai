// features/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebase/firebase.config";
import { AuthPayload, User, UserState } from "../../model/types";
import * as Sentry from "@sentry/react";

const initialState: UserState = {
  user: null,
  isLoggedIn: false,
  isLoading: false,
  error: undefined,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    authLoading: (state) => {
      state.isLoading = true;
    },
    authError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = true;
        state.isLoading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isLoggedIn = false;
        state.isLoading = false;
      });
  },
});

export const { setLoggedIn, setUser, authLoading, authError, clearError } =
  userSlice.actions;

export const login = createAsyncThunk(
  "user/login",
  async ({ email, password }: AuthPayload, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Capture successful login
      Sentry.captureMessage("User logged in", {
        level: "info",
        user: { email: email },
      });

      return userCredential.user;
    } catch (error) {
      Sentry.captureException(error, {
        extra: {
          email: email,
        },
      });

      return rejectWithValue(error);
    }
  }
);

export const signup = createAsyncThunk(
  "user/signup",
  async ({ email, password }: AuthPayload, { rejectWithValue }) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Capture successful signup
      Sentry.captureMessage("User signed up and logged in", {
        level: "info",
        user: { email: email },
      });

      return userCredential.user;
    } catch (error) {
      // Capture signup errors
      Sentry.captureException(error, {
        extra: {
          email: email,
        },
      });

      return rejectWithValue(error);
    }
  }
);

export const logout = createAsyncThunk("user/logout", async () => {
  await auth.signOut();
});

export default userSlice.reducer;
