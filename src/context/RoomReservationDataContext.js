import { createContext, useState } from "react";

export const RoomReservationDataContext = createContext();

export const RoomReservationProvider = ({ children }) => {
  // State to hold reservation data
  const [reservationData, setReservationData] = useState({
    type: null,
    checkIn: null,
    checkOut: null,
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
      checkIn: null,
      checkOut: null,
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
        reservationData,
        updateReservationData,
        resetReservationData,
      }}
    >
      {children}
    </RoomReservationDataContext.Provider>
  );
};
