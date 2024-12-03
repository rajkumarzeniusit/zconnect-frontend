import React from "react";
import "./callDetails.scss";
interface Iprops {
  exstensionPhoneNumber?: any;
}
const CallDetails = (props: Iprops) => {
  return (
    <div>
      <div className="callDetails-main-wrapper">
        <div className="d-flex">
          <div className="calldetails-name-section">
            <span>{props.exstensionPhoneNumber?.slice(0, 1)}</span>
          </div>
          <div className="calldetails-fullname-section">
            {props.exstensionPhoneNumber}
            {/* <span>Zenius</span>
            <br />
            <span>Test</span> */}
          </div>
        </div>
        <div className="d-flex">
          <div className="callsection-icon">
            <i className="fa-solid fa-phone"></i>
          </div>
          <div className="callDeatils-section">
            <span className="callsection-text">Phone</span>
            <br />
            <span className="callsection-value">
              {props.exstensionPhoneNumber}
            </span>
          </div>
        </div>
        <div className="d-flex">
          <div className="callsection-icon">
            <i className="fa-solid fa-envelope"></i>
          </div>
          <div className="callDeatils-section">
            <span className="callsection-text">Email</span>
            <br />
            {/* <span className="callsection-value">9182302894</span> */}
          </div>
        </div>
        <hr></hr>

        <div className="calldetails-subsection">
          <div className="d-flex">
            <div className="calldetails-bull"></div>
            <div className="callDeatils-section">
              <span className="callsection-text">Campaign</span>
              <br />
              <span className="callsection-value">Buy 1 Get 1 free</span>
            </div>
          </div>
          <div className="d-flex">
            <div className="calldetails-bull"></div>
            <div className="callDeatils-section">
              <span className="callsection-text">Account</span>
              <br />
              <span className="callsection-value">Saving</span>
            </div>
          </div>
          <div className="d-flex">
            <div className="calldetails-bull"></div>
            <div className="callDeatils-section">
              <span className="callsection-text">Company Type</span>
              <br />
              <span className="callsection-value">Pvt Ltd</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallDetails;
