import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../server";

// ✅ Async action to fetch all referrals
export const fetchAllReferrals = createAsyncThunk("referral/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${server}/referrals`);
    return data;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

// ✅ Async action to fetch referrals for a specific patient
export const fetchPatientReferrals = createAsyncThunk("referral/fetchPatient", async (patientId, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${server}/referrals/patient/${patientId}`);
    return data;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

// ✅ Async action to create a new referral
export const createReferral = createAsyncThunk("referral/create", async (referralData, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${server}/referrals/create`, referralData, { withCredentials: true });
    return data;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

// ✅ Async action to update referral status
export const updateReferralStatus = createAsyncThunk("referral/updateStatus", async ({ referralId, status }, { rejectWithValue }) => {
  try {
    const { data } = await axios.put(`${server}/referrals/update/${referralId}`, { status }, { withCredentials: true });
    return data;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

// ✅ Async action to delete a referral
export const deleteReferral = createAsyncThunk("referral/delete", async (referralId, { rejectWithValue }) => {
  try {
    await axios.delete(`${server}/referrals/delete/${referralId}`, { withCredentials: true });
    return referralId; // Return ID to remove from state
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

// 📌 Referral Slice
const referralSlice = createSlice({
  name: "referral",
  initialState: { referrals: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllReferrals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllReferrals.fulfilled, (state, action) => {
        state.loading = false;
        state.referrals = action.payload;
      })
      .addCase(fetchAllReferrals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchPatientReferrals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPatientReferrals.fulfilled, (state, action) => {
        state.loading = false;
        state.referrals = action.payload;
      })
      .addCase(fetchPatientReferrals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createReferral.pending, (state) => {
        state.loading = true;
      })
      .addCase(createReferral.fulfilled, (state, action) => {
        state.loading = false;
        state.referrals.push(action.payload);
      })
      .addCase(createReferral.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateReferralStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateReferralStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.referrals.findIndex((referral) => referral._id === action.payload._id);
        if (index !== -1) {
          state.referrals[index] = action.payload;
        }
      })
      .addCase(updateReferralStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteReferral.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteReferral.fulfilled, (state, action) => {
        state.loading = false;
        state.referrals = state.referrals.filter((referral) => referral._id !== action.payload);
      })
      .addCase(deleteReferral.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export reducer
export default referralSlice.reducer;
