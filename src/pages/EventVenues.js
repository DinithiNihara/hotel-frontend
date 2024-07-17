import React, { useEffect, useState } from "react";
import { useEventVenuesContext } from "../hooks/useEventVenuesContext.js";
import { FiUser, FiArrowRight } from "react-icons/fi";
// components
import EventVenueDetails from "../components/EventVenueDetails.js";
import EventVenueForm from "../components/EventVenueForm.js";
import SoftButton from "../components/SoftButton.js";

const EventVenues = () => {
  const { eventVenues, setEventVenues } = useEventVenuesContext();

  const [changeLayout, setChangeLayout] = useState(false);

  // fetch all eventVenue
  useEffect(() => {
    const fetchEventVenues = async () => {
      const response = await fetch("/api/eventVenues");
      const json = await response.json();

      if (response.ok) {
        setEventVenues({ type: "SET_EVENTVENUES", payload: json });
      }
    };

    fetchEventVenues();
  }, []);

  return (
    <div className="mx-24">
      <div className="grid grid-cols-2">
        <p className="py-4 text-2xl font-bold"> Event Venue Management</p>
        <div className="flex justify-end py-4">
          {!changeLayout ? (
            <SoftButton className="align-bottom" text="Add New Event Venue">
              <span
                onClick={(e) => {
                  e.preventDefault();
                  setChangeLayout(true);
                }}
              >
                Add New Event Venue
              </span>
            </SoftButton>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className={`grid ${changeLayout ? " grid-cols-5" : "grid-cols-1"}`}>
        <div
          className={`relative overflow-x-auto rounded-lg h-96 ${
            changeLayout ? "col-span-3" : ""
          }`}
        >
          <table className="w-full text-sm text-left rtl:text-right  text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Type
                </th>
                <th scope="col" className="px-6 py-3">
                  Venue No
                </th>
                <th scope="col" className="px-6 py-3">
                  Capacity
                </th>
                <th scope="col" className="px-6 py-3">
                  Description
                </th>
                <th scope="col" className="px-6 py-3">
                  Cost
                </th>
                <th> </th>
                <th> </th>
              </tr>
            </thead>
            <tbody>
              {eventVenues &&
                eventVenues.map((eventVenue) => (
                  <EventVenueDetails
                    key={eventVenue._id}
                    eventVenue={eventVenue}
                  />
                ))}
            </tbody>
          </table>
        </div>
        {changeLayout ? (
          <div className="col-span-2 pl-20">
            <div className="grid grid-cols-2">
              <p className="py-1 text-2xl"> Add an Event Venue</p>

              <div className="flex justify-end">
                <FiArrowRight
                  onClick={(e) => {
                    e.preventDefault();
                    setChangeLayout(false);
                  }}
                />
              </div>
            </div>
            <div>
              <EventVenueForm />
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default EventVenues;
