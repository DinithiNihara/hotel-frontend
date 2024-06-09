import React, { useEffect, useState } from "react";
import ProgressStepsBarEvents from "../components/ProgressStepsBarEvents.js";
import { differenceInDays, format, parseISO } from "date-fns";
import { HStack } from "@chakra-ui/react";
import Datepicker from "react-tailwindcss-datepicker";
import SoftButton from "./SoftButton.js";
import { useGuestsContext } from "../hooks/useGuestsContext.js";
import { useEventVenuesContext } from "../hooks/useEventVenuesContext.js";

const EventVenueReservationForm = () => {
  // Completed step number in the Progress Bar
  const [stepNo, setStepNo] = useState(0);
  //   Current section to update page content
  const [currentSection, setCurrentSection] = useState("venue");
  //   Check-In & Check-Out dates
  const [value, setValue] = useState({
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });
  const [dateCount, setDateCount] = useState(1);

  // Event Venues Details
  const { eventVenues, dispatch } = useEventVenuesContext();

  // Guest Details
  const { guests, setGuests } = useGuestsContext();

  const resetReservation = () => {
    // resetReservationData();
    // setResetDates(!resetDates);
    setStepNo(0);
  };
  const nextSection = () => {
    if (currentSection === "venue") {
      setCurrentSection("menu");
    }
    if (currentSection === "menu") {
      setCurrentSection("entertain");
    }
    if (currentSection === "entertain") {
      setCurrentSection("decor");
    }
    if (currentSection === "decor") {
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
    if (currentSection === "menu") {
      setCurrentSection("venue");
    }
    if (currentSection === "entertain") {
      setCurrentSection("menu");
    }
    if (currentSection === "decor") {
      setCurrentSection("entertain");
    }
    if (currentSection === "guest") {
      setCurrentSection("decor");
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
  };

  const fetchGuests = async () => {
    const response = await fetch("/api/guests");
    const json = await response.json();

    if (response.ok) {
      setGuests({ type: "SET_GUESTS", payload: json });
    }
  };

  const checkAvailableVenues = () => {
    // fetchRooms();
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
        {/* Step 1: Select venue */}
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
            <div className="h-72 overflow-y-scroll"></div>
          </div>
        )}
        {/* Step 2: Select menu */}
        {currentSection === "menu" && (
          <div>
            <div className="relative h-18 my-4 p-1 flex justify-between"></div>
            <div className="h-72"></div>
          </div>
        )}
        {/* Step 3: Select entertain */}
        {currentSection === "entertain" && (
          <div>
            <div className="relative h-18 my-4 p-1 flex justify-between"></div>
            <div className="h-72"></div>
          </div>
        )}
        {/* Step 4: Select decor */}
        {currentSection === "decor" && (
          <div>
            <div className="relative h-18 my-4 p-1 flex justify-between"></div>
            <div className="h-72"></div>
          </div>
        )}
        {/* Step 5: Select guest */}
        {currentSection === "guest" && (
          <div>
            <div className="relative h-18 my-4 p-1 flex justify-between"></div>
            <div className="h-72"></div>
          </div>
        )}
        {/* Step 6: Reservation payment */}
        {currentSection === "payment" && (
          <div>
            <div className="relative h-18 my-4 p-1 flex justify-between"></div>
            <div className="h-72"></div>
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
      <div className="flex justify-between py-8">
        <p>
          {currentSection}
          Total:
          <span className="font-bold">
            {/* LKR {reservationData.total * dateCount} */}
          </span>
        </p>
        <div className="flex gap-2">
          {(currentSection !== "payment" ||
            currentSection !== "confirmation") && (
            <button onClick={resetReservation}>Cancel</button>
          )}
          {(currentSection !== "venue" ||
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
