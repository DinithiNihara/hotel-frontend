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

const CancelModal = () => {
  const { isOpen, onClose } = useModalContext();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent className="bg-white mt-8 mx-72 px-10 py-5 rounded-lg">
        <ModalHeader
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text className="text-xl"> Cancel Reservation</Text>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <p>Are you sure you wanna delete reservation details?</p>
        </ModalBody>
        <ModalFooter>
          Yes No
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CancelModal;
