import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API Base URL
const API_URL = "http://localhost:8000/api/patients";

// 📌 Fetch All Patients (Admin)
export const fetchAllPatients = createAsyncThunk("patients/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/all`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch patients");
  }
});

// 📌 Fetch Patient by ID
export const fetchPatientById = createAsyncThunk("patients/fetchById", async (patientId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/${patientId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Patient not found");
  }
});

// 📌 Register a New Patient
export const registerPatient = createAsyncThunk("patients/register", async (patientData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/register`, patientData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Patient registration failed");
  }
});

// 📌 Update Patient Information
export const updatePatient = createAsyncThunk("patients/update", async ({ patientId, updatedData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${API_URL}/update/${patientId}`, updatedData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to update patient");
  }
});

// 📌 Delete Patient (Admin)
export const deletePatient = createAsyncThunk("patients/delete", async (patientId, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/delete/${patientId}`);
    return patientId; // Return deleted patient ID to remove from state
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete patient");
  }
});

// 📌 Patient Slice
const patientSlice = createSlice({
  name: "patients",
  initialState: {
    patients: [],
    patient: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetPatientError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Patients
      .addCase(fetchAllPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = action.payload;
      })
      .addCase(fetchAllPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Patient by ID
      .addCase(fetchPatientById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientById.fulfilled, (state, action) => {
        state.loading = false;
        state.patient = action.payload;
      })
      .addCase(fetchPatientById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Register Patient
      .addCase(registerPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.patients.push(action.payload);
      })
      .addCase(registerPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Patient
      .addCase(updatePatient.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = state.patients.map((patient) =>
          patient._id === action.payload._id ? action.payload : patient
        );
      })
      .addCase(updatePatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Patient
      .addCase(deletePatient.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePatient.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = state.patients.filter((patient) => patient._id !== action.payload);
      })
      .addCase(deletePatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPatientError } = patientSlice.actions;
export default patientSlice.reducer;
