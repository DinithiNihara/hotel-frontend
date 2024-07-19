import React from "react";
import { FaChevronLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const ReportGuests = () => {
  return (
    <div className="mx-24">
      <Link to="/" className="w-1/4 flex p-2">
        <div className="flex items-center pr-1">
          <FaChevronLeft />
        </div>
        <p>Dashboard</p>
      </Link>
      <div></div>
    </div>
  );
};

export default ReportGuests;
