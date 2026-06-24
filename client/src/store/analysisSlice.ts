import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./store";

// 1. Define the shape of our Analysis data (matches our backend model)
export interface IAnalysis {
  _id: string;
  resumeUrl: string;
  jobDescription: string;
  matchScore: number;
  matchingSkills: string[];
  missingKeywords: string[];
  suggestions: string[];
  createdAt: string;
}

// 2. Define the shape of the Slice's state
export interface AnalysisState {
  currentAnalysis: IAnalysis | null;
  history: IAnalysis[];
  isLoading: boolean;
  error: string | null;
}

// 3. Set the initial state
const initialState: AnalysisState = {
  currentAnalysis: null,
  history: [],
  isLoading: false,
  error: null,
};

// 4. Create the async thunk for submitting the analysis
// 4. Create the async thunk for submitting the analysis
export const analyzeResume = createAsyncThunk(
  "analysis/analyzeResume",
  async (formData: FormData, { rejectWithValue, getState }) => {
    try {
      // Grab the token from our global state
      const state = getState() as RootState;
      const token = state.auth.token;
      // Send the request to port 3000, and pass the token in the Headers!
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/analyze`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to analyze resume",
      );
    }
  },
);

export const fetchAnalysisHistory = createAsyncThunk(
  "analysis/fetchAnalysisHistory",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      const repsonse = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/analyze/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return repsonse.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get analysis history",
      );
    }
  },
);

// 5. Create the slice
const analysisSlice = createSlice({
  name: "analysis",
  initialState,
  reducers: {
    // We can add synchronous actions here later if we need to (like clearing the current analysis)
    clearCurrentAnalysis: (state) => {
      state.currentAnalysis = null;
    },
  },
  extraReducers: (builder) => {
    // When the request starts, set loading to true and clear any old errors
    builder.addCase(analyzeResume.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });

    builder.addCase(fetchAnalysisHistory.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });

    builder.addCase(
      fetchAnalysisHistory.fulfilled,
      (state, action: PayloadAction<IAnalysis[]>) => {
        state.isLoading = false;
        state.history = action.payload;
      },
    );

    builder.addCase(fetchAnalysisHistory.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // When the request succeeds, stop loading and save the analysis data
    builder.addCase(
      analyzeResume.fulfilled,
      (state, action: PayloadAction<IAnalysis>) => {
        state.isLoading = false;
        state.currentAnalysis = action.payload; // action.payload is the "response.data" we returned above
      },
    );

    // When the request fails, stop loading and save the error message
    builder.addCase(analyzeResume.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string; // action.payload is the string from "rejectWithValue"
    });
  },
});

// Export any synchronous actions
export const { clearCurrentAnalysis } = analysisSlice.actions;

// Export the reducer so we can add it to our store.ts
export default analysisSlice.reducer;
