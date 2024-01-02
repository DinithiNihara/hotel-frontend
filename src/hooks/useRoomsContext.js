import { useContext } from "react";
import { RoomContext } from "../context/RoomContext";

export const useRoomsContext = () => {
  const context = useContext(RoomContext);

  if (!context) {
    throw Error("useRoomsContext must be used inside an RoomContextProvider");
  }

  return context;
};
