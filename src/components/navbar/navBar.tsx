import { log } from "console";
import react, { ChangeEvent, useEffect, useRef, useState } from "react";
import { agentStateDropDown } from "../commonUtils/agentCommon";
import { agentStateChangeDropDown } from "../../interface/mainavbar/agentStateChange";

import { useLocation, useNavigate } from "react-router-dom";
import "./incoming.scss";
import config from "../../config";
import "../../scss/_custome.scss";
import SocketService from "../../services/services";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import ApiConstants from "../../api-constants";
import appsettings from "../../serverConfig.json";

// Softphone imports
import { Registerer, UserAgentOptions } from "sip.js";
import { SessionDescriptionHandler } from "sip.js/lib/platform/web";
import {
  Invitation,
  Inviter,
  Session,
  SessionState,
  UserAgent,
  Web,
} from "sip.js";
import { useCallback } from "react";

let userAgent: UserAgent;
let inviter: Inviter;
let queueCall: any;
let context: AudioContext;
let isUserInteracted = false;
// let outgoingAudio: HTMLAudioElement;
// let incomingAudio: HTMLAudioElement;
// incomingAudio = new Audio("./audio/ringtone.mp3");
// incomingAudio.loop = true;


const NavBar = () => {
  const dispatch = useDispatch();
  const [agentState, setAgentState] = useState<string>("Logged Out");
  const [isAgentRegistered, setIsAgentRegistered] = useState<boolean>(false);
  const [agentFields, setAgnetFileds] = useState(agentStateDropDown);
  const [isAgentReady, setIsAgentReady] = useState<boolean>(false);
  const [navSearch, setNavSearch] = useState<any>();
  const [isNavDialPad, setNavDialPad] = useState<boolean>(false);
  const [isNavEmail, setNavEmail] = useState<boolean>(false);
  const [isIncomingEmail, setIsIncomingEmail] = useState<boolean>(false);
  const [isAnswerEmail, setIsAnswerEmail] = useState<boolean>(false);
  const [emailsData, setEmailsData] = useState<any>();
  const [pathName, setPathName] = useState<any>();
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const timerRef = useRef<number | null>(null);

  const [NewSubject, setNewSubject] = useState<any>("");
  const [isOnBreakHovered, setIsOnBreakHovered] = useState(false);

  // Chat states

  const [firstMessage, setFirstMessage] = useState<any>();
  const [isNewIncomingMsg, setIsNewIncomingMsg] = useState<boolean>(false);
  const [isAnswerMsg, setIsAnswerMsg] = useState<boolean>(false);
  const [messageData, setMessageData] = useState<any>();
  const [count, setCount] = useState<any>();
  const ws = useRef<WebSocket | null>(null);
  const [agent_id, setAgentID] = useState<any>();
  const currentDateTime = new Date();
  const formattedDateTime = currentDateTime.toLocaleString();
  const [agentFullData, setAgentFullData] = useState<any>();
  const [agentName, setAgentName] = useState<any>();

  // ////////////Softphone states /////////////////////

  const [initialRender, setInitialRender] = useState(true);
  const [isIncommingCall, setIsIncommingCall] = useState<boolean>(false);
  const [isCallAnswered, setIsCallAnswered] = useState<boolean>(false);
  const [isConferencecall, setIsConferenceCall] = useState<boolean>(false);
  const [exstensionPhoneNumber, setExstensionPhoneNumber] =
    useState<string>("");
  const [isMutePhone, setIsMutePhone] = useState<boolean>(false);
  const [isHoldPhone, setIsHoldPhone] = useState<boolean>(false);
  const [isDialPadOpen, setIsDialPadOPen] = useState<boolean>(false);
  const [isTransferCall, setIsTransferCall] = useState<boolean>(false);
  const [isoutBoundCall, setIsOutBoundCall] = useState<boolean>(false);
  const [isConferenceIcon, setIsConferenceIcon] = useState<boolean>(false);
  const [isOnCallText, setIsOnCallText] = useState<boolean>(false);
  const [incomingSession, setIncomingSession] = useState<Session | null>(null);
  const [outgoingSession, setOutgoingSession] = useState<Session | null>(null);
  const invitationRef = useRef<Invitation | null>(null);

  const outgoingSessionRef = useRef<Session | null>(null);
  const [usersAgents, setUserAgents] = useState<any>();
  const [queueName, setQueueName] = useState("");
  const [ringtone, setRingtone] = useState<HTMLAudioElement | null>(null);
  const [outgoingTone, setOutgoingTone] = useState<HTMLAudioElement | null>(
    null
  );

  const [localStream] = useState(new MediaStream());
  const [remoteStream] = useState(new MediaStream());
  const remoteMedia = useRef<HTMLAudioElement>(null);
  const localMedia = useRef<HTMLAudioElement>(null);

  const userTransferCall = useSelector((state: any) => state.transforCall);
  const userOutBoundCall = useSelector((state: any) => state.outBoundDialCall);
  const isIncomingEmails: any = useSelector(
    (state: any) => state.emailFetch.isIncomingEmail
  );
  const maxcount: any = useSelector(
    (state: any) => state.emailFetch.maxcount
  );
  const maxmsgcount:any=useSelector(
    (state:any)=> state.messageFetch.maxmsgcount
  );
  console.log("log for mxcount in nav",maxcount,maxmsgcount)
  console.log("staus for",isIncommingCall,isIncomingEmail,isNewIncomingMsg)
  // const agstate: any = useSelector(
  //   (state: any) => state.emailFetch.agstate
  // );
  // const isNewEmailIncomings: any = useSelector(
  //   (state: any) => state.emailFetch.isNewEmailIncoming
  // );
  // const [agstate,setagstate]=useState<boolean>(false);
  
  useEffect(()=>{
    console.log("isIncomingEmails state  in navbar ::", isIncomingEmails);
    // let changeValue="Available (On Demand)"
    // setAgentState(changeValue);
    // localStorage.setItem("agentState", changeValue);
 

  },[isIncomingEmail])
  
  // useEffect(()=>{
  //   if(isIncomingEmail===true||isNewIncomingMsg===true){
  //   console.log("agstate state  in navbar ::");
  //   let changeValue="Available (On Demand)"
  //   setAgentState(changeValue);
  //   localStorage.setItem("agentState", changeValue);
  //   }
  // },[isIncomingEmail,isNewIncomingMsg])

  useEffect(() => {
    let isRunning = true; // Control variable for the while loop
  
    const checkAgentState = async () => {
      while (isRunning) {
        if (isIncomingEmail === true || isNewIncomingMsg === true || isIncommingCall === true) {
          console.log("agstate state in navbar ::");
          let changeValue = "Available (On Demand)";
          setAgentState(changeValue);
          localStorage.setItem("agentState", changeValue);
        } else {
          isRunning = false; // Stop the loop when conditions are false
        }
        await new Promise(resolve => setTimeout(resolve, 1000)); // Delay of 1 second
      }
    };
  
    checkAgentState();
  
    return () => {
      isRunning = false; // Stop the loop on unmount
    };
  }, [isIncomingEmail, isNewIncomingMsg, isIncommingCall]);
  
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     if (isIncomingEmail === true || isNewIncomingMsg === true || isIncommingCall===true) {
  //       console.log("agstate state in navbar ::");
  //       let changeValue = "Available (On Demand)";
  //       setAgentState(changeValue);
  //       localStorage.setItem("agentState", changeValue);
  //     } else {
  //       clearInterval(intervalId); // Stop the interval when both conditions are false
  //     }
  //   }, 1000); // Check every second
  
  //   return () => clearInterval(intervalId); // Clear interval on unmount
  // }, [isIncomingEmail, isNewIncomingMsg,isIncommingCall]);
 
  
  useEffect(()=>{
    console.log("***********************************")
    if((maxcount+maxmsgcount)>=3 ){
    console.log("max count is",maxcount,maxmsgcount);
    let changeValue="Available (On Demand)"
    setAgentState(changeValue);
    localStorage.setItem("agentState", changeValue);
    // const apiURL = `http://localhost:8000/busy-command/${encodeURIComponent(fullusername)}`;///${encodeURIComponent(username)}
    // console.log("API URL for history:", apiURL);
    // const response = axios.get(apiURL);
    // console.log("response is",response)

  
    }
    else{
      console.log("max count is else",maxcount,maxmsgcount);
      let changeValue="Available"
      setAgentState(changeValue);
      localStorage.setItem("agentState", changeValue);
      // const apiURL = `http://localhost:8000/available-command/${encodeURIComponent(fullusername)}`;///${encodeURIComponent(username)}
      // console.log("API URL for history:", apiURL);
      // const response = axios.get(apiURL);
      // console.log("response is",response)
     
      
    }
  },[maxcount,maxmsgcount])

  useEffect(() => {
    // Define a function to check `isCallAnswered` and update state if true
    const checkCallStatus = () => {
      console.log("is call answered", isCallAnswered);
  
      if (isCallAnswered === true) {
        const changeValue = "Available (On Demand)";
        setAgentState(changeValue);
        localStorage.setItem("agentState", changeValue);
      }
    };
  
    // Set an interval to repeatedly check the call status
    const intervalId = setInterval(checkCallStatus, 1000); // checks every second, adjust as needed
  
    // Cleanup to clear the interval when component unmounts
    return () => clearInterval(intervalId);
  }, [isCallAnswered]);

  interface AgentData {
    agent_id: string;
    // queue: string;
    // skills: string;
    agentState: string;
    dateTime: string;
    //maxConcurrentInteraction: number;
  }

  const agentData: AgentData = {
    agent_id: agent_id,
    // queue: "Q1,Q2",
    // skills: "S1,S2",
    agentState: agentState,
    dateTime: formattedDateTime,
    //maxConcurrentInteraction: 3
  };
  //console.log("agentState in navbar ::", agentState);

  const location = useLocation();

  // useEffect(() => {

  //   console.log("agentFields label value in navbar ::", agentFields);

  // }, [agentFields]);
  const timeFormatter = (timeInSeconds: any) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  useEffect(() => {
    const maxLength = 28;
    let updatedSubject = emailsData?.subject || "";
 
    console.log(
      "New subject in useEffect before assignment ::",
      updatedSubject
    );
 
    if (updatedSubject.length > maxLength) {
      updatedSubject = updatedSubject.substring(0, maxLength) + "...";
    }
 
    setNewSubject(updatedSubject);
    console.log("New subject in useEffect after assignment ::", updatedSubject);
  }, [emailsData, isIncomingEmails]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!isRunning && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setTime(0); // Reset the time when stopping the timer
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);
  }, []);

  useEffect(() => {
    console.log("isOnBreakHovered state ::", isOnBreakHovered);
  }, [isOnBreakHovered]);

  useEffect(() => {
    setPathName(location.pathname);
  }, [location, pathName]);
  //   {
  //   sender: "Ashok Reddy <ashok.reddy@zeniusit.com>",
  //   recipient: '"itzenius@gmail.com" <itzenius@gmail.com>',
  //   to_email: "'itzenius@gmail.com'",
  //   cc_email: null,
  //   subject: "testing",
  //   date: "Fri, 14 Jun 2024 09:27:39 +0000",
  //   body: "SADFGHJKLFDGHJK\r\n\r\n\r\n\r\nThanks & Regards,\r\n\r\nASHOK REDDY YATHAM\r\n\r\n\r\n\r\n[http://localhost:8037/images/Outlook-mp32frqi.png]\r\n\r\nM: +919182302894\r\n\r\nashok.reddy<mailto:ashok.reddy@zeniusit.com>@zeniusit.com<mailto:ashok.reddy@zeniusit.com>\r\n\r\n www.zeniusit.com<http://www.zeniusit.com/>\r\n\r\n\r\n\r\n\r\n\r\n\r\n",
  //   attachments: [],
  // }
  const navigate = useNavigate();
  useEffect(() => {
    // Connect to the socket server
    SocketService.connect();

    // Listen for new email events
    SocketService.onNewEmail((data: any) => {
      // playTone(incomingAudio);
      setIsIncomingEmail(true)
      console.log("New email received:", data);
      dispatch({ type: "INCOMING-EMAIL", emaildata: data });
      setEmailsData(data);
      dispatch({
        type: "INCOMING-EMAIL",
        emaildata: data,
        isIncomingEmail: true,
        isNewEmailIncoming: true,
       
      });
     
      setIsIncomingEmail(true);
      // if(pathName === "/email"){
      //   dispatch({ type: "INCOMING-EMAIL", emaildata: data });
      //   setEmailsData(data);
      //   setIsIncomingEmail(true);
      // }
    });

    // Cleanup on component unmount
    // return () => {
    //   SocketService.disconnect();
    // };
  }, []);
  const extractEmail = (input: string): string | null => {
    const match = input?.match(/<([^>]+)>/);
    return match ? match[1] : null;
  };

  const email = extractEmail(emailsData?.sender);

  //////////////////////// Common Functions////////////////////////////////////////

  const agentStateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let changeValue = event.target.value;

    console.log("Inside agentStateChange", changeValue);

    // if (changeValue === "On Tea Break") {
    //   console.log("Inside change value to tea break", changeValue);
    //   changeValue = "On Break";
    //   console.log(
    //     "Inside change value after assigning to tea break",
    //     changeValue
    //   );
    //   // return changeValue;
    // }

    console.log("New changeValue :", changeValue);
    setAgentState(changeValue);
    localStorage.setItem("agentState", changeValue);
    console.log("State in Navbar ::", changeValue);

    //below lines for timer

    // setIsRunning(false); // Stop the timer
    // console.log("Setisrunning state ::", isRunning);
    setTime(0); // Reset the time
    setIsRunning(true); // Start the timer
    console.log("Setisrunning state ::", isRunning);

    if (
      changeValue === "Available" ||
      changeValue === "Available (On Demand)"
    ) {
      setTimeout(() => {
        //setIsAgentReady(true);
        navigate("/softPhone", {
          state: {
            isDailkeypad: false,
          },
        });
      }, 1000);
    } else {
      setIsAgentReady(false);
      navigate("/softPhone", {
        state: {},
      });
    }
  };

  const agentStateclassName = () => {
    if (agentState === "Available") {
      return "agentstate-circle-ready";
    } else if (
      agentState === "Logged Out" ||
      agentState === "Available (On Demand)" ||
      agentState === "On Break"
    ) {
      return "agentstate-circle-not-ready";
    } else if (agentState === "Available (On Demand)") {
      return "agentstate-circle-after-work";
    } else {
      return "agentstate-circle-not-ready";
    }
  };
  const phoneIconClassname = () => {
    if (agentState === "Available") {
      return "fa-solid fa-phone icon-ready";
    } else if (
      agentState === "Logged Out" ||
      agentState === "Available (On Demand)" ||
      agentState === "On Break"
    ) {
      return "fa-solid fa-phone icon-not-ready";
    } else if (agentState === "Available (On Demand)") {
      return "fa-solid fa-phone icon-after-work";
    } else {
      return "fa-solid fa-phone navbar-icon";
    }
  };
  const navDialEmailSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const changeValue: any = event.target.value;
    console.log("changeValue", changeValue);

    if (!isNaN(changeValue)) {
      setNavDialPad(true);
      console.log("entering if");
    }
    if (changeValue.includes(".com")) {
      setNavEmail(true);
    } else if (changeValue == null || changeValue == "") {
      setNavDialPad(false);
      setNavEmail(false);
      navigate("./");
    }

    setNavSearch(changeValue);
  };
  const naviGatePhone = () => {
    dispatch({
      type: "OUT-BOUND-DIAL-CALL",
      isOutBoundCall: true,
      outBoundDialNumber: navSearch,
    });
    navigate("/softPhone", {
      state: {
        isDailkeypad: true,
      },
    });
  };

  const answerEmail = () => {
    // stopTone(incomingAudio);
    if (pathName === "/email") {
      dispatch({
        type: "INCOMING-EMAIL-MODULE",
        iSIncomingEmailSameModule: true,
      });
      // navigate("/email");
      storeAcceptEmailData();
      setIsAnswerEmail(true);
      setIsIncomingEmail(false);
      let changeValue="Available"
      setAgentState(changeValue);
      localStorage.setItem("agentState", changeValue);
    } else {
      navigate("/email");
      dispatch({
        type: "ANSWER-INCOMING-EMAIL",
        iSIncomingEmailAnswer: true,
      });
      let changeValue="Available"
      setAgentState(changeValue);
      localStorage.setItem("agentState", changeValue);
      storeAcceptEmailData();
      setIsAnswerEmail(true);
      setIsIncomingEmail(false);
    }
  };
  // const rejectEmail = () => {
  //   setIsAnswerEmail(false);
  //   setIsIncomingEmail(false);
  // };

  const rejectEmail = async () => {
    // stopTone(incomingAudio);
    try {
      const emailToRemoveWithAgentId = {
        ...emailsData,
      };
      console.log("rejected mail", emailToRemoveWithAgentId);
      const rejectResponse = await fetch(
        config.rejectedmails,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(emailToRemoveWithAgentId),
        }
      );
      if (!rejectResponse.ok)
        throw new Error(`Error: ${rejectResponse.status}`);

      const responseData = await rejectResponse.json();
      console.log("Backend response for reject mail:", responseData);
      setIsAnswerEmail(false);
      setIsIncomingEmail(false);
      let changeValue="Available"
      setAgentState(changeValue);
      localStorage.setItem("agentState", changeValue);
    } catch (error) {
      console.error("Error rejecting mail:", error);
    }
  };

  const storeAcceptEmailData = () => {
    const storeEmailpayload = {
      message_id: emailsData?.message_id,
      session_id: emailsData?.session_id,
      sender: emailsData?.sender,
      recipient: emailsData?.recipient,
      cc: emailsData?.cc_email,
      subject: emailsData?.subject,
      date: emailsData?.date,
      body: emailsData?.body,
      attachments: emailsData?.attachments,
    };
    console.log("storeEmailpayload =====> 123456789", storeEmailpayload);
    axios
      .post(
        appsettings.AppSettings.WebApiBaseUrl + ApiConstants.storeEmails,
        storeEmailpayload
      )
      .then((responce) => {
        console.log("storng the email data into the data base api::", responce);
      })
      .catch((error) => {
        console.log("responce error in the storing data base::", error);
      });
  };
  console.log("emails coming data in nav bar page", emailsData);

  // Chat Functions
  // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const isSessionPresent = (sessionId: string): boolean => {
    return (
      Array.isArray(agentFullData) &&
      agentFullData.some((agent) => agent.session_id === sessionId)
    );
  };

  const handleTimerClick = () => {
    setIsRunning((prevIsRunning) => {
      if (prevIsRunning) {
        setTime(0); // Reset the time when stopping the timer
      }
      return !prevIsRunning;
    });
  };

  const answerMessage = () => {
    // stopTone(incomingAudio);
    console.log("second message::");

    setCount(count + 1);
    navigate("/chat");
    dispatch({
      type: "ANSWERED-INCOMING-MESSAGES",
      first_message: firstMessage,
    });
    setIsAnswerMsg(true);
    setIsNewIncomingMsg(false);
  };

  const rejectMessage = async () => {
    // stopTone(incomingAudio);
    // Add 'async' to the function declaration
    try {
      const chatToRemoveWithAgentId = {
        ...firstMessage,
        rejectedMessage: true,
      };

      // const chatToRemoveWithAgentId = {
      //   ...chatToRemove,
      //   agent_id: parsedMessage.agent_id,
      //   rejectedMessage: true,
      // };

      console.log(
        "rejectMessage chatToRemoveWithAgentId",
        chatToRemoveWithAgentId
      );

      const rejectResponse = await fetch(
        config.chatApiBaseUrl + "/rejected_message",
       // "http://localhost:8002/rejected_message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(chatToRemoveWithAgentId),
        }
      );

      if (!rejectResponse.ok)
        throw new Error(`Error: ${rejectResponse.status}`);

      const responseData = await rejectResponse.json();
      console.log("Backend response for reject messages:", responseData);

      setIsAnswerMsg(true);
      setIsNewIncomingMsg(false);
      let changeValue="Available"
      setAgentState(changeValue);
      localStorage.setItem("agentState", changeValue);
    } catch (error) {
      console.error("Error rejecting message:", error);
    }
  };
  // const answerMessage = () => {
  //   setCount(count + 1);
  //   navigate("/chat");
  //   dispatch({
  //     type: "ANSWERED-INCOMING-MESSAGE",
  //     isAccepted: true,
  //     isAcceptData: messageData,
  //     secondMessageAct: true,
  //     isRejectmessage: false,
  //   });
  //   setIsAnswerMsg(true);
  //   setIsNewIncomingMsg(false);
  // };

  // const rejectMessage = () => {
  //   console.log("rejected .........");
  //   console.log("rejected .........", messageData);
  //   navigate("/chat");
  //   dispatch({
  //     type: "REJECT-INCOMING-MESSAGE",
  //     message_data: messageData,
  //     isRejectmessage: true,
  //   });
  //   setIsAnswerMsg(true);
  //   setIsNewIncomingMsg(false);
  // };

  useEffect(() => {
    ws.current = new WebSocket(config.chatWebSocketUrl + "/ws/user");
    if (agent_id) {
      ws.current.onopen = () => {
        // console.log('WebSocket connection opened');
        if (ws.current) {
          ws.current.send(JSON.stringify(agentData));
        }
      };

      ws.current.onmessage = (event) => {
        setIsAnswerMsg(false);

        const eventData: any = JSON.parse(event.data); // Parse the JSON string into a JavaScript object
        console.log("Message from server:=====>", eventData);

        if (eventData.isFirstMessage) {
          // playTone(incomingAudio);
          console.log("First message received...");

          setFirstMessage(eventData);
          setIsNewIncomingMsg(true);
        } else {
          dispatch({
            type: "CONNECTED_MESSAGES",
            connected_messages: eventData,
          });
          console.log("Every second message ", eventData.userInput);
          console.log("Every second message ", eventData["userInput"]);
          console.log("Subsequent message received...");
        }

        // if (!isSessionPresent(eventData?.metadata?.session_id && pathName === "")) {
        //   console.log("New session ID detected. Handling message based on path...");

        //   dispatch({ type: "NEW-INCOMING-MESSAGE", data: eventData, isSecondMessage: true });
        // }
      };
      // ws.current.onmessage = (event) => {
      //   setIsAnswerMsg(false);
      //   const eventData: any = JSON.parse(event.data);
      //   console.log("Message from server:", eventData);

      //   if (eventData.isFirstMessage) {
      //     console.log("First message received...");
      //     setIsNewIncomingMsg(true);
      //   } else {
      //     console.log("Subsequent message received...");
      //     setIsNewIncomingMsg(false);
      //   }
      //   setMessageData(eventData);

      //   if (
      //     !isSessionPresent(eventData?.metadata?.session_id && pathName === "")
      //   ) {
      //     console.log(
      //       "New session ID detected. Handling message based on path..."
      //     );
      //     setMessageData(eventData);
      //     dispatch({
      //       type: "NEW-INCOMING-MESSAGE",
      //       data: eventData,
      //       isSecondMessage: true,
      //     });
      //   } else if (pathName !== "/chat") {
      //     dispatch({ type: "CLEAR-INCOMING-MESSAGE", data: "" });
      //   }
      // };
    }
  }, [agent_id]);

  useEffect(() => {
    fetchAgentData();
  }, []);

  const fetchAgentData = async () => {
    try {
      const response = await fetch(config.chatApiBaseUrl + "/agents");
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setAgentFullData(data);
    } catch (error) {
      console.error("Error fetching agent data:", error);
    }
  };

  const logStateChange = (agentState: string) => {
    console.log("stateToUpdate", agentState);
    const agentData: AgentData = {
      agent_id: agent_id,
      agentState: agentState,
      dateTime: formattedDateTime,
    };
    console.log("Before posting state in navbar", agentData);
 
    fetch(`${config.chatApiBaseUrl}/log_state_change`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(agentData),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("Backend response ::", response);
      })
      .catch((error) => console.error("Error logging state change:", error));
  };
 
  // useEffect(() => {
  //   if (isNewEmailIncomings) {
  //     logStateChange("busy");
  //   } else {
  //     logStateChange(agentState);
  //   }
  // }, [isNewEmailIncomings, formattedDateTime, agent_id]);
  useEffect(() => {
    if (agentState && agent_id) {
      logStateChange(agentState);
    }
  }, [agentState, agent_id]);

  useEffect(() => {
    if (agent_id) {
      // This will run whenever agentID is updated
      console.log("agentID updated to:", agent_id);
    }
  }, [agent_id]);

  useEffect(() => {
    setPathName(location.pathname);
    // console.log("location.pathname :",location.pathname," ",location ," ",pathName)
  }, [location, pathName]);

  useEffect(() => {
    //fetch(config.chatApiBaseUrl + "/api/agent_queues")
      fetch(config.skills)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("data in ui is",data)
        console.log("fectching agent data ", data[0]["agent_id"]);
        // setAgentID(data[0]['agent_id'])
        const agentEmail = data[0]["agent_id"];
        console.log("agentEmail",agentEmail)
        const agentName = agentEmail.split("@")[0];
        console.log("fetching agent data==========> ", agentName);
        setAgentName(agentName);
        setAgentID(data[0]["agent_id"]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  /////////////// Softphone Functions ///////////////////

  const tempData = {
    firstName: "Zenius",
    lastName: "Test",
    phoneNumber: "9999999999",
    queue: "Billing",
    callType: "Incoming Call...",
    afterlift: "On Call",
  };

  // const formatTime = (seconds: number) => {
  //   const minutes = Math.floor(seconds / 60);
  //   const remainingSeconds = seconds % 60;
  //   return `${String(minutes).padStart(2, "0")}:${String(
  //     remainingSeconds
  //   ).padStart(2, "0")}`;
  // };

  const username = appsettings.AppSettings.username;
  const password = appsettings.AppSettings.password;
  const ip = appsettings.AppSettings.ip;
  const serverURL = appsettings.AppSettings.webSocketServerURL;
  const sip = appsettings.AppSettings.sip;
  const fullusername=username+"@"+ip

  useEffect(() => {
    const savedAgentState = localStorage.getItem("agentState");
    const savedIsAgentRegistered = localStorage.getItem("isAgentRegistered");

    if (savedAgentState) setAgentState(savedAgentState);
    if (savedIsAgentRegistered === "true") {
      setIsAgentRegistered(true);
      agentRegister();
    }
  }, []);

  const agentRegister = useCallback(() => {
    const uri = UserAgent.makeURI(`${sip}${username}@${ip}`);

    console.log("Uri in agentregister", uri);
    if (!uri) throw new Error("Failed to create URI");

    const transportOptions = {
      server: serverURL,
      traceSip: true,
    };
    const userAgentOptions: UserAgentOptions = {
      displayName: username,
      authorizationPassword: password,
      authorizationUsername: username,
      transportOptions,
      uri,
      // contactName: username,
      // viaHost: ip,
      noAnswerTimeout: 60,
    };
    userAgent = new UserAgent(userAgentOptions);
    const registerer = new Registerer(userAgent);

    userAgent
      .start()
      .then(async () => {
        console.log("userAgent Started");
        try {
          await registerer.register();
          setIsAgentRegistered(true);
          localStorage.setItem("isAgentRegistered", "true");
          console.log("UserAgent registered");
          setUserAgents(userAgent);
          dispatch({
            type: "USER REGISTERED",
            userAgent: userAgent,
          });
          // navigate("/softPhone", {
          //   state: {
          //     isDailkeypad: false,
          //   },
          // });
        } catch (error) {
          console.error("Error in registration process:", error);
        }
      })
      .catch((error) => {
        console.error("Error in start process:", error);
      });
  }, [dispatch, navigate, password, sip, username, serverURL, ip]);

  const unregister = useCallback(() => {
    if (isAgentRegistered) {
      if (!userAgent) throw new Error("UserAgent not initialized");
      if (!isAgentRegistered) return;
      const registerer = new Registerer(userAgent);
      registerer
        .unregister()
        .then(() => {
          setIsAgentRegistered(false);
          localStorage.setItem("isAgentRegistered", "false");
          console.log("UserAgent unregistered");
          dispatch({
            type: "USER UNREGISTERED",
            userAgent: userAgent,
          });
          // navigate("/softPhone", {
          //   state: {
          //     isDailkeypad: false,
          //   },
          // });
        })
        .catch((error) => {
          console.error("Error in unregistration process:", error);
        });
    }
  }, [dispatch, isAgentRegistered, navigate]);

  function handleClick() {
    if (isAgentRegistered) {
      unregister();
    } else {
      agentRegister();
    }
  }

  useEffect(() => {
    if (initialRender) {
      setInitialRender(false);
      return;
    }
    // if (agentState === "Logged Out") unregister();
    axios
      .post(config.agentstatus, {
        agent: username,
        status: agentState,
      })
      .then((response) => {
        console.log("Agent status:", response.data);
      })
      .catch((error) => {
        console.error("Error setting agent status:", error);
      });
  }, [agentState, initialRender, username]);

  useEffect(() => {
    if (userOutBoundCall.isOutBoundCall === true || isIncommingCall) {
      // setIsSoftPhoneFeatures(true);
    }
  }, [isIncommingCall, location, userOutBoundCall.isOutBoundCall]);


  const clearSession = useCallback(
    (sessionType: "incoming" | "outgoing") => {
      setIsIncommingCall(false);
      
      navigate("/");

      if (sessionType === "outgoing") {
        setOutgoingSession(null);
      } else if (sessionType === "incoming") {
        setIncomingSession(null);
        setIsCallAnswered(false);
      }
    },
    [
      navigate,
      setIncomingSession,
      setIsCallAnswered,
      setIsIncommingCall,
      setOutgoingSession,
    ]
  );
  useEffect(()=>{
    console.log("is call answered",isCallAnswered)
     /////status
     if((maxcount+maxmsgcount)<3){
      console.log("max count is",maxcount,maxmsgcount);
      let changeValue="Available"
      setAgentState(changeValue);
      localStorage.setItem("agentState", changeValue);
      }
     /////
  },[clearSession])


  


  const playAudio = useCallback(() => {
    const session = outgoingSession || incomingSession;
    if (
      !session ||
      session.state !== SessionState.Established ||
      !session.sessionDescriptionHandler
    )
      return;

    const sessionDescriptionHandler =
      session.sessionDescriptionHandler as SessionDescriptionHandler;
    const peerConnection = sessionDescriptionHandler.peerConnection;

    if (peerConnection) {
      peerConnection.getReceivers().forEach((receiver) => {
        if (receiver.track) remoteStream.addTrack(receiver.track);
      });
      if (remoteMedia.current) {
        remoteMedia.current.srcObject = remoteStream;
        remoteMedia.current
          .play()
          .catch((e) => console.error("Error playing remote media", e));
      }

      peerConnection.getSenders().forEach((sender) => {
        if (sender.track) localStream.addTrack(sender.track);
      });
      if (localMedia.current) {
        localMedia.current.srcObject = localStream;
        localMedia.current
          .play()
          .catch((e) => console.error("Error playing local media", e));
      }
    }
  }, [incomingSession, outgoingSession, localStream, remoteStream]);

  useEffect(() => {
    isUserInteracted = true;
    console.log("User Interacted", isUserInteracted);
    const handleUserInteraction = () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    };

    document.addEventListener("click", handleUserInteraction, { once: true });
    document.addEventListener("keydown", handleUserInteraction, { once: true });
    document.addEventListener("touchstart", handleUserInteraction, {
      once: true,
    });

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    };
  }, []);

  const playTone = (audio: HTMLAudioElement) => {
    const attemptPlay = () => {
      audio.play().catch((error: any) => {
        console.error("Audio playback error:", error);
      });
    };
    if (isUserInteracted) {
      console.log("userinteracted in if block", isUserInteracted);
      attemptPlay();
    } else {
      const handleUserInteraction = () => {
        console.log(
          "userinteracted in else before true block",
          isUserInteracted
        );
        document.removeEventListener("click", handleUserInteraction);
        document.removeEventListener("keydown", handleUserInteraction);
        document.removeEventListener("touchstart", handleUserInteraction);
      };

      document.addEventListener("click", handleUserInteraction, { once: true });
      document.addEventListener("keydown", handleUserInteraction, {
        once: true,
      });
      document.addEventListener("touchstart", handleUserInteraction, {
        once: true,
      });
    }
  };

  const stopTone = (audio: HTMLAudioElement) => {
    if (!audio.paused) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  const handleStateChange = useCallback(
    (
      session: Session,
      audio: HTMLAudioElement,
      sessionType: "incoming" | "outgoing"
    ) => {
      session.stateChange.addListener((newState) => {
        switch (newState) {
          case SessionState.Establishing:
            if (incomingSession) {
              incomingSession.invite({
                sessionDescriptionHandlerModifiers: [Web.holdModifier],
              });
            }
            console.log("Connection Establishing in", sessionType, "session");

            break;
          case SessionState.Established:
            console.log("Connection Established in", sessionType, "session");
            stopTone(audio);
            if (sessionType === "incoming") {
              setIsIncommingCall(true);
              /////status
              let changeValue="Available (On Demand)"
              setAgentState(changeValue);
              localStorage.setItem("agentState", changeValue);
              /////
              setIsOnCallText(true);
            } else {
              setIsCallAnswered(true);
              setIsOnCallText(true);
              setIsConferenceCall(false);
              setIsOutBoundCall(false);
              setIsConferenceIcon(false);
              playAudio();
            }
            break;
          case SessionState.Terminated:
            console.log("Connection Terminated in", sessionType, "session");
            clearSession(sessionType);
            stopTone(audio);
            queueCall = null;
            console.log("queueCall in end", queueCall);
            setQueueName("null");
            console.log("queueName in end ", queueName);
            break;
          default:
            break;
        }
      });
    },
    [clearSession]
  );

  useEffect(() => {
    const incomingAudio = new Audio("./audio/ringtone.mp3");
    incomingAudio.loop = true;
    incomingAudio.canPlayType("");
    setRingtone(incomingAudio);

    const outgoingAudio = new Audio("./audio/outboundring.mp3");
    outgoingAudio.loop = true;
    setOutgoingTone(outgoingAudio);

    if (usersAgents) {
      usersAgents.delegate = {
        onInvite(invitation: Invitation) {
          const incomingSession = invitation;
          setIncomingSession(incomingSession);

          // const audio = new Audio("./audio/ringtone.mp3");
          // audio.loop = true;
          // setRingtone(audio);
          // playTone(audio);
          setIsIncommingCall(true);
          setIsOnCallText(true);

          setRingtone(incomingAudio);
          playTone(incomingAudio);
          handleStateChange(incomingSession, incomingAudio, "incoming");

          // handleStateChange(incomingSession, audio, "incoming");
          invitationRef.current = invitation;
          const Username = invitation.remoteIdentity.displayName;
          setExstensionPhoneNumber(Username);

          const headers = invitation.request.headers;
          console.log("headers", headers);

          if (headers["X-Queue-Name"]) {
            const queueHeader = headers["X-Queue-Name"][0].raw;
            console.log("queueHeader", queueHeader);
            // setQueueCall(queueName);
            queueCall = queueHeader;
            console.log("queueCall", queueCall);
          } else {
            axios
              .get(appsettings.AppSettings.dbURL + ApiConstants.queueName)
              .then((response) => {
                const { queue_name } = response.data;
                console.log("queue_name", queue_name);
                if (queue_name) {
                  setQueueName(queue_name);
                } else {
                  console.log("Queue name is undefined or empty");
                }
              })
              .catch((error) => {
                console.log("Error in queue Api", error);
              });
          }
        },
      };
    }

    if (outgoingSession) {
      // const audio = new Audio("./audio/outboundring.mp3");
      // audio.loop = true;
      // playTone(audio);

      // handleStateChange(outgoingSession, audio, "outgoing");

      setOutgoingTone(outgoingAudio);

      playTone(outgoingAudio);

      handleStateChange(outgoingSession, outgoingAudio, "outgoing");
    }

    // Cleanup function to stop audio if component unmounts
    return () => {
      if (ringtone) {
        stopTone(ringtone);
      }
      if (outgoingTone) {
        stopTone(outgoingTone);
      }
    };
  }, [usersAgents,outgoingSession,handleStateChange]);

  useEffect(() => {
    if (
      userTransferCall.istransforCall === true &&
      userTransferCall.transfornumber !== null
    ) {
      const target = UserAgent.makeURI(
        sip + userTransferCall.transfornumber + `@${ip}`
      );

      console.log("target in transfer", target);
      if (!target) {
        throw new Error("Failed to create target URI.");
      }
      if (outgoingSession) {
        outgoingSession.refer(target);
        outgoingSession.dispose();
        clearSession("outgoing");
      } else if (incomingSession) {
        console.log("Inside incoming transfer");
        incomingSession.refer(target);
        incomingSession.dispose();
        clearSession("incoming");
      }
      dispatch({
        type: "TRANSFER CALL",
        istransforCall: false,
        transfornumber: "",
      });
      setIsTransferCall(false);
      setIsDialPadOPen(false);
      dispatch({
        type: "IS-TRANSFER-CALL",
        isTransferCall: false,
      });
    }
  }, [
    userTransferCall,
    clearSession,
    incomingSession,
    outgoingSession,
    ip,
    sip,
  ]);

  const outBoundcall = useCallback(
    (dialPhoneNumber: string) => {
      setExstensionPhoneNumber(dialPhoneNumber);
      setIsCallAnswered(false);
      setIsConferenceCall(true);
      console.log("we are entering into the outbound method", dialPhoneNumber);

      if (!dialPhoneNumber) {
        console.error("No phone number entered. Call aborted.");
        return;
      }

      const target = UserAgent.makeURI(sip + dialPhoneNumber + `@${ip}`);

      console.log("target in outboundcall", target);

      if (!target) {
        throw new Error("Failed to create target URI.");
      }

      inviter = new Inviter(usersAgents, target);
      outgoingSessionRef.current = inviter;
      setOutgoingSession(outgoingSessionRef.current);

      inviter
        .invite()
        .then(() => {
          console.log("Invite Sent");
        })
        .catch((error: Error) => {
          console.log("Error in Invite", error);
        });
    },
    [
      sip,
      ip,
      usersAgents,
      setExstensionPhoneNumber,
      setIsCallAnswered,
      setIsConferenceCall,
      setOutgoingSession,
      outgoingSessionRef,
    ]
  );

  useEffect(() => {
    if (userOutBoundCall.isOutBoundCall === true) {
      outBoundcall(userOutBoundCall.outBoundDialNumber);
      setIsIncommingCall(true);
    }
  }, [userOutBoundCall, outBoundcall]);

//   useEffect(() => {
//     console.log("in coming issss",isIncommingCall)
//     if(isIncommingCall===true){
//  /////status
//  let changeValue="Available (On Demand)"
//  setAgentState(changeValue);
//  localStorage.setItem("agentState", changeValue);
//  /////
//     }
//     dispatch({ type: "INCOMING_CALL", isIncommingCall: true });
//   }, [isIncommingCall]);

  const conference = useCallback(() => {
    if (incomingSession)
      incomingSession.invite({ sessionDescriptionHandlerModifiers: [] });

    const sessions = [
      incomingSession?.sessionDescriptionHandler,
      outgoingSession?.sessionDescriptionHandler,
    ] as SessionDescriptionHandler[];
    if (!sessions) return;
    context = new AudioContext();
    const allReceivedMediaStreams = new MediaStream();
    const receivedTracks: MediaStreamTrack[] = [];

    sessions.forEach((session) => {
      const peerConnection = session?.peerConnection;
      if (peerConnection) {
        peerConnection.getReceivers().forEach((receiver) => {
          receivedTracks.push(receiver.track);
        });
      }
    });
    sessions.forEach((session) => {
      const peerConnection = session?.peerConnection;
      if (peerConnection) {
        const mixedOutput = context.createMediaStreamDestination();
        peerConnection.getReceivers().forEach((receiver) => {
          receivedTracks.forEach((track) => {
            allReceivedMediaStreams.addTrack(receiver.track);
            if (receiver.track && receiver.track.id !== track.id) {
              const sourceStream = context.createMediaStreamSource(
                new MediaStream([track])
              );
              sourceStream.connect(mixedOutput);
            }
          });
        });
        peerConnection.getSenders().forEach((sender) => {
          if (sender && sender.track) {
            const sourceStream = context.createMediaStreamSource(
              new MediaStream([sender.track])
            );
            sourceStream.connect(mixedOutput);
          }
        });
        peerConnection
          .getSenders()[0]
          .replaceTrack(mixedOutput.stream.getTracks()[0]);
      }
    });

    [remoteMedia.current, localMedia.current].forEach(async (audio) => {
      if (audio) {
        (audio as HTMLMediaElement).srcObject = allReceivedMediaStreams;
        try {
          await (audio as HTMLMediaElement).play();
          console.log("playing conference");
        } catch (error) {
          console.error("Error playing audio", error);
        }
      }
    });
  }, [incomingSession, outgoingSession, remoteMedia, localMedia]);

  const handleCallResponse = useCallback(
    (accept: boolean) => {
      const invite = invitationRef.current;
      if (!invite) return console.error("No invitation available to process.");
      const options = {
        sessionDescriptionHandlerOptions: {
          constraints: { audio: true, video: false },
        },
      };
      const action = accept ? invite.accept(options) : invite.reject();
      action
        .then(() => {
          console.log(
            accept ? "Incoming INVITE Accepted" : "Incoming INVITE Rejected"
          );
          playAudio();
        })
        .catch((error) =>
          console.error(
            `Error ${accept ? "accepting" : "rejecting"} incoming call:`,
            error
          )
        );
    },
    [playAudio]
  );

  const endCall = useCallback(() => {
    setIsCallAnswered(false);
    setIsDialPadOPen(false);
    setIsTransferCall(false);
    dispatch({
      type: "IS-DIALPAD-OPEN",
      isDialPadOpen: false,
    });
    dispatch({
      type: "IS-TRANSFER-CALL",
      isTransferCall: false,
    });

    if (outgoingSession) endSession(outgoingSession);
    if (incomingSession) endSession(incomingSession);
    [remoteMedia.current, localMedia.current].forEach((audio) => {
      if (audio) {
        audio.srcObject = null;
        audio.pause();
      }
    });
    localStream.getTracks().forEach((track) => track.stop());
    remoteStream.getTracks().forEach((track) => track.stop());
  }, [outgoingSession, incomingSession]);

  const endSession = (session: Session) => {
    if (!session) return;
    switch (session.state) {
      case SessionState.Initial:
      case SessionState.Establishing:
        if (session instanceof Inviter) {
          session.cancel();
          session.dispose();
        }
        break;
      case SessionState.Established:
        session.bye();
        break;
      default:
        break;
    }
  };

  const answerCall = useCallback(() => {
    handleCallResponse(true);
    setIsCallAnswered(true);
    dispatch({
      type: "IS-INCOMING-ANSWER",
      isSoftPhoneFeatures: true,
    });
    navigate("/softPhone");
  }, [handleCallResponse]);

  const rejectCall = useCallback(() => {
    if (outgoingSession) endCall();
    else handleCallResponse(false);
    setIsCallAnswered(false);
  }, [handleCallResponse, endCall, outgoingSession]);

  const toggleMute = useCallback(
    (isMuted: boolean, session: SessionDescriptionHandler) => {
      session.peerConnection?.getSenders().forEach((sender) => {
        if (sender.track) sender.track.enabled = !isMuted;
      });
    },
    []
  );

  const handleSession = useCallback(
    (session: Session, isMuted: boolean) => {
      if (
        session?.state === SessionState.Established &&
        session.sessionDescriptionHandler
      ) {
        toggleMute(
          isMuted,
          session.sessionDescriptionHandler as SessionDescriptionHandler
        );
      }
    },
    [toggleMute]
  );

  const muteCall = useCallback(() => {
    setIsMutePhone(true);
    setIsOnCallText(false);
    if (outgoingSession) handleSession(outgoingSession, true);
    else if (incomingSession) handleSession(incomingSession, true);
  }, [outgoingSession, incomingSession, handleSession]);

  const unmuteCall = useCallback(() => {
    setIsMutePhone(false);
    setIsOnCallText(true);
    if (outgoingSession) handleSession(outgoingSession, false);
    else if (incomingSession) handleSession(incomingSession, false);
  }, [outgoingSession, incomingSession, handleSession]);

  const inviteWithSession = (session: Session, options: any) => {
    if (session?.state === SessionState.Established) session.invite(options);
  };

  const holdCall = useCallback(() => {
    setIsHoldPhone(true);
    setIsOnCallText(false);
    const holdOptions = {
      sessionDescriptionHandlerModifiers: [Web.holdModifier],
    };
    if (outgoingSession) inviteWithSession(outgoingSession, holdOptions);
    else if (incomingSession) inviteWithSession(incomingSession, holdOptions);
  }, [outgoingSession, incomingSession]);

  const unholdCall = useCallback(() => {
    setIsHoldPhone(false);
    setIsOnCallText(true);
    const unholdOptions = { sessionDescriptionHandlerModifiers: [] };
    if (outgoingSession) inviteWithSession(outgoingSession, unholdOptions);
    else if (incomingSession) inviteWithSession(incomingSession, unholdOptions);
  }, [outgoingSession, incomingSession]);

  // const dialPadOpen = () => {
  //   setIsDialPadOPen(true);
  //   setIsTransferCall(false);
  //   dispatch({
  //     type: "IS-DIALPAD-OPEN",
  //     isDialPadOpen: true,
  //   });
  // };

  // const transferCall = () => {
  //   setIsTransferCall(true);
  //   setIsDialPadOPen(false);
  //   dispatch({
  //     type: "IS-TRANSFER-CALL",
  //     isTransferCall: true,
  //   });
  // };

  const onBreakOptions = [
    { label: "Tea", value: "tea" },
    { label: "Lunch", value: "lunch" },
  ];

  useEffect(() => {
    console.log("Transfer call state updated to:", isTransferCall);
  }, [isTransferCall]);

  const dialPadOpen = () => {
    setIsDialPadOPen(!isDialPadOpen);
    // setIsTransferCall(false);
    dispatch({
      type: "TRANSFER CALL IN DIALPLAN",
      istransforCall: false,
    });
    dispatch({
      type: "IS-DIALPAD-OPEN",
      isDialPadOpen: !isDialPadOpen,
    });
  };

  const transferCall = () => {
    setIsTransferCall(!isTransferCall);
    setIsDialPadOPen(false);
    dispatch({
      type: "IS-TRANSFER-CALL",
      isTransferCall: !isTransferCall,
      isDialPadOpen: false,
    });
  };
  useEffect(() => {
    console.log("started timer")
    let timer :any;
    // Start a timer when isIncomingEmail is true
    if (isIncomingEmail) {
      console.log("isIncomingEmail :",isIncomingEmail)
      timer = setTimeout(() => {
        console.log("timer completed 30 sec",timer)
        rejectEmail(); // Automatically call rejectEmail after 30 seconds
      }, 30000); // 30,000 milliseconds = 30 seconds
    }

    // Cleanup the timer if the component unmounts or isIncomingEmail changes
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isIncomingEmail]);
  useEffect(() => {
    console.log("started timer")
    let timer :any;
    // Start a timer when isNewIncomingMsg is true
    if (isNewIncomingMsg) {
      console.log("isNewIncomingMsg :",isNewIncomingMsg)
      timer = setTimeout(() => {
        console.log("timer completed 30 sec",timer)
        rejectMessage(); // Automatically call rejectMessage after 30 seconds
      }, 30000); // 30,000 milliseconds = 30 seconds
    }

    // Cleanup the timer if the component unmounts or isNewIncomingMsg changes
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isNewIncomingMsg]);

  return (
    <div>
      <nav className="navbar navbar-expand-sm navbar-wrapper">
        <div className="container-fluid">
          <span className="navbar-brand navbar-logo">
            <img
              src="./images/Zeniusitservices.png"
              alt=""
              className="logo-images"
            />
          </span>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mynavbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="mynavbar">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <div className="navbar-search-section">
                  <span>
                    <i className="fa-solid fa-magnifying-glass navbar-search-icon"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control navbar-search-input"
                    placeholder="Enter Number"
                    onChange={(e) => navDialEmailSearch(e)}
                  />
                  <span className="nav-dial-section">
                    {isNavDialPad && !outgoingSession && (
                      <i
                        className="fa-solid fa-phone"
                        onClick={() => naviGatePhone()}
                      ></i>
                    )}
                    {isNavEmail && <i className="fa-solid fa-envelope"></i>}
                  </span>
                </div>
              </li>
              {/* <li className="nav-item">
                <div className="multi-media-section">
                  {isAgentReady && (
                    <SoftPhone setIsAgentReady={setIsAgentReady} />
                  )}
                </div>
              </li> */}
            </ul>

            {/* Emailui */}
            
            {isIncomingEmail && (
              <>
                <div className="incomingEamil-section">
                  <div
                    className={
                      isAnswerEmail
                        ? "answer-main-section"
                        : "incoming-main-section"
                    }
                  >
                    <div className="name-section-wrapper">
                      <span>
                        {emailsData?.sender.replace(/<[^>]*>/g, "").slice(0, 1)}
                      </span>
                    </div>
                    <div className="email-details-main-section">
                      <span>
                        <span className="email-name">
                          {emailsData?.sender.replace(/<[^>]*>/g, "")}
                        </span>
                        <span className="email-user-mail">{email}</span>
                      </span>
                      <br></br>
                      <span>
                        <span className="email-subject">Subject</span>
                        <span className="email-subject-mail">
                          {emailsData?.subject}
                          {/* {NewSubject}   */}
                                                </span>
                      </span>
                    </div>
                    <div className="incoming-attend-section">
                      {/* {isAnswerEmail && ( */}
                      <div
                        className="incoming-answered-wrapper"
                        onClick={() => answerEmail()}
                      >
                        <i className="fa-solid fa-envelope-open-text"></i>
                      </div>
                      {/* )
                      } */}

                      <div className="reject-emails">
                        <div
                          className="incoming-reject-wrapper"
                          onClick={() => rejectEmail()}
                        >
                          <i className="fa-solid fa-xmark"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* chatui */}

            {isNewIncomingMsg && (
              <>
                <div className="incomingEamil-section">
                  <div
                    className={
                      isAnswerMsg
                        ? "answer-main-section"
                        : "incoming-main-section"
                    }
                  >
                    <div className="name-section-wrapper">
                      <span>{firstMessage?.name.slice(0, 1)}</span>
                    </div>
                    <div className="email-details-main-section">
                      <span>
                        <span className="email-name">{firstMessage?.name}</span>
                        <span className="message-user-message">
                          ({firstMessage?.phone})
                        </span>
                      </span>
                      <br></br>
                      <span>
                        <span className="email-subject">Incoming Message</span>
                        {/* <span className="message-subject-message">
                          {messageData?.userInput}
                        </span> */}
                      </span>
                    </div>
                    <div className="incoming-attend-section">
                      {!isAnswerMsg && (
                        <div
                          className="incoming-answered-wrapper"
                          onClick={() => answerMessage()}
                        >
                          {/* <i className="fa-solid fa-envelope-open-text"></i> */}
                          <i className="fa-solid fa-message"></i>
                        </div>
                      )}

                      <div className="reject-emails">
                        <div
                          className="incoming-reject-wrapper"
                          onClick={() => rejectMessage()}
                        >
                          <i className="fa-solid fa-xmark"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Softphone UI */}

            <div>
              {isIncommingCall && (
                <div className="soft-phone-main-wrapper">
                  <div
                    className={
                      isCallAnswered
                        ? "soft-phone-main-section-after-answered"
                        : "soft-phone-main-section"
                    }
                  >
                    <>
                      <div className="name-section-wrapper">
                        <p className="firstletter-name">
                          {isConferencecall ? (
                            ""
                          ) : (
                            <>
                              {exstensionPhoneNumber
                                ? exstensionPhoneNumber.slice(0, 1)
                                : ""}
                            </>
                          )}
                        </p>
                      </div>
                      <div className="call-details-section">
                        <p>
                          <span className="nav-phone-number">
                            {outgoingSession ? (
                              <span>{exstensionPhoneNumber}</span>
                            ) : queueCall === "Local_extension" ? (
                              <span>{exstensionPhoneNumber}</span>
                            ) : (
                              <span>
                                {exstensionPhoneNumber} ({queueName})
                              </span>
                            )}
                          </span>

                          <br></br>

                          {isConferencecall ? (
                            <span>Dialing....</span>
                          ) : isCallAnswered ? (
                            <span className="navbar-call-after">
                              {isMutePhone && <span>On Mute</span>}
                              {isHoldPhone && <span>On Hold</span>}
                              {isOnCallText && <span>On Call</span>}
                            </span>
                          ) : (
                            <span className="navbar-call-type">
                              {tempData.callType}
                            </span>
                          )}
                        </p>
                      </div>
                    </>

                    <div className="call-answered-section">
                      {isCallAnswered ? (
                        <div className="d-flex">
                          <div>
                            <ul className="navbar-nav call-actions-sections">
                              <li className="nav-item call-mute-section">
                                {isMutePhone ? (
                                  <button className="mute-button">
                                    <i
                                      className="fas fa-microphone-slash icon-cursor"
                                      onClick={() => unmuteCall()}
                                    ></i>
                                  </button>
                                ) : (
                                  <button className="mute-button">
                                    <i
                                      className="fas fa-microphone icon-cursor"
                                      onClick={() => muteCall()}
                                    ></i>
                                  </button>
                                )}
                              </li>
                              <li className="nav-item call-hold-section">
                                {isHoldPhone ? (
                                  <i
                                    className="fa-solid fa-play icon-cursor"
                                    onClick={() => unholdCall()}
                                  ></i>
                                ) : (
                                  <i
                                    className="fa-solid fa-pause icon-cursor"
                                    onClick={() => holdCall()}
                                  ></i>
                                )}
                              </li>
                              <li className="nav-item">
                                <i
                                  className="fa-solid fa-code-merge icon-cursor"
                                  // onClick={() => transferCall()}
                                  onClick={transferCall}
                                ></i>
                              </li>
                              <li className="nav-item">
                                <i
                                  className="fa-solid fa-user-plus icon-cursor"
                                  // onClick={() => dialPadOpen()}
                                  onClick={dialPadOpen}
                                ></i>
                              </li>
                              <>
                                {incomingSession && outgoingSession && (
                                  <li className="nav-item">
                                    <i
                                      className="fa-solid fa-right-left icon-cursor"
                                      onClick={() => conference()}
                                    ></i>
                                  </li>
                                )}
                              </>
                              <li className="nav-item">
                                <div
                                  className="call-declined"
                                  onClick={() => endCall()}
                                >
                                  <i className="fa-solid fa-phone endCall"></i>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      ) : isConferenceIcon ? (
                        <>
                          <div className="d-flex">
                            <div></div>
                            <div
                              className="call-declined"
                              // onClick={() => callDeclained()}
                            >
                              <i className="fa-solid fa-phone"></i>
                            </div>
                          </div>
                        </>
                      ) : userOutBoundCall.outBoundDialCall === true ? (
                        <>
                          <div
                            className="call-declined"
                            onClick={() => endCall()}
                          >
                            <i className="fa-solid fa-phone"></i>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="icon-container">
                            {!isoutBoundCall && !outgoingSession && (
                              <div
                                className={
                                  isoutBoundCall
                                    ? "call-answered-wrapper-none"
                                    : "call-answered-wrapper"
                                }
                                onClick={() => answerCall()}
                              >
                                <i className="fa-solid fa-phone"></i>
                              </div>
                            )}
                            <div
                              className="call-declined test"
                              onClick={() => rejectCall()}
                            >
                              <i className="fa-solid fa-phone"></i>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="icons-wrapper-section">
              <ul className="navbar-nav">
                {/* <li className="nav-item" style={{ paddingRight: "20px" }}> */}
                {/* <li className="nav-item">
                  <i className="fa-solid fa-comment navbar-icons"></i>
                </li>
                <li className="nav-item ">
                  <i className="fa-solid fa-envelope navbar-icons"></i>
                </li>
                <li className="nav-item">
                  <i className={phoneIconClassname()}></i>
                </li> */}
                {/* <li className="divider"></li> */}
                <li className="nav-item">
                  <button className="timer-button" onClick={handleTimerClick}>
                    {timeFormatter(time)}
                  </button>
                </li>
                <li
                  className="nav-item"
                  style={{
                    paddingRight: "20px",
                    paddingLeft: "15px",
                    marginTop: "-6.5px",
                  }}
                >
                  <div>
                    <div className={agentStateclassName()}></div>
                    <select
                      className="form-select agent-state-selection"
                      value={agentState}
                      onChange={(event: any) => agentStateChange(event)}
                    >
                      {agentFields.map(
                        (
                          optionItem: agentStateChangeDropDown,
                          index: number
                        ) => (
                          // <option key={index} value={optionItem.value}>
                          //   {optionItem.label}
                          // </option>
                          <option
                            key={index}
                            value={optionItem.label}
                            // onMouseEnter={() =>
                            //   optionItem.value === "On Break" ||
                            //   ("onbreak" && setIsOnBreakHovered(true))
                            // }
                            // onMouseLeave={() => setIsOnBreakHovered(false)}
                          >
                            {optionItem.label}
                          </option>
                        )
                      )}
                    </select>
                    {/* {isOnBreakHovered && (
                      <select className="form-select break-options">
                        {onBreakOptions.map((option, index) => (
                          <option key={index} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )} */}
                  </div>
                </li>
                <li className="nav-item">
                  <i className={phoneIconClassname()}></i>
                </li>
                <li className="nav-item">
                  <i className="fa-solid fa-bell navbar-icon"></i>
                  {/* <i className="fa-solid fa-arrows-to-dot navbar-icon"></i> */}
                </li>
                {/* <li className="nav-item">
                  <i className="fa-solid fa-user navbar-icon"></i>
                </li> */}
                <li className="nav-item">
                  <i className="fa-solid fa-gear navbar-icon"></i>
                </li>
                <li className="nav-item">
                  <i
                    className="fa-solid fa-power-off navbar-icon"
                    onClick={() => handleClick()}
                  ></i>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* {isSoftPhoneFeatures && (
        <SoftPhoneFeatures
          isDialPadOpen={isDialPadOpen}
          // isTransferCall={isTransferCall}
          setIsDialPadOPen={setIsDialPadOPen}
          setIsOutBoundCall={setIsOutBoundCall}
          setIsIncommingCall={setIsIncommingCall}
          // outBoundcall={outBoundcall}
          exstensionPhoneNumber={exstensionPhoneNumber}
        ></SoftPhoneFeatures>
      )} */}
      <audio ref={remoteMedia} />
      <audio ref={localMedia} muted />
    </div>
  );
};
export default NavBar;
