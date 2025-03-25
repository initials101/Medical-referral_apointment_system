import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API Base URL
const API_URL = "http://localhost:8000/api/referrals";

// 📌 Fetch All Referrals (Admin)
export const fetchAllReferrals = createAsyncThunk("referrals/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/all`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch referrals");
  }
});

// 📌 Fetch Referral by ID
export const fetchReferralById = createAsyncThunk("referrals/fetchById", async (referralId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/${referralId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Referral not found");
  }
});

// 📌 Create a New Referral
export const createReferral = createAsyncThunk("referrals/create", async (referralData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/create`, referralData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to create referral");
  }
});

// 📌 Approve a Referral
export const approveReferral = createAsyncThunk("referrals/approve", async (referralId, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${API_URL}/approve/${referralId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to approve referral");
  }
});

// 📌 Reject a Referral
export const rejectReferral = createAsyncThunk("referrals/reject", async (referralId, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${API_URL}/reject/${referralId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to reject referral");
  }
});

// 📌 Complete a Referral
export const completeReferral = createAsyncThunk("referrals/complete", async (referralId, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${API_URL}/complete/${referralId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to complete referral");
  }
});

// 📌 Fetch Referrals for a Specific Patient
export const fetchReferralsByPatient = createAsyncThunk("referrals/fetchByPatient", async (patientId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/patient/${patientId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "No referrals found for this patient");
  }
});

// 📌 Fetch Referrals Sent to a Specific Hospital
export const fetchReferralsByHospital = createAsyncThunk("referrals/fetchByHospital", async (hospitalId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/hospital/${hospitalId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "No referrals found for this hospital");
  }
});

// 📌 Referral Slice
const referralSlice = createSlice({
  name: "referrals",
  initialState: {
    referrals: [],
    referral: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetReferralError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Referrals
      .addCase(fetchAllReferrals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllReferrals.fulfilled, (state, action) => {
        state.loading = false;
        state.referrals = action.payload;
      })
      .addCase(fetchAllReferrals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Referral by ID
      .addCase(fetchReferralById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReferralById.fulfilled, (state, action) => {
        state.loading = false;
        state.referral = action.payload;
      })
      .addCase(fetchReferralById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Referral
      .addCase(createReferral.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReferral.fulfilled, (state, action) => {
        state.loading = false;
        state.referrals.push(action.payload);
      })
      .addCase(createReferral.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Approve Referral
      .addCase(approveReferral.pending, (state) => {
        state.loading = true;
      })
      .addCase(approveReferral.fulfilled, (state, action) => {
        state.loading = false;
        state.referrals = state.referrals.map((referral) =>
          referral._id === action.payload._id ? action.payload : referral
        );
      })
      .addCase(approveReferral.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reject Referral
      .addCase(rejectReferral.pending, (state) => {
        state.loading = true;
      })
      .addCase(rejectReferral.fulfilled, (state, action) => {
        state.loading = false;
        state.referrals = state.referrals.map((referral) =>
          referral._id === action.payload._id ? action.payload : referral
        );
      })
      .addCase(rejectReferral.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Complete Referral
      .addCase(completeReferral.pending, (state) => {
        state.loading = true;
      })
      .addCase(completeReferral.fulfilled, (state, action) => {
        state.loading = false;
        state.referrals = state.referrals.map((referral) =>
          referral._id === action.payload._id ? action.payload : referral
        );
      })
      .addCase(completeReferral.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetReferralError } = referralSlice.actions;
export default referralSlice.reducer;
