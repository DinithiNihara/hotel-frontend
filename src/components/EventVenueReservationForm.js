import React from "react";
import ProgressStepsBarEvents from "../components/ProgressStepsBarEvents.js";

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

  return (
    <div className="h-4/5">
      <ProgressStepsBarEvents />
      {/* Step 1: Select venue */}
      {currentSection === "venue" && <div></div>}
      {/* Step 2: Select menu */}
      {currentSection === "menu" && <div></div>}
      {/* Step 3: Select entertain */}
      {currentSection === "entertain" && <div></div>}
      {/* Step 4: Select decor */}
      {currentSection === "decor" && <div></div>}
      {/* Step 5: Select guest */}
      {currentSection === "guest" && <div></div>}
      {/* Step 6: Reservation payment */}
      {currentSection === "payment" && <div></div>}
      {/* Step 7: Reservation confirmation */}
      {currentSection === "confirmation" && <div></div>}
    </div>
  );
};

export default EventVenueReservationForm;
