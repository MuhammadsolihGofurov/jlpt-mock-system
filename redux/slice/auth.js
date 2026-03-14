import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import defaultAxios, { authAxios } from "../../utils/axios";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await defaultAxios.post("auth/login/", data);

      if (typeof window !== "undefined") {
        localStorage.setItem("access", res.data.access);
        localStorage.setItem("refresh", res.data.refresh);
      }

      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (__, { rejectWithValue }) => {
    try {
      const res = await authAxios.post("auth/logout/", {
        refresh: localStorage.getItem("refresh"),
      });

      return res;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await defaultAxios.post("auth/register/", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Ro'yxatdan o'tishda xatolik",
      );
    }
  },
);

// getMe thunk
export const getMe = createAsyncThunk(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const res = await authAxios.get("auth/me/");

      await new Promise((resolve) => setTimeout(resolve, 350));

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Sessiya muddati tugadi");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.clear();
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getMe.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(getMe.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
