import React, { useContext, useEffect, useState } from "react";
import ProgressStepsBarEvents from "../components/ProgressStepsBarEvents.js";
import { differenceInDays, format, parseISO } from "date-fns";
import { HStack } from "@chakra-ui/react";
import Datepicker from "react-tailwindcss-datepicker";
import SoftButton from "./SoftButton.js";
import { useGuestsContext } from "../hooks/useGuestsContext.js";
import { useEventVenuesContext } from "../hooks/useEventVenuesContext.js";
import { useRoomsContext } from "../hooks/useRoomsContext.js";
import EventVenueDetailsForReservation from "./EventVenueDetailsForReservation.js";
import { EventVenueReservationDataContext } from "../context/EventVenueReservationDataContext.js";
import EventVenueReservationGuest from "./EventVenueReservationGuest.js";
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
import EventVenueReservationInvoice from "./EventVenueReservationInvoice.js";
import { useAddModalContext } from "../context/AddModalContext.js";
import ProgressStepsBarWedding from "./ProgressStepsBarWedding.js";
import RoomDetailsForVenueReservation from "./RoomDetailsForVenueReservation.js";

const EventVenueReservationForm = ({ onCancel, reloadReservations }) => {
  const [isLoading, setIsLoading] = useState(true);

  // Completed step number in the Progress Bar
  const [stepNo, setStepNo] = useState(0);
  //   Current section to update page content
  const [currentSection, setCurrentSection] = useState("eventType");
  //   Check-In & Check-Out dates
  const [value, setValue] = useState({
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });
  const [dateCount, setDateCount] = useState(1);
  const [resetDates, setResetDates] = useState(false);
  const { reservationData, updateReservationData, resetReservationData } =
    useContext(EventVenueReservationDataContext);
  const [reservedGuest, setReservedGuest] = useState(null);
  const [reservedRooms, setReservedRooms] = useState([]);
  const [reservedVenues, setReservedVenues] = useState([]);
  const [reservedExtras, setReservedExtras] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState("unpaid");
  const [paymentType, setPaymentType] = useState("Full");
  const [eventType, setEventType] = useState(null);
  const [packageType, setPackageType] = useState({});
  const [bookingNo, setBookingNo] = useState();
  const [extraSelected, setExtraSelected] = useState(false);
  const [disableNextBtn, setDisableNextBtn] = useState(true);
  const { onAddOpen } = useAddModalContext();
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentAmount, setpaymentAmount] = useState(totalAmount);
  const [guestCount, setGuestCount] = useState(0);
  const [invalidGuestCount, setinvalidGuestCount] = useState(true);
  const [searchType, setSearchType] = useState("");
  const [searchRoom, setSearchRoom] = useState("");

  // Event Venues Details
  const { eventVenues, setEventVenues } = useEventVenuesContext();
  // Room Details
  const { rooms, dispatch } = useRoomsContext();
  // Guest Details
  const { guests, setGuests } = useGuestsContext();

  const packages = [
    { name: "Gold Menu 1", cost: 6500 },
    { name: "Gold Menu 2", cost: 6850 },
    { name: "Platinum Menu 1", cost: 7650 },
    { name: "Platinum Menu 2", cost: 7800 },
    { name: "Platinum Menu 3", cost: 8250 },
    { name: "Platinum Menu 4", cost: 8850 },
    { name: "Platinum Menu 5", cost: 9250 },
    { name: "Platinum Menu 5", cost: 9250 },
    { name: "Platinum Menu 5", cost: 9250 },
  ];

  // Extras Details
  const extras = [
    {
      extraId: 1,
      icon: <FaParking />,
      name: "Screen and projector",
      cost: 4000,
    },
    {
      extraId: 2,
      icon: <FaWineBottle />,
      name: "Champagne Bottle for the Champagne Fountain & Dry Ice",
      cost: 8000,
    },
    {
      extraId: 3,
      icon: <FaSpa />,
      name: "Milk Rice Platter",
      cost: 3000,
    },
    {
      extraId: 4,
      icon: <FaHandshake />,
      name: "Milk Rice Portion",
      cost: 1000,
    },
    {
      extraId: 5,
      icon: <FaDumbbell />,
      name: "Foyer Area Decoration",
      cost: 25000,
    },
  ];

  const handleExtras = (extraItem) => {
    console.log(reservationData);
    const newData = { ...reservationData };
    const itemIndex = newData.extras.indexOf(extraItem.extraId);

    if (itemIndex === -1) {
      newData.extras.push(extraItem.extraId);
      newData.total = reservationData.total + extraItem.cost;
      setExtraSelected(true);
    } else {
      newData.extras.splice(itemIndex, 1);
      newData.total = reservationData.total - extraItem.cost;
      setExtraSelected(false);
    }
    updateReservationData(newData);
    console.log(reservationData.extras);
  };

  const handleCashPayment = () => {
    setPaymentStatus("completed");
    console.log(reservationData);
    const newData = { ...reservationData };
    newData.paymentDetails.push({
      payment: paymentType,
      cost: paymentAmount,
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
        payment: paymentType,
        cost: paymentAmount,
        type: "Card",
        date: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      });
      updateReservationData(newData);
      handleReservationData();
    }, 2000);
  };

  const handleReservationData = () => {
    const newData = { ...reservationData };
    newData.type = eventType;
    newData.package = packageType;
    newData.guestCount = guestCount;
    newData.status = "Confirmed";
    newData.checkIn = value.startDate;
    newData.checkOut = value.endDate;
    newData.extras = extras
      .filter((extra) => reservationData.extras.includes(extra.extraId))
      .map((extra) => ({
        extraId: extra.extraId,
        name: extra.name,
        cost: extra.cost,
      }));
    updateReservationData(newData);
    console.log(reservationData);
  };

  const handleRoomReservation = async () => {
    let roomReservation = {};
    roomReservation.type = "Wedding";
    roomReservation.status = "Confirmed";
    roomReservation.checkIn = value.startDate;
    roomReservation.checkOut = value.endDate;
    roomReservation.guest = reservationData.guest;
    roomReservation.rooms = reservationData.rooms;
    roomReservation.extras = [];
    roomReservation.paymentDetails = [];
    roomReservation.total = 0;
    const response = await fetch("/api/roomReservations", {
      method: "POST",
      body: JSON.stringify(roomReservation),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response);
    const json = await response.json();
  };

  const handleSubmit = async (e) => {
    const response = await fetch("/api/eventVenueReservations", {
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
    if (
      eventType === "Wedding" &&
      reservationData.rooms &&
      reservationData.rooms.length > 0
    ) {
      handleRoomReservation();
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
    if (currentSection === "eventType") {
      setCurrentSection("package");
    }
    if (currentSection === "package") {
      setCurrentSection("venue");
    }
    if (currentSection === "venue") {
      if (eventType === "Wedding") {
        setCurrentSection("rooms");
      } else {
        setCurrentSection("extras");
      }
    }
    if (currentSection === "rooms") {
      setCurrentSection("extras");
    }
    if (currentSection === "extras") {
      setCurrentSection("guest");
    }
    if (currentSection === "guest") {
      setCurrentSection("payment");
    }
    if (currentSection === "payment") {
      setCurrentSection("confirmation");
    }
  };

  // Fetch all available venues
  const fetchEventVenues = async () => {
    let checkInDate = value.startDate;
    let checkOutDate = value.endDate;
    const response = await fetch(
      `/api/eventVenues/available?checkIn=${checkInDate}&checkOut=${checkOutDate}`
    );
    const json = await response.json();
    if (response.ok) {
      setEventVenues({ type: "SET_EVENTVENUES", payload: json });
    }

    setIsLoading(false);
  };

  // Fetch all available rooms
  const fetchRooms = async () => {
    let checkInDate = value.startDate;
    let checkOutDate = value.endDate;
    const response = await fetch(
      `/api/rooms/searchAvailable?term=${searchRoom}&type=Deluxe&checkIn=${checkInDate}&checkOut=${checkOutDate}`
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

  const checkAvailableVenues = () => {
    fetchEventVenues();
    // setResetDates(!resetDates);
    // setStepNo(0);

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

  // Add new guest
  const handleNewGuest = (e) => {
    e.preventDefault();
    onAddOpen("Guest");
  };

  // Guest Count
  const handleChange = (e) => {
    const newValue = Number(e.target.value);

    setGuestCount(newValue);
  };

  useEffect(() => {
    console.log(value);
    fetchEventVenues();
    fetchRooms();
    fetchGuests();
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [value.startDate, value.endDate]);

  // search room
  useEffect(() => {
    let checkInDate = value.startDate;
    let checkOutDate = value.endDate;
    const searchRooms = async () => {
      const response = await fetch(
        `/api/rooms/searchAvailable?term=${searchRoom}&type=Deluxe&checkIn=${checkInDate}&checkOut=${checkOutDate}`
      );
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_ROOMS", payload: json });
      }
    };

    searchRooms();
  }, [searchRoom, searchType]);

  // Validate guest count
  useEffect(() => {
    console.log(guestCount);

    if (guestCount < 50) {
      setinvalidGuestCount(true);
    } else if (guestCount > 3000) {
      setinvalidGuestCount(true);
    } else {
      setinvalidGuestCount(false);
    }
    console.log(invalidGuestCount);
  }, [guestCount]);

  useEffect(() => {
    console.log(packageType);
    const newData = { ...reservationData };
    if (packageType && Object.keys(packageType).length > 0) {
      newData.total = packageType.cost * guestCount;
    }

    updateReservationData(newData);
    console.log(reservationData);
  }, [packageType]);

  // Change progress bar step number
  useEffect(() => {
    console.log(reservationData);
    if (eventType !== null && invalidGuestCount) {
      setStepNo(1);
    }
    if (packageType && Object.keys(packageType).length > 0) {
      setStepNo(2);
      console.log(packageType);
    }
    if (reservationData.eventVenues && reservationData.eventVenues.length > 0) {
      setStepNo(3);
      console.log(packageType);
    }
    if (reservationData.rooms && reservationData.rooms.length > 0) {
      setStepNo(1);
    }
    if (reservationData.extras && reservationData.extras.length > 0) {
      {
        eventType === "Wedding" ? setStepNo(5) : setStepNo(4);
      }
    }
    if (reservationData.guest !== null) {
      {
        eventType === "Wedding" ? setStepNo(5) : setStepNo(5);
      }
    }
    if (
      reservationData.paymentDetails &&
      reservationData.paymentDetails.length > 0
    ) {
      {
        eventType === "Wedding" ? setStepNo(7) : setStepNo(6);
      }
    }

    if (reservationData.rooms && reservationData.rooms.length > 0) {
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
    if (reservationData.eventVenues) {
      // Filter reserved venues
      const filteredEventVenues = eventVenues.filter((venue) =>
        reservationData.eventVenues.includes(venue._id)
      );
      setReservedVenues(filteredEventVenues);
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
  }, [eventType, invalidGuestCount, packageType, reservationData]);

  useEffect(() => {
    if (reservationData.total > 0) {
      setTotalAmount(reservationData.total);
    }
    if (paymentType === "Full") {
      setpaymentAmount(totalAmount);
    } else if (paymentType === "Partial") {
      setpaymentAmount(totalAmount / 2);
    }
  }, [paymentType, reservationData.total]);

  useEffect(() => {
    console.log(currentSection);
    console.log(stepNo);
    console.log(reservationData.guest);
    if (currentSection === "eventType") {
      // setDisableNextBtn(eventType == null);

      if (eventType !== null && guestCount > 0) {
        setDisableNextBtn(invalidGuestCount);
      }
    } else if (currentSection === "package") {
      setDisableNextBtn(Object.keys(packageType).length === 0);
    } else if (currentSection === "venue") {
      setDisableNextBtn(reservationData.eventVenues.length === 0);
    } else if (currentSection === "rooms") {
      setDisableNextBtn(
        reservationData.rooms && reservationData.rooms.length === 0
      );
    } else if (currentSection === "guest") {
      setDisableNextBtn(reservationData.guest === null);
    } else if (currentSection === "payment") {
      setDisableNextBtn(reservationData.paymentDetails.length === 0);
    }
  }, [
    stepNo,
    currentSection,
    reservationData.rooms,
    reservationData.guest,
    eventType,
    guestCount,
    invalidGuestCount,
  ]);
  console.log(reservationData);

  return (
    <div className="h-4/5">
      {eventType === "Wedding" ? (
        <ProgressStepsBarWedding stepNo={stepNo} />
      ) : (
        <ProgressStepsBarEvents stepNo={stepNo} />
      )}

      <div>
        {/* Step 1: Select eventType */}
        {currentSection === "eventType" && (
          <div>
            <div className="relative h-18 my-4 p-1 flex justify-between">
              <p className="py-4">Event type:</p>
            </div>
            <div className="h-72">
              <div className="flex items-center mb-2 ps-4 border border-gray-200 rounded dark:border-gray-700 ">
                <input
                  onChange={(e) => setEventType("Wedding")}
                  id="bordered-radio-1"
                  type="radio"
                  value=""
                  name="bordered-radio"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="bordered-radio-1"
                  className="w-full py-4 ms-2 text-sm font-medium text-gray-900"
                >
                  Wedding
                </label>
              </div>
              <div className="flex items-center mb-2 ps-4 border border-gray-200 rounded dark:border-gray-700">
                <input
                  onChange={(e) => setEventType("Other")}
                  id="bordered-radio-2"
                  type="radio"
                  value=""
                  name="bordered-radio"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="bordered-radio-2"
                  className="w-full py-4 ms-2 text-sm font-medium text-gray-900"
                >
                  Other
                </label>
              </div>
              <div className="py-4">
                <p>No of Guests:</p>
                <input
                  type="number"
                  max={3000}
                  min={85}
                  onChange={handleChange}
                  className="bg-gray-50 border text-gray-900 text-sm rounded-lg w-full py-4 px-2"
                />
              </div>
            </div>
          </div>
        )}
        {/* Step 2: Select package */}
        {currentSection === "package" && (
          <div>
            <div className="relative h-18 my-4 p-1 flex justify-between">
              <p className="py-4">Package type:</p>
            </div>
            <div className="h-72 grid grid-cols-2 overflow-y-auto">
              {packages &&
                packages.map((eachPackage, index) => (
                  <div
                    key={index}
                    className="flex w-4/5 items-center my-2 mx-2 ps-4 border border-gray-200 rounded dark:border-gray-700"
                  >
                    <input
                      onChange={(e) => setPackageType(eachPackage)}
                      id="bordered-radio-2"
                      type="radio"
                      value=""
                      name="bordered-radio"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="bordered-radio-2"
                      className="py-4 ms-2 text-sm font-medium text-gray-900"
                    >
                      {eachPackage.name} - LKR {eachPackage.cost}
                    </label>
                  </div>
                ))}
            </div>
          </div>
        )}
        {/* Step 3: Select venue */}
        {currentSection === "venue" && (
          <div>
            {/* Change dates to find available venues */}
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
                      checkAvailableVenues();
                    }}
                    className="text-base"
                  >
                    Check Availability
                  </p>
                </SoftButton>
              </HStack>
            </div>
            {/* Available venues list */}

            <div className="h-72 overflow-y-scroll">
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                <table className="w-full text-sm text-left rtl:text-right  text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th>
                        <th
                          scope="col"
                          className="px-6 py-3 md:w-48 text-center"
                        >
                          Type
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 md:w-32 text-center"
                        >
                          Venue No
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 md:w-24 text-center"
                        >
                          Capacity
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 md:w-32 text-center"
                        >
                          Cost
                        </th>
                        <th scope="col" className="px-6 py-2 md:w-48"></th>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventVenues &&
                      eventVenues.map((eventVenue) => (
                        <EventVenueDetailsForReservation
                          key={eventVenue._id}
                          eventVenue={eventVenue}
                          resetDates={resetDates}
                        />
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
        {/* Step 4: Select rooms */}
        {currentSection === "rooms" && (
          <div>
            {/* Change dates to find available rooms */}
            <div className="h-18 my-4 p-1 rounded border-2 border-dashed border-slate-600 ">
              {/* <HStack>
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
              </HStack> */}
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
                    <option value="Deluxe">Deluxe</option>
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
                      <RoomDetailsForVenueReservation
                        key={room._id}
                        room={room}
                      />
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* Step 4/5: Select extras */}
        {currentSection === "extras" && (
          <div>
            <div className="relative h-18 my-4 p-1 flex justify-between">
              <p>
                Extras:{"  "}
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
                    </div>
                  </div>
                  <div className="px-2">
                    <SoftButton
                      text="Select"
                      // backgroundColor={extraSelected ? "bg-gray-600" : ""}
                    >
                      <p
                        onClick={(e) => {
                          e.preventDefault();
                          handleExtras(extraItem);
                        }}
                      >
                        {/* {extraSelected ? "Selected" : "Select"} */}Select
                      </p>
                    </SoftButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Step 5/6: Select guest */}
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
                      <EventVenueReservationGuest
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
        {/* Step 6/7: Reservation payment */}
        {currentSection === "payment" && (
          <div>
            <div className="relative h-18 my-4 p-1 flex justify-between">
              <p>Payment:</p>
            </div>
            <div className="h-72 grid grid-cols-3 px-1">
              <div className="col-span-2">
                <div className="grid grid-cols-2 py-2">
                  <div className="mr-8 ">
                    <label>Type:</label>
                    <select
                      onChange={(e) => setPaymentType(e.target.value)}
                      value={paymentType}
                      className="bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
                    >
                      <option value="Full">Full Payment</option>
                      <option value="Partial">Partial Payment 50%</option>
                    </select>
                  </div>
                  <div className="mr-8 ">
                    <label>Amount:</label>
                    <input
                      disabled
                      type="number"
                      className={
                        "text-right bg-gray-50 border text-gray-900 text-sm rounded-lg w-full p-2"
                      }
                      value={paymentAmount}
                    />
                  </div>
                </div>
                <div className="py-4">
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
                        <span className="px-4 font-bold">
                          Payment completed
                        </span>
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
                  {reservedGuest && (
                    <p className="text-base">
                      {reservedGuest &&
                        reservedGuest.title +
                          " " +
                          reservedGuest.firstName +
                          " " +
                          reservedGuest.lastName}
                    </p>
                  )}
                </div>
                <div className="py-2">
                  {reservedVenues &&
                    reservedVenues.map((venue, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-base">{venue.type}</span>
                        <span className="text-base">{venue.cost}</span>
                      </div>
                    ))}
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
        {/* Step 7/8: Reservation confirmation */}
        {currentSection === "confirmation" && (
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
                {reservedVenues.length > 0 && (
                  <EventVenueReservationInvoice
                    reservation={reservationData}
                    bookingNo={bookingNo}
                    reservedGuest={reservedGuest}
                    reservedVenues={reservedVenues}
                    reservedRooms={reservedRooms}
                    packageType={packageType}
                    guestCount={guestCount}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-between py-4">
        <p>
          Total:
          <span className="font-bold">
            {" "}
            LKR {reservationData.total * dateCount}
          </span>
        </p>
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

export default EventVenueReservationForm;
