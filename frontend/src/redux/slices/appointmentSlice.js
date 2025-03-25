import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const server = "http://localhost:8000/api"; // Update if needed

// 📌 Fetch all appointments
export const fetchAppointments = createAsyncThunk(
  "appointments/fetchAppointments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${server}/appointments`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// 📌 Create a new appointment
export const createAppointment = createAsyncThunk(
  "appointments/createAppointment",
  async (appointmentData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${server}/appointments`, appointmentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// 📌 Update an appointment
export const updateAppointment = createAsyncThunk(
  "appointments/updateAppointment",
  async ({ appointmentId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${server}/appointments/${appointmentId}`, updatedData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// 📌 Delete an appointment
export const deleteAppointment = createAsyncThunk(
  "appointments/deleteAppointment",
  async (appointmentId, { rejectWithValue }) => {
    try {
      await axios.delete(`${server}/appointments/${appointmentId}`);
      return appointmentId;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// 📌 Appointment slice
const appointmentSlice = createSlice({
  name: "appointments",
  initialState: {
    appointments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments.push(action.payload);
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.appointments.findIndex((a) => a._id === action.payload._id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = state.appointments.filter((a) => a._id !== action.payload);
      })
      .addCase(deleteAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default appointmentSlice.reducer;
