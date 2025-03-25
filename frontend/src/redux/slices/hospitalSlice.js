import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API Base URL
const API_URL = "http://localhost:8000/api/hospitals";

// 📌 Fetch All Hospitals
export const fetchAllHospitals = createAsyncThunk("hospitals/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/all`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch hospitals");
  }
});

// 📌 Fetch Hospital by ID
export const fetchHospitalById = createAsyncThunk("hospitals/fetchById", async (hospitalId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/${hospitalId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Hospital not found");
  }
});

// 📌 Register a New Hospital
export const registerHospital = createAsyncThunk("hospitals/register", async (hospitalData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/register`, hospitalData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Hospital registration failed");
  }
});

// 📌 Update Hospital Information
export const updateHospital = createAsyncThunk("hospitals/update", async ({ hospitalId, updatedData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${API_URL}/update/${hospitalId}`, updatedData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to update hospital");
  }
});

// 📌 Delete Hospital (Admin)
export const deleteHospital = createAsyncThunk("hospitals/delete", async (hospitalId, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/delete/${hospitalId}`);
    return hospitalId; // Return deleted hospital ID to remove from state
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete hospital");
  }
});

// 📌 Hospital Slice
const hospitalSlice = createSlice({
  name: "hospitals",
  initialState: {
    hospitals: [],
    hospital: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetHospitalError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Hospitals
      .addCase(fetchAllHospitals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllHospitals.fulfilled, (state, action) => {
        state.loading = false;
        state.hospitals = action.payload;
      })
      .addCase(fetchAllHospitals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Hospital by ID
      .addCase(fetchHospitalById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHospitalById.fulfilled, (state, action) => {
        state.loading = false;
        state.hospital = action.payload;
      })
      .addCase(fetchHospitalById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Register Hospital
      .addCase(registerHospital.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerHospital.fulfilled, (state, action) => {
        state.loading = false;
        state.hospitals.push(action.payload);
      })
      .addCase(registerHospital.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Hospital
      .addCase(updateHospital.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateHospital.fulfilled, (state, action) => {
        state.loading = false;
        state.hospitals = state.hospitals.map((hospital) =>
          hospital._id === action.payload._id ? action.payload : hospital
        );
      })
      .addCase(updateHospital.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Hospital
      .addCase(deleteHospital.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteHospital.fulfilled, (state, action) => {
        state.loading = false;
        state.hospitals = state.hospitals.filter((hospital) => hospital._id !== action.payload);
      })
      .addCase(deleteHospital.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetHospitalError } = hospitalSlice.actions;
export default hospitalSlice.reducer;
