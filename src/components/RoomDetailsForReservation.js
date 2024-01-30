import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from "@chakra-ui/react";
import { useThemeContext } from "../context/ThemeContext";
const RoomDetailsForReservation = ({ room }) => {
  const { theme } = useThemeContext();
  return (
    <tr
      className={` font-medium  whitespace-nowrap border-b  ${
        theme === "light"
          ? "bg-white text-slate-900"
          : "bg-slate-800 text-slate-100"
      }`}
    >
      <Accordion allowMultiple className="w-full">
        <AccordionItem>
          <AccordionButton>
            <td className="px-6 py-4">{room.type}</td>
            <td className="px-6 py-4">{room.roomNo}</td>
            <td className="px-6 py-4">{room.beds}</td>
            <td className="px-6 py-4">{room.extraBed}</td>
            <td className="px-6 py-4">{room.occupancy}</td>
            <td className="px-6 py-4">{room.cost}</td>

            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <tr>
              <td className="px-6 py-4">
                <p>Bathrooms:{room.bathrooms}</p>
                <p>Ground Space:{room.groundSpace}</p>
                <p> Description:{room.description}</p>
              </td>
            </tr>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </tr>
  );
};

export default RoomDetailsForReservation;
