import React, { useEffect } from "react";
import "./emailCustomePopUp.scss";
import { useSelector } from "react-redux";
interface IProps {
  isSendEmailSuccess: boolean;
  isSendEmailError: boolean;
  isSendEmailProcess: boolean;
  // sendPostEmail: (forceSend?: boolean) => void;
  sendAnyWay: (forceSend?: boolean) => void;
  showSendConfirmation: boolean;
  successEmailPopUp: () => void;
  Closepopup: () => void;
  CloseEmailpopup: () => void;
  ClosingEmailPopUp: () => void;
}
const EmailCustomePopup = (props: IProps) => {
  const isSendEmailProcess: any = useSelector(
    (state: any) => state.emailFetch.isSendEmailProcess
  );

  const isTonotavailable: any = useSelector(
    (state: any) => state.emailFetch.isTonotavailable
  );
  useEffect(() => {
    console.log(
      "isSendEmailProcess in custompop component",
      isSendEmailProcess
    );
  }, [isSendEmailProcess]);

  useEffect(() => {
    console.log("isTonotavailable in custompop component", isTonotavailable);
  }, [isTonotavailable]);

  return (
    <>
      <div className="modal" id="myEmailCustomModal">
        <div className="modal-dialog modal-lg modal-dialog-centered email-custom-modal">
          <div className="modal-content email-custome-content">
            {/* <div className="modal-header">
              <h4 className="modal-title">Modal Heading</h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div> */}
            <div className="modal-body main-body-section">
              <div className="">
                {props.isSendEmailSuccess && (
                  <>
                    <div>
                      {/* <i className="fa-regular fa-circle-check fa-check-mail-modal"></i> */}
                      <i className="fa-solid fa-circle-check fa-check-mail-modal"></i>
                    </div>
                  </>
                )}
                {isSendEmailProcess && (
                  <div className="spinner-icon-section">
                    <div className="loader-spinner"></div>
                  </div>
                )}
                {props.isSendEmailError && (
                  <div>
                    {/* <i className="fa-regular fa-circle-check fa-check-mail-modal"></i> */}
                    <i className="fa-regular fa-circle-xmark modal-circle-mark"></i>
                  </div>
                )}
                {props.isSendEmailSuccess && (
                  <>
                    <div className="text-of-mail-modal-success">
                      <h4 className="success-message-heading">Success</h4>
                      <span className="success-text-message">
                        Your email has been successfully sent.
                      </span>
                    </div>
                  </>
                )}
                {isSendEmailProcess && (
                  <div className="text-of-mail-modal">
                    <span className="hold-text-message">
                      Please hold on, we are in the process of sending your
                      email.
                    </span>
                  </div>
                )}
                {props.isSendEmailError && (
                  <div className="text-of-mail-modal-success">
                    <h4 className="error-message-heading">Sorry (:</h4>
                    <span className="success-text-message">
                      Something went wrong please try again
                    </span>
                  </div>
                )}

                {props.isSendEmailSuccess && (
                  <div>
                    <button
                      type="button"
                      className="ok-success-btn"
                      data-bs-dismiss="modal"
                      onClick={() => props.successEmailPopUp()}
                    >
                      OK
                    </button>
                  </div>
                )}

                {isTonotavailable && (
                  <div className="text-of-mail-modal">
                    <span className="hold-text-message">
                      <h4 className="warning-message-heading">Warning</h4>
                      We need to know who to send this to. Make sure you enter
                      at least one name.
                    </span>
                    <div>
                      <button
                        type="button"
                        className="ok-success-btn"
                        data-bs-dismiss="modal"
                        onClick={() => props.Closepopup()}
                      >
                        OK
                      </button>
                    </div>
                  </div>
                )}
                {props.isSendEmailError && (
                  <div>
                    <button
                      type="button"
                      className="try-again-btn"
                      data-bs-dismiss="modal"
                      onClick={() => props.ClosingEmailPopUp()}
                      // onClick={() => props.ClosingEmailPopUp()}
                    >
                      TRY AGAIN
                    </button>
                  </div>
                )}

                {props.showSendConfirmation && (
                  <div className="text-of-mail-modal-success">
                    <h4 className="warning-message-heading">Warning</h4>
                    <span className="success-text-message">
                      Do you want to send this message without a subject?
                    </span>
                    <button
                      type="button"
                      className="delete-email-Dontsend "
                      data-bs-dismiss="modal"
                      onClick={() => props.CloseEmailpopup()}
                    >
                      <span>Don't Send</span>
                    </button>
                    <button
                      type="button"
                      className="send-email-button"
                      onClick={() => props.sendAnyWay(true)}
                    >
                      <span>Send Anyway</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div> */}
        </div>
      </div>
    </>
  );
};

export default EmailCustomePopup;
