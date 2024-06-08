import React, { useState } from "react";
import SoftButton from "../components/SoftButton.js";
import EventVenueReservationForm from "../components/EventVenueReservationForm.js";

const EventReservations = () => {
  const [section, setSection] = useState("main");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="mx-24">
      <div className="grid grid-cols-2">
        <p className="py-4 text-2xl font-bold">
          Venue Reservation{section === "form" ? " / New Reservation" : ""}
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
        {section === "form" ? (
          <EventVenueReservationForm />
        ) : isLoading ? (
          <p>Loading...</p> // Display loading text or spinner while data is loading
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default EventReservations;
