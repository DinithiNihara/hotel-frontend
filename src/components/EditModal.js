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
} from "@chakra-ui/react";
import EditModalBodyGuest from "./EditModalBodyGuest";
import EditModalBodyRoom from "./EditModalBodyRoom";

const EditModal = () => {
  const { isOpen, onClose, title } = useModalContext();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent className="bg-white mt-8 mx-auto ">
        <ModalCloseButton />
        <ModalHeader>Edit {title}</ModalHeader>
        <ModalBody>
          {title === "Guest" && <EditModalBodyGuest />}
          {title === "Room" && <EditModalBodyRoom />}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditModal;
