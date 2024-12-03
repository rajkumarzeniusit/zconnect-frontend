import React, { useState } from "react";
import "./dialPad.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
interface Iprops {
  setIsOutBoundCall?: any;
  setIsIncommingCall?: any;
  // outBoundcall?: any;
}
const DialPad = (props: Iprops) => {
  const dispatch = useDispatch();
  const number = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];
  const [dialPhoneNumber, setDialPhoneNumber] = useState<any>("");
  const [dialNumbers, setDialNumbers] = useState<Array<string>>(number);
  const navigate = useNavigate();
  const appendToPhoneNumber = (number: string) => {
    const tempNum: any = dialPhoneNumber + number;
    setDialPhoneNumber(tempNum);
  };
  const deleteLastDigit = () => {
    const tempNum = dialPhoneNumber.slice(0, -1);
    setDialPhoneNumber(tempNum);
  };
  const outBoundCall = () => {
    dispatch({
      type: "OUT-BOUND-DIAL-CALL",
      isOutBoundCall: true,
      outBoundDialNumber: dialPhoneNumber,
    });
    // props.setIsOutBoundCall(true);
    // props.setIsIncommingCall(true);
    // props.outBoundcall(dialPhoneNumber);
    // // setDialPhoneNumber("");
    // navigate("/softPhone", {
    //   state: {
    //     isDailkeypad: false,
    //   },
    // });
    // console.log("setIsOutBoundCall");
  };
  const clearPhoneNumber = () => {
    setDialPhoneNumber("");
  };
  return (
    <div>
      <div className="dial-pad-section">
        <div className="dial-pad">
          <div className="display-phone">
            <span>{dialPhoneNumber || ""}</span>
            {dialPhoneNumber.length > 0 && (
              <span
                className="clear-phonenumber"
                onClick={() => clearPhoneNumber()}
              >
                <i className="fa-solid fa-xmark"></i>
              </span>
            )}
          </div>

          <div className="dial-pad-caller-section">
            <div className="dial-pad-wrapper">
              <div className="dial-pad-buttons">
                {dialNumbers.map((number, index) => (
                  <button
                    key={index}
                    className="number"
                    onClick={() => appendToPhoneNumber(number)}
                  >
                    {number}
                  </button>
                ))}
                {/* <button
              v-for="number in numbers"
              :key="number"
              @click="appendToPhoneNumber(number)"
              class="number"
              :class="{ 'star-font-size': number === '*' }"
            >
              {{ number }}
            </button> */}
              </div>
            </div>
            <div className="call-clear-section">
              <div className="dial-pad-call" onClick={() => outBoundCall()}>
                <i className="fa-solid fa-phone"></i>
              </div>
              <div className="dial-pad-clear" onClick={() => deleteLastDigit()}>
                <i className="fa-regular fa-circle-xmark"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DialPad;

// function dispatch(arg0: {
//   type: string;
//   isOutBoundCall: boolean;
//   outBoundDialNumber: any;
// }) {
//   throw new Error("Function not implemented.");
// }
// function dispatch(arg0: {
//   type: string;
//   isOutBoundCall: boolean;
//   outBoundDialNumber: any;
// }) {
//   throw new Error("Function not implemented.");
// }
