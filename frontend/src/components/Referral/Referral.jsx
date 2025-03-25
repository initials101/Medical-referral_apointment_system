import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const Referral = () => {
  const { referralId } = useParams();
  const { referrals } = useSelector((state) => state.referrals);

  const referral = referrals.find((r) => r._id === referralId);

  if (!referral) {
    return <p className="text-center text-red-500 mt-10">Referral not found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl bg-white shadow-md rounded-md p-6">
        <h2 className="text-2xl font-extrabold text-gray-900">Referral Details</h2>
        <p className="text-gray-600 mt-2"><strong>Patient:</strong> {referral.patient.user.name}</p>
        <p className="text-gray-600"><strong>Referring Doctor:</strong> {referral.referringDoctor.user.name}</p>
        <p className="text-gray-600"><strong>Referred To:</strong> {referral.destinationHospital.name}</p>
        <p className="text-gray-600"><strong>Reason:</strong> {referral.reason}</p>
        <p className="text-gray-600"><strong>Status:</strong> {referral.status}</p>
      </div>
    </div>
  );
};

export default Referral;
