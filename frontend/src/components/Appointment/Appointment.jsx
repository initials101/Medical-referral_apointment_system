import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPatientAppointments, createAppointment, cancelAppointment } from "../../redux/slices/appointmentSlice";
import { toast } from "react-toastify";
import styles from "../../styles/styles";

const Appointment = () => {
  const dispatch = useDispatch();
  const { appointments, loading, error } = useSelector((state) => state.appointments);
  const { user } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    doctorId: "",
    date: "",
    notes: "",
  });

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchPatientAppointments(user._id));
    }
  }, [dispatch, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.doctorId || !formData.date) {
      toast.error("Please select a doctor and date.");
      return;
    }
    dispatch(createAppointment({ ...formData, patientId: user._id }))
      .then((result) => {
        if (result.meta.requestStatus === "fulfilled") {
          toast.success("Appointment booked successfully!");
          setFormData({ doctorId: "", date: "", notes: "" });
        } else {
          toast.error(result.payload);
        }
      });
  };

  const handleCancel = (appointmentId) => {
    dispatch(cancelAppointment(appointmentId))
      .then((result) => {
        if (result.meta.requestStatus === "fulfilled") {
          toast.success("Appointment canceled.");
        } else {
          toast.error(result.payload);
        }
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-2xl font-extrabold text-gray-900">Manage Appointments</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md bg-white py-6 px-4 shadow sm:rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900">Book an Appointment</h3>
        <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="doctorId"
            placeholder="Enter Doctor ID"
            value={formData.doctorId}
            onChange={handleChange}
            required
            className={styles.input}
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className={styles.input}
          />
          <textarea
            name="notes"
            placeholder="Notes (Optional)"
            value={formData.notes}
            onChange={handleChange}
            className={styles.input}
          ></textarea>
          <button type="submit" className={styles.button}>Book Appointment</button>
        </form>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <h3 className="text-lg font-semibold text-gray-900">Your Appointments</h3>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : appointments.length > 0 ? (
          <ul className="mt-4 space-y-4">
            {appointments.map((appointment) => (
              <li key={appointment._id} className="p-4 border rounded-md shadow-md">
                <p><strong>Doctor ID:</strong> {appointment.doctor}</p>
                <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {appointment.status}</p>
                <button onClick={() => handleCancel(appointment._id)} className="text-red-600 mt-2">Cancel</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No appointments found.</p>
        )}
      </div>
    </div>
  );
};

export default Appointment;
