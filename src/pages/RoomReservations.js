import React, { useState } from "react";
import SoftButton from "../components/SoftButton.js";
import RoomReservationForm from "../components/RoomReservationForm.js";

const RoomReservation = () => {
  const [section, setSection] = useState("main");

  return (
    <div className="mx-24 ">
      <div className="grid grid-cols-2">
        <p className="py-4 text-2xl font-bold">
          <span
            className={`${section === "form" ? "cursor-pointer" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              setSection("main");
            }}
          >
            Room Reservation
          </span>{" "}
          {section === "form" ? "/ New Reservation" : ""}
        </p>
        <div className="flex justify-end py-4">
          {section === "main" ? (
            <SoftButton className="align-bottom" text="Add New Reservation">
              <span
                onClick={(e) => {
                  e.preventDefault();
                  setSection("form");
                }}
              >
                Add New Reservation
              </span>
            </SoftButton>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="w-full">
        {section === "form" ? <RoomReservationForm /> : ""}
      </div>
    </div>
  );
};

export default RoomReservation;
