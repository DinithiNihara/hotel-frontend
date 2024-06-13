import React, { useContext, useEffect, useState } from "react";
import {
  FaMoneyBill,
  FaCreditCard,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";
import ProgressStepsBarEvents from "../components/ProgressStepsBarEvents.js";
import { differenceInDays, format, parseISO } from "date-fns";
import { HStack } from "@chakra-ui/react";
import Datepicker from "react-tailwindcss-datepicker";
import SoftButton from "./SoftButton.js";
import { useGuestsContext } from "../hooks/useGuestsContext.js";
import { useEventVenuesContext } from "../hooks/useEventVenuesContext.js";
import EventVenueDetailsForReservation from "./EventVenueDetailsForReservation.js";
import { EventVenueReservationDataContext } from "../context/EventVenueReservationDataContext.js";
import EventVenueReservationGuest from "./EventVenueReservationGuest.js";

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
  const [paymentStatus, setPaymentStatus] = useState("unpaid");

  // Event Venues Details
  const { eventVenues, dispatch } = useEventVenuesContext();

  // Guest Details
  const { guests, setGuests } = useGuestsContext();

  const handleCashPayment = () => {
    setPaymentStatus("completed");
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
    newData.type = "Standard";
    newData.status = "Confirmed";
    newData.checkIn = value.startDate;
    newData.checkOut = value.endDate;
    // newData.extras = extras
    //   .filter((extra) => reservationData.extras.includes(extra.extraId))
    //   .map((extra) => ({
    //     extraId: extra.extraId,
    //     name: extra.name,
    //     cost: extra.cost,
    //     costText: extra.costText,
    //   }));
    updateReservationData(newData);
    console.log(reservationData);
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

  const previousSection = () => {
    if (currentSection === "package") {
      setCurrentSection("eventType");
    }
    if (currentSection === "venue") {
      setCurrentSection("package");
    }
    if (currentSection === "extras") {
      setCurrentSection("venue");
    }
    if (currentSection === "guest") {
      setCurrentSection("extras");
    }
    if (currentSection === "payment") {
      setCurrentSection("guest");
    }
    if (currentSection === "confirmation") {
      setCurrentSection("payment");
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
      dispatch({ type: "SET_EVENTVENUES", payload: json });
    }

    setIsLoading(false);
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
    fetchGuests();
  }, []);

  return (
    <div className="h-4/5">
      <ProgressStepsBarEvents />
      <div>
        {/* Step 1: Select eventType */}
        {currentSection === "eventType" && (
          <div>
            <div className="relative h-18 my-4 p-1 flex justify-between"></div>
            <div className="h-72"></div>
          </div>
        )}
        {/* Step 2: Select package */}
        {currentSection === "package" && (
          <div>
            <div className="relative h-18 my-4 p-1 flex justify-between"></div>
            <div className="h-72"></div>
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
            <div className="relative h-18 my-4 p-1 flex justify-between"></div>
            <div className="h-72"></div>
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
            <div className="h-72">
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
                      {reservedGuest.title} {reservedGuest.firstName}{" "}
                      {reservedGuest.lastName}
                    </p>
                  )}
                </div>
                <div className="py-2">
                  {/* {reservedRooms &&
                    reservedRooms.map((room, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-base">{room.type}</span>
                        <span className="text-base">{room.cost}</span>
                      </div>
                    ))} */}
                </div>
                <div className="py-2">
                  {/* {reservedExtras &&
                    reservedExtras.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-base">{item.name}</span>
                        <span className="text-base">{item.cost}</span>
                      </div>
                    ))} */}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Step 7: Reservation confirmation */}
        {currentSection === "confirmation" && (
          <div>
            <div className="relative h-18 my-4 p-1 flex justify-between"></div>
            <div className="h-72"></div>
          </div>
        )}
      </div>
      <div className="flex justify-between py-4">
        <p>
          {currentSection}
          Total:
          <span className="font-bold">
            LKR {reservationData.total * dateCount}
          </span>
        </p>
        <div className="flex gap-2">
          {(currentSection !== "payment" ||
            currentSection !== "confirmation") && (
            <button onClick={resetReservation}>Cancel</button>
          )}
          {(currentSection !== "eventType" ||
            currentSection !== "confirmation") && (
            <button onClick={previousSection}>Back</button>
          )}
          {currentSection === "confirmation" ? (
            <button>All Reservations</button>
          ) : (
            <button onClick={nextSection}>Next</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventVenueReservationForm;
