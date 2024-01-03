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

const EditModal = () => {
  const { isOpen, onClose, title } = useModalContext();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent className="bg-white mt-8 mx-72 px-10 py-5 rounded-lg">
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
          {title === "EventVenue" && <EditModalBodyEventVenue />}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditModal;
