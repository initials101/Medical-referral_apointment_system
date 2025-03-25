import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API Base URL
const API_URL = "http://localhost:8000/api/doctors";

// 📌 Async Action for Fetching All Doctors
export const fetchAllDoctors = createAsyncThunk("doctors/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/all`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch doctors");
  }
});

// 📌 Async Action for Fetching a Single Doctor by ID
export const fetchDoctorById = createAsyncThunk("doctors/fetchById", async (doctorId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/${doctorId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Doctor not found");
  }
});

// 📌 Async Action for Registering a New Doctor
export const registerDoctor = createAsyncThunk("doctors/register", async (doctorData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/register`, doctorData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Doctor registration failed");
  }
});

// 📌 Async Action for Updating Doctor Information
export const updateDoctor = createAsyncThunk("doctors/update", async ({ doctorId, updatedData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${API_URL}/update/${doctorId}`, updatedData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to update doctor");
  }
});

// 📌 Async Action for Deleting a Doctor (Admin)
export const deleteDoctor = createAsyncThunk("doctors/delete", async (doctorId, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/delete/${doctorId}`);
    return doctorId; // Return deleted doctor ID to remove from state
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete doctor");
  }
});

// 📌 Doctor Slice
const doctorSlice = createSlice({
  name: "doctors",
  initialState: {
    doctors: [],
    doctor: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetDoctorError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Doctors
      .addCase(fetchAllDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload;
      })
      .addCase(fetchAllDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Doctor by ID
      .addCase(fetchDoctorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorById.fulfilled, (state, action) => {
        state.loading = false;
        state.doctor = action.payload;
      })
      .addCase(fetchDoctorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Register Doctor
      .addCase(registerDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerDoctor.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors.push(action.payload);
      })
      .addCase(registerDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Doctor
      .addCase(updateDoctor.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDoctor.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = state.doctors.map((doctor) =>
          doctor._id === action.payload._id ? action.payload : doctor
        );
      })
      .addCase(updateDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Doctor
      .addCase(deleteDoctor.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDoctor.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = state.doctors.filter((doctor) => doctor._id !== action.payload);
      })
      .addCase(deleteDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetDoctorError } = doctorSlice.actions;
export default doctorSlice.reducer;
