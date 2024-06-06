import { createContext, useReducer, useState } from "react";

export const RoomReservationDataContext = createContext();

export const roomReservationReducer = (state, action) => {
  switch (action.type) {
    case "SET_ROOMRESERVATIONS":
      return { roomReservations: action.payload };
    case "ADD_ROOMRESERVATIONS":
      return { roomReservations: [action.payload, ...state.roomReservations] };
    case "DELETE_ROOMRESERVATIONS":
      return {
        roomReservations: state.roomReservations.filter(
          (r) => r._id !== action.payload._id
        ),
      };
    case "UPDATE_ROOMRESERVATIONS":
      return {
        roomReservations: state.roomReservations.map((r) =>
          r._id === action.payload._id ? action.payload : r
        ),
      };
    default:
      return state;
  }
};

export const RoomReservationProvider = ({ children }) => {
  const [state, setRoomReservations] = useReducer(roomReservationReducer, {
    roomReservations: null,
  });
  // State to hold reservation data
  const [reservationData, setReservationData] = useState({
    type: null,
    checkIn: new Date(),
    checkOut: new Date(),
    guest: null,
    rooms: [],
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
      rooms: [],
      extras: [],
      paymentDetails: [],
      status: null,
      total: 0,
    });
  };

  return (
    <RoomReservationDataContext.Provider
      value={{
        ...state,
        setRoomReservations,
        reservationData,
        updateReservationData,
        resetReservationData,
      }}
    >
      {children}
    </RoomReservationDataContext.Provider>
  );
};
