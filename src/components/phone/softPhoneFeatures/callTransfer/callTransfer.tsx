import React from "react";
import "./callTransfer.scss";
import CallTransforDetails from "../callTransforDetails/callTransforDetails";
const CallTransfer = () => {
  return (
    <div>
      <div className="row">
        <div className="col-lg-8">
          <div className="callTransfer-main-wrapper">
            <div className="d-flex align-items-start ">
              <div
                className="nav flex-column nav-pills  calltransfer-vertical-tabs"
                id="v-pills-tab"
                role="tablist"
                aria-orientation="vertical"
              >
                <button
                  className="nav-link active"
                  id="v-pills-all-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#v-pills-all"
                  type="button"
                  role="tab"
                  aria-controls="v-pills-all"
                  aria-selected="true"
                >
                  All
                </button>
                <button
                  className="nav-link"
                  id="v-pills-contact-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#v-pills-contact"
                  type="button"
                  role="tab"
                  aria-controls="v-pills-contact"
                  aria-selected="false"
                >
                  Contact Center
                </button>
                <button
                  className="nav-link"
                  id="v-pills-ivr-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#v-pills-ivr"
                  type="button"
                  role="tab"
                  aria-controls="v-pills-ivr"
                  aria-selected="false"
                >
                  IVR
                </button>
                <button
                  className="nav-link"
                  id="v-pills-agent-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#v-pills-agent"
                  type="button"
                  role="tab"
                  aria-controls="v-pills-agent"
                  aria-selected="false"
                >
                  Agents
                </button>
                <button
                  className="nav-link"
                  id="v-pills-queue-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#v-pills-queue"
                  type="button"
                  role="tab"
                  aria-controls="v-pills-queue"
                  aria-selected="false"
                >
                  Queue
                </button>
                <button
                  className="nav-link"
                  id="v-pills-company-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#v-pills-company"
                  type="button"
                  role="tab"
                  aria-controls="v-pills-comapany"
                  aria-selected="false"
                >
                  Company
                </button>
              </div>
              <div
                className="tab-content callTransfer-tabcontent-section"
                id="v-pills-tabContent"
              >
                <div className="inputheader">
                  <input
                    type="text"
                    className="form-control callTranfer-search-destinations"
                    placeholder="Search for destinations or enter new phone number"
                  />
                </div>
                <div className="calltranfer-minisub-section">
                  <div
                    className="tab-pane fade show active"
                    id="v-pills-all"
                    role="tabpanel"
                    aria-labelledby="v-pills-all-tab"
                  >
                    <CallTransforDetails />
                  </div>
                  <div
                    className="tab-pane fade"
                    id="v-pills-contact"
                    role="tabpanel"
                    aria-labelledby="v-pills-contact-tab"
                  >
                    welcome to contact
                  </div>
                  <div
                    className="tab-pane fade"
                    id="v-pills-ivr"
                    role="tabpanel"
                    aria-labelledby="v-pills-ivr-tab"
                  >
                    welcome to ivr
                  </div>
                  <div
                    className="tab-pane fade"
                    id="v-pills-agent"
                    role="tabpanel"
                    aria-labelledby="v-pills-agent-tab"
                  >
                    welcome to agent
                  </div>
                  <div
                    className="tab-pane fade"
                    id="v-pills-queue"
                    role="tabpanel"
                    aria-labelledby="v-pills-queue-tab"
                  >
                    welcome to queue
                  </div>
                  <div
                    className="tab-pane fade"
                    id="v-pills-company"
                    role="tabpanel"
                    aria-labelledby="v-pills-company-tab"
                  >
                    welcome to company agent
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="callerid-main-section">
            <div>
              <label htmlFor="callerIds" className="form-label callerids-label">
                Caller Id
              </label>
              <select
                className="form-select caller-ids-dropdown"
                id="callerIds"
                name="sellist1"
              >
                <option>My Defaultid</option>
                <option>zenius</option>
                <option>zenius-test-2</option>
                <option>zenius-1</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallTransfer;
