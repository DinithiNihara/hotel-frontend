import React, { useState } from "react";
import ProgressStepsBar from "./ProgressStepsBar";
import Datepicker from "react-tailwindcss-datepicker";
import { Button } from "@chakra-ui/react";
const RoomReservationForm = () => {
  const [value, setValue] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  const handleValueChange = (newValue) => {
    console.log("newValue:", newValue);
    setValue(newValue);
  };

  return (
    <div>
      <ProgressStepsBar />
      <div className="h-[60px] m-4 rounded border-2 border-dashed border-slate-600 ">
        <div className="flex flex-col p-2">
          <Datepicker
            value={value}
            onChange={handleValueChange}
            primaryColor={"amber"}
            minDate={new Date()}
            placeholder="Check In - Check Out"
            inputClassName={"bg-white w-3/4 rounded-lg p-1 text-center"}
          />
          <Button>Availability</Button>
        </div>
      </div>
    </div>
  );
};

export default RoomReservationForm;
