import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, fetchMe } from '../../api/authApi';

export const login = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const data = await loginUser(credentials);
    localStorage.setItem('token', data.token);
    localStorage.setItem('tenantId', data.user.tenantId || '');
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const loadUser = createAsyncThunk('auth/loadUser', async (_, thunkAPI) => {
  try {
    const data = await fetchMe();
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Load user failed');
  }
});

const hasToken = !!localStorage.getItem('token');

const initialState = {
  token: localStorage.getItem('token') || null,
  isAuthenticated: hasToken,
  user: null,
  // Start in loading state if we have a token so routes wait
  // for the user to be fetched before making role-based decisions
  loading: hasToken,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('tenantId');
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      // Load User
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(loadUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('tenantId');
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
