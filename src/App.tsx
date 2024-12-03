import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import SideNavBar from "./components/navbar/sideNavBar";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home/home";
import Chat from "./components/chat/chat";
import Email from "./components/email/email";
import DashBoard from "./components/dashboard/dashboard";
import NavBar from "./components/navbar/navBar";
import SoftPhone from "./components/phone/softPhone/softPhone";
import { Tooltip } from "react-tooltip";
import EmailCkEditor from "./components/email-ckeditor/emaickeditor";
import { useDispatch, useSelector } from "react-redux";
import { FALSE } from "node-sass";
import config from "./config";
interface Iprops {
  history?: any;
}

const App = (props: Iprops) => {
  const [ischeckChange, setIsCheckChange] = useState<boolean>(false);

  useEffect(() => {
    console.log("The APP.tsx rendering ");
  }, []);

  const dispatch = useDispatch();
  const connected_messages: any = useSelector(
    (state: any) => state.messageFetch.connected_messages
  );
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
  const [agentData, setAgentData] = useState<DataItem[]>([]);

  const fetchAgentData = async () => {
    try {
      const response = await fetch(config.agents);
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

  useEffect(() => {
    console.log(
      "Useeffect for connected message in app.tsx",
      connected_messages["userInput"]
    );
    dispatch({
      type: "IS-NOT-MESSAGE-CHECKING",
      isSecondMessage: false,
    });

    if (connected_messages["userInput"]) {
      setIsCheckChange(true);
    }

    if (connected_messages.metadata) {
      console.log("Inside no event available");

      const sessionId = connected_messages.metadata?.session_id;
      const userInput = connected_messages["userInput"];
      console.log("second message checking :", userInput, sessionId);

      if (userInput && sessionId) {
        const newMessage = {
          sender: "agent",
          timestamp: new Date().toISOString(),
          content: userInput,
        };

        const requestBody = { session_id: sessionId, ...newMessage };
        console.log("Request Body:", requestBody); // Log request body

        // if (!isDuplicate) {
        console.log("testing .........");
        fetch(config.messagesapi, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        })
          .then((response) => {
            console.log("Inside API call in app.tsx", response);

            dispatch({
              type: "IS-SECOND-MESSAGE-CHECKING",
              isSecondMessage: true,
            });
            // fetchMessages();
            // lastMessageRef.current = newMessage;
            // console.log("lastMessageRef.current", lastMessageRef.current);

            if (!response.ok) {
              console.error("Error saving message to the database");
            } else {
              // lastMessageRef.current = newMessage;
            }
          })
          .catch((error) => {
            console.error("Error saving message to the database:", error);
          });

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
    }
  }, [connected_messages]);

  return (
    <div className="App">
      {/* <EmailCkEditor></EmailCkEditor> */}
      <NavBar />
      <SideNavBar />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route
          path="/chat"
          element={
            <Chat
              connected_messages={connected_messages}
              ischeckChange={ischeckChange}
            />
          }
        />
        <Route path="/email" element={<Email />} />
        <Route path="/softPhone" element={<SoftPhone />} />
        <Route path="/navbar" element={<NavBar />} />
      </Routes>
    </div>
  );
};

export default App;
