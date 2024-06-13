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
import { EventVenueReservationDataContext } from "../context/EventVenueReservationDataContext";
import SoftButton from "./SoftButton";

const EventVenueDetailsForReservation = ({ eventVenue, resetDates }) => {
  const { theme } = useThemeContext();
  const { reservationData, updateReservationData, resetReservationData } =
    useContext(EventVenueReservationDataContext);
  const [isSelected, setIsSelected] = useState(false);

  // If eventVenue availability dates are changed, then the reservation data should reset
  useEffect(() => {
    console.log(eventVenue);
    console.log("here");
    // resetReservationData();
    setIsSelected(false);
  }, [resetDates]);

  const handleSelect = () => {
      setIsSelected(!isSelected);
      // console.log(reservationData);
      // Function to handle adding data to reservationData
      const newData = { ...reservationData };
      const eventVenueIdIndex = newData.eventVenues.indexOf(eventVenue._id);
      if (eventVenueIdIndex === -1) {
        // eventVenue ID is not in the array, add it
        newData.total = reservationData.total + eventVenue.cost;
        newData.eventVenues.push(eventVenue._id);
      } else {
        // eventVenue ID is already in the array, remove it
        newData.total = reservationData.total - eventVenue.cost;
        newData.eventVenues.splice(eventVenueIdIndex, 1);
      }
      updateReservationData(newData);
      console.log(reservationData);
  };

  useEffect(() => {
    console.log(eventVenue);
  }, []);

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
          <Box className="px-6 py-4 md:w-48">{eventVenue.type}</Box>
          <Box className="px-6 py-4 md:w-32">{eventVenue.venueNo}</Box>
          <Box className="px-6 py-4 md:w-24 ">{eventVenue.capacity}</Box>
          <Box className="px-6 py-4 md:w-32">{eventVenue.cost}</Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={4}>
          <Box className="pr-6 pl-24 py-4">
            {/* <p>BatheventVenues: {eventVenue.batheventVenues}</p>
            <p>Ground Space: {eventVenue.groundSpace}</p>*/}
            <p>Description: {eventVenue.description}</p>
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

export default EventVenueDetailsForReservation;
