import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPatientAppointments } from "../redux/slices/appointmentSlice";
import { fetchPatientReferrals } from "../redux/slices/referralSlice";

const PatientDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { appointments } = useSelector((state) => state.appointments);
  const { referrals } = useSelector((state) => state.referrals);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchPatientAppointments(user._id));
      dispatch(fetchPatientReferrals(user._id));
    }
  }, [dispatch, user]);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <h2 className="text-3xl font-extrabold text-center text-gray-900">Patient Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Appointments Section */}
        <div className="bg-white p-6 shadow-md rounded-md">
          <h3 className="text-lg font-semibold text-gray-700">Your Appointments</h3>
          {appointments.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {appointments.map((appointment) => (
                <li key={appointment._id} className="p-2 border-b">
                  <strong>Doctor:</strong> {appointment.doctor.user.name} <br />
                  <strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()} <br />
                  <strong>Status:</strong> {appointment.status}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-gray-500">No appointments found.</p>
          )}
        </div>

        {/* Referrals Section */}
        <div className="bg-white p-6 shadow-md rounded-md">
          <h3 className="text-lg font-semibold text-gray-700">Your Referrals</h3>
          {referrals.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {referrals.map((referral) => (
                <li key={referral._id} className="p-2 border-b">
                  <strong>Referred To:</strong> {referral.destinationHospital.name} <br />
                  <strong>Reason:</strong> {referral.reason} <br />
                  <strong>Status:</strong> {referral.status}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-gray-500">No referrals found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
