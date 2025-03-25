import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import doctorReducer from "./slices/doctorSlice";
import patientReducer from "./slices/patientSlice";
import hospitalReducer from "./slices/hospitalSlice";
import appointmentReducer from "./slices/appointmentSlice";
import referralReducer from "./slices/referralSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    doctor: doctorReducer,
    patient: patientReducer,
    hospital: hospitalReducer,
    appointment: appointmentReducer,
    referral: referralReducer,
  },
});

export default store;

