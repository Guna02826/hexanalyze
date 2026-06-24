import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};


const authSlice = createSlice({
  name: "auth", 
  initialState, 
  reducers: {
   
    setAuthCredentials: (
      state,
      action: PayloadAction<{ user: any; token: string }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },

    setAccessToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setAuthCredentials, setAccessToken, logout } = authSlice.actions;

export default authSlice.reducer;
