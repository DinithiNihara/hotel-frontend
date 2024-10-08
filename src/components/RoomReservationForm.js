import React, { useContext, useEffect, useState } from "react";
import ProgressStepsBarRooms from "./ProgressStepsBarRooms";
import Datepicker from "react-tailwindcss-datepicker";
import { HStack } from "@chakra-ui/react";
import RoomDetailsForReservation from "./RoomDetailsForReservation";
import RoomReservationGuest from "./RoomReservationGuest.js";
import { useRoomsContext } from "../hooks/useRoomsContext.js";
import { useGuestsContext } from "../hooks/useGuestsContext.js";
import SoftButton from "./SoftButton.js";
import { differenceInDays, format, parseISO } from "date-fns";
import { RoomReservationDataContext } from "../context/RoomReservationDataContext";
import RoomReservationInvoice from "./RoomReservationInvoice";
import {
  FaParking,
  FaWineBottle,
  FaSpa,
  FaHandshake,
  FaDumbbell,
  FaMoneyBill,
  FaCreditCard,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { useAddModalContext } from "../context/AddModalContext.js";

const RoomReservationForm = ({ onCancel, reloadReservations }) => {
  // Completed step number in the Progress Bar
  const [stepNo, setStepNo] = useState(0);
  //   Current section to update page content
  const [currentSection, setCurrentSection] = useState("rooms");
  const [value, setValue] = useState({
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });
  const [dateCount, setDateCount] = useState(1);
  const [resetDates, setResetDates] = useState(false);
  const { reservationData, updateReservationData, resetReservationData } =
    useContext(RoomReservationDataContext);
  const [reservedGuest, setReservedGuest] = useState(null);
  const [reservedRooms, setReservedRooms] = useState([]);
  const [reservedExtras, setReservedExtras] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState("unpaid");
  const [bookingNo, setBookingNo] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [searchRoom, setSearchRoom] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [extraSelected, setExtraSelected] = useState(false);
  const [disableNextBtn, setDisableNextBtn] = useState(true);
  const { onAddOpen } = useAddModalContext();

  // Room Details
  const { rooms, dispatch } = useRoomsContext();

  // Guest Details
  const { guests, setGuests } = useGuestsContext();

  // Extras Details
  const extras = [
    {
      extraId: 1,
      icon: <FaParking />,
      name: "Parking",
      cost: 200,
      costText: "night",
    },
    {
      extraId: 2,
      icon: <FaWineBottle />,
      name: "Bottle of wine",
      cost: 5000,
      costText: "piece",
    },
    {
      extraId: 3,
      icon: <FaSpa />,
      name: "Spa treatment",
      cost: 2000,
      costText: "treatment",
    },
    {
      extraId: 4,
      icon: <FaHandshake />,
      name: "Conference Room",
      cost: 1000,
      costText: "hour",
    },
    {
      extraId: 5,
      icon: <FaDumbbell />,
      name: "Gym",
      cost: 1000,
      costText: "day",
    },
  ];

  const handleExtras = (extraItem) => {
    console.log(reservationData);
    const newData = { ...reservationData };
    const itemIndex = newData.extras.indexOf(extraItem.extraId);

    if (itemIndex === -1) {
      newData.extras.push(extraItem.extraId);
      newData.total = reservationData.total + extraItem.cost * dateCount;
      setExtraSelected(true);
    } else {
      newData.extras.splice(itemIndex, 1);
      newData.total = reservationData.total - extraItem.cost * dateCount;
      setExtraSelected(false);
    }
    updateReservationData(newData);
    console.log(reservationData.extras);
  };

  const isSelected = (extraId) => reservationData.extras.includes(extraId);

  const handleCashPayment = () => {
    setPaymentStatus("completed");
    const newData = { ...reservationData };
    newData.paymentDetails.push({
      payment: "Full",
      // cost: newData.total,
      cost: reservationData.total,
      type: "Cash",
      date: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    });
    updateReservationData(newData);

    handleReservationData();
  };

  const handleCardPayment = () => {
    setPaymentStatus("pending");

    setTimeout(() => {
      setPaymentStatus("completed");
      const newData = { ...reservationData };
      newData.paymentDetails.push({
        payment: "Full",
        // cost: newData.total,
        cost: reservationData.total,
        type: "Card",
        date: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      });
      updateReservationData(newData);
      handleReservationData();
    }, 2000);
  };

  const handleReservationData = () => {
    const newData = { ...reservationData };
    newData.type = "Standard";
    newData.status = "Confirmed";
    newData.checkIn = value.startDate;
    newData.checkOut = value.endDate;
    newData.extras = extras
      .filter((extra) => reservationData.extras.includes(extra.extraId))
      .map((extra) => ({
        extraId: extra.extraId,
        name: extra.name,
        cost: extra.cost,
        costText: extra.costText,
      }));
    updateReservationData(newData);
    console.log(reservationData);
  };

  const handleSubmit = async (e) => {
    const response = await fetch("/api/roomReservations", {
      method: "POST",
      body: JSON.stringify(reservationData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response);
    const json = await response.json();

    if (json && json.bookingNo) {
      setBookingNo(json.bookingNo);
    }
    reloadReservations(); // Call the reload function to refresh the reservations data
  };

  const resetReservation = () => {
    resetReservationData();
    setResetDates(!resetDates);
    setStepNo(0);
    onCancel();
  };

  const nextSection = () => {
    if (currentSection === "rooms") {
      setCurrentSection("guest");
    }
    if (currentSection === "guest") {
      setCurrentSection("extras");
    }
    if (currentSection === "extras") {
      setCurrentSection("payment");
    }
    if (currentSection === "payment") {
      setCurrentSection("confirmation");
    }
  };

  // Fetch all available rooms
  const fetchRooms = async () => {
    let checkInDate = value.startDate;
    let checkOutDate = value.endDate;
    const response = await fetch(
      `/api/rooms/available?checkIn=${checkInDate}&checkOut=${checkOutDate}`
    );
    const json = await response.json();
    if (response.ok) {
      dispatch({ type: "SET_ROOMS", payload: json });
    }
  };

  const fetchGuests = async () => {
    const response = await fetch("/api/guests");
    const json = await response.json();

    if (response.ok) {
      setGuests({ type: "SET_GUESTS", payload: json });
    }
  };

  const checkAvailableRooms = () => {
    fetchRooms();
    setResetDates(!resetDates);
    setStepNo(0);

    // Parse the dates
    const startDate = parseISO(value.startDate);
    const endDate = parseISO(value.endDate);

    // Calculate the difference in days
    const daysDifference = differenceInDays(endDate, startDate) + 1;

    // Set the date count
    setDateCount(daysDifference);
    console.log(daysDifference);
  };

  // Change Dates
  let handleValueChange = (newDates) => {
    setValue(newDates);
    console.log(newDates);
  };

  // Add new guest
  const handleNewGuest = (e) => {
    e.preventDefault();
    onAddOpen("Guest");
  };

  // search room
  useEffect(() => {
    let checkInDate = value.startDate;
    let checkOutDate = value.endDate;
    const searchRooms = async () => {
      const response = await fetch(
        `/api/rooms/searchAvailable?term=${searchRoom}&type=${searchType}&checkIn=${checkInDate}&checkOut=${checkOutDate}`
      );
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_ROOMS", payload: json });
      }
    };

    searchRooms();
  }, [searchRoom, searchType]);

  // search guest
  useEffect(() => {
    const searchGuests = async () => {
      const response = await fetch("/api/guests/" + searchTerm);
      const json = await response.json();

      if (response.ok) {
        setGuests({ type: "SET_GUESTS", payload: json });
      }
    };

    searchGuests();
  }, [searchTerm]);

  useEffect(() => {
    console.log(value);
    fetchRooms();
    fetchGuests();
  }, []);

  // Change progress bar step number
  useEffect(() => {
    console.log(reservationData);
    if (reservationData.rooms.length > 0) {
      setStepNo(1);
    }
    if (reservationData.guest !== null) {
      setStepNo(2);
    }
    if (reservationData.extras.length > 0) {
      setStepNo(3);
    }
    if (reservationData.paymentDetails.length > 0) {
      setStepNo(4);
    }

    if (reservationData.rooms.length > 0) {
      // Filter reserved rooms
      const filteredRooms = rooms.filter((room) =>
        reservationData.rooms.includes(room._id)
      );
      setReservedRooms(filteredRooms);
    }
    if (reservationData.guest !== null) {
      // Filter guest
      const filteredGuest = guests.filter((guest) =>
        reservationData.guest.includes(guest._id)
      );

      if (filteredGuest.length > 0) {
        const reservedGuest = filteredGuest[0];
        setReservedGuest(reservedGuest);
      }
    }
    if (reservationData.extras) {
      // Filter reserved extras
      const filteredExtras = extras.filter((item) =>
        reservationData.extras.includes(item.extraId)
      );
      setReservedExtras(filteredExtras);
    }

    // Call "Add Reservation" Function
    if (reservationData.status === "Confirmed") {
      handleSubmit();
    }

    setIsLoading(false);
  }, [reservationData]);

  useEffect(() => {
    console.log(currentSection);
    console.log(stepNo);
    console.log(reservationData.guest);

    if (currentSection === "rooms") {
      setDisableNextBtn(reservationData.rooms.length === 0);
    } else if (currentSection === "guest") {
      setDisableNextBtn(reservationData.guest === null);
    } else if (currentSection === "payment") {
      setDisableNextBtn(reservationData.paymentDetails.length === 0);
    }
  }, [stepNo, currentSection, reservationData.rooms, reservationData.guest]);
  // console.log(reservedGuest);
  // console.log(reservedRooms);
  // console.log(reservedExtras);

  return (
    <div className="h-4/5">
      <ProgressStepsBarRooms stepNo={stepNo} />
      {/* Step 1: Select Rooms */}
      {currentSection === "rooms" && (
        <div>
          {/* Change dates to find available rooms */}
          <div className="h-18 my-4 p-1 rounded border-2 border-dashed border-slate-600 ">
            <HStack>
              <Datepicker
                value={value}
                onChange={handleValueChange}
                primaryColor={"amber"}
                minDate={new Date()}
                placeholder="Check In - Check Out"
                inputClassName={"bg-white w-full rounded-lg py-4 text-center"}
              />
              <SoftButton text="Check Availability">
                <p
                  onClick={(e) => {
                    e.preventDefault();
                    checkAvailableRooms();
                  }}
                  className="text-base"
                >
                  Check Availability
                </p>
              </SoftButton>
            </HStack>
          </div>
          {/* Available rooms list */}
          <div className="h-72 overflow-y-scroll">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex flex-row mb-4 items-center">
                <label className="text-base pr-2">Type:</label>
                <select
                  onChange={(e) => {
                    setSearchType(e.target.value);
                  }}
                  className="bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
                >
                  <option value="">--</option>
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Superior Lagoon">Superior Lagoon</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>

              <div className="md:col-span-2 flex justify-center items-center bg-gray-50 border rounded-lg mb-4">
                <FiSearch className="mx-2" />
                <input
                  type="text"
                  onChange={(e) => {
                    setSearchRoom(e.target.value);
                  }}
                  className="bg-gray-50  text-gray-900 text-sm rounded-r-lg w-full p-2"
                  placeholder="Search by Room No / Occupancy / Cost"
                />
              </div>
            </div>
            <table className="w-full text-sm text-left rtl:text-right  text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th>
                    <th scope="col" className="px-6 py-2 md:w-48 text-center">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-2 md:w-24 text-center">
                      Room No
                    </th>
                    <th scope="col" className="px-6 py-2 md:w-48 text-center">
                      Beds
                    </th>
                    <th scope="col" className="px-6 py-2 md:w-24 text-center">
                      Extra Bed
                    </th>
                    <th scope="col" className="px-6 py-2 md:w-48 text-center">
                      Occupancy
                    </th>
                    <th scope="col" className="px-6 py-2 md:w-32 text-center">
                      Cost
                    </th>
                    <th scope="col" className="px-6 py-2 md:w-48"></th>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rooms &&
                  rooms.map((room) => (
                    <RoomDetailsForReservation
                      key={room._id}
                      room={room}
                      resetDates={resetDates}
                      dateCount={dateCount}
                    />
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Step 2: Select/ Add Guest */}
      {currentSection === "guest" && (
        <div>
          <div className="relative h-18 my-4 p-1 flex justify-between">
            <div className="w-full flex justify-between">
              <span>Guest: </span>
              <div>
                <SoftButton text="Add New Guest">
                  <p onClick={handleNewGuest}>Add New Guest</p>
                </SoftButton>
              </div>
            </div>
          </div>
          <div className="h-72 overflow-y-scroll">
            <div className="flex justify-center items-center bg-gray-50 border rounded-lg mb-4">
              <FiSearch className="mx-2" />
              <input
                type="text"
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                className="bg-gray-50  text-gray-900 text-sm rounded-r-lg w-full p-2"
                placeholder="Search by Name / NIC / Passport No"
              />
            </div>
            <table className="w-full text-sm text-left rtl:text-right  text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Address
                  </th>
                  <th scope="col" className="px-6 py-3">
                    NIC/Passport
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Phone
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  <th> </th>
                  <th> </th>
                </tr>
              </thead>
              <tbody>
                {guests &&
                  guests.map((guest) => (
                    <RoomReservationGuest
                      key={guest._id}
                      guest={guest}
                      selectedGuest={reservationData && reservationData.guest}
                    />
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Step 3: Select Extras */}
      {currentSection === "extras" && (
        <div>
          <div className="relative h-18 my-4 p-1 flex justify-between">
            <p>
              Extras: {"  "}
              {reservedExtras.map((item, index) => (
                <span key={index}>
                  {item.name} {" | "}
                </span>
              ))}
            </p>
          </div>
          <div className="h-72 overflow-y-scroll">
            {extras.map((extraItem, index) => (
              <div
                key={index}
                className="py-2 my-2 px-2 mr-2 flex justify-between hover:cursor-pointer rounded-lg text-gray-700 bg-gray-50 dark:bg-gray-200 dark:text-gray-700"
              >
                <div className="flex">
                  <div className="flex items-center px-4 bg-white rounded-lg">
                    {extraItem.icon}
                  </div>
                  <div className="px-4">
                    <p className="text-base">{extraItem.name}</p>
                    <span className="font-bold text-sm">
                      Rs. {extraItem.cost}
                    </span>
                    <span className="text-sm">/{extraItem.costText}</span>
                  </div>
                </div>
                <div className="px-2">
                  <SoftButton
                    text="Select"
                    backgroundColor={
                      isSelected(extraItem.extraId) ? "bg-gray-600" : ""
                    }
                  >
                    <p
                      onClick={(e) => {
                        e.preventDefault();
                        handleExtras(extraItem);
                      }}
                    >
                      {isSelected(extraItem.extraId) ? "Selected" : "Select"}
                    </p>
                  </SoftButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Step 4: Payment */}
      {currentSection === "payment" && (
        <div>
          <div className="relative h-18 my-4 p-1 flex justify-between">
            <p>Payment:</p>
          </div>
          <div className="h-72 grid grid-cols-3 px-1">
            <div className="col-span-2">
              <div className="py-2">
                <p className="font-bold">Payment method:</p>
                {paymentStatus === "unpaid" && (
                  <div className="grid grid-cols-2 py-4">
                    <div
                      className="py-6 px-4 mr-8 hover:cursor-pointer flex items-center justify-center rounded-lg text-gray-700 bg-gray-50 dark:bg-gray-200 dark:text-gray-700"
                      onClick={(e) => {
                        e.preventDefault();
                        setPaymentStatus("confirm");
                      }}
                    >
                      <FaMoneyBill />
                      <p className="px-4">Cash</p>
                    </div>
                    <div
                      className="py-6 px-4 mr-8 hover:cursor-pointer flex items-center justify-center rounded-lg text-gray-700 bg-gray-50 dark:bg-gray-200 dark:text-gray-700"
                      onClick={handleCardPayment}
                    >
                      <FaCreditCard />
                      <p className="px-4">Card</p>
                    </div>
                  </div>
                )}
                {/* For cash payments */}
                {paymentStatus === "confirm" && (
                  <div className="grid py-4">
                    <div
                      className="py-6 px-4 mr-8 hover:cursor-pointer flex items-center justify-center rounded-lg text-gray-700 bg-gray-50 dark:bg-gray-200 dark:text-gray-700"
                      onClick={handleCashPayment}
                    >
                      <p className="px-4">Confirm Payment</p>
                    </div>
                  </div>
                )}
                {/* For card payments */}
                {paymentStatus === "pending" && (
                  <div className="grid py-4">
                    <div className="py-6 px-4 mr-8 hover:cursor-pointer flex items-center justify-center rounded-lg text-gray-700 bg-gray-50 dark:bg-gray-200 dark:text-gray-700">
                      <span className="px-4">Payment processing</span>
                      <FaSpinner />
                    </div>
                  </div>
                )}
                {paymentStatus === "completed" && (
                  <div className="grid py-4">
                    <div className="py-6 px-4 mr-8 hover:cursor-pointer flex items-center justify-center rounded-lg text-gray-700 bg-gray-50 dark:bg-gray-200 dark:text-gray-700">
                      <span className="px-4 font-bold">Payment completed</span>
                      <FaCheckCircle />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className="py-2">
                <p className="font-bold">Reservation Details:</p>
              </div>
              <div className="py-2">
                <p className="text-base">
                  {reservedGuest &&
                    reservedGuest.title +
                      " " +
                      reservedGuest.firstName +
                      " " +
                      reservedGuest.lastName}
                </p>
              </div>
              <div className="py-2">
                {reservedRooms &&
                  reservedRooms.map((room, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-base">{room.type}</span>
                      <span className="text-base">{room.cost}</span>
                    </div>
                  ))}
              </div>
              <div className="py-2">
                {reservedExtras &&
                  reservedExtras.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-base">{item.name}</span>
                      <span className="text-base">{item.cost}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Step 5: Confirmation */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        currentSection === "confirmation" && (
          <div>
            <div className="relative h-18 my-4 p-1 flex rounded-lg text-gray-700 bg-gray-50 dark:bg-gray-200 dark:text-gray-700">
              <FaCheckCircle />
              <span className="font-bold text-base px-4">
                Reservation is confirmed
              </span>
            </div>
            <div className="h-72 text-base">
              <div className="w-full grid grid-cols-3 py-4">
                <div>
                  <p>Booking No:</p>
                  <p>{bookingNo !== null && bookingNo}</p>
                </div>
                <div>
                  <p>Check In:</p>
                  <p>{reservationData.checkIn}</p>
                </div>
                <div>
                  <p>Check Out:</p>
                  <p>{reservationData.checkOut}</p>
                </div>
              </div>
              <div className="w-full grid grid-cols-3 py-4">
                <div>
                  <p>Guest:</p>
                  <p>
                    {reservedGuest.title} {reservedGuest.firstName}{" "}
                    {reservedGuest.lastName}
                  </p>
                </div>
                <div>
                  <p>Phone:</p>
                  <p>{reservedGuest.phone}</p>
                </div>
                <div>
                  <p>Email:</p>
                  <p>{reservedGuest.email}</p>
                </div>
              </div>
              <div className="w-full py-4">
                {reservedRooms.length > 0 && (
                  <RoomReservationInvoice
                    reservation={reservationData}
                    bookingNo={bookingNo}
                    reservedGuest={reservedGuest}
                    reservedRooms={reservedRooms}
                    dateCount={dateCount}
                  />
                )}
              </div>
            </div>
          </div>
        )
      )}
      <div className="flex justify-between py-4">
        <div className="flex flex-col">
          <p>
            No of days:
            <span className="font-bold">{dateCount}</span>
          </p>
          <p>
            Total:
            <span className="font-bold">
              {" "}
              {/* LKR {reservationData.total * dateCount} */}
              LKR {reservationData.total}
            </span>
          </p>
        </div>

        <div className="flex gap-2">
          {(currentSection !== "payment" ||
            currentSection !== "confirmation") && (
            <button
              className="px-6 py-2 bg-gray-700 text-gray-400 rounded"
              onClick={resetReservation}
            >
              Cancel
            </button>
          )}
          {currentSection === "confirmation" ? (
            <button
              onClick={resetReservation}
              className="px-6 py-2 bg-slate-300 text-gray-900 rounded"
            >
              All Reservations
            </button>
          ) : (
            <button
              disabled={disableNextBtn}
              className="px-6 py-2 bg-slate-300 text-gray-900 rounded"
              onClick={nextSection}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomReservationForm;
