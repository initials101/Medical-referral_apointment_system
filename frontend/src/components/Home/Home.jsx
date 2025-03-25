import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center px-6">
      {/* Hero Section */}
      <div className="max-w-4xl">
        <h1 className="text-5xl font-extrabold text-gray-900">Welcome to MRAS</h1>
        <p className="mt-4 text-lg text-gray-700">
          Your trusted **Medical Referral and Appointment System** for seamless healthcare management.
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex flex-wrap justify-center gap-6">
        <Link to="/login" className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-blue-700">
          Login
        </Link>
        <Link to="/sign-up" className="bg-green-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-green-700">
          Sign Up
        </Link>
        <Link to="/doctors" className="bg-purple-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-purple-700">
          Find a Doctor
        </Link>
        <Link to="/hospitals" className="bg-red-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-red-700">
          Browse Hospitals
        </Link>
        <Link to="/appointments" className="bg-yellow-500 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-yellow-600">
          Book an Appointment
        </Link>
      </div>
    </div>
  );
};

export default Home;
