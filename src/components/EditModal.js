import React from "react";
import { useModalContext } from "../context/ModalContext";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Grid,
  GridItem,
  Text,
} from "@chakra-ui/react";
import EditModalBodyGuest from "./EditModalBodyGuest";
import EditModalBodyRoom from "./EditModalBodyRoom";
import EditModalBodyEventVenue from "./EditModalBodyEventVenue";
import EditModalBodyUser from "./EditModalBodyUser";
import EditModalBodyRoomReservation from "./EditModalBodyRoomReservation";
import EditModalBodyVenueReservation from "./EditModalBodyVenueReservation";

const EditModal = () => {
  const { isOpen, onClose, title } = useModalContext();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent className="bg-white mt-2 mx-32 px-4 py-4 rounded-lg">
        <ModalHeader
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text className="text-xl"> Edit {title}</Text>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          {title === "Guest" && <EditModalBodyGuest />}
          {title === "Room" && <EditModalBodyRoom />}
          {title === "Room Reservation" && <EditModalBodyRoomReservation />}
          {title === "Venue" && <EditModalBodyEventVenue />}
          {title === "Venue Reservation" && <EditModalBodyVenueReservation />}
          {title === "User" && <EditModalBodyUser />}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditModal;
