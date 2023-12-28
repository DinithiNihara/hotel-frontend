import { useContext } from "react";
import { GuestContext } from "../context/GuestContext";

export const useGuestsContext = () => {
  const context = useContext(GuestContext);

  if (!context) {
    throw Error("useGuestsContext must be used inside an GuestContextProvider");
  }

  return context;
};
