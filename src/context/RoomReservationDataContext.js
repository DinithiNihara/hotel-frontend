import { createContext, useState } from "react";

export const RoomReservationDataContext = createContext();

export const RoomReservationProvider = ({ children }) => {
  // State to hold reservation data
  const [reservationData, setReservationData] = useState({
    roomIds: [],
    guestId: null,
    extras: {},
    paymentDetails: {},
    status: null,
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
      roomIds: [],
      guestId: null,
      extras: {},
      paymentDetails: {},
      status: null,
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
