import { connectRouter } from "connected-react-router";
import { combineReducers } from "redux";
import { reducer as oidcReducer } from "redux-oidc";
import { Action, History } from "history";

// Voice Reducer

interface InitialState {
  isIncomingCall: boolean;
}

const initialState: InitialState = {
  isIncomingCall: false,
};
const softPhoneIntialState = {
  userAgents: {},
  isSoftPhoneFeatures: false,
  isTransferCall: false,
  isDialPadOpen: false,
};

const userAgentObject = (state = softPhoneIntialState, action: any) => {
  switch (action.type) {
    case "USER REGISTERED":
      state = action.userAgent;
      return state;
    case "USER UNREGISTERED":
      state = action.userAgent;
      return state;
    case "IS-INCOMING-ANSWER":
      const initialState = { ...state };
      initialState.isSoftPhoneFeatures = action.isSoftPhoneFeatures;
      return initialState;
    case "IS-TRANSFER-CALL":
      const initialTransferState = { ...state };
      initialTransferState.isTransferCall = action.isTransferCall;
      initialTransferState.isDialPadOpen = action.isDialPadOpen;
      console.log(
        "Transfer call in reducer state change ::",
        initialTransferState.isTransferCall
      );
      return initialTransferState;
    case "TRANSFER CALL IN DIALPLAN":
      const initialStates = { ...state };
      initialStates.isTransferCall = action.istransforCall;
      console.log(
        "Transfer call in dialplan state ::",
        initialStates.isTransferCall
      );
      return initialStates;
    case "IS-DIALPAD-OPEN":
      const initialDialpadState = { ...state };
      initialDialpadState.isDialPadOpen = action.isDialPadOpen;
      return initialDialpadState;
    default:
      return state;
  }
};
const transforInitial = {
  istransforCall: false,
  transfornumber: "",
};
const transforCall = (state = transforInitial, action: any) => {
  switch (action.type) {
    case "TRANSFER CALL":
      const initialState = { ...state };
      initialState.istransforCall = action.istransfor;
      initialState.transfornumber = action.tarnsforNUmber;
      return initialState;

    default:
      return state;
  }
};
const isOutBoundstate = {
  isOutBoundCall: false,
  outBoundDialNumber: "",
};
const outBoundCall = (state = isOutBoundstate, action: any) => {
  switch (action.type) {
    case "OUT-BOUND-DIAL-CALL":
      const initialState = { ...state };
      initialState.isOutBoundCall = action.isOutBoundCall;
      initialState.outBoundDialNumber = action.outBoundDialNumber;
      return initialState;
    default:
      return state;
  }
};

const incomingCallReducer = (
  state = initialState,
  action: { type: string; isIncomingCall: boolean }
) => {
  switch (action.type) {
    case "INCOMING_CALL":
      return { ...state, isIncomingCall: action.isIncomingCall };
    default:
      return state;
  }
};

// Email Reducer

const emailfetch = {
  emailData: {},
  iSIncomingEmailSameModule: false,
  isSendEmailProcess: false,
  isReplyallEmail: false,
  isIncomingEmail: false,
  agstate:false,
  // isNewEmailIncoming:false,
  iSIncomingEmailAnswer: false,
  isTonotavailable: false,
  readonly: true,
  maxcount:0,
};
const fetchingEmailData = (state = emailfetch, action: any) => {
  switch (action.type) {
    case "MAX-Count":
      console.log("log in MAX-Count")
      const initialSta = { ...state };
      initialSta.maxcount = action.maxcount;
      console.log("max-count in reducer",initialSta )
      return initialSta;
    case "EMAIL_DATA":
      console.log("log in EMAIL_DATA")
      const initialStat = { ...state };
      initialStat.emailData = action.emaildata;
      initialStat.isIncomingEmail = action.isIncomingEmail;
      initialStat.iSIncomingEmailSameModule =
        action.iSIncomingEmailSameModule;
      console.log("EMAIL_DATA in reducer",initialStat )
      return initialStat;

    case "CLEAR_EMAIL_DATA":
      console.log("log in CLEAR_EMAIL_DATA")
      console.log("reducer in reducer")
      return {
        emailData: [] // Set emailData to empty
      };
    case "INCOMING-EMAIL":
      console.log("log in INCOMING-EMAIL")
      const initialState = { ...state };
      initialState.emailData = action.emaildata;
      initialState.isIncomingEmail = action.isIncomingEmail;
      initialState.agstate = action.agstate;
      // initialState.isNewEmailIncoming = action.isNewEmailIncoming;
      // initialState.iSIncomingEmailSameModule = action.iSIncomingEmailSameModule
      console.log(
        "Inside reducer isIncomingEmail state ::",
        initialState.isIncomingEmail
      );
      console.log("email data in reducers", initialState);
      return initialState;

    case "REPLYALLEMAIL":
      console.log("log in REPLYALLEMAIL")
      const initial = { ...state };
      initial.isReplyallEmail = action.isReplyallEmail;
      // initialState.iSIncomingEmailSameModule = action.iSIncomingEmailSameModule
      console.log("REPLYALLEMAIL data in reducers ", initial.isReplyallEmail);
      console.log(initial)
      return initial;

    case "READONLY":
      console.log("log in READONLY")
      const intial = { ...state };
      intial.readonly = action.readonly;
      console.log("REPLY EMAIL reducer READONLY", intial.readonly);
      return intial;

    case "TONOTAVAILABLE":
      console.log("log in TONOTAVAILABLE")
      const initialStateS = { ...state };
      initialStateS.isTonotavailable = action.isTonotavailable;
      initialStateS.isSendEmailProcess = action.isSendEmailProcess;
      // initialState.iSIncomingEmailSameModule = action.iSIncomingEmailSameModule
      console.log(
        "initialStateS.isSendEmailProcess ",
        initialStateS.isSendEmailProcess
      );
      console.log(
        "isTonotavailable in reducer",
        initialStateS.isTonotavailable
      );
      return initialStateS;
    case "EMAILPROCESS":
      console.log("log in EMAILPROCESS")
      const initialStates = { ...state };
      initialStates.isSendEmailProcess = action.isSendEmailProcess;
      initialStates.isTonotavailable = action.isTonotavailable;
      // initialState.iSIncomingEmailSameModule = action.iSIncomingEmailSameModule
      console.log(
        "isSendEmailProcess in reducer ::",
        initialStates
      );
      return initialStates;

    case "INCOMING-EMAIL-MODULE":
      console.log("log in INCOMING-EMAIL-MODULE")
      const initialStateModule = { ...state };
      initialStateModule.iSIncomingEmailSameModule =
        action.iSIncomingEmailSameModule;
      console.log(
        "email data in reducers with in the same modules",
        initialStateModule
      );
      return initialStateModule;
    case "ANSWER-INCOMING-EMAIL":
      console.log("log in ANSWER-INCOMING-EMAIL")
      const initialAnswerState = { ...state };
      initialAnswerState.iSIncomingEmailAnswer = action.iSIncomingEmailAnswer;
      console.log(
        "email data in reducers with in the same modules",
        initialAnswerState
      );
      return initialAnswerState;
    case "CLOSE-THE-SAME-MODULE-VALUES":
      console.log("log in CLOSE-THE-SAME-MODULE-VALUES")
      const initialcloseState = { ...state };
      initialcloseState.iSIncomingEmailSameModule = false;
      initialcloseState.iSIncomingEmailAnswer = false;
      console.log(
        "email data in reducers with in the same modules",
        initialcloseState
      );
      return initialcloseState;
    default:
      return state;
  }
};

//  Chat Reducer

const messageFetch = {
  connected_messages: "",
  first_message: "",
  EmptyFirstMessage: "",
  EmptySecondMessage: "",
  isSecondMessageChecking: false,
  message_data: "",
  isAcceptedMessage: false,
  secondMessageAct: false,
  isAcceptData: {},
  isSecondMessage: false,
  userInputsData: "",
  rejectMessage: false,
  change_agent_state: "",
  maxmsgcount:0,
};

const fetchingMessageData = (state = messageFetch, action: any) => {
  switch (action.type) {
    case "MAX-Msg-Count":
      console.log("log in MAX-Msg-Count");
      const instialmsgstate={...state};
      instialmsgstate.maxmsgcount=action.maxmsgcount
      return instialmsgstate;
    case "CLEAR-FIRST-MESSAGE":
      const clearfirstmessage = { ...state };
      clearfirstmessage.first_message = action.EmptyFirstMessage;

      console.log("CLEAR-FIRST-MESSAGE", clearfirstmessage.first_message);
      return clearfirstmessage;

    case "CLEAR-SECOND-MESSAGE":
      const clearsecondmessage = { ...state };
      clearsecondmessage.connected_messages = action.EmptySecondMessage;

      console.log(
        "CLEAR-SECOND-MESSAGE",
        clearsecondmessage.connected_messages
      );
      return clearsecondmessage;

    case "IS-SECOND-MESSAGE-CHECKING":
      const checksecondmessage = { ...state };
      checksecondmessage.isSecondMessageChecking = action.isSecondMessage;

      console.log(
        "IS-SECOND-MESSAGE-CHECKING",
        checksecondmessage.isSecondMessageChecking
      );
      return checksecondmessage;

    case "IS-NOT-MESSAGE-CHECKING":
      const notsecondmessage = { ...state };
      notsecondmessage.isSecondMessageChecking = action.isSecondMessage;

      console.log(
        "IS-NOT-MESSAGE-CHECKING",
        notsecondmessage.isSecondMessageChecking
      );
      return notsecondmessage;

    case "CONNECTED_MESSAGES":
      const connectedmessages = { ...state };
      connectedmessages.connected_messages = action.connected_messages;
      if (connectedmessages.connected_messages) {
        console.log(
          "connectedmessages in reducer",
          connectedmessages.connected_messages
        );
      }

      return connectedmessages;

    case "ANSWERED-INCOMING-MESSAGES":
      const answeredIncomingMessage = { ...state };
      answeredIncomingMessage.first_message = action.first_message;

      console.log(
        "answeredIncomingMessage",
        answeredIncomingMessage.first_message
      );
      return answeredIncomingMessage;

    case "CHANGE_AGENT_STATE":
      const agentchangeState = { ...state };
      agentchangeState.change_agent_state = action.change_agent_state;

      console.log("after CHANGINING-agent state", agentchangeState);
      return agentchangeState;

    case "NEW-INCOMING-MESSAGE":
      const initialState = { ...state };
      initialState.message_data = action.data;
      initialState.isSecondMessage = action.isSecondMessage;
      console.log("messages data in reducers", initialState);
      return initialState;
    case "ANSWERED-INCOMING-MESSAGE":
      const originalState = { ...state };
      originalState.isAcceptedMessage = action.isAccepted;
      originalState.isAcceptData = action.isAcceptData;
      originalState.secondMessageAct = action.secondMessageAct;
      originalState.rejectMessage = action.isRejectmessage;
      console.log("after answered the new messages", originalState);
      return originalState;
    case "STORED-NEW-INCOMING-MESSAGE":
      // Check if action contains the expected properties
      if (
        typeof action.tempSecondMessage === "undefined" ||
        typeof action.tempAcceptedMessage === "undefined"
      ) {
        console.error(
          "Action payload missing required properties: AcceptedMessage, SecondMessage"
        );
        return state; // Return the current state if properties are missing
      }

      const inStateS = { ...state };
      // inStateS.isSecondMessage = action.tempSecondMessage;
      inStateS.secondMessageAct = action.tempSecondMessage;
      inStateS.isAcceptedMessage = action.tempAcceptedMessage;
      inStateS.message_data = "";
      inStateS.isAcceptData = {};
      console.log(
        "after answered the new messages and stored in the data bases",
        inStateS
      );
      return inStateS;
    case "CHANGINING-COMPONENT":
      const changeState = { ...state };
      changeState.message_data = action.data;

      console.log("after CHANGINING-COMPONENT", changeState);
      return changeState;
    case "CLEAR-INCOMING-MESSAGE":
      const chanState = { ...state };
      chanState.message_data = action.tempData;

      console.log("after CLEAR-INCOMING-MESSAGE", chanState);
      return chanState;

    case "REJECT-INCOMING-MESSAGE":
      const rejectState = { ...state };
      rejectState.message_data = action.message_data;
      rejectState.rejectMessage = action.isRejectmessage;
      console.log("after rejected the new messages", rejectState);
      return rejectState;

    default:
      return state;
  }
};

const reducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    oidc: oidcReducer,
    softPhoneUserAgent: userAgentObject,
    transforCall: transforCall,
    outBoundDialCall: outBoundCall,
    emailFetch: fetchingEmailData,
    messageFetch: fetchingMessageData,
    incomingCall: incomingCallReducer,
    // chatSampleReducer:chatReducer
  });

export default reducer;
