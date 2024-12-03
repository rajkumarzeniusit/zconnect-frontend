import react, { useState } from "react";
import "./callTransforDetails.scss";
import { Extension } from "typescript";
import { useDispatch } from "react-redux";
const CallTransforDetails = () => {
  const dispatch = useDispatch();
  const dummy = [
    {
      firstName: "Jayasurya",
      lastName: "V S",
      type: "agent",
      status: "Available",
      phoneNumber: "9999999999",
      extension: "1041",
    },
    {
      firstName: "zenius",
      lastName: "test",
      type: "company",
      status: "Available",
    },
    {
      firstName: "Raj",
      lastName: "Kumar",
      type: "agent",
      status: "Available",
      phoneNumber: "8888888888",
      extension: "1043",
    },
    {
      firstName: "zenius",
      lastName: "test",
      type: "company",
      status: "Available",
    },
    // {
    //   firstName: "gopi",
    //   lastName: "mukka",
    //   type: "agent",
    //   status: "away",
    // },
    // {
    //   firstName: "Enqueue",
    //   lastName: "",
    //   type: "queue",
    //   status: "away",
    // },
    // {
    //   firstName: "Queue-1",
    //   lastName: "",
    //   type: "queue",
    //   status: "ready",
    // },
    {
      firstName: "queue-1",
      lastName: "test",
      type: "queue",
      status: "On Break",
    },
  ];
  const [tempData, setTempData] = useState<any>(dummy);
  const [isTransforTable, setIsTransforTable] = useState<boolean>(true);
  const [tableTransferDetails, setTableTransferDetails] = useState<any>();
  const [isPhoneRadio, setIsPhoneRadio] = useState<boolean>(false);
  const [isExtensionRadio, setIsExtensionRadio] = useState<boolean>(false);
  const [isColdTransfer, setIsColdTransfer] = useState<boolean>(false);
  const [isWarmTransfer, setIsWarmTransfer] = useState<boolean>(false);
  const [transferPhoneNumber, setTransferPhoneNumber] = useState<any>();
  const callTransferTableStatus = (text: string) => {
    if (text === "Available") {
      return "active-status";
    } else if (text === "Available (On Demand)") {
      return "busy-status";
    } else if (text === "On Break") {
      return "away-status";
    }
  };
  const tableSelectTransfer = (tansferItem: any) => {
    setTableTransferDetails(tansferItem);
    setIsTransforTable(false);
  };
  const changeDestination = () => {
    setIsTransforTable(true);
  };
  const phoneRadioChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    text: string
  ) => {
    const tempValue = e.target.value;
    setTransferPhoneNumber(tempValue);
    if (text === "phoneNumber") {
      setIsPhoneRadio(true);
      setIsExtensionRadio(false);
    } else if (text === "extension") {
      setIsPhoneRadio(false);
      setIsExtensionRadio(true);
    } else if (text === "coldTransfer") {
      setIsWarmTransfer(false);
      setIsColdTransfer(true);
    } else if (text === "warmTransfer") {
      setIsWarmTransfer(true);
      setIsColdTransfer(false);
    }
  };
  const transferDetailsPhoneStatus = (status: string) => {
    if (status === "Available") {
      return "status-value-ready";
    } else if (status === "Available (On Demand)") {
      return "status-value-busy";
    } else if (status === "On Break") {
      return "status-value-away";
    }
  };
  const transferCallHangUp = () => {
    dispatch({
      type: "TRANSFER CALL",
      tarnsforNUmber: transferPhoneNumber,
      istransfor: true,
    });
    console.log("we transfer the call successfully", transferPhoneNumber);
  };
  return (
    <div>
      {/* {tempData.map((item: any, index: number) => (
        <div className="call-wrapper-session">
          <div className="callTrasfer-minisection-wrapper">
            <span>{item.firstName.slice(0, 1)}</span>
            <span>{item.lastName.slice(0, 1)}</span>
            <div className="callTransfer-sub-circle"></div>
          </div>
          <div className="circle-name-section">
            <span className="circle-sub-section-name">
              {item.firstName} {item.lastName}
            </span>
            <br />
            <span className="circle-sub-section-type">{item.type}</span>
          </div>
        </div>
      ))} */}
      {isTransforTable ? (
        <table className="table table-hover">
          <thead>
            <tr className="calltransfer-table-header">
              <th></th>

              <th>Firstname</th>
              <th>Lastname</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tempData.map((item: any, index: number) => (
              <tr
                className="calltransfer-table-body"
                onClick={() => tableSelectTransfer(item)}
                key={index}
              >
                <td>
                  <div className="callTansfer-table-circle">
                    <span>{item.firstName.slice(0, 1)}</span>
                    <span>{item.lastName.slice(0, 1)}</span>
                  </div>
                </td>
                <td>{item.firstName}</td>
                <td>{item.lastName}</td>
                <td>{item.type}</td>
                <td>
                  <span className={callTransferTableStatus(item.status)}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <>
          <div
            className="backto-transfer-table-wrapper"
            onClick={() => changeDestination()}
          >
            <i className="fas fa-angle-double-left"></i>&nbsp;&nbsp;
            <span>Change destinations</span>
          </div>
          <div className="call-wrapper-session">
            <div className="callTrasfer-minisection-wrapper">
              <span>{tableTransferDetails.firstName.slice(0, 1)}</span>
              <span>{tableTransferDetails.lastName.slice(0, 1)}</span>
              {/* <div className="callTransfer-sub-circle"></div> */}
            </div>
            <div className="circle-name-section">
              <span className="circle-sub-section-name">
                {tableTransferDetails.firstName} {tableTransferDetails.lastName}
              </span>
              <br />
              <span className="circle-sub-section-type">
                {tableTransferDetails.type}
              </span>
            </div>
            <div className="status-section">
              <span className="status-lable">Status</span>
              <br />
              <span
                className={transferDetailsPhoneStatus(
                  tableTransferDetails.status
                )}
              >
                {tableTransferDetails.status}
              </span>
            </div>
          </div>
          <div className="phoneNumber-section-wrapper">
            <div className="form-check">
              <input
                type="radio"
                className="form-check-input transfor-phone-radio"
                id="phoneradio"
                name="phoneradio"
                value={tableTransferDetails.phoneNumber}
                onChange={(e: any) => phoneRadioChange(e, "phoneNumber")}
                checked={isPhoneRadio}
              />

              <label
                className={
                  isPhoneRadio
                    ? "form-check-label transfor-phoneradio-label"
                    : "form-check-label transfor-phone-uncheked"
                }
                htmlFor="radio1"
              >
                {tableTransferDetails.phoneNumber}
              </label>
            </div>
            <div className="form-check extension-wrapper">
              <input
                type="radio"
                className="form-check-input transfor-phone-check"
                id="extensionradio"
                name="extensionradio"
                value={tableTransferDetails.extension}
                onChange={(e: any) => phoneRadioChange(e, "extension")}
                checked={isExtensionRadio}
              />

              <label
                className={
                  isExtensionRadio
                    ? "form-check-label transfor-phoneradio-label"
                    : "form-check-label transfor-phone-uncheked"
                }
                htmlFor="extension"
              >
                {tableTransferDetails.extension} extension
              </label>
            </div>
          </div>
          <div className="phoneNumber-section-wrapper">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="coldTransfer"
                name="coldTransfer"
                value="coldTransfer"
                onChange={(e: any) => phoneRadioChange(e, "coldTransfer")}
                checked={isColdTransfer}
              />
              <label
                className={
                  isColdTransfer
                    ? "form-check-label transfor-phoneradio-label"
                    : "form-check-label transfor-phone-uncheked"
                }
              >
                Cold Tranfer
              </label>
            </div>
            <div className="form-check extension-wrapper">
              <input
                className="form-check-input"
                type="checkbox"
                id="warmTransfer"
                name="warmTransfer"
                value="warmTransfer"
                onChange={(e: any) => phoneRadioChange(e, "warmTransfer")}
                checked={isWarmTransfer}
              />
              <label
                className={
                  isWarmTransfer
                    ? "form-check-label transfor-phoneradio-label"
                    : "form-check-label transfor-phone-uncheked"
                }
              >
                Warm Transfer
              </label>
            </div>
          </div>
          <div
            className="transfer-button-section"
            onClick={() => transferCallHangUp()}
          >
            <button
              className={
                isPhoneRadio || isExtensionRadio
                  ? "btn button-transfer"
                  : "btn button-transfer-disabled"
              }
              onClick={() => transferCallHangUp()}
            >
              {" "}
              Transfer and hang up
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CallTransforDetails;
