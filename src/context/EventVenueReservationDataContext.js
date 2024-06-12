import { createContext, useReducer, useState } from "react";

export const EventVenueReservationDataContext = createContext();

export const eventVenueReservationReducer = (state, action) => {
  switch (action.type) {
    case "SET_EVENTVENUERESERVATIONS":
      return { eventVenueReservations: action.payload };
    case "ADD_EVENTVENUERESERVATIONS":
      return { eventVenueReservations: [action.payload, ...state.eventVenueReservations] };
    case "DELETE_EVENTVENUERESERVATIONS":
      return {
        eventVenueReservations: state.eventVenueReservations.filter(
          (r) => r._id !== action.payload._id
        ),
      };
    case "UPDATE_EVENTVENUERESERVATIONS":
      return {
        eventVenueReservations: state.eventVenueReservations.map((r) =>
          r._id === action.payload._id ? action.payload : r
        ),
      };
    default:
      return state;
  }
};

export const EventVenueReservationProvider = ({ children }) => {
  const [state, setEventVenueReservations] = useReducer(eventVenueReservationReducer, {
    eventVenueReservations: null,
  });
  // State to hold reservation data
  const [reservationData, setReservationData] = useState({
    type: null,
    checkIn: new Date(),
    checkOut: new Date(),
    guest: null,
    eventVenues: [],
    extras: [],
    paymentDetails: [],
    status: null,
    total: 0,
  });

  // Function to update reservation data
  const updateReservationData = (newData) => {
    setReservationData((prevData) => ({
      ...prevData,
      ...newData,
    }));
    console.log(reservationData);
  };

  // Function to reset reservation data
  const resetReservationData = () => {
    setReservationData({
      type: null,
      checkIn: new Date(),
      checkOut: new Date(),
      guest: null,
      eventVenues: [],
      extras: [],
      paymentDetails: [],
      status: null,
      total: 0,
    });
  };

  return (
    <EventVenueReservationDataContext.Provider
      value={{
        ...state,
        setEventVenueReservations,
        reservationData,
        updateReservationData,
        resetReservationData,
      }}
    >
      {children}
    </EventVenueReservationDataContext.Provider>
  );
};
