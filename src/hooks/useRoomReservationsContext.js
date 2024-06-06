import { useContext } from "react";
import { RoomReservationDataContext } from "../context/RoomReservationDataContext";

export const useRoomReservationsContext = () => {
  const context = useContext(RoomReservationDataContext);

  if (!context) {
    throw Error(
      "useRoomReservationsContext must be used inside an RoomReservationContextProvider"
    );
  }

  return context;
};
