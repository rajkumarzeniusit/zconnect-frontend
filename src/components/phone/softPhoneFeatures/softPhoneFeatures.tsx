import React, { useEffect } from "react";
import "./softPhoneFeatures.scss";
import "../../../scss/_custome.scss";
import CallDetails from "./callDetails/callDetails";
import CallTransfer from "./callTransfer/callTransfer";
import DialPad from "./dialPad/dialPad";
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
interface Iprops {
  isDialPadOpen?: ReactNode;
  // isTransferCall?: ReactNode;
  setIsDialPadOPen?: any;
  setIsOutBoundCall?: any;
  setIsIncommingCall?: any;
  outBoundcall?: any;
  exstensionPhoneNumber?: any;
}
const SoftPhoneFeatures = (props: Iprops) => {
  const location = useLocation();
  const useroutBoundCall = useSelector((state: any) => state.outBoundDialCall);
  useEffect(() => {
    if (useroutBoundCall.isOutBoundCall === true) {
      //props.setIsDialPadOPen(true);
    }
  }, [location]);

  const isTransferCall = useSelector(
    (state: any) => state.softPhoneUserAgent.isTransferCall
  );

  const isDialPadOpen = useSelector(
    (state: any) => state.softPhoneUserAgent.isDialPadOpen
  );
  console.log("isSoftPhoneFeatures", isTransferCall);
  console.log("isSoftPhoneFeatures isDialPadOpen", isDialPadOpen);
  console.log(
    "isTransferCallDialplan in softphone features ::",
    isTransferCall
  );
  return (
    <div className="main-body-wrapper-section">
      <div className="sub-wrapper-section">
        <div className="main-features-wrapper">
          <div>
            <ul className="nav nav-pills" role="tablist">
              <li className="nav-item">
                <a
                  className={
                    isDialPadOpen || isTransferCall
                      ? "nav-link "
                      : "nav-link active"
                  }
                  data-bs-toggle="pill"
                  href="#callDetails"
                >
                  Call details
                </a>
              </li>

              {/* <li className="nav-item">
                <a className="nav-link" data-bs-toggle="pill" href="#menu1">
                  Classfication
                </a>
              </li> */}
              {isTransferCall && (
                <li className="nav-item">
                  <a
                    className={isTransferCall ? "nav-link active" : "nav-link"}
                    data-bs-toggle="pill"
                    href="#callTransfer"
                  >
                    Transfer to
                  </a>
                </li>
              )}

              {isDialPadOpen && (
                <li className="nav-item">
                  <a
                    className={`${
                      isDialPadOpen
                        ? isTransferCall
                          ? "nav-link"
                          : "nav-link active"
                        : "nav-link"
                    }`}
                    data-bs-toggle="pill"
                    href="#dialpad"
                  >
                    Dial pad
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="features-content">
          <div className="tab-content">
            <div
              id="callDetails"
              className={
                isDialPadOpen || isTransferCall
                  ? "container-fluid  tab-pane fade"
                  : "container-fluid  tab-pane active"
              }
            >
              <CallDetails
                exstensionPhoneNumber={props.exstensionPhoneNumber}
              />
            </div>
            <div id="menu1" className="container tab-pane fade">
              <h3>Menu 1</h3>
              <p>
                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
            <div
              id="callTransfer"
              className={`${
                isTransferCall
                  ? isDialPadOpen
                    ? "container-fluid  tab-pane  active"
                    : "container-fluid  tab-pane active"
                  : "container-fluid  tab-pane fade"
              }`}
            >
              <CallTransfer></CallTransfer>
            </div>
            <div
              id="dialpad"
              className={`${
                isDialPadOpen
                  ? isTransferCall
                    ? "container-fluid  tab-pane fade"
                    : "container-fluid  tab-pane active"
                  : "container-fluid  tab-pane fade"
              }`}
            >
              <DialPad
                setIsOutBoundCall={props.setIsOutBoundCall}
                setIsIncommingCall={props.setIsIncommingCall}
                // outBoundcall={props.outBoundcall}
              ></DialPad>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SoftPhoneFeatures;
