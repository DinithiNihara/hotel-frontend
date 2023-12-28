import React from "react";

const GuestDetails = ({ guest }) => {
  return (
    <tr className="bg-white border-b  font-medium text-gray-600 whitespace-nowrap">
      <td scope="row" className="px-6 py-4">
        {guest.title} {guest.firstName} {guest.lastName}
      </td>
      <td className="px-6 py-4">{guest.address}</td>
      <td className="px-6 py-4">0{guest.phone}</td>
      <td className="px-6 py-4">{guest.email}</td>
    </tr>
  );
};

export default GuestDetails;
