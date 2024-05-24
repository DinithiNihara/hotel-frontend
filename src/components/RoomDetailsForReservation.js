import React, { useContext } from "react";
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

const RoomDetailsForReservation = ({ room }) => {
  const { theme } = useThemeContext();
  const { updateReservationData } = useContext(RoomReservationDataContext);

  // Function to handle adding data to reservationData
  const handleAddData = () => {
    const newData = {
      roomIds: room._id,
    };

    updateReservationData(newData);
  };

  return (
    <Accordion
      allowMultiple
      className={` font-medium flex justify-between whitespace-nowrap border-b ${
        theme === "light"
          ? "bg-white text-slate-900"
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
      <Box className="my-auto">
        <SoftButton text="Select">
          <span onClick={handleAddData}>Select</span>
        </SoftButton>
      </Box>
    </Accordion>
  );
};

export default RoomDetailsForReservation;
