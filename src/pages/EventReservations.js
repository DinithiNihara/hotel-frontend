import React, { useEffect, useState } from "react";
import SoftButton from "../components/SoftButton.js";
import EventVenueReservationForm from "../components/EventVenueReservationForm.js";
import { useVenueReservationsContext } from "../hooks/useVenueReservationsContext.js";
import { useGuestsContext } from "../hooks/useGuestsContext.js";
import { useRoomsContext } from "../hooks/useRoomsContext.js";
import { useEventVenuesContext } from "../hooks/useEventVenuesContext.js";
import { format } from "date-fns";
import EventVenueReservationDetails from "../components/EventVenueReservationDetails.js";

const EventReservations = () => {
  const [section, setSection] = useState("main");
  const [isLoading, setIsLoading] = useState(false);
  const { eventVenueReservations, setEventVenueReservations } =
    useVenueReservationsContext();
  const { guests, setGuests } = useGuestsContext();
  const { rooms, dispatch } = useRoomsContext();
  const { eventVenues, setEventVenues } = useEventVenuesContext();
  const [formattedEventVenueReservations, setFormattedEventVenueReservations] =
    useState([]);

  const formatReservationData = () => {
    // Format each reservation
    const formattedData = eventVenueReservations.map((reservation) => {
      // Format dates
      const formattedCheckIn = format(
        new Date(reservation.checkIn),
        "yyyy-MM-dd"
      );
      const formattedCheckOut = format(
        new Date(reservation.checkOut),
        "yyyy-MM-dd"
      );

      // Find the guest object by guest ID
      const guest = guests.find((g) => g._id === reservation.guest);

      let mappedRooms = [];
      // Check if rooms is not null or undefined
      if (rooms) {
        // Map each room ID to its corresponding room object
        mappedRooms = reservation.rooms.map((roomId) => {
          return rooms.find((room) => room._id === roomId);
        });
      }

      let mappedVenues = [];
      // Check if rooms is not null or undefined
      if (eventVenues) {
        // Map each room ID to its corresponding room object
        mappedVenues = reservation.eventVenues.map((venueId) => {
          return eventVenues.find((venue) => venue._id === venueId);
        });
      }

      // Return a new reservation object with formatted dates and guest object
      return {
        ...reservation,
        checkIn: formattedCheckIn,
        checkOut: formattedCheckOut,
        guest: guest || reservation.guest, // fallback to guest ID if guest not found
        rooms: mappedRooms,
        eventVenues:mappedVenues
      };
    });

    // Set the formatted data back to state
    setFormattedEventVenueReservations(formattedData);
    console.log(formattedEventVenueReservations);
    console.log(formattedData);
    // setIsLoading(false); // Data is now loaded
  };

  // Fetch all reservations details
  useEffect(() => {
    const fetchVenueReservations = async () => {
      const response = await fetch("/api/eventVenueReservations");
      const json = await response.json();

      if (response.ok) {
        setEventVenueReservations({
          type: "SET_EVENTVENUERESERVATIONS",
          payload: json,
        });
      }
    };

    const fetchGuests = async () => {
      const response = await fetch("/api/guests");
      const json = await response.json();

      if (response.ok) {
        setGuests({ type: "SET_GUESTS", payload: json });
      }
    };

    const fetchRooms = async () => {
      const response = await fetch("/api/rooms");
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_ROOMS", payload: json });
      }
    };

    const fetchEventVenues = async () => {
      const response = await fetch("/api/eventVenues");
      const json = await response.json();

      if (response.ok) {
        setEventVenues({ type: "SET_EVENTVENUES", payload: json });
      }
    };

    fetchGuests();
    fetchRooms();
    fetchVenueReservations();
    fetchEventVenues();
  }, [setEventVenueReservations, setGuests]);

  // Format data once eventVenueReservations and guests are loaded
  useEffect(() => {
    if (
      eventVenueReservations &&
      eventVenueReservations.length > 0 &&
      guests &&
      guests.length > 0
      // &&
      // rooms &&
      // rooms.length > 0
    ) {
      formatReservationData();
    }
  }, [eventVenueReservations, guests]);

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
          <>
            <div className="header flex justify-between p-2">
              <span className="text-lg font-bold"></span>
            </div>
            <div className="relative overflow-x-auto rounded-lg h-96">
              {/* Tabular View */}
              <div className="rounded w-full ">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs  uppercase  bg-gray-700 text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        No
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Guest
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Check In
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Check Out
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Status
                      </th>
                      <th> </th>
                      <th> </th>
                      <th> </th>
                    </tr>
                  </thead>
                  <tbody>
                    {formattedEventVenueReservations.length > 0 &&
                      formattedEventVenueReservations.map(
                        (eventVenueReservation) => (
                          <EventVenueReservationDetails
                            key={eventVenueReservation._id}
                            eventVenueReservation={eventVenueReservation}
                          />
                        )
                      )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EventReservations;
