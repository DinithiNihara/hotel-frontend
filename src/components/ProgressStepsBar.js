import React from "react";
import { FaCheckCircle } from "react-icons/fa";
const ProgressStepsBar = () => {
  return (
    <div className="max-w-xl mx-auto my-2 pb-2">
      <div className="flex pb-3">
        <div className="flex-1"></div>

        <div className="flex-1">
          <div className="w-6 h-6 bg-green mx-auto rounded-full text-lg text-white flex items-center">
            <span className="text-yellow-600 text-center w-full">
              <FaCheckCircle size={"sm"} />
            </span>
          </div>
        </div>

        <div className="w-1/6 align-center items-center align-middle content-center flex">
          <div className="w-full bg-grey-light rounded items-center align-middle align-center flex-1">
            <div className="bg-yellow-600 text-xs leading-none py-0.5 text-center text-grey-darkest rounded w-full"></div>
          </div>
        </div>

        <div className="flex-1">
          <div className="w-6 h-6 bg-green mx-auto rounded-full text-lg text-white flex items-center">
            <span className="text-yellow-600 text-center w-full">
              <FaCheckCircle size={"sm"} />
            </span>
          </div>
        </div>

        <div className="w-1/6 align-center items-center align-middle content-center flex">
          <div className="w-full bg-grey-light rounded items-center align-middle align-center flex-1">
            <div className="bg-yellow-600 text-xs leading-none py-0.5 text-center text-grey-darkest rounded w-1/5"></div>
          </div>
        </div>

        <div className="flex-1">
          <div className="w-6 h-6 bg-white border-2 border-grey-light mx-auto rounded-full text-lg text-white flex items-center">
            <span className="text-grey-darker text-center w-full">3</span>
          </div>
        </div>

        <div className="w-1/6 align-center items-center align-middle content-center flex">
          <div className="w-full bg-grey-light rounded items-center align-middle align-center flex-1">
            <div className="bg-yellow-600 text-xs leading-none py-0.5 text-center text-grey-darkest rounded w-0"></div>
          </div>
        </div>

        <div className="flex-1">
          <div className="w-6 h-6 bg-white border-2 border-grey-light mx-auto rounded-full text-lg text-white flex items-center">
            <span className="text-grey-darker text-center w-full">4</span>
          </div>
        </div>

        <div className="flex-1"></div>
      </div>

      <div className="flex text-xs content-center text-center">
        <div className="w-1/4">Invitation received</div>

        <div className="w-1/4">Personal details</div>

        <div className="w-1/4">Application details</div>

        <div className="w-1/4">Confirmation</div>
      </div>
    </div>
  );
};

export default ProgressStepsBar;
