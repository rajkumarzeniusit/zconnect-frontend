import React, { useState, useEffect, useRef, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import "./chat.scss";
import internalchat from "../../assets/images/internalchat.png";
import msg from "../../assets/images/msg.png";
import accept from "../../assets/images/accept.png";
import decline from "../../assets/images/decline.png";
import "../../scss/_custome.scss";
import config from "../../config";
// import { useStateContext } from "../context/stateContext";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { log, timeStamp } from "console";
import axios from "axios";
import { Rnd } from "react-rnd";
interface ChatProps {
  connected_messages: any;
  ischeckChange: boolean;

  // Replace 'any' with the specific type if possible
}

const Chat: React.FC<ChatProps> = ({ connected_messages, ischeckChange }) => {
  console.log("Inside chat.tsx cheking the log ::", ischeckChange);
  // Define your interfaces here
  let userInput: any;
  interface DataItem {
    metadata: {
      session_id: string;
    };
    name: string;
    phone: string;
    userInput: string;
    queues: string;
    skills: string;
    agentstate: string | null;
    timestamp: string;
    email: string;
    agent_id?: string;
  }
  interface Message {
    sender: string;
    timestamp: string;
    content: string;
    lastname?: string; // Optional since not all messages will have a lastname
  }
  interface AgentData {
    agent_id: string;
    // queue: string;
    // skills: string;
    agentState: string;
    dateTime: string;
    //maxConcurrentInteraction: number;
  }
  interface AgentMessage {
    sender: string;
    timestamp: string;
    content: any;
  }
  const MAX_INTERACTIONS = 3;
  const location = useLocation();
  const [agentState, setAgentState] = useState<string>("");
  const [sessionId, setsessionId] = useState<string>("");
  const [maxConcurrentInteraction, setMaxConcurrentInteraction] =
    useState<string>("");
  const currentDateTime = new Date();
  const formattedDateTime = currentDateTime.toLocaleString();
  const [agent_id, setAgentID] = useState<any>();
  const [agentName, setAgentName] = useState<any>();
  const [incomingmsgCount, setIncomingmsgCount] = useState(0);
  const dispatch = useDispatch();
  // const { message: contextMessage} = useStateContext();
  // const { isNewMessage} = useStateContext();
  // console.log("contextmessages =====> =====> ",isNewMessage);

  useEffect(() => {
    if (ischeckChange) {
      console.log("The chat.tsx rendering to see the api is working or not ");
      // fetchMessages();
      // checkingFetchMessages();
    }
  }, [ischeckChange]);

  // const contextMessage: any = useSelector(
  //   (state: any) => state.messageFetch.message_data
  // );
  const isAcceptedMessage: any = useSelector(
    (state: any) => state.messageFetch.isAcceptedMessage
  );
  const isAcceptData: any = useSelector(
    (state: any) => state.messageFetch.isAcceptData
  );
  const secondMessageAct: any = useSelector(
    (state: any) => state.messageFetch.secondMessageAct
  );
  const isSecondMessage: any = useSelector(
    (state: any) => state.messageFetch.isSecondMessage
  );
  const rejectMessage: any = useSelector(
    (state: any) => state.messageFetch.rejectMessage
  );

  const isSecondMessageChecking: any = useSelector(
    (state: any) => state.messageFetch.isSecondMessageChecking
  );
  const first_message: any = useSelector(
    (state: any) => state.messageFetch.first_message
  );
  // console.log("messaDataprinting ====>",contextMessage);
  console.log("isAcceptedMessage ====>", isAcceptedMessage);
  console.log("contextMessage: contextMessage: ====>", connected_messages);
  // console.log("isAcceptData ====>", isAcceptData);
  // console.log("iisSecondMessage ====>", isSecondMessage);
  // console.log("secondMessageAct ====>", secondMessageAct);

  useEffect(() => {
    return () => {
      dispatch({ type: "CLEAR-INCOMING-MESSAGE", tempData: "" }); // Dispatch action to clear contextMessage
    };
  }, [dispatch]);
  // Access the shared message from the context
  const ws = useRef<WebSocket | null>(null);
  const [showChatPart, setShowChatPart] = useState(false);
  // const [contextMessage,setcontextMessage]= useState<string>('')
  const [agentData, setAgentData] = useState<DataItem[]>([]);
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
  const [acceptedChats, setAcceptedChats] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedChat, setSelectedChat] = useState<DataItem | null>(null);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [userInputsData, setUserInputsData] = useState<any>();
  const [checkChange, setCheckChange] = useState<any>();
  // const [currentInteractions, setCurrentInteractions] = useState<number>(Object.keys(acceptedChats).length);
  const [currentInteractions, setCurrentInteractions] = useState<number>(
    agentData.length
  );
  const [showCloseButton, setShowCloseButton] = useState(false);
  const [lastAgentMessage, setLastAgentMessage] = useState<AgentMessage | null>(
    null
  );
  const [pathName, setPathName] = useState<any>();
  const [count, setCount] = useState<any>();
  // console.log(" agentData =====>",agentData)
  const [typingStatus, setTypingStatus] = useState(false);
  const [chatListTypingStatus, setChatListTypingStatus] = useState(false);

  const lastMessageRef = useRef<any>(null);

  const typingTimeoutRef = useRef<number | null>(null);

  const [currentQueue, setCurrentQueue] = useState(null);
  const [chatData, setChatData] = useState({ queue_name: "", phrases: [] });

  const newarravingmessage: any = connected_messages;

  const selectionofChat = (chat: DataItem) => {
    console.log("selected chat==>", chat.queues);
    setSelectedChat(chat);
    setShowChatPart(true);
  };

  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const handleItemClick = (phrase: any) => {
    setMessage(phrase);
  };

  // const [iframeSrc, setIframeSrc] = useState('');
  // const handleGenerateLinkClick = () => {
  //   setIframeSrc('http://localhost:3005/');
  // };
  const [senderlink, setsenderlink] = useState("");
  const [isIframeVisible, setIsIframeVisible] = useState(false);
  const [iframeSrc, setIframeSrc] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [rndPosition, setRndPosition] = useState({ x: 0, y: 0 });
  const [rndSize, setRndSize] = useState({ width: 0, height: 0 });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // State to store all selected files
  console.log("selectedFiles is", selectedFiles);
  const [base64Files, setBase64Files] = useState<string[]>([]);

  const [base64File, setBase64File] = useState<string | null>(null);
  ///////////////

  useEffect(() => {
    console.log(
      "In chat.tsx logs for connected messages ::",
      connected_messages
    );
    fetchMessages();
  }, [isSecondMessageChecking]);

  console.log("messages in chat.tsx for log purpose ::", messages);

  useEffect(() => {
    if (isIframeVisible) {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const width = windowWidth * 0.8;
      const height = windowHeight * 0.8;
      const x = (windowWidth - width) / 2;
      const y = (windowHeight - height) / 2;

      setRndPosition({ x, y });
      setRndSize({ width, height });
    }
  }, [isIframeVisible]);

  const handleGenerateLinkClick = () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const width = windowWidth * 0.8;
    const height = windowHeight * 0.8;
    const x = (windowWidth - width) / 2;
    const y = (windowHeight - height) / 2;

    setRndPosition({ x, y });
    setRndSize({ width, height });
    setIframeSrc(config.chatiframe);
    // setIframeSrc('https://a4e8-183-82-100-26.ngrok-free.app');
    setIsIframeVisible(true);
    setIsMinimized(false);
    setIsMaximized(false);
  };

  const handleMinimize = () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const width = 300;
    const height = 30;
    const x = windowWidth - width - 20; // 20px from the right edge
    const y = windowHeight - height - 20; // 20px from the bottom edge

    setRndPosition({ x, y });
    setRndSize({ width, height });
    setIsMinimized(true);
    setIsMaximized(false);
  };

  const handleMaximize = () => {
    if (isMaximized) {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const width = windowWidth * 0.8;
      const height = windowHeight * 0.8;
      const x = (windowWidth - width) / 2;
      const y = (windowHeight - height) / 2;

      setRndPosition({ x, y });
      setRndSize({ width, height });
      setIsMinimized(false);
    } else {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const width = windowWidth;
      const height = windowHeight;
      const x = 0;
      const y = 0;

      setRndPosition({ x, y });
      setRndSize({ width, height });
      setIsMinimized(false);
    }
    setIsMaximized(!isMaximized);
  };

  const handleClose = () => {
    setIsIframeVisible(false);
    setIframeSrc("");
  };

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
        console.log("fectching agent data ", data[0]["agent_id"]);

        const agentEmail = data[0]["agent_id"];
        const agentName = agentEmail.split("@")[0];
        setAgentName(agentName);
        setAgentID(data[0]["agent_id"]);

        console.log("fetching agent data==========> ", agentName);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    if (agentState && agent_id) {
      console.log("checking status==>", agentState, agent_id);
    }
  }, [agentState, agent_id]);

  useEffect(() => {
    if (selectedChat) {
      // Fetch chat phrases from the API for the selected queue

      axios
        .get(
          config.chatApiBaseUrl +
            `/api/chat_phrases/queue/${selectedChat.queues}`
        )
        // axios.get(`http://127.0.0.1:8009/api/chat_phrases/${selectedChat.queue}`)
        .then((response) => {
          // Assuming response.data contains filtered phrases for the selected queue
          const data = response.data;
          setChatData({
            queue_name: selectedChat.queues,
            phrases: data.map((item: { phrase_text: any }) => item.phrase_text), // Assuming response structure needs mapping
          });
          console.log("chatData===>", chatData);
        })
        .catch((error) => {
          console.error("There was an error fetching the chat phrases!", error);
        });
    }
  }, [selectedChat]);

  let test: string;

  //  console.log("chatData============>",chatData);

  const toggleCloseButton = () => {
    setShowCloseButton(!showCloseButton);
  };
  useEffect(() => {
    console.log("Inside useeffect rendering dependencies ::");
    // setTimeout(()=>{
    fetchAgentData();
    fetchAcceptedChats();
    // fetchMessages();
    // checkingFetchMessages();
    // },1000)
  }, [connected_messages, first_message]);
  // useEffect(()=>{

  // },[])
  const fetchAgentData = async () => {
    try {
      const response = await fetch(config.chatApiBaseUrl + "/agents");
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      const transformedData = data.map((agent: any) => ({
        metadata: {
          session_id: agent.session_id,
        },
        name: agent.name,
        phone: agent.phone,
        userInput: agent.user_input,
        queues: agent.queues,
        skills: agent.skills,
        agentstate: agent.agentstate ?? null, // Set agentstate to null if not present
        isFirstMessage: agent.is_first_message,
        email: agent.email,
        timestamp: agent.timestamp,
        agent_id: agent.agent_id,
      }));
      console.log("agent tranform data ====>123445678", transformedData);

      setAgentData(transformedData);
      console.log(
        "agent in the below of tranform data ====>123445678",
        agentData
      );
    } catch (error) {
      console.error("Error fetching agent data:", error);
    }
  };

  console.log("currentInteractions========>", currentInteractions);

  const filteredData = agentData.filter((agent) => agent.agent_id === agent_id);
  console.log("agentlenth==>", filteredData.length);

  console.log("agent===========>", agentData);

  // console.log("currentInteractionsagent========>", agentData.length);

  // const checkingFetchMessages = () => {
  //   axios
  //     .get(config.chatApiBaseUrl + "/messages")
  //     .then((response) => {
  //       console.log("Response from get API ::", response);
  //     })
  //     .catch((error) => {
  //       console.log("Error in get api ", error);
  //     });
  // };

  const fetchMessages = async () => {
    try {
      console.log("Inside fetchMessages checking the API");

      const response = await fetch(config.chatApiBaseUrl + "/messages");
      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();
      console.log("data in fetching method ====> 345677", data);

      const transformedData: { [key: string]: Message[] } = {};
      data.forEach((message: any) => {
        const { session_id, sender, timestamp, content, lastname } = message;
        if (!transformedData[session_id]) {
          transformedData[session_id] = [];
        }
        transformedData[session_id].push({
          sender,
          timestamp,
          content,
          lastname,
        });
      });
      console.log(
        "transformedData message data in message fetching method ====>",
        transformedData
      );

      setMessages((prevMessages) => ({
        ...prevMessages,
        ...transformedData,
      }));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const fetchAcceptedChats = async () => {
    try {
      const response = await fetch(config.chatApiBaseUrl + "/accepted_chats");
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      const transformedData: { [key: string]: boolean } = {};
      data.forEach((chat: any) => {
        transformedData[chat.session_id] = chat.accepted;
      });
      setAcceptedChats(transformedData);
    } catch (error) {
      console.error("Error fetching accepted chats:", error);
    }
  };

  //raj
  // useEffect(() => {
  //   console.log(
  //     "Current interactions:.....",
  //     currentInteractions,
  //     MAX_INTERACTIONS
  //   );
  //   if (filteredData.length >= MAX_INTERACTIONS) {
  //     updateLastTimeStamp("Available (On Demand)", formattedDateTime);
  //     dispatch({
  //       type: "CHANGE_AGENT_STATE",
  //       change_agent_state: "Available (On Demand)",
  //     });
  //   } else if (filteredData.length < MAX_INTERACTIONS) {
  //     updateLastTimeStamp("Available", formattedDateTime);
  //     dispatch({ type: "CHANGE_AGENT_STATE", change_agent_state: "Available" });
  //   }
  // }, [agentData]);
  useEffect(() => {
    const countMessages = () => {
      console.log("agentData length is for", agentData.length);
      const msgcount = agentData.length;
      setIncomingmsgCount(msgcount);
      dispatch({
        type: "MAX-Msg-Count",
        maxmsgcount: msgcount,
      });
    };

    // Call the function every 1 second (1000ms)
    const interval = setInterval(() => {
      countMessages();
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, [agentData]);

  console.log("agnet data is", agentData.length);

  const extractbase64File = (parsedMessage: any) => {
    console.log("parsed meggase for attchemnts", parsedMessage);
    if (parsedMessage.files && parsedMessage.files.length > 0) {
      let fileLinks = "";

      parsedMessage.files.forEach((file: any) => {
        const fileData = file.data.split(",")[1]; // Extract the base64 part
        const fileName = file.name;
        const fileType = file.type;

        // Append each file anchor tag to the result
        fileLinks +=
          `<a href="${fileData}" download="${fileName}">${fileName}</a>` + " ";
      });

      // After all files, add a break tag
      fileLinks += "<br>";

      return fileLinks;
    }

    // if (parsedMessage.file && parsedMessage.file.data) {
    //   const fileData = parsedMessage.file.data.split(",")[1]; // Extract the base64 part
    //   const fileName = parsedMessage.file.name;
    //   const fileType = parsedMessage.file.type;
    //   return `<a href="${fileData}" download="${fileName}">${fileName}</a><br>`;

    //   // return {
    //   //   name: fileName,
    //   //   type: fileType,
    //   //   data: fileData,
    //   // };
    // }
    else {
      console.log("No file present in the parsed message.");
      return null;
    }
  };

  const extractFile = (parsedMessage: any) => {
    if (parsedMessage.file && parsedMessage.file.data) {
      const fileData = parsedMessage.file.data.split(",")[1]; // Extract the base64 part
      const fileName = parsedMessage.file.name;
      const fileType = parsedMessage.file.type;

      // Decode the base64 data
      const decodedData = atob(fileData);
      const byteArray = new Uint8Array(decodedData.length);

      for (let i = 0; i < decodedData.length; i++) {
        byteArray[i] = decodedData.charCodeAt(i);
      }

      return {
        name: fileName,
        type: fileType,
        data: byteArray,
      };
    } else {
      console.log("No file present in the parsed message.");
      return null;
    }
  };

  function generateUniqueId() {
    return uuidv4();
  }

  useEffect(() => {
    if (first_message) {
      console.log("inside first message", first_message);
      insertNewMessage(first_message);
      acceptmessage(first_message);
      fetchAgentData();
      dispatch({ type: "CLEAR-FIRST-MESSAGE", EmptyFirstMessage: "" });
    } else if (connected_messages) {
      console.log(
        "SAmple message for connected message",
        connected_messages,
        connected_messages["userInput"],
        connected_messages["file"]
      );

      // console.log("connected messages",connected_messages);
      if (
        connected_messages.receivedData &&
        connected_messages.receivedData.agentState
      ) {
        setAgentState(connected_messages.receivedData.agentState);
      }
      if (connected_messages.metadata) {
        console.log("Inside no event available");

        const sessionId = connected_messages.metadata?.session_id;
        const testattch = extractbase64File(connected_messages);
        console.log("testattch is", testattch);
        //   if(testattch?.name !== undefined){
        //    connected_messages["userInput"]=`<a href="${testattch?.data}" download="${testattch?.name}">${testattch?.name}</a><br>`+connected_messages["userInput"]
        //   }
        if (testattch !== null) {
          connected_messages["userInput"] =
            testattch + connected_messages["userInput"];
        }

        const userInput = connected_messages["userInput"];
        console.log("second message checking :", userInput, sessionId);
        const extractedFile = extractFile(connected_messages);
        //const testattch=extractbase64File(connected_messages)
        console.log(
          "cheking if and else condition",
          userInput,
          sessionId,
          testattch
        );
        console.log("attachments --->", extractedFile);
        if (userInput && sessionId && testattch === null) {
          console.log("enteredaaa if");
          const newMessage = {
            sender: "agent",
            timestamp: new Date().toISOString(),
            content: userInput,
          };

          const updatedAgentData = agentData.map((chat) =>
            chat.metadata.session_id === connected_messages.metadata.session_id
              ? {
                  ...chat,
                  userInput: userInput,
                  timestamp: new Date().toISOString(),
                }
              : chat
          );

          fetch(config.agentsapi, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedAgentData),
          })
            .then((response) => {
              if (!response.ok) {
                console.error("Error saving agents to the database");
              } else {
                fetchAgentData(); // Fetch updated agent data
              }
            })
            .catch((error) => {
              console.error("Error saving agents to the database:", error);
            });

          dispatch({ type: "CLEAR-SECOND-MESSAGE", EmptySecondMessage: "" });
        }

        // if (extractedFile) {
        //   const referenceId = generateUniqueId();
        //   console.log(
        //     "inside attachments:::::",
        //     extractedFile.name,
        //     referenceId,extractedFile
        //   );
        //   // uploadAttachment(extractedFile, sessionId);
        //   uploadAttachment(extractedFile, sessionId, referenceId);

        //   if (extractedFile.name && sessionId) {
        //     const newMessage = {
        //       sender: "agent",
        //       timestamp: new Date().toISOString(),
        //       content: extractedFile.name + "   ref ID " + referenceId,
        //     };

        ////////////////
        // if (testattch?.name==="rrr") {
        //   console.log("enteredaaa else")
        //   const referenceId = generateUniqueId();
        //   console.log(
        //     "inside attachments:::::",
        //     testattch.name,
        //     referenceId,extractedFile
        //   );
        //   // uploadAttachment(extractedFile, sessionId);
        //   uploadAttachment(extractedFile, sessionId, referenceId);

        //   if (testattch.name && sessionId) {
        //     const newMessage = {
        //       sender: "agent",
        //       timestamp: new Date().toISOString(),
        //       content: `<a href="${testattch.data}" download="${testattch.name}">${testattch.name}</a><br>`+userInput,
        //     };

        //     const requestBody = { session_id: sessionId, ...newMessage };
        //     console.log("Request Body:", requestBody); // Log request body

        //     // if (!isDuplicate) {
        //     console.log("testing .........");
        //     fetch("http://localhost:8005/messages", {
        //       method: "POST",
        //       headers: {
        //         "Content-Type": "application/json",
        //       },
        //       body: JSON.stringify(requestBody),
        //     })
        //       .then((response) => {
        //         console.log("Inserted second message succesfully", response);
        //         fetchMessages();

        //       })
        //       .catch((error) => {
        //         console.error("Error saving message to the database:", error);
        //       });
        //   }

        //   dispatch({ type: "CLEAR-SECOND-MESSAGE", EmptySecondMessage: "" });
        // }
      }

      if (
        connected_messages.event === "typing" &&
        selectedChat?.metadata.session_id === connected_messages.session_id
      ) {
        const sessionIds = agentData.map((data) => data.metadata.session_id);
        console.log("heloooooo", sessionIds);
        setTypingStatus(true);
      } else {
        setTypingStatus(false);
      }

      if (connected_messages.event === "typing") {
        setChatListTypingStatus(true);
      } else {
        setChatListTypingStatus(false);
      }
    }

    fetchMessages();
  }, [connected_messages, first_message]);
  // useEffect(() => {
  //   if (contextMessage) {
  //     console.log("contextMessage testing...", contextMessage);
  //     console.log("contextMessage timestamp...", contextMessage.timestamp);
  //     const contextObject: any = contextMessage;

  //     // Update session ID, max concurrent interaction, agent ID, etc.
  //     if (contextObject.metadata && contextObject.metadata.session_id) {
  //       setsessionId(contextObject.metadata.session_id);
  //     }
  //     if (
  //       contextObject.receivedData &&
  //       contextObject.receivedData.maxConcurrentInteraction
  //     ) {
  //       setMaxConcurrentInteraction(
  //         contextObject.receivedData.maxConcurrentInteraction
  //       );
  //       // setAgentID(contextObject.receivedData.id);
  //     }
  //     if (contextObject.receivedData && contextObject.receivedData.agentState) {
  //       setAgentState(contextObject.receivedData.agentState);
  //     }

  //     try {
  //       const parsedMessage: any = contextMessage;
  //       console.log(
  //         "parsedMessage ===============>>>>1234567890",
  //         parsedMessage
  //       );

  //       if (parsedMessage.isFirstMessage) {
  //         setCount(count + 1);

  //         console.log("latest parsedMessage ", parsedMessage);
  //         console.log(" agent data in useeffect==>", agentData);
  //         if (agentData?.length === 0 && !rejectMessage) {
  //           // const newData = [...prevData, parsedMessage];
  //           insertNewMessage(parsedMessage);
  //           dispatch({
  //             type: "STORED-NEW-INCOMING-MESSAGE",
  //             tempSecondMessage: false,
  //             tempAcceptedMessage: false,
  //           });
  //           // newsdata = newData;
  //           console.log("when ever the first message comes");
  //         } else if (
  //           secondMessageAct &&
  //           isAcceptedMessage &&
  //           agentData?.length !== 0 &&
  //           !rejectMessage
  //         ) {
  //           // const newData = [...prevData, parsedMessage];
  //           insertNewMessage(parsedMessage);
  //           dispatch({
  //             type: "STORED-NEW-INCOMING-MESSAGE",
  //             tempSecondMessage: false,
  //             tempAcceptedMessage: false,
  //           });
  //           // newsdata = newData;
  //           console.log("when ever the second messages comes message comes");
  //         }
  //       } else {
  //         console.log("parseMessage .......", parsedMessage);
  //         console.log(
  //           "parsedMessage['userInput'] =======> 123456890",
  //           parsedMessage["userInput"]
  //         );
  //         // Handle user input message
  //         const userInput = parsedMessage["userInput"];
  //         const usertimestamp = parsedMessage["timestamp"];
  //         const extractedFile = extractFile(parsedMessage);

  //         console.log("attachments --->", extractedFile);

  //         console.log("userInputsData ====>", userInputsData);
  //         // setUserInputsData(userInputsData)
  //         const sessionId = parsedMessage.metadata?.session_id;
  //         console.log("userinputs =======> 123456890", userInput);

  //         if (userInput && sessionId) {
  //           const newMessage = {
  //             sender: "agent",
  //             timestamp: new Date().toISOString(),
  //             content: userInput,
  //           };

  //           const requestBody = { session_id: sessionId, ...newMessage };
  //           console.log("Request Body:", requestBody); // Log request body

  //           // if (!isDuplicate) {
  //           console.log("testing .........");
  //           fetch(config.chatApiBaseUrl + "/messages", {
  //             method: "POST",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify(requestBody),
  //           })
  //             .then((response) => {
  //               fetchMessages();
  //               lastMessageRef.current = newMessage;
  //               console.log("lastMessageRef.current", lastMessageRef.current);

  //               if (!response.ok) {
  //                 console.error("Error saving message to the database");
  //               } else {
  //                 // lastMessageRef.current = newMessage;
  //               }
  //             })
  //             .catch((error) => {
  //               console.error("Error saving message to the database:", error);
  //             });

  //           const updatedAgentData = agentData.map((chat) =>
  //             chat.metadata.session_id === parsedMessage.metadata.session_id
  //               ? {
  //                   ...chat,
  //                   userInput: userInput,
  //                   timestamp: new Date().toISOString(),
  //                 }
  //               : chat
  //           );

  //           fetch(config.chatApiBaseUrl + "/agents", {
  //             method: "PUT",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify(updatedAgentData),
  //           })
  //             .then((response) => {
  //               if (!response.ok) {
  //                 console.error("Error saving agents to the database");
  //               } else {
  //                 fetchAgentData(); // Fetch updated agent data
  //               }
  //             })
  //             .catch((error) => {
  //               console.error("Error saving agents to the database:", error);
  //             });
  //         }

  //         // Handle attachment if present
  //         if (extractedFile) {
  //           const referenceId = generateUniqueId();
  //           console.log(
  //             "inside attachments:::::",
  //             extractedFile.name,
  //             referenceId
  //           );
  //           // uploadAttachment(extractedFile, sessionId);
  //           uploadAttachment(extractedFile, sessionId, referenceId);

  //           if (extractedFile.name && sessionId) {
  //             const newMessage = {
  //               sender: "agent",
  //               timestamp: new Date().toISOString(),
  //               content: extractedFile.name + "   ref ID " + referenceId,
  //             };

  //             const requestBody = { session_id: sessionId, ...newMessage };
  //             console.log("Request Body:", requestBody); // Log request body

  //             // if (!isDuplicate) {
  //             console.log("testing .........");

  //             fetch(config.chatApiBaseUrl + "/messages", {
  //               method: "POST",
  //               headers: {
  //                 "Content-Type": "application/json",
  //               },
  //               body: JSON.stringify(requestBody),
  //             })
  //               .then((response) => {
  //                 fetchMessages();
  //                 lastMessageRef.current = newMessage;
  //                 console.log("lastMessageRef.current", lastMessageRef.current);

  //                 if (!response.ok) {
  //                   console.error("Error saving message to the database");
  //                 } else {
  //                   // lastMessageRef.current = newMessage;
  //                 }
  //               })
  //               .catch((error) => {
  //                 console.error("Error saving message to the database:", error);
  //               });
  //           }
  //         }
  //       }
  //       test = parsedMessage.session_id;
  //       console.log("hello ...", test);

  //       // Handle typing event
  //       if (
  //         parsedMessage.event === "typing" &&
  //         selectedChat?.metadata.session_id === parsedMessage.session_id
  //       ) {
  //         const sessionIds = agentData.map((data) => data.metadata.session_id);
  //         console.log("heloooooo", sessionIds);
  //         setTypingStatus(true);
  //       } else {
  //         setTypingStatus(false);
  //       }

  //       if (parsedMessage.event === "typing") {
  //         setChatListTypingStatus(true);
  //       } else {
  //         setChatListTypingStatus(false);
  //       }
  //     } catch (error) {
  //       console.error("Error parsing contextMessage:", error);
  //     }
  //   }
  // }, [contextMessage, secondMessageAct, isAcceptedMessage]);

  const insertNewMessage = (parsedMessage: any) => {
    console.log("parsedMessage=======>hello", parsedMessage);

    fetch(config.chatApiBaseUrl + "/agents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsedMessage),
    })
      .then((response) => {
        fetchMessages();
        if (!response.ok) {
          console.error("Error saving agent data to the database");
        }
      })
      .catch((error) => {
        console.error("Error saving agent data to the database:", error);
      });
  };

  //   async function uploadAttachment(extractedFile:any, sessionId:any,referenceId:any) {
  //     const formData = new FormData();
  //     formData.append('session_id', sessionId);
  //     formData.append('file', new Blob([new Uint8Array(Object.values(extractedFile.data))], { type: extractedFile.type }), extractedFile.name);
  //     formData.append('reference_id',referenceId)

  //     try {
  //         const response = await fetch('http://localhost:8005/attachments', {  // Use the full URL here
  //             method: 'POST',
  //             body: formData,
  //         });

  //         if (response.ok) {
  //             const result = await response.json();
  //             console.log('Attachment saved successfully', result);
  //         } else {
  //             console.error('Error saving attachment', response.statusText);
  //         }
  //     } catch (error) {
  //         console.error('Error saving attachment', error);
  //     }
  // }

  async function uploadAttachment(
    extractedFile: any,
    sessionId: any,
    referenceId: any
  ) {
    const formData = new FormData();

    // Convert the file data to base64
    const base64FileData = btoa(
      new Uint8Array(extractedFile.data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );

    const filePayload = {
      name: extractedFile.name,
      type: extractedFile.type,
      data: base64FileData, // Send the base64-encoded data
    };

    formData.append("session_id", sessionId);
    formData.append("extracted_file", JSON.stringify(filePayload));
    formData.append("reference_id", referenceId);

    try {
      const response = await fetch(config.chatApiBaseUrl + "/attachments", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Attachment saved successfully", result);
      } else {
        console.error("Error saving attachment", response.statusText);
      }
    } catch (error) {
      console.error("Error saving attachment", error);
    }
  }

  const tempData = () => {};
  const memoizedMessage = useMemo(() => {
    return connected_messages;
  }, [connected_messages]);
  // useEffect(() => {
  //   if (
  //     isAcceptedMessage &&
  //     memoizedMessage &&
  //     memoizedMessage.isFirstMessage
  //   ) {
  //     console.log("accepted messages -->", memoizedMessage);
  //     acceptmessage(memoizedMessage);
  //     console.log("accepted messages useEffect re-rendering the things");
  //   }
  // }, [isAcceptedMessage, memoizedMessage]);

  // useEffect(() => {
  //   if (rejectMessage && memoizedMessage) {
  //     console.log("rejectMessage -->", memoizedMessage);
  //     rejectmessage(memoizedMessage);
  //     console.log("rejectMessage useEffect re-rendering the things");
  //   }
  // }, [rejectMessage, memoizedMessage]);

  // const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setMessage(event.target.value);
  //   const newMessage = event.target.value;
  //   console.log("before sending..........")

  //   if(ws.current){
  //    console.log("checking ......",ws.current);

  //    ws.current.send(JSON.stringify({ event: 'typing', data: 'user is typing...', session_id: selectedChat?.metadata.session_id }));

  //   }

  // };
  ////////////////////
  // const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // State to store all selected files
  // console.log("multple files is",selectedFiles)
  // const [base64Files, setBase64Files] = useState<string[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    console.log("files is", files);

    if (files && files.length > 0) {
      let downloadLinks: string[] = []; // Array to hold download links
      const base64Files: string[] = []; // Array to hold base64 content for later use
      const filesArray: File[] = []; // Array to store all selected files

      for (let i = 0; i < files.length; i++) {
        const selectedFile = files[i];
        console.log("Selected file:", selectedFile);
        filesArray.push(selectedFile); // Add file to the array

        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);

        reader.onload = () => {
          const base64 = reader.result as string;
          base64Files.push(base64); // Store base64 content
          const downloadLink = `<a href="${base64}" download="${selectedFile.name}">${selectedFile.name}</a>`;
          downloadLinks.push(downloadLink); // Add to download links array

          // Set the sender link when all files have been processed
          if (downloadLinks.length === files.length) {
            setsenderlink(downloadLinks.join("  ")); // Join links with a comma
          }
        };

        reader.onerror = (error) => {
          console.error("Error reading file:", error);
        };
      }

      // Store all selected files in state after processing
      setSelectedFiles(filesArray);
      setBase64Files(base64Files);
    }
  };

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = event.target.files;
  //   console.log("files is", files);

  //   if (files && files.length > 0) {
  //     // Handle file upload logic here
  //     let downloadLinks: string[] = []; // Array to hold download links
  //     const base64Files: string[] = []; // Array to hold base64 content for later use

  //     for (let i = 0; i < files.length; i++) {
  //       const selectedFile = files[i];
  //       console.log('Selected file:', selectedFile);
  //       setSelectedFile(selectedFile); // This will only set the last selected file

  //       const reader = new FileReader();
  //       reader.readAsDataURL(selectedFile);

  //       reader.onload = () => {
  //         const base64 = reader.result as string;
  //         base64Files.push(base64); // Store base64 content
  //         const downloadLink = `<a href="${base64}" download="${selectedFile.name}">${selectedFile.name}</a>`;
  //         downloadLinks.push(downloadLink); // Add to download links array

  //         // Set the sender link when all files have been processed
  //         if (downloadLinks.length === files.length) {
  //           setsenderlink(downloadLinks.join(', ')); // Join links with a comma
  //         }
  //       };

  //       reader.onerror = (error) => {
  //         console.error('Error reading file:', error);
  //       };
  //     }

  //   }
  // };

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {

  //   const files = event.target.files;
  //   console.log("files is",files)

  //   if (files && files.length > 0) {
  //     // Handle file upload logic here
  //     const selectedFile = files[0];
  //     console.log('Selected file:', selectedFile);
  //     setSelectedFile(selectedFile)
  //     // You can now append this file to your message or send it separately.
  //     const reader = new FileReader();
  //     reader.readAsDataURL(selectedFile);

  //     reader.onload = () => {
  //       const base64 = reader.result as string;
  //       setBase64File(base64); // Store the base64 content for later use
  //      const downloadLink = `<a href="${base64}" download="${selectedFile.name}">${selectedFile.name}</a><br>`;
  //      console.log("download linki is",downloadLink)
  //       setsenderlink(downloadLink);
  //     };

  //     reader.onerror = (error) => {
  //       console.error('Error reading file:', error);
  //     };
  //   }
  // };
  // const handleRemoveFile = () => {
  //   setSelectedFile(null); // Clear the selected file
  //   setSelectedFiles([])
  // };
  const handleRemoveFile = (index: any) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles); // Assuming you have a setter for updating selected files
  };
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      console.log("Enter key pressed", event);
      // You can call the function to send the message or perform any other action
      handleSendClick();
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
    const newMessage = event.target.value;
    console.log("before sending..........", newMessage);

    if (ws.current) {
      console.log("checking ......", ws.current);
      ws.current.send(
        JSON.stringify({
          event: "typing",
          data: " typing..... ",
          session_id: selectedChat?.metadata.session_id,
        })
      );

      // Clear the previous timer if it exists
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set a new timer to send stop_typing event after 2 seconds of inactivity
      typingTimeoutRef.current = window.setTimeout(() => {
        if (ws.current) {
          ws.current.send(
            JSON.stringify({
              event: "stop_typing",
              session_id: selectedChat?.metadata.session_id,
            })
          );
        }
      }, 400); // 2000 ms = 2 seconds
    }
  };

  const acceptmessage = async (chat: DataItem) => {
    try {
      console.log("inside accept.......");

      // Post accepted chat after 2 seconds
      await new Promise((resolve) => setTimeout(resolve, 500)); // 2000 milliseconds = 2 seconds

      await fetch(config.chatApiBaseUrl + "/accepted_chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: chat.metadata.session_id,
          accepted: true,
        }),
      });

      setAcceptedChats((prev) => {
        console.log("...prev", prev);
        const newAcceptedChats = { ...prev, [chat.metadata.session_id]: true };
        return newAcceptedChats;
      });

      fetchAgentData();

      const newMessage: Message = {
        sender: "agent",
        timestamp: new Date().toISOString(),
        content: chat.userInput,
      };

      console.log("new messages in the accepted method ===>", newMessage);
      console.log(
        "storing message into the data basess ===>",
        JSON.stringify({ ...newMessage, session_id: chat.metadata.session_id })
      );

      // Post new message immediately (without delay)

      await fetch(config.chatApiBaseUrl + "/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newMessage,
          session_id: chat.metadata.session_id,
        }),
      });

      fetchMessages();

      setCurrentInteractions((prev) => prev + 1);
      selectionofChat(chat);
      console.log("updateLastTimeStamp====>", agentState, formattedDateTime);

      updateLastTimeStamp(agentState, formattedDateTime);
    } catch (error) {
      console.error("Error accepting message:", error);
    }
  };

  const rejectmessage = async (chatToRemove: DataItem) => {
    try {
      console.log("heloooooooo", connected_messages);
      const parsedMessage: any = connected_messages;
      console.log("heloooooooo", parsedMessage.agent_id);

      const chatToRemoveWithAgentId = {
        ...chatToRemove,
        agent_id: parsedMessage.agent_id,
        rejectedMessage: true,
      };

      console.log(
        "rejectmessage chatToRemoveWithAgentId",
        chatToRemoveWithAgentId
      );

      const rejectResponse = await fetch(
        config.chatApiBaseUrl + "/rejected_message",
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
      setAgentData((prevData) => {
        const newData = prevData.filter((chat) => chat !== chatToRemove);
        return newData;
      });
      if (selectedChat === chatToRemove) {
        setShowChatPart(false);
        setSelectedChat(null);
      }
    } catch (error) {
      console.error("Error rejecting message:", error);
    }
  };
  const handleSendClick = async () => {
    if (!selectedChat) {
      return;
    }
    console.log("aaaa in aaaa");
    const newMessage: Message = {
      sender: "user",
      timestamp: new Date().toISOString(),
      content: message,
    };
    console.log("aaaa in aaaa", newMessage.content);

    try {
      console.log("Attempting to send message:", newMessage);

      // Ensure WebSocket is initialized
      if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
        console.log(
          "WebSocket is not open or initialized. Attempting to initialize..."
        );
        // config.chatWebSocketUrl+'/ws/user'
        ws.current = new WebSocket(config.chatWebSocketUrl + "/ws/user");
        await new Promise<void>((resolve, reject) => {
          ws.current!.onopen = () => {
            console.log("WebSocket connection established.");
            resolve();
          };
          ws.current!.onerror = (err) => {
            console.error("WebSocket error:", err);
            reject(err);
          };
        });
      }
      const jsonObject = {
        message: message,
        sessionId: selectedChat.metadata.session_id,
        agentName: agentName,
        files: selectedFiles.map((file, index) => ({
          name: file.name,
          type: file.type,
          data: base64Files[index], // Use corresponding base64 data
        })),
      };

      // const jsonObject = {
      //   message: message,
      //   sessionId: selectedChat.metadata.session_id,
      //   agentName: agentName,
      //   file:{
      //    name: selectedFile?.name,
      //    type : selectedFile?.type,
      //    data:base64File

      //   }
      // };
      console.log("Sending message via WebSocket:", jsonObject);
      ws.current!.send(JSON.stringify(jsonObject));
      setSelectedFile(null);
      setSelectedFiles([]);
      setBase64File(null);

      // Handling server response
      ws.current!.onmessage = (event) => {
        console.log("Message from server:", event.data);
      };

      // Sending message data to backend API
      console.log("Sending message data to backend API:", newMessage.content);
      newMessage.content = senderlink + "<br>" + newMessage.content;
      console.log("conetnt for new msg", newMessage, newMessage.content);
      setsenderlink("");

      const response = await fetch(config.chatApiBaseUrl + "/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: selectedChat.metadata.session_id,
          sender: newMessage.sender,
          timestamp: newMessage.timestamp,
          content: newMessage.content,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error updating messages: ${response.status}`);
      }

      // Updating agent data
      const updatedAgentData = agentData.map((chat) =>
        chat.metadata.session_id === selectedChat.metadata.session_id
          ? { ...chat, userInput: message, timestamp: new Date().toISOString() }
          : chat
      );

      console.log("Updating agent data:", updatedAgentData);

      const agentResponse = await fetch(config.chatApiBaseUrl + "/agents", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedAgentData),
      });

      if (!agentResponse.ok) {
        throw new Error(`Error updating agent data: ${agentResponse.status}`);
      }

      // Update messages in UI state only once per message sent
      setMessages((prevMessages) => {
        const updatedMessages = { ...prevMessages };
        const sessionId = selectedChat.metadata.session_id;

        // Ensure the session_id exists in updatedMessages
        if (!updatedMessages[sessionId]) {
          updatedMessages[sessionId] = [];
        }

        // Check if the new message is already in the state
        const existingMessage = updatedMessages[sessionId].find(
          (m) =>
            m.timestamp === newMessage.timestamp &&
            m.content === newMessage.content
        );

        // If not already added, push the new message
        if (!existingMessage) {
          updatedMessages[sessionId].push(newMessage);
        }

        console.log("Updated messages in UI state:", updatedMessages);
        return updatedMessages;
      });

      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const updateLastTimeStamp = (state: string, dateTime: string) => {
    if (agent_id) {
      const agentData: AgentData = {
        agent_id: agent_id,
        // queue: "Q1,Q2",
        // skills: "S1,S2",
        agentState: state,
        dateTime: dateTime,
        // maxConcurrentInteraction: 3
      };

      console.log("before posting state in chat", agentData);
      // config.chatApiBaseUrl+'/log_state_change'
      fetch(config.chatApiBaseUrl + "/log_state_change", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(agentData),
      })
        .then((response) => response.json())
        .then((response) => {
          console.log("Backend response:", response);
        })
        .catch((error) => console.error("Error logging state change:", error));
    }
  };

  const closeChat = () => {
    if (selectedChat) {
      const sessionIdToRemove = selectedChat.metadata.session_id;
      console.log("selectedChat -->:", selectedChat);
      console.log("email ::::-->", selectedChat);

      console.log("hereeeee......", sessionIdToRemove);

      fetch(config.chatApiBaseUrl1 + "/remove-session1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionIdToRemove,
          agent_id: agent_id,
          agentName: agentName,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });

      setCurrentInteractions((prev) => prev - 1);
      // Remove the selected chat session_id from acceptedChats
      const updatedAcceptedChats = { ...acceptedChats };
      delete updatedAcceptedChats[sessionIdToRemove];
      localStorage.setItem(
        "acceptedChats",
        JSON.stringify(updatedAcceptedChats)
      );
      setAcceptedChats(updatedAcceptedChats); // Update state
      // Remove the selected chat session_id from agentData
      setAgentData((prevData) => {
        const newData = prevData.filter(
          (chat) => chat.metadata.session_id !== sessionIdToRemove
        );
        localStorage.setItem("agentData", JSON.stringify(newData)); // Save to localStorage
        return newData;
      });
      // Remove the selected chat session_id from messages
      setMessages((prevMessages) => {
        const { [sessionIdToRemove]: _, ...newMessages } = prevMessages; // Destructure to remove the sessionIdToRemove key
        localStorage.setItem("messages", JSON.stringify(newMessages)); // Save to localStorage
        return newMessages;
      });

      setShowChatPart(false);
      setSelectedChat(null);
    }
  };
  const formatTimestamp = (timestamp: string | number | Date) => {
    console.log("check time..", timestamp);
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  const last_Time_stamp = (sessionId: string) => {
    console.log("check sessionId..", sessionId);

    return sessionId;
  };

  function formatTimestampcheck(timestamp: any) {
    const date = new Date(timestamp);

    // Format components
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert 24-hour time to 12-hour time
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    // Format final string
    const formattedDate = `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`;

    return formattedDate;
  }

  // async function fetchAttachmentData(refId: string) {
  //   try {
  //     const response = await fetch(`http://localhost:8005/attachments/${refId}`);
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     const data = await response.json();

  //     console.log("Attachment data:", data);

  //     // Decode base64 to binary string
  //     const fileData = atob(data.attachment_data);

  //     // Convert the binary string to a Uint8Array
  //     const byteArray = new Uint8Array(Array.from(fileData, char => char.charCodeAt(0)));

  //     const fileName = data.file_name;
  //     const fileType = data.file_type;

  //     console.log("files details",fileName ,fileType,byteArray);

  //     // Create a Blob and download the file
  //     // const blob = new Blob([byteArray], { type: fileType });
  //     // const url = URL.createObjectURL(blob);
  //     // const a = document.createElement('a');
  //     // a.href = url;
  //     // a.download = fileName;
  //     // a.click();
  //     // URL.revokeObjectURL(url);

  //   } catch (error) {
  //     console.error("Failed to fetch attachment data:", error);
  //   }
  // }

  // function renderContent(content: string) {
  //   // Define the regular expressions for file extensions and ref IDs
  //   const fileExtensionRegex = /\.\w+$/;
  //   const refIdRegex = /\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b/;

  //   // Check for file extensions (optional, you may want to handle them differently)
  //   const fileExtensions = content.match(fileExtensionRegex);
  //   if (fileExtensions) {
  //     console.log("File extensions found:", fileExtensions);
  //   }

  //   //   // Check for ref IDs
  //   const refIds = content.match(refIdRegex);
  //   if (refIds) {
  //     console.log("Ref IDs found:", refIds);
  //     // Fetch attachment data for each ref ID
  //     refIds.forEach((refId: string) => {
  //        fetchAttachmentData(refId);
  //     });
  //   }

  //   // Check for ref IDs and replace them with anchor tags
  //   const formattedContent = content.replace(refIdRegex, (refId) => {
  //     return `<a href="/path/to/attachment/${refId}" target="_blank">${refId}</a>`;
  //   });

  //   return formattedContent;
  // }

  function renderContent(content: string) {
    const fileExtensionRegex = /\.\w+$/;
    const refIdRegex =
      /\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b/;

    const fileExtensions = content.match(fileExtensionRegex);
    if (fileExtensions) {
      console.log("File extensions found:", fileExtensions);
    }

    const formattedContent = content.replace(refIdRegex, (refId) => {
      return `<a href="#" class="attachment-link" data-refid="${refId}">${refId}</a>`;
    });

    const container = document.getElementById("content-container");
    if (container) {
      container.innerHTML = formattedContent;
    }

    const links = document.querySelectorAll(".attachment-link");
    links.forEach((link) => {
      link.addEventListener("click", async (event) => {
        event.preventDefault();
        const target = event.target as HTMLElement;
        const refId = target.getAttribute("data-refid");

        if (refId) {
          console.log(`Click detected on refId: ${refId}`);

          if (target.classList.contains("downloading")) {
            console.log(`Download already in progress for refId: ${refId}`);
            return;
          }

          console.log(`Starting download for refId: ${refId}`);
          target.classList.add("downloading"); // Add a class to indicate download is in progress
          target.style.pointerEvents = "none"; // Disable the link to prevent multiple clicks

          try {
            await fetchAttachmentData(refId);
          } finally {
            console.log(`Download complete for refId: ${refId}`);
            target.classList.remove("downloading");
            target.style.pointerEvents = "auto"; // Re-enable the link
          }
        }
      });
    });

    console.log("Links have been initialized with event listeners.");

    return formattedContent;
  }

  async function fetchAttachmentData(refId: string) {
    console.log(`Fetching data for refId: ${refId}`);

    try {
      const response = await fetch(
        config.chatApiBaseUrl + `/attachments/${refId}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      console.log("Attachment data received:", data);

      // Decode base64 to binary string
      const fileData = atob(data.attachment_data);

      // Convert the binary string to a Uint8Array
      const byteArray = new Uint8Array(
        Array.from(fileData, (char) => char.charCodeAt(0))
      );

      const fileName = data.file_name;
      const fileType = data.file_type;

      console.log("File details", fileName, fileType, byteArray);

      // Create a Blob and download the file
      const blob = new Blob([byteArray], { type: fileType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to fetch attachment data:", error);
    }
  }


  
    const chatboxRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (chatboxRef.current) {
            // Only scroll if chatboxRef is not null
            chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
        }
    }, [messages]);

  return (
    <div className="main-body-wrapper-section">
      <div className="sub-wrapper-section">
        <div className="main-wrapper-chat">
          <div className="row">
            <div className="col-lg-3">
              <nav className="internalchat-nav">
                <img className="chat-logo" src={internalchat} alt="Avatar" />
                Internal Chats
              </nav>

              <div className="chat-list-container">
                {agentData
                  .filter((chat) => chat.agent_id === agent_id)
                  .map((chat, index) => (
                    <div
                      key={index}
                      className="chat-item-container"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <div
                        className="chat-main-wrapper-section"
                        onClick={() =>
                          acceptedChats[chat.metadata.session_id] &&
                          selectionofChat(chat)
                        }
                        style={{
                          flexGrow: 1,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <div className="chat-image-section">
                          <img
                            className="mediatypeprofilesmessage"
                            src={msg}
                            alt="message-logo"
                          />
                        </div>
                        <div className="naming-section">
                          <span>{chat.name.split(" ")[0]}</span> &nbsp;
                          <span>{chat.name.split(" ")[1]}</span>
                          <p className="chatmessage">
                            {chat.metadata.session_id ===
                              newarravingmessage.session_id &&
                            chatListTypingStatus
                              ? "typing..."
                              : chat.userInput.slice(0, 20)}
                          </p>
                        </div>
                        <div className="timezone-section">
                          <span>{formatTimestamp(chat.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div className="col-lg-6">
              {showChatPart && selectedChat && (
                <div>
                <div className="chat-part " >
                  <div>
                    <nav className="navbar navbar-light bg-light">
                      <div className="container-fluid">
                        <div className="chat-person">
                          <div className="chat-name">{selectedChat.name}</div>
                          <div>{selectedChat.phone}</div>
                        </div>

                        {/* <i className={`fa fa-ellipsis-v ellipsis-icon`} aria-hidden="true" onClick={toggleCloseButton}></i>
                   {showCloseButton && <button onClick={closeChat}>Close Chat</button>} */}
                        <div
                          className="close-chat-container"
                          onMouseEnter={toggleCloseButton}
                          onMouseLeave={toggleCloseButton}
                        >
                          <i
                            className={`fa fa-ellipsis-v ellipsis-icon`}
                            aria-hidden="true"
                          ></i>
                          {showCloseButton && (
                            <button
                              className="close-chat-button"
                              onClick={closeChat}
                            >
                              Close Chat
                            </button>
                          )}
                        </div>
                      </div>
                    </nav>
                  </div>
                  <div className="chatbox" ref={chatboxRef}>
                    {messages[selectedChat.metadata.session_id]?.map(
                      (item, index) => (
                        <div key={index}>
                          {item.sender === "agent" && (
                            <div className="you-section-user">
                              <div className="sender-name-user">
                                <span>
                                  {selectedChat.name} •{" "}
                                  {formatTimestampcheck(item.timestamp)}
                                </span>
                              </div>

                              <div className="agent-section">
                                {/* <p className="contentmessage">{item.content}</p> */}
                                {/* <p className="contentmessage">{renderContent(item.content)}</p> */}

                                <p
                                  className="contentmessage"
                                  dangerouslySetInnerHTML={{
                                    __html: renderContent(item.content),
                                  }}
                                ></p>
                              </div>
                            </div>
                          )}
                          {item.sender === "user" && (
                            <div className="you-section-main">
                              <div className="sender-name-agent">
                                <span>
                                  {agentName} •{" "}
                                  {formatTimestampcheck(item.timestamp)}
                                </span>
                              </div>

                              <div className="user-section">
                                <p
                                  className="contentmessage"
                                  dangerouslySetInnerHTML={{
                                    __html: renderContent(item.content),
                                  }}
                                ></p>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    )}
                    {typingStatus && (
                      <div className="agent-section">
                        <p className="contentmessage">typing...</p>

                        {/* <div className="typing-indicator">
                  <span></span>
                  <span></span>
                   <span></span>
                   </div> */}
                      </div>
                    )}
                    {/* {selectedFile && (
                        
                        <div className="selected-file-preview">
                          
                          <span>{selectedFile.name.slice(0,15)}</span>
                          <button className="remove-file-button" onClick={handleRemoveFile}>×</button>
                        </div>
                      )} */}
                    {/* <div className="chatinputbox">
                      <input
                        className="inputmessage"
                        value={message}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                        placeholder="Type your message here..."
                      ></input>
                      <div className="bottom-navbar">
                        <div className="col-lg-6">
                       
                          <label htmlFor="fileUpload" className="SendBTN">
                              <i className="fas fa-paperclip attach"></i>
                          </label>
                          <input
                              id="fileUpload"
                              type="file"
                              style={{ display: "none" }} // Hide the file input
                              onChange={handleFileChange}
                           />
                        </div>
                        <div className="col-lg-row">
                          <button onClick={handleSendClick} className="SendBTN">
                            <i className="fas fa-paper-plane send-icon"></i>
                          </button>
                        </div>
                      </div>
                     
                    </div> */}
                  </div>

                  {/* <div className="chatinputbox">
                    {selectedFiles && selectedFiles.length > 0 && (
                      <div className="selected-files-preview">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="selected-file-preview">
                            <span>{file.name.slice(0, 15)}</span>
                            <button
                              className="remove-file-button"
                              onClick={() => handleRemoveFile(index)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <input
                      className="inputmessage"
                      value={message}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyPress}
                      placeholder="Type your message here..."
                    ></input>
                    <div className="bottom-navbar">
                      <div className="col-lg-6">
                        <label htmlFor="fileUpload" className="SendBTN">
                          <i className="fas fa-paperclip attach"></i>
                        </label>
                        <input
                          id="fileUpload"
                          type="file"
                          style={{ display: "none" }} // Hide the file input
                          onChange={handleFileChange}
                          multiple
                        />
                      </div>
                      <div className="col-lg-row">
                        <button onClick={handleSendClick} className="SendBTN">
                          <i className="fas fa-paper-plane send-icon"></i>
                        </button>
                      </div>
                    </div>
                  </div> */}
                </div>
                <div className="chatinputbox" >
                    {selectedFiles && selectedFiles.length > 0 && (
                      <div className="selected-files-preview">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="selected-file-preview">
                            <span>{file.name.slice(0, 15)}</span>
                            <button
                              className="remove-file-button"
                              onClick={() => handleRemoveFile(index)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <input
                      className="inputmessage"
                      value={message}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyPress}
                      placeholder="Type your message here..."
                    ></input>
                    <div className="bottom-navbar">
                      <div className="col-lg-6">
                        <label htmlFor="fileUpload" className="SendBTN">
                          <i className="fas fa-paperclip attach"></i>
                        </label>
                        <input
                          id="fileUpload"
                          type="file"
                          style={{ display: "none" }} // Hide the file input
                          onChange={handleFileChange}
                          multiple
                        />
                      </div>
                      <div className="col-lg-row">
                        <button onClick={handleSendClick} className="SendBTN">
                          <i className="fas fa-paper-plane send-icon"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
              )}
            </div>

            <div className="col-lg-3">
              {/* <button
                className="toggle-button"
                onClick={handleGenerateLinkClick}
              >
                Click here to generate link
              </button>  */}

              <button onClick={toggleVisibility} className="toggle-button">
                {chatData.queue_name || "Queue"}
              </button>

              {(chatData.phrases as string[][]).map((phraseArray, index) => (
                <div
                  key={index}
                  className={`phrase-list ${visible ? "" : "hidden"}`}
                >
                  <ul className="phrase-list">
                    {phraseArray.map((phrase, idx) => (
                      <li
                        key={idx}
                        onClick={() => handleItemClick(phrase)}
                        className="phrase-item"
                      >
                        {phrase}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          {iframeSrc && isIframeVisible && (
            <Rnd
              size={{ width: rndSize.width, height: rndSize.height }}
              position={{ x: rndPosition.x, y: rndPosition.y }}
              onDragStop={(e, d) => setRndPosition({ x: d.x, y: d.y })}
              onResizeStop={(e, direction, ref, delta, position) => {
                setRndSize({
                  width: parseInt(ref.style.width, 10),
                  height: parseInt(ref.style.height, 10),
                });
                setRndPosition(position);
              }}
              minWidth={300}
              minHeight={200}
              bounds="window"
              className={`iframe-container ${isMinimized ? "minimized" : ""} ${
                isMaximized ? "maximized" : ""
              }`}
            >
              <div className="iframe-controls">
                <button onClick={handleMinimize}>_</button>
                <button onClick={handleMaximize}>
                  {isMaximized ? "▢" : "□"}
                </button>
                <button onClick={handleClose}>X</button>
              </div>
              <iframe
                src={iframeSrc}
                title="Generated Link"
                className="iframe-content"
              />
            </Rnd>
          )}
        </div>
      </div>
    </div>
  );
};
export default React.memo(Chat);
