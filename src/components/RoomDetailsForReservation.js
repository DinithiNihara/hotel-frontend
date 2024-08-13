import React, { useContext, useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from "@chakra-ui/react";
import { useThemeContext } from "../context/ThemeContext";
import { RoomReservationDataContext } from "../context/RoomReservationDataContext";
import SoftButton from "./SoftButton";

const RoomDetailsForReservation = ({ room, resetDates, dateCount }) => {
  const { theme } = useThemeContext();
  const { reservationData, updateReservationData, resetReservationData } =
    useContext(RoomReservationDataContext);
  const [isSelected, setIsSelected] = useState(false);

  // If room availability dates are changed, then the reservation data should reset
  useEffect(() => {
    resetReservationData();
    setIsSelected(false);
  }, [resetDates]);

  const handleSelect = () => {
    setIsSelected(!isSelected);
    console.log(reservationData);
    // Function to handle adding data to reservationData
    const newData = { ...reservationData };
    const roomIdIndex = newData.rooms.indexOf(room._id);

    if (roomIdIndex === -1) {
      // Room ID is not in the array, add it
      newData.total = reservationData.total + room.cost * dateCount;
      newData.rooms.push(room._id);
    } else {
      // Room ID is already in the array, remove it
      newData.total = reservationData.total - room.cost * dateCount;
      newData.rooms.splice(roomIdIndex, 1);
    }

    updateReservationData(newData);
    console.log(reservationData);
  };

  return (
    <Accordion
      allowMultiple
      className={` font-medium flex justify-between whitespace-nowrap border-b ${
        theme === "light"
          ? isSelected
            ? "bg-gray-200 text-slate-900"
            : "bg-white text-slate-900"
          : isSelected
          ? "bg-slate-500 text-slate-100"
          : "bg-slate-800 text-slate-100"
      }`}
    >
      <AccordionItem>
        <AccordionButton>
          <Box className="px-6 py-4 md:w-48">{room.type}</Box>
          <Box className="px-6 py-4 md:w-24">{room.roomNo}</Box>
          <Box className="px-6 py-4 md:w-48 ">{room.beds}</Box>
          <Box className="px-6 py-4 md:w-24">{room.extraBed}</Box>
          <Box className="px-6 py-4 md:w-48">{room.occupancy}</Box>
          <Box className="px-6 py-4 md:w-32">{room.cost}</Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={4}>
          <Box className="pr-6 pl-24 py-4">
            <p>Bathrooms: {room.bathrooms}</p>
            <p>Ground Space: {room.groundSpace}</p>
            <p>Description: {room.description}</p>
          </Box>
        </AccordionPanel>
      </AccordionItem>
      <Box className="my-auto px-4">
        <SoftButton
          text="Select"
          backgroundColor={isSelected ? "bg-gray-600" : ""}
        >
          <p onClick={handleSelect}>{isSelected ? "Selected" : "Select"}</p>
        </SoftButton>
      </Box>
    </Accordion>
  );
};

export default RoomDetailsForReservation;
