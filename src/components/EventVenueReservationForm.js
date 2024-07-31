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
import EventVenueReservationInvoice from "./EventVenueReservationInvoice.js";

const EventVenueReservationForm = () => {
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
  const [eventType, setEventType] = useState(null);
  const [packageType, setPackageType] = useState({});
  const [bookingNo, setBookingNo] = useState();

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
    } else {
      newData.extras.splice(itemIndex, 1);
      newData.total = reservationData.total + extraItem.cost;
    }
    updateReservationData(newData);
    console.log(reservationData.extras);
  };

  const handleCashPayment = () => {
    setPaymentStatus("completed");
    console.log(reservationData);
    const newData = { ...reservationData };
    newData.paymentDetails.push({
      payment: "Full",
      cost: newData.total,
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
        cost: newData.total,
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
  };

  const resetReservation = () => {
    resetReservationData();
    setResetDates(!resetDates);
    setStepNo(0);
  };
  const nextSection = () => {
    if (currentSection === "eventType") {
      setCurrentSection("package");
    }
    if (currentSection === "package") {
      setCurrentSection("venue");
    }
    if (currentSection === "venue") {
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

  const checkAvailableVenues = () => {
    fetchEventVenues();
    // setResetDates(!resetDates);
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

  useEffect(() => {
    console.log(value);
    fetchEventVenues();
    fetchRooms();
    fetchGuests();
  }, []);

  // Change progress bar step number
  useEffect(() => {
    console.log(reservationData);
    if (eventType !== null) {
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
      setStepNo(4);
    }
    if (reservationData.guest !== null) {
      setStepNo(5);
    }
    if (
      reservationData.paymentDetails &&
      reservationData.paymentDetails.length > 0
    ) {
      setStepNo(6);
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
    if (reservationData.eventVenues.length > 0) {
      // Filter reserved venues
      const filteredEventVenues = eventVenues.filter((venue) =>
        reservationData.eventVenues.includes(venue._id)
      );
      setReservedVenues(filteredEventVenues);
    }

    if (reservationData.extras.length > 0) {
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
  }, [eventType, packageType, reservationData]);

  return (
    <div className="h-4/5">
      <ProgressStepsBarEvents stepNo={stepNo} />
      <div>
        {/* Step 1: Select eventType */}
        {currentSection === "eventType" && (
          <div>
            <div className="relative h-18 my-4 p-1 flex justify-between">
              <p className="py-4">Event type:</p>
            </div>
            <div className="h-72">
              <div className="flex items-center mb-2 ps-4 border border-gray-200 rounded dark:border-gray-700">
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
        {/* Step 4: Select extras */}
        {currentSection === "extras" && (
          <div>
            <div className="relative h-18 my-4 p-1 flex justify-between">
              <p>
                Extras:
                {reservationData.extras.map((item, index) => {
                  <span>{item}</span>;
                })}
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
        {/* Step 5: Select guest */}
        {currentSection === "guest" && (
          <div>
            <div className="relative h-18 my-4 p-1 flex justify-between">
              <div className="w-full flex justify-between">
                <span>Guest: </span>
                <div>
                  <SoftButton text="Add New Guest">
                    <p>Add New Guest</p>
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
                      />
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* Step 6: Reservation payment */}
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
        {/* Step 7: Reservation confirmation */}
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
            <button className="px-6 py-2 bg-slate-300 text-gray-900 rounded">
              All Reservations
            </button>
          ) : (
            <button
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
