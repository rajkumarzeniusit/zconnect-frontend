import react, { useEffect, useRef, useState } from "react";
import "./email.scss";
import { v4 as uuidv4 } from "uuid";
import "../../scss/_custome.scss";
import Appsettings from "../../serverConfig.json";
import ApiConstants from "../../api-constants";
import { emailDataState } from "../../interface/email/email";
import axios from "axios";
import moment from "moment";
import { Tooltip } from "react-tooltip";
import Quill from "quill";
import Editor from "./emailEditor/emailEditor";
import { io } from "socket.io-client";
import EmailCustomePopup from "./emailCustomPopup/emailCustomePopUp";
// import "../../scss/_custome.scss";
import SocketService from "../../services/services";
import { useDispatch, useSelector } from "react-redux";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { useLocation } from "react-router-dom";
import React from "react";
import config from "../../config";

// import Socket
const Delta = Quill.import("delta");
const Email = () => {
  const tempEmail = {
    to_email: "itzenius@gmail.com",
    sender: "ashok.reddy@zeniust.com",
    recipien: "ashok",
    subject: "On board",
    date: new Date(),
    body: "hii welcome to the zenius",
    cc: "",
  };
  const location = useLocation();
  const [pathName, setPathName] = useState<any>();
  const [templateData, setTemplateData] = useState<any[]>([]);
  const dispatch = useDispatch();
  useEffect(() => {
    setPathName(location.pathname);
  }, [location, pathName]);
  //   {

  useEffect(() => {
    console.log("The Email.tsx rendering ");
  }, []);

  interface SendingEmails {
    toemail: string;
    ccemail: string;
    subject: string;
  }
  const [range, setRange] = useState<any>(null);

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [showSendConfirmation, setShowSendConfirmation] =
    useState<boolean>(false);
  const [lastChange, setLastChange] = useState<any>(null);
  const [readOnly, setReadOnly] = useState<boolean>(false);
  const [isReplyAllEmail, setIsReplyAllEamil] = useState<boolean>(false);
  const [isForwardEmail, setIsForwardEamil] = useState<boolean>(false);
  const [isSendNewEmail, setIsSendNewEmail] = useState<boolean>(false);
  const [newEmail, setnewEmail] = useState<boolean>(false);
  const [isSendMailModal, setIsSendMailModal] = useState<boolean>(false);
  const [isSelectedEmailTemplate, setIsSelectedEmailTemplate] =
    useState<boolean>(false);
  const [isWarningtoPopup, setIsWarningtoPopup] = useState<boolean>(false);
  const [selectedEmailTemplateData, setSelectedEmailTemplateData] =
    useState<any>();
  const [isIncomingEmailText, setIsIncomingEmailText] =
    useState<boolean>(false);
  const [incomingCount, setIncomingCount] = useState(0);
  //const [maxcount, setmaxCount] = useState(0);
  const [isSendEmailSuccess, setisSendEmailSuccess] = useState<boolean>(false);
  const [isSendEmailError, setIsSendEmailError] = useState<boolean>(false);
  const [isSendEmailProcess, setisSendEmailProcess] = useState<boolean>(true);
  const [editorKey, setEditorKey] = useState<number>(0);
  const [sendAttachments, setSendAttachments] = useState<any[]>([]);
  const [isAttachmentsForward, setIsAttachmentsForward] =
    useState<boolean>(true);
  const emailDatas: any = useSelector(
    (state: any) => state.emailFetch.emailData
  );
  // const isBody: any = useSelector(
  //   (state: any) => state.emailFetch.isBody
  // );
  const isReplyAllEmailState: any = useSelector(
    (state: any) => state.emailFetch.isReplyallEmail
  );


  console.log("isReplyEmail state in email.tsx ::", isReplyAllEmailState);
  // console.log("isBody state in email.tsx ::", isBody);


  useEffect(()=>{
    console.log(" The state newEmail is :",newEmail)

  },[newEmail])

  const iSIncomingEmailSameModule: any = useSelector(
    (state: any) => state.emailFetch.iSIncomingEmailSameModule
  );
  const isIncomingEmailForSubject: any = useSelector(
    (state: any) => state.emailFetch.isIncomingEmail
  );
  console.log(
    "Inside isIncomingEmailForSubject in email.tsx",
    isIncomingEmailForSubject
  );
  const iSIncomingEmailAnswer: any = useSelector(
    (state: any) => state.emailFetch.iSIncomingEmailAnswer
  );
  console.log("getting data from userreducer", emailDatas);


  // Use a ref to access the quill instance directly
  const SOCKET_SERVER_URL = config.socketurl;//"http://localhost:8000";
  const quillRef = useRef<Quill | null>(null);
  const [emailData, setEmailData] = useState<any>({
    sender: "",
    recipient: "",
    to_email: "",
    cc_email: "",
    subject: "",
    date: "",
    body: "",
    attachments: [],
  });
  console.log("email.....",emailData)

  const userId = "itzenius@gmail.com";
  interface DataModel {
    message_id: string;
    session_id: string;
    sender: string;
    recipient: string;
    cc: string | null;
    subject: string;
    date: string;
    body: string;
    attachments: { filepath: string; cid: string | null }[]; // Adjust type as per actual structure
    direction:string
    
  }

  const [redisData, setRedisData] = useState<DataModel[]>([]);
  const [historyData, sethistoryData] = useState<DataModel[]>([]);
  const [showCloseButton, setShowCloseButton] = useState(false);
  const [iscount, setiscount] = useState<boolean>(false);
  console.log("redis_data is",redisData)
  const [status,setstatus]=useState<string[]>([]);
  const [quill, setquill] = useState<boolean>(false);
  const [name, setName] = useState('');
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);
  //for status
  // useEffect(()=>{
  //   console.log("redisdata for nav bar is",redisData)
  //   const countIncomingMessages = () => {
  //     const count = redisData.filter(obj => obj.direction === 'incoming').length;
  //     setIncomingCount(count);
  //   };
  // countIncomingMessages();
  // dispatch({
  //   type: "MAX-Count",
  //   maxcount: incomingCount,
  // });

  // },[redisData])
  useEffect(() => {
    const countIncomingMessages = () => {
      //console.log("redisdata for nav bar is", redisData);
      const count = redisData.filter(obj => obj.direction === 'incoming').length;
      setIncomingCount(count);
      dispatch({
        type: "MAX-Count",
        maxcount: count,
      });
    };
  
    // Call the function every 1 second (1000ms)
    const interval = setInterval(() => {
      countIncomingMessages();
    }, 1000);
  
    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, [redisData,emailDatas]);  // You should include redisData in the dependency array
  


  
  console.log("count for incomming is",incomingCount)
  useEffect(()=>{
    console.log("set quill body",quill)
    setEmailData({
      sender: '',
      recipient: '',
      to_email: '',
      subject: '',
      date: '',
      body: '',
      attachments: [],
    });

  },[quill])
  const clearSearch = () => {

    
     // Clear the search input
    setIsSearchPerformed(false); // Set search performed state to false
    fetchhistory()

  


    
  };

  const fetchhistory = async () => {
    
    try {
      console.log("Started fetching email");
      const apiURL = `${Appsettings.AppSettings.WebApiBaseUrl}${ApiConstants.history}`;
      console.log("API URL for history:", apiURL);

      const response = await axios.get(apiURL);
      const historyResponse = response.data; // This is the array of stringified JSON

      console.log("history mail is", historyResponse);
      sethistoryData(historyResponse);
      setName('1111')
      console.log("nbame isss",name)
      

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
 
  const fetchEmailsByName = async () => {
    try {
      setIsSearchPerformed(true);
        // Send the name as a part of the URL
        const apiURL = `http://localhost:8000/gmail/${encodeURIComponent(name)}`;
        console.log("API URL for history:", apiURL);

        const response = await axios.get(apiURL);
        const historyResponse = response.data;
        console.log("Filtered email history by name:", historyResponse);

        sethistoryData(historyResponse);
        setName(' ')
    } catch (error) {
      setName(' ')
        console.error("Error fetching email history:", error);
    }
    
};

  //history
  useEffect(() => {
    const fetchhistory = async () => {
      try {
        console.log("Started fetching email");
        const apiURL = `${Appsettings.AppSettings.WebApiBaseUrl}${ApiConstants.history}`;
        console.log("API URL for history:", apiURL);

        const response = await axios.get(apiURL);
        const historyResponse = response.data; // This is the array of stringified JSON

        console.log("history mail is", historyResponse);
        sethistoryData(historyResponse);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchhistory(); // Call the function to make the API call
  }, [emailData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Started fetching email");
        const apiURL = `${Appsettings.AppSettings.WebApiBaseUrl}${ApiConstants.fetchEmails}`;
        console.log("API URL:", apiURL);

        const response = await axios.get(apiURL);
        const redisResponse = response.data; // This is the array of stringified JSON

        //console.log("Raw Redis Response:", redisResponse);

        // If the response is already an array, no need for JSON.parse on the outer array
        if (Array.isArray(redisResponse)) {
          // Parse each stringified JSON object inside the array
          const parsedData: DataModel[] = redisResponse.map((item: string) =>
            JSON.parse(item)
          );

          console.log("Parsed Data:", parsedData);

          // Set the parsed data to state
          setRedisData(parsedData);
        } else {
          console.log("Unexpected response format:", redisResponse);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call the function to make the API call
  }, [emailData,isSendEmailSuccess]);

  // interface DataModel {
  //   message_id: string;
  //   session_id: string;
  //   sender: string;
  //   recipient: string;
  //   cc: string | null;
  //   subject: string;
  //   date: string;
  //   body: string;
  //   attachments: { filepath: string; cid: string | null }[]; // Adjust type as per actual structure
  // }

  // const [redisData, setRedisData] = useState<DataModel[]>([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       console.log("Started fetching email");
  //       const apiURL = `${Appsettings.AppSettings.WebApiBaseUrl}${ApiConstants.fetchEmails}`;
  //       console.log("API URL:", apiURL);

  //       const response = await axios.get(apiURL);
  //       const redisResponse = response.data; // This is the array of stringified JSON

  //       console.log("Raw Redis Response:", redisResponse);

  //       // If the response is already an array, no need for JSON.parse on the outer array
  //       if (Array.isArray(redisResponse)) {
  //         // Parse each stringified JSON object inside the array
  //         const parsedData: DataModel[] = redisResponse.map((item: string) =>
  //           JSON.parse(item)
  //         );

  //         console.log("Parsed Data:", parsedData);

  //         // Set the parsed data to state
  //         setRedisData(parsedData);
  //       } else {
  //         console.log("Unexpected response format:", redisResponse);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData(); // Call the function to make the API call
  // }, []);

  // console.log("After fetching data from Redis:", redisData);

  useEffect(() => {
    console.log("new body is",emailDatas)
  
    const urlInAngleBracketsRegex = /<https?:\/\/[^<>]+>/g;
    // Replace URLs within angle brackets with [linktext:URL]
    emailDatas.body = emailDatas?.body?.replace(
      urlInAngleBracketsRegex,
      (match: any) => {
        const url = match?.slice(1, -1); // Remove the angle brackets
        return `${url}`;
      }
    );
    const standaloneUrlRegex = /(?<!\[)https?:\/\/[^\s<>\]]+(?!\])/g;

    // Replace standalone URLs with [linktext:URL]
    emailDatas.body = emailDatas?.body?.replace(
      standaloneUrlRegex,
      (match: any) => `\n[${match}]`
    );

    console.log("Modified Body:", emailDatas?.body);
    const tempBody = emailDatas?.body?.replace(/<mailto:[^>]+>/g, "");

    console.log("tempdaat in get api responces ===> 556677899344", tempBody);
    

    if (iSIncomingEmailAnswer) {
      seetingEmailInformation(emailDatas);
      console.log("we are enterig into the emails at empaty path names");
    }
    setnewEmail(false)
  }, [emailDatas, iSIncomingEmailAnswer]);
  const seetingEmailInformation = (emailDatas: any) => {
    const urlInAngleBracketsRegex = /<https?:\/\/[^<>]+>/g;
    // Replace URLs within angle brackets with [linktext:URL]
    emailDatas.body = emailDatas?.body?.replace(
      urlInAngleBracketsRegex,
      (match: any) => {
        const url = match?.slice(1, -1); // Remove the angle brackets
        return `${url}`;
      }
    );
    const standaloneUrlRegex = /(?<!\[)https?:\/\/[^\s<>\]]+(?!\])/g;

    // Replace standalone URLs with [linktext:URL]
    emailDatas.body = emailDatas?.body?.replace(
      standaloneUrlRegex,
      (match: any) => `\n[${match}]`
    );

    console.log("Modified Body:", emailDatas?.body);
    const tempBody = emailDatas?.body?.replace(/<mailto:[^>]+>/g, "");

    console.log("tempdaat in get api responces ===>", tempBody);
    

    setEmailData({
      sender: emailDatas.sender,
      recipient: emailDatas.recipient,
      to_email: emailDatas.to_email,
      subject: emailDatas.subject,
      date: emailDatas.date,
      body: tempBody,
      attachments: emailDatas?.attachments,
    });
    setEditorKey((prevKey) => prevKey + 1);
    dispatch({
      type: "CLOSE-THE-SAME-MODULE-VALUES",
      incomingEmailAnswer: false,
    });
    if (emailData !== null) {
      setIsIncomingEmailText(true);
    }
  };
  useEffect(() => {
    if (iSIncomingEmailSameModule) {
      // setEmailData({});
      seetingEmailInformation(emailDatas);
      setEditorKey((prevKey) => prevKey + 1);
      console.log("iSIncomingEmailSameModule ====> 1234567", emailDatas);
    }
  }, [iSIncomingEmailSameModule, emailDatas]);
  const [sendingEmails, setSendingEmails] = useState<any>({
    toemail: "",
    ccemail: "",
    subject: "",
  });
  const [isReplyEmail, setIsReplyEmail] = useState<boolean>(false);
  const [emails, setEmails] = useState<any>([]);
  const [notification, setNotification] = useState<string | null>(null);

  // useEffect(() => {
  //   // Connect to the socket server
  //   SocketService.connect();

  //   // Listen for new email events
  //   SocketService.onNewEmail((data: any) => {
  //     console.log("New email received:", data);
  //     setEmails((prevEmails: any) => [...prevEmails, data]);
  //   });

  //   // Cleanup on component unmount
  //   // return () => {
  //   //   SocketService.disconnect();
  //   // };
  // }, []);
  useEffect(() => {
    getEmailTemplate();
    dummyData();
  }, []);
  const Closepopup = () => {
    console.log("Inside close popup");
    setIsSendNewEmail(true);
  };
  const getEmailTemplate = () => {
    axios
      .get(config.emailtemplates)
      .then((response) => {
        console.log("emailtemplates responce api", response);
        setTemplateData(response.data);
      })
      .catch((error) => {
        console.log("error in get email templates", error);
      });
  };
  useEffect(() => {
    if (
      selectedEmailTemplateData &&
      isSelectedEmailTemplate &&
      isSendNewEmail
    ) {
      console.log("selectedEmailTemplateData", selectedEmailTemplateData);

      setEmailData({
        body: selectedEmailTemplateData,
      });
      setEditorKey((prevKey) => prevKey + 1);
      console.log("selectedEmailTemplateData ====>12345", emailData);
    }
  }, [selectedEmailTemplateData, isSelectedEmailTemplate]);

  useEffect(() => {
    // getEmails();
    // const socket = io(SOCKET_SERVER_URL);
    // Listen for 'new_email' events
    // socket.on("new_email", (data) => {
    //   setEmails((prevEmails: any) => [...prevEmails, data]);
    //   console.log("websocket generating the events ====> from fast api", data);
    // });
    // Clean up the connection when the component is unmounted
    // return () => {
    //   socket.disconnect();
    // };

    if (isReplyEmail || isForwardEmail) {
      console.log("checking email data in reply all", emailData);
      setSendingEmails({ subject: emailData?.subject });
      console.log("sendingEmails after:", sendingEmails);
    }
  }, [isReplyEmail, isForwardEmail]);

  const dummyData = () => {
    let body =
      "HI,Iam sedinghsdcvhjsdhjsdhjkwdfhjkwsdvhjksdcvhjkwsdcbhjksdchjskdcb.Thanks & Regards,ASHOK REDDY YATHAM[http://localhost:8037/images/image001.png]M: +919182302894 ashok.reddy@zeniusit.com<mailto:ashok.reddy@zeniusit.com> www.zeniusit.com <http://www.zeniusit.com/>";

    // Define the regular expression pattern to match URLs within <>
    // const urlInAngleBracketsRegex = /<https?:\/\/[^<>]+>/g;

    // // Replace URLs within angle brackets with [linktext:URL]
    // body = body.replace(urlInAngleBracketsRegex, (match) => {
    //   const url = match.slice(1, -1); // Remove the angle brackets
    //   return `[linktext:${url}]`;
    // });

    // Define the regular expression pattern to match standalone URLs
    // const standaloneUrlRegex = /(?<!\[)https?:\/\/[^\s<>\]]+(?!\])/g;
    const urlInAngleBracketsRegex = /<https?:\/\/[^<>]+>/g;

    // Replace URLs within angle brackets with [linktext:URL]
    body = body.replace(urlInAngleBracketsRegex, (match: any) => {
      const url = match.slice(1, -1); // Remove the angle brackets
      return `${url}`;
    });
    const standaloneUrlRegex = /(?<!\[)https?:\/\/[^\s<>\]]+(?!\])/g;

    // Replace standalone URLs with [linktext:URL]
    body = body.replace(standaloneUrlRegex, (match: any) => `\n[${match}]`);

    console.log("Modified Body:", body);
    //
    // let mergedBody = response.data.body;

    // Loop through the URL and text pairs
    // matches.forEach((pair) => {
    //   const urlRegex = new RegExp(`\\[${pair.text}\\][${pair.url}]`);
    //   // Replace the placeholder with the actual URL and text
    //   mergedBody = mergedBody.replace(
    //     urlRegex,
    //     `${pair.text}[${pair.url}]`
    //   );
    // });
    // console.log("mergedBody in get api responces ===>", mergedBody);
    const tempBody = body.replace(/<mailto:[^>]+>/g, "");
    // .replace(/\s*www\.zeniusit\.com/g, "");
    // .replace(/<[^>]*>/g, "");
    // .replace(/\r\n/g, "\n");

    console.log("tempdaat ashok reddy 1435656555===>", tempBody);
  };
  const getEmails = () => {
    axios
      .get(Appsettings.AppSettings.WebApiBaseUrl + ApiConstants.getEmail)
      .then((response) => {
        // const filteredBody = processEmailBody(response.data.body);
        // console.log("filteredBody ====>", filteredBody);
        let body =
          "HI,Iam sedinghsdcvhjsdhjsdhjkwdfhjkwsdvhjksdcvhjkwsdcbhjksdchjskdcb.Thanks & Regards,ASHOK REDDY YATHAM[http://localhost:8037/images/image001.png]M: +919182302894ashok.reddy@zeniusit.com<mailto:ashok.reddy@zeniusit.com>www.zeniusit.com<http://www.zeniusit.com/>";

        // Define the regular expression pattern to match URLs within <>
        // const urlInAngleBracketsRegex = /<https?:\/\/[^<>]+>/g;

        // // Replace URLs within angle brackets with [linktext:URL]
        // body = body.replace(urlInAngleBracketsRegex, (match) => {
        //   const url = match.slice(1, -1); // Remove the angle brackets
        //   return `[linktext:${url}]`;
        // });

        // Define the regular expression pattern to match standalone URLs
        // const standaloneUrlRegex = /(?<!\[)https?:\/\/[^\s<>\]]+(?!\])/g;
        const urlInAngleBracketsRegex = /<https?:\/\/[^<>]+>/g;

        // Replace URLs within angle brackets with [linktext:URL]
        response.data.body = response.data.body.replace(
          urlInAngleBracketsRegex,
          (match: any) => {
            const url = match.slice(1, -1); // Remove the angle brackets
            return `${url}`;
          }
        );
        const standaloneUrlRegex = /(?<!\[)https?:\/\/[^\s<>\]]+(?!\])/g;

        // Replace standalone URLs with [linktext:URL]
        response.data.body = response.data.body.replace(
          standaloneUrlRegex,
          (match: any) => `\n[${match}]`
        );

        console.log("Modified Body:", body);
        //
        // let mergedBody = response.data.body;

        // Loop through the URL and text pairs
        // matches.forEach((pair) => {
        //   const urlRegex = new RegExp(`\\[${pair.text}\\][${pair.url}]`);
        //   // Replace the placeholder with the actual URL and text
        //   mergedBody = mergedBody.replace(
        //     urlRegex,
        //     `${pair.text}[${pair.url}]`
        //   );
        // });
        // console.log("mergedBody in get api responces ===>", mergedBody);
        const tempBody = response.data.body.replace(/<mailto:[^>]+>/g, "");
        // .replace(/\s*www\.zeniusit\.com/g, "");
        // .replace(/<[^>]*>/g, "");
        // .replace(/\r\n/g, "\n");

        console.log("tempdaat in get api responces ===>", tempBody);
        // setEmailData({
        //   sender: response.data.sender,
        //   recipient: response.data.recipient,
        //   to_email: response.data.to_email,
        //   subject: response.data.subject,
        //   date: response.data.date,
        //   body: tempBody,
        //   attachments: response.data.attachments,
        // });
      })
      .catch((error) => {
        console.log("error in email get api", error);
      });
  };
  const processEmailBody = (body: string) => {
    const lines = body.split(/\r?\n/);
    return lines
      .map((line) =>
        line
          .replace(/mailto:/g, "")
          // .replace(/<[^>]*>/g, "")
          .trim()
      )
      .filter((line) => line !== "");
  };
  console.log("quillRef.current?", quillRef.current?.getContents());
  let Emaildatasubject = "";
  const replyEmail = () => {
    if (emailData?.subject.startsWith("RE:")) {
      Emaildatasubject = emailData?.subject.slice(3).trim();
      console.log("Email subject of trim ::", Emaildatasubject);
    }
    setIsForwardEamil(false);
    setIsReplyEmail(true);
    dispatch({
      type: "READONLY",
      readonly: false,
    });
    setIsAttachmentsForward(false);
  };
  const replyAllEmail = () => {
    setIsReplyAllEamil(true);

    console.log("Inside replyallemail ", isReplyAllEmail);
    dispatch({
      type: "REPLYALLEMAIL",
      isReplyallEmail: true,
    });
    dispatch({
      type: "READONLY",
      readonly: false,
    });
    setIsReplyEmail(false);
    setIsAttachmentsForward(false);
    setIsForwardEamil(false);
  };
  const forwardEmail = () => {
    setIsForwardEamil(true);
    console.log("isforward email state in forwardEmail ::", isForwardEmail);
    setIsReplyEmail(false);

    dispatch({
      type: "REPLYALLEMAIL",
      isReplyallEmail: false,
    });
    dispatch({
      type: "READONLY",
      readonly: false,
    });
    setIsAttachmentsForward(true);
  };

  useEffect(() => {
    console.log("isforward email state is ::", isForwardEmail);
  }, [isForwardEmail]);
  const deleteReplyMail = () => {
    setIsReplyEmail(false);
    setIsForwardEamil(false);
    // setIsReplyAllEamil(false);
    dispatch({
      type: "REPLYALLEMAIL",
      isReplyEmail: false,
    });
    dispatch({
      type: "READONLY",
      readonly: true,
    });

    setIsSendNewEmail(false);
    setIsAttachmentsForward(true);
    setSendAttachments([]);
    setEmailData({
      sender: '',
      recipient: '',
      to_email: '',
      subject: '',
      date: '',
      body: '',
      attachments: [],
    });
  };

  const sendingEmailEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("e.target.value in sendingEmailEvent ", e.target.value);
    console.log("sendingEmails in sendingEmailEvent", sendingEmails);
    setSendingEmails({ ...sendingEmails, [e.target.name]: e.target.value });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log("pressed enter");
      e.preventDefault(); // Prevent the default behavior
      const newValue = `${e.currentTarget.value},`;
      console.log("newValue", newValue);
      setSendingEmails({ ...sendingEmails, [e.currentTarget.name]: newValue });
    }
  };
  const objects: any = [
    { insert: "welcome to the ashok reddy\n\n" },
    {
      insert: {
        image:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAB4AA…5dPmrD3xwyI1s165d5f8BwxnTYFEtVZ0AAAAASUVORK5CYII=",
      },
    },
    {
      insert:
        "\n\nHii,\ngd mrng frnds.\n\n\n\n\nThanks & Regards,\n\nASHOK…shok.reddy@zeniusit.com\n\n www.zeniusit.com\n\n\n\n\n\n\n",
    },
  ];
  // const generateCid = (index: number): string => {
  //   return `cid:${index}`;
  // };
  const generateCid = (imageData: string): string => {
    return `${imageData}`;
    // return `cid:${uuidv4()}`;
  };

  const convertDeltaToHtml = (delta: any) => {
    const converter = new QuillDeltaToHtmlConverter(delta.ops, {});
    return converter.convert();
  };

  // const concatenateInserts = (
  //   objects: any[],
  //   isSendEmailProcess: boolean
  // ): { body: string; attachments: { filepath: string; cid: null; filename: string }[] } => {
  //   const bodyParts: string[] = [];
  //   const attachments: { filepath: string; cid: null; filename: string }[] = [];
  
  //   objects.forEach((obj: any) => {
  //       if (typeof obj.insert === "string") {
  //           if (obj.attributes && obj.attributes.link) {
  //               const link = obj.attributes.link;
  //               const fileExtensions = [".pdf", ".zip", ".docx", ".xlsx", ".csv", ".txt"]; // Include .txt
  //               const isFileExtension = fileExtensions.some(extension =>
  //                   link.endsWith(extension)
  //               );
  
  //               if (isFileExtension) {
  //                   const baseUrl = "http://localhost:8037/images/";
  //                   const filename = link.split("/").pop(); // Extract filename
  
  //                   attachments.push({
  //                       filepath: `${baseUrl}${filename}`,
  //                       cid: null, // Assuming no Content-ID needed
  //                       filename: filename // Use the extracted filename
  //                   });
  //               } else {
  //                   bodyParts.push(`[OutsideLink: ${link}]`);
  //               }
  //           } else {
  //               bodyParts.push(obj.insert);
  //           }
  //       } else if (typeof obj.insert === "object" && "file" in obj.insert) {
  //           const filepath = obj.insert.file.url;
  //           const isBase64 = filepath.startsWith("data:");
  
  //           let filename = ""; // Initialize filename variable
            
  //           if (isBase64) {
  //               filename = obj.insert.file.name || "default_filename"; // Access the correct filename
  //           } else {
  //               filename = filepath.split("/").pop() || "file"; // Fallback to "file" if no filename found
  //           }
  
  //           attachments.push({
  //               filepath: filepath,
  //               cid: null, // Assuming no Content-ID needed
  //               filename: filename // Use the extracted or default filename
  //           });
  //       } else if (typeof obj.insert === "object" && "image" in obj.insert) {
  //           bodyParts.push(`[Image: ${obj.insert.image}]`);
  //       } else if (typeof obj.insert === "object" && "divider" in obj.insert) {
  //           bodyParts.push(isSendEmailProcess ? "" : "⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺\n");
  //       } else {
  //           // Handle other object types (optional)
  //       }
  //   });
  
  //   console.log("Generated file URLs:", attachments);
  
  //   // Download logic for attachments
  //   attachments.forEach((attachment) => {
  //       const { filepath, filename } = attachment;
  
  //       const link = document.createElement('a');
  //       link.href = filepath;
  //       link.download = filename; // This should prompt a download with the correct filename
  //       document.body.appendChild(link); // Append to body for Firefox
  //       link.click(); // Simulate click to trigger download
  //       document.body.removeChild(link); // Clean up
  //   });
  
  //   return { body: bodyParts.join(""), attachments };
  // };

  /////


 const concatenatesendInserts = (
    objects: any[],
    isSendEmailProcess: boolean
  ): string => {
    return objects
      .map((obj: any, index: number) => {
        if (typeof obj.insert === "string") {
          if (obj.attributes && obj.attributes.link) {
            const link = obj.attributes.link;
            const fileExtensions = [".pdf", ".zip", ".docx", ".xlsx"];
            const isFileExtension = fileExtensions.some((extension) =>
              link.endsWith(extension)
            );
            if (isFileExtension) {
              return `[File:Name: ${obj.insert}, URL: ${obj.attributes.link}]`;
            } else {
              return `[OutsideLink: ${obj.attributes.link}]`;
            }
          }
          return obj.insert;
        } else if (typeof obj.insert === "object" && "file" in obj.insert) {
          return `[File:Name:${obj.insert.file.name}, URL: ${obj.insert.file.url}]`;
        } else if (typeof obj.insert === "object" && "image" in obj.insert) {
          return `[Image: ${obj.insert.image}]`;
        } else if (typeof obj.insert === "object" && "divider" in obj.insert) {
          // Check for isSendEmailProcess and return empty string if true
          return isSendEmailProcess
            ? ""
            : "⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺\n";
        } else {
          return "";
        }
      })
      .join("");
  };
  
  

  



  /////
  
  
  



 // Function to concatenate all 'insert' values into a single string
 const concatenateInserts = (
  objects: any[],
  isSendEmailProcess: boolean
): { body: string; attachments: { filepath: string; cid: null; filename: string }[] } => {
  const bodyParts: string[] = [];
  const attachments: { filepath: string; cid: null; filename: string }[] = [];

  objects.forEach((obj: any) => {
      if (typeof obj.insert === "string") {
          if (obj.attributes && obj.attributes.link) {
              const link = obj.attributes.link;
              const fileExtensions = [".pdf", ".zip", ".docx", ".xlsx", ".csv"];
              const isFileExtension = fileExtensions.some(extension =>
                  link.endsWith(extension)
              );

              if (isFileExtension) {
                  const baseUrl = "http://localhost:8037/images/";
                  const filename = link.split("/").pop(); // Extract filename

                  attachments.push({
                      filepath: `${baseUrl}${filename}`,
                      cid: null, // Assuming no Content-ID needed
                      filename: filename // Use the extracted filename
                  });
              } else {
                  bodyParts.push(`[OutsideLink: ${link}]`);
              }
          } else {
              bodyParts.push(obj.insert);
          }
      } else if (typeof obj.insert === "object" && "file" in obj.insert) {
          const filepath = obj.insert.file.url;
          const isBase64 = filepath.startsWith("data:");

          let filename = ""; // Initialize filename variable
          
          if (isBase64) {
              // If it's a base64 data URI, try to get the filename from the file object
              filename = obj.insert.file.name || "default_filename"; // Access the correct filename
          } else {
              // For URLs, extract the filename directly from the URL
              filename = filepath.split("/").pop() || "file"; // Fallback to "file" if no filename found
          }

          attachments.push({
              filepath: filepath,
              cid: null, // Assuming no Content-ID needed
              filename: filename // Use the extracted or default filename
          });
      } else if (typeof obj.insert === "object" && "image" in obj.insert) {
          bodyParts.push(`[Image: ${obj.insert.image}]`);
      } else if (typeof obj.insert === "object" && "divider" in obj.insert) {
          bodyParts.push(isSendEmailProcess ? "" : "⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺\n");
      } else {
          // Handle other object types (optional)
      }
  });

  return { body: bodyParts.join(""), attachments };
};




  // const concatenateInserts = (
  //   objects: any[],
  //   isSendEmailProcess: boolean
  // ): { body: string; attachments: { filepath: string; cid: null; filename: string }[] } => {
  //   const bodyParts: string[] = [];
  //   const attachments: { filepath: string; cid: null; filename: string }[] = [];
  
  //   objects.forEach((obj: any, index: number) => {
  //     if (typeof obj.insert === "string") {
  //       if (obj.attributes && obj.attributes.link) {
  //         const link = obj.attributes.link;
  //         const fileExtensions = [".pdf", ".zip", ".docx", ".xlsx", ".csv"];
  //         const isFileExtension = fileExtensions.some((extension) =>
  //           link.endsWith(extension)
  //         );
  
  //         if (isFileExtension) {
  //           const baseUrl = "http://localhost:8037/images/";
  //           const filename = link.split("/").pop(); // Extract filename
  
  //           attachments.push({
  //             filepath: `${baseUrl}${filename}`,
  //             cid: null, // Assuming no Content-ID needed
  //             filename: filename // Add filename here
  //           });
  //         } else {
  //           bodyParts.push(`[OutsideLink: ${link}]`);
  //         }
  //       } else {
  //         bodyParts.push(obj.insert);
  //       }
  //     } else if (typeof obj.insert === "object" && "file" in obj.insert) {
  //       const filepath = obj.insert.file.url;
  //       const isBase64 = filepath.startsWith("data:");
  
  //       let filename = ""; // Initialize filename variable
        
  //       if (isBase64) {
  //         // If it's a base64 data URI, derive the filename based on MIME type
  //         const mimeType = filepath.split(';')[0].split(':')[1]; // Extract MIME type
  //         if (mimeType) {
  //           // Default names based on MIME type
  //           if (mimeType.includes("csv")) {
  //             filename = "data.csv";
  //           } else if (mimeType.includes("pdf")) {
  //             filename = "document.pdf";
  //           } else if (mimeType.includes("docx")) {
  //             filename = "document.docx";
  //           } else if (mimeType.includes("xlsx")) {
  //             filename = "spreadsheet.xlsx";
  //           } else {
  //             filename = "file"; // Generic filename if type is unknown
  //           }
  //         }
  //       } else {
  //         // For URLs, extract the filename directly from the URL
  //         filename = filepath.split("/").pop() || "file"; // Fallback to "file" if no filename found
  //       }
  
  //       attachments.push({
  //         filepath: filepath,
  //         cid: null, // Assuming no Content-ID needed
  //         filename: filename // Set the extracted or default filename
  //       });
  //     } else if (typeof obj.insert === "object" && "image" in obj.insert) {
  //       bodyParts.push(`[Image: ${obj.insert.image}]`);
  //     } else if (typeof obj.insert === "object" && "divider" in obj.insert) {
  //       bodyParts.push(isSendEmailProcess ? "" : "⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺\n");
  //     } else {
  //       // Handle other object types (optional)
  //     }
  //   });
  
  //   return { body: bodyParts.join(""), attachments };
  // };



  ///working
  
  
  

  // const concatenateInserts = (
  //   objects: any[],
  //   isSendEmailProcess: boolean
  // ): { body: string; attachments: { filepath: string; cid: null }[] } => {
  //   const bodyParts: string[] = [];
  //   const attachments: { filepath: string; cid: null }[] = [];
  
  //   objects.forEach((obj: any, index: number) => {
  //     if (typeof obj.insert === "string") {
  //       if (obj.attributes && obj.attributes.link) {
  //         const link = obj.attributes.link;
  //         const fileExtensions = [".pdf", ".zip", ".docx", ".xlsx"];
  //         const isFileExtension = fileExtensions.some((extension) =>
  //           link.endsWith(extension)
  //         );
  
  //         if (isFileExtension) {
  //           // Assuming a base URL for attachments (modify as needed)
  //           const baseUrl = "http://localhost:8037/images/";
  //           const filename = link.split("/").pop(); // Extract filename
  
  //           attachments.push({
  //             filepath: `${baseUrl}${filename}`,
  //             cid: null, // Assuming no Content-ID needed
  //           });
  //         } else {
  //           bodyParts.push(`[OutsideLink: ${link}]`);
  //         }
  //       } else {
  //         bodyParts.push(obj.insert);
  //       }
  //     } else if (typeof obj.insert === "object" && "file" in obj.insert) {
  //       attachments.push({
  //         filepath: obj.insert.file.url, // Use existing URL from the object
  //         cid: null, // Assuming no Content-ID needed
  //       });
  //     } else if (typeof obj.insert === "object" && "image" in obj.insert) {
  //       bodyParts.push(`[Image: ${obj.insert.image}]`);
  //     } else if (typeof obj.insert === "object" && "divider" in obj.insert) {
  //       bodyParts.push(isSendEmailProcess ? "" : "⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺\n");
  //     } else {
  //       // Handle other object types (optional)
  //     }
  //   });
  
  //   return { body: bodyParts.join(""), attachments };
  // };



  // const concatenateInserts = (
  //   objects: any[],
  //   isSendEmailProcess: boolean
  // ): { body: string; attachments: { name: string; url: string }[] } => {
  //   const bodyParts: string[] = [];
  //   const attachments: { name: string; url: string }[] = [];
  
  //   objects.forEach((obj: any, index: number) => {
  //     if (typeof obj.insert === "string") {
  //       if (obj.attributes && obj.attributes.link) {
  //         const link = obj.attributes.link;
  //         const fileExtensions = [".pdf", ".zip", ".docx", ".xlsx"];
  //         const isFileExtension = fileExtensions.some((extension) =>
  //           link.endsWith(extension)
  //         );
  
  //         if (isFileExtension) {
  //           attachments.push({ name: obj.insert, url: link });
  //         } else {
  //           bodyParts.push(`[OutsideLink: ${link}]`);
  //         }
  //       } else {
  //         bodyParts.push(obj.insert);
  //       }
  //     } else if (typeof obj.insert === "object" && "file" in obj.insert) {
  //       attachments.push({ name: obj.insert.file.name, url: obj.insert.file.url });
  //     } else if (typeof obj.insert === "object" && "image" in obj.insert) {
  //       bodyParts.push(`[Image: ${obj.insert.image}]`);
  //     } else if (typeof obj.insert === "object" && "divider" in obj.insert) {
  //       bodyParts.push(isSendEmailProcess ? "" : "⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺\n");
  //     } else {
  //       // Handle other object types (optional)
  //     }
  //   });
  
  //   return { body: bodyParts.join(""), attachments };
  // };




  // const concatenateInserts = (
  //   objects: any[],
  //   isSendEmailProcess: boolean
  // ): string => {
  //   return objects
  //     .map((obj: any, index: number) => {
  //       if (typeof obj.insert === "string") {
  //         if (obj.attributes && obj.attributes.link) {
  //           const link = obj.attributes.link;
  //           const fileExtensions = [".pdf", ".zip", ".docx", ".xlsx"];
  //           const isFileExtension = fileExtensions.some((extension) =>
  //             link.endsWith(extension)
  //           );
  //           if (isFileExtension) {
  //             return `[File:Name: ${obj.insert}, URL: ${obj.attributes.link}]`;
  //           } else {
  //             return `[OutsideLink: ${obj.attributes.link}]`;
  //           }
  //         }
  //         return obj.insert;
  //       } else if (typeof obj.insert === "object" && "file" in obj.insert) {
  //         return `[File:Name:${obj.insert.file.name}, URL: ${obj.insert.file.url}]`;
  //       } else if (typeof obj.insert === "object" && "image" in obj.insert) {
  //         return `[Image: ${obj.insert.image}]`;
  //       } else if (typeof obj.insert === "object" && "divider" in obj.insert) {
  //         // Check for isSendEmailProcess and return empty string if true
  //         return isSendEmailProcess
  //           ? ""
  //           : "⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺\n";
  //       } else {
  //         return "";
  //       }
  //     })
  //     .join("");
  // };





  /////
  const concatenateInsertsForward = (
    objects: any[],
    attachments: any[]
  ): { body: string; attachments: { filepath: string; cid: null; filename: string }[] } => {
    const bodyParts: string[] = [];
    const formattedAttachments: { filepath: string; cid: null; filename: string }[] = [];
 
    const fileExtensions = [".pdf", ".zip", ".docx", ".xlsx"];
 
    objects.forEach((obj: any) => {
      if (typeof obj.insert === "string") {
        console.log("object in far is",obj.insert)
        if (obj.attributes && obj.attributes.link) {
          const link = obj.attributes.link;
          const isFileExtension = fileExtensions.some((extension) => link.endsWith(extension));
 
          if (isFileExtension) {
            console.log("Full object: ", obj);
            // Handle links with file extensions, storing them as URLs
            bodyParts.push(`[File: Name: ${obj.insert}, URL: ${obj.attributes.link}]`);
          } else {
            // Handle links without file extensions, storing them as outside links
            bodyParts.push(`[OutsideLink: ${obj.attributes.link}]`);
          }
        } else {
          bodyParts.push(obj.insert);
        }
      } else if (typeof obj.insert === "object" && "file" in obj.insert) {
        // Handle file objects, adding them to the attachments array
        const filename = obj.insert.file.name || "default_filename";
        const filepath = obj.insert.file.url;
 
        formattedAttachments.push({
          filepath: filepath,
          cid: null, // Assuming no Content-ID needed
          filename: filename // Use the extracted or default filename
        });
 
        // Optionally include in the body if desired
        bodyParts.push(`[File: Name: ${filename}, URL: ${filepath}]`);
      } else if (typeof obj.insert === "object" && "image" in obj.insert) {
        bodyParts.push(`[Image: ${obj.insert.image}]`);
      } else if (typeof obj.insert === "object" && "divider" in obj.insert) {
        bodyParts.push("⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺\n");
      }
    });
 
    // Include the original attachments passed as a parameter
    attachments.forEach((attachment: any) => {
      formattedAttachments.push({
        filepath: attachment.filepath,
        cid: null, // Assuming no Content-ID needed
        filename: attachment.filename //attachment.filepath.split("/").pop() // Use the filename from the filepath
      });
 
      // Optionally include these in the body as well
      bodyParts.push(`[Attached File: ${attachment.filepath.split("/").pop()}]`);
    });
 
    return { body: bodyParts.join(""), attachments: formattedAttachments };
  };

  
  ////

  // const concatenateInsertsForward = (
  //   objects: any[],
  //   attachments: any[]
  // ): string => {
  //   const fileExtensions = [".pdf", ".zip", ".docx", ".xlsx"];

  //   const formattedObjects = objects
  //     .map((obj: any) => {
  //       if (typeof obj.insert === "string") {
  //         if (obj.attributes && obj.attributes.link) {
  //           const link = obj.attributes.link;
  //           const isFileExtension = fileExtensions.some((extension) =>
  //             link.endsWith(extension)
  //           );

  //           if (isFileExtension) {
  //             // Handle links with file extensions, storing them as URLs
  //             return `[File:Name: ${obj.insert}, URL: ${obj.attributes.link}]`;
  //           } else {
  //             // Handle links without file extensions, storing them as outside links
  //             return `[OutsideLink: ${obj.attributes.link}]`;
  //           }
  //         }
  //         return obj.insert;
  //       } else if (typeof obj.insert === "object" && "file" in obj.insert) {
  //         // Handle file objects, converting them to a string representation
  //         return `[File:Name:${obj.insert.file.name}, URL: ${obj.insert.file.url}]`;
  //       } else if (typeof obj.insert === "object" && "image" in obj.insert) {
  //         // Handle image objects, converting them to a string representation
  //         return `[Image: ${obj.insert.image}]`;
  //       } else if (typeof obj.insert === "object" && "divider" in obj.insert) {
  //         return "⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺⸺\n";
  //       } else {
  //         return "";
  //       }
  //     })
  //     .join("");

  //   const formattedAttachments = attachments
  //     .map(
  //       (attachment: any) =>
  //         `[File:Name: ${attachment.filepath.split("/").pop()}, URL: ${
  //           attachment.filepath
  //         }]`
  //     )
  //     .join("");

  //   return formattedObjects + formattedAttachments;
  // };

////original

  //
  // useEffect(() => {
  //   const concatenatedString = concatenateInserts(objects);
  //   const dummytemp = {
  //     temdata: concatenatedString,
  //   };
  //   console.log("concatenatedString ======>", dummytemp);
  // }, []);

  const sendAnyWay = async (forceSend: any) => {
    console.log("Setting states...");

    // Set the state to show confirmation
    setisSendEmailProcess(true);

    dispatch({
      type: "EMAILPROCESS",
      isSendEmailProcess: true,
    });

    setShowSendConfirmation(false);
    setisSendEmailSuccess(false);

    // Log states immediately after setting
    console.log("States after setting:");
    console.log("isSendEmailProcess:", isSendEmailProcess);
    console.log("ShowSendConfirmation:", showSendConfirmation);
    console.log("isSendEmailSuccess:", isSendEmailSuccess);

    // Wait for state updates to be processed
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Log states after waiting
    console.log("States after waiting:");
    console.log("isSendEmailProcess:", isSendEmailProcess);
    console.log("ShowSendConfirmation:", showSendConfirmation);
    console.log("isSendEmailSuccess:", isSendEmailSuccess);

    // Call sendPostEmail after state updates
    console.log("Calling sendPostEmail...");
    await sendPostEmail(forceSend);
  };

  const sendPostEmail = async (forceSend = false) => {
    console.log("Inside sendPostEmail function");
    dispatch({
      type: "EMAILPROCESS",
      isSendEmailProcess: true,
    });
    setIsSendEmailError(false);
    console.log("Inside send post email toemail ::", sendingEmails.toemail);
    console.log("Inside send post email ccemail ::", sendingEmails.ccemail);
    if (!sendingEmails.toemail && !sendingEmails.ccemail) {
      console.log("No to available ");
      dispatch({
        type: "TONOTAVAILABLE",
        isTonotavailable: true,
        isSendEmailProcess: false,
      });

      setIsSendEmailError(false);
      return;
    } else if (!sendingEmails.subject && !forceSend) {
      console.log("There is no subject, so we are displaying popup");
      setShowSendConfirmation(true);
      setIsSendEmailError(false);
      dispatch({
        type: "EMAILPROCESS",
        isSendEmailProcess: false,
        isTonotavailable: false,
      });
      setisSendEmailSuccess(false);
      return;
    }

    try {
      // Prepare the email payload
      const dummy = quillRef.current?.getContents();
      const ops = dummy?.ops || [];
      //const concatenatedString = concatenateInserts(ops, isSendEmailProcess);
      const sendconcatenatedString = concatenatesendInserts(dummy?.ops || [], isSendEmailProcess);
      console.log("Concatenated String:", sendconcatenatedString); // Add logging to check the result
      // const sendemailBody = sendconcatenatedString.body;
      // const sendemailAttachments = sendconcatenatedString.attachments;
      const concatenatedString = concatenateInserts(dummy?.ops || [], isSendEmailProcess);
      const emailBody = concatenatedString.body;
      const emailAttachments = concatenatedString.attachments;
      // const concatenatedStringForward = concatenateInsertsForward(
      //     ops,
      //     emailData?.attachments
      //   );
      
    

   


      setIsSendMailModal(true);

      const htmlWithInlineStyles = convertDeltaToHtml(dummy);

      console.log("htmlWithInlineStyles ====>", htmlWithInlineStyles);
      console.log("concatenatedString ======>", concatenatedString);
      

      let sessionId;
      let messageid;

      if (iSIncomingEmailSameModule) {
        sessionId = emailData.session_id;
      } else {
        sessionId = uuidv4();
      }

      if (iSIncomingEmailSameModule) {
        messageid = emailData.messageid;
      } else {
        messageid = userId;
      }

      let sendEmailPayload = {};
      console.log("Email Data:", emailDatas);

      // if (isSendNewEmail) {
      //   console.log("enterd send email")
        
      //   sendEmailPayload = {
      //     message_id: messageid,
      //     to_email: sendingEmails.toemail,
      //     cc: sendingEmails.ccemail,
      //     sender: userId,
      //     recipient: sendingEmails.toemail,
      //     attachments:sendconcatenatedString,//emailDatas?.attachments,
      //     session_id: sessionId,
      //     subject: forceSend ? "" : sendingEmails.subject,
      //     date: new Date(),
      //     body: sendconcatenatedString,
      //   };

      //   console.log("Sending email with payload:", sendEmailPayload);
      //   await replayEmail(sendEmailPayload); // Await API call
      // }

      // else
       if (isReplyEmail || isSendNewEmail) {
        console.log("enterd send email")
        
        sendEmailPayload = {
          message_id: messageid,
          to_email: sendingEmails.toemail,
          cc: sendingEmails.ccemail,
          sender: userId,
          recipient: sendingEmails.toemail,
          attachments:emailAttachments,// emailDatas?.attachments,
          session_id: sessionId,
          subject: forceSend ? "" : sendingEmails.subject,
          date: new Date(),
          body: emailBody//concatenatedString,
        };

        console.log("Sending email with payload:", sendEmailPayload);
        await replayEmail(sendEmailPayload); // Await API call
      } else if (isReplyAllEmailState) {
        console.log("reply all object", sendingEmails);
        sendEmailPayload = {
          message_id: messageid,
          to_email: sendingEmails.toemail,
          cc: sendingEmails.ccemail,
          recipient: sendingEmails.toemail,
          sender: userId,
          attachments: emailAttachments,//isReplyAllEmailState?.attchments,
          session_id: sessionId,
          subject: forceSend ? "" : sendingEmails.subject,
          date: new Date(),
          body: emailBody,//concatenatedString,
        };
        console.log("Replying to new all with payload:", sendEmailPayload);
        await replyAllEmailMethod(sendEmailPayload); // Await API call
      } else if (isForwardEmail) {
        // const concatenatedStringForward = concatenateInsertsForward(
        //   ops,
        //   emailData?.attachments
        // );
        console.log("far attch",emailData?.attachments)
        const concatenatedStringForward = concatenateInsertsForward(
          ops,
          emailData?.attachments
        );
        console.log(
          "forfarwardaaaaa:",
          concatenatedStringForward.attachments
        );
        console.log(
          "forfarwardbbbbb:",
          concatenatedStringForward.body
        );
          // Regular expression to match various patterns
          let updatedBody = concatenatedStringForward.body.replace(/\[Attached[^\]]*\]|\[File: Name: [^\]]+, URL: [^\]]+\]|\[Attached File: [^\]]+\]/g, '');

          // Update the body with the modified content
          concatenatedStringForward.body = updatedBody;

          // Log the modified body content
          console.log("After modification:", concatenatedStringForward.body);


        sendEmailPayload = {
          message_id: messageid,
          to_email: [sendingEmails.toemail],
          cc: sendingEmails.ccemail,
          recipient: sendingEmails.toemail,
          sender: userId,
          attachments: concatenatedStringForward.attachments ,//isReplyAllEmailState?.attchments,
          session_id: sessionId,
          subject: forceSend ? "" : sendingEmails.subject,
          date: new Date(),
          body: concatenatedStringForward.body,
        };
        console.log("farward mail object", sendEmailPayload);
        await forwardEmailMethod(sendEmailPayload); // Await API call
      }

      dispatch({
        type: "EMAILPROCESS",
        isSendEmailProcess: false,
      });
    } catch (error) {
      console.error("Error sending email:", error);
      setIsSendEmailError(true);
      setisSendEmailSuccess(false);
    }
  };
  const replayEmail = async (sendEmailPayload: any) => {
    console.log("Inside replayEmail subject check::", sendingEmails.subject);
    console.log("Checking the body before ", sendEmailPayload.body);
    console.log("Checking the body before sending the API", sendEmailPayload);
    try {
      const response = await axios.post(
        `${Appsettings.AppSettings.WebApiBaseUrl}${ApiConstants.storeRep}`,
        sendEmailPayload
      );
      // const response = await axios.post(
      //   Appsettings.AppSettings.WebApiBaseUrl + ApiConstants.storeEmails,
      //   sendEmailPayload
      // );
      

      if (response.status === 200) {
        console.log("Email sent successfully:", response);
        setisSendEmailSuccess(true);

        dispatch({
          type: "EMAILPROCESS",
          isSendEmailProcess: false,
        });
        setShowSendConfirmation(false);
        handleEmailClick(sendEmailPayload)
       
        
        
      } else {
        dispatch({
          type: "EMAILPROCESS",
          isSendEmailProcess: false,
        });
        // setIsSendEmailError(true);
        console.error("Error sending email:");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      // setIsSendEmailError(true);
    }
  };

  const replyAllEmailMethod = async (sendEmailPayload: any) => {
    try {
      console.log("reply all before sending", sendEmailPayload);
      const response = await axios.post(
        Appsettings.AppSettings.WebApiBaseUrl + ApiConstants.storerepall,
        sendEmailPayload
      );
      console.log("Reply all email sent successfully:", response);
      // setIsReplyAllEamil(false);
      dispatch({
        type: "REPLYALLEMAIL",
        isReplyEmail: false,
      });
      setisSendEmailSuccess(true);
      setisSendEmailProcess(false);
      handleEmailClick(sendEmailPayload)
      
    } catch (error) {
      console.error("Error Reply all email:", error);
    }
  };
  const getToEmailValue = () => {
    if (isReplyAllEmailState && !isReplyEmail) {
      const filteredRecipients = emailData?.recipient
        .split(",")
        .filter((email: string) => !email.includes(userId)) // Filter out the specific email
        .map((email: string) => {
          // Check if \r\n\t exists and remove them
          if (/[\r\n\t]+/.test(email)) {
            console.log(`Special characters found in: ${email}`);
            return email.replace(/[\r\n\t]+/g, "").trim();
          }
          return email.trim();
        });

      return [emailData?.sender, ...filteredRecipients].join(", ") || "";

      // return (
      //   [emailData?.sender, ...emailData?.recipient.split(",").slice(1)].join(
      //     ", "
      //   ) || ""
      // );
    } else if (isReplyEmail && !isReplyAllEmailState) {
      return emailData?.sender || "";
    } else if (!isReplyEmail && !isReplyAllEmailState && isForwardEmail) {
      return "";
    } else {
      return sendingEmails.toemail;
    }
  };

  const getCcEmailValue = (): string => {
    if (isReplyEmail) {
      return "";
    } else if (!isReplyEmail && isReplyAllEmailState) {
      console.log(
        "Inside else if so cc should print for reply all ",
        sendingEmails
      );
      const ccEmail = emailDatas?.cc_email || ""; // below one is duplicet
     // const ccEmail = emailDatas?.cc_email || emailData.cc;
      const filteredCCEmails = ccEmail
        .split(",")
        .filter((email: string) => !email.includes(userId)) // Remove all instances of 'itzenius@gmail.com'
        .map((email: string) => {
          // Check if \r\n\t exists and remove them
          if (/[\r\n\t]+/.test(email)) {
            console.log(`Special characters found in: ${email}`);
            return email.replace(/[\r\n\t]+/g, "").trim();
          }
          return email.trim();
        }); // Trim any extra spaces around the emails

      return filteredCCEmails.join(", ") || "";
      //return emailDatas.cc_email;
    } else if (!isReplyEmail && !isReplyAllEmailState && !isForwardEmail) {
      console.log(
        "Inside else if so cc should print for reply all ",
        sendingEmails
      );
      return "";
    } else {
      return sendingEmails.ccemail;
    }
  };

  const getSubjectValue = (): string => {
    if (isForwardEmail) {
      return ""; // Clear subject when forwarding email
    } else if (isSendNewEmail) {
      return ""; // Clear subject when sending a new email
    } else {
      return emailData?.subject || sendingEmails.subject;
    }
  };

  const forwardEmailMethod = async (sendEmailPayload: any) => {
    try {
      console.log("body before forwarding", sendEmailPayload);
      const response = await axios.post(
        Appsettings.AppSettings.WebApiBaseUrl + ApiConstants.storefar,
        sendEmailPayload
      );
      console.log("Email forwarded successfully:", response);
      setIsForwardEamil(false);
      setisSendEmailSuccess(true);
      // setisSendEmailSuccess(true);
      setisSendEmailProcess(false);
    } catch (error) {
      console.error("Error forwarded  email:", error);
    }
  };

  const sendNewEmail = () => {
    // setIsReplyEmail(true);
    setIsSendNewEmail(true);
    setSendingEmails({});
    setEmailData({});
    dispatch({
      type: "READONLY",
      readonly: false,
    });
  };
  const downloadAttachmentsFilesrep = (filepath: string) => {
    const dataUrl=filepath
    const byteString = atob(dataUrl.split(',')[1]);
    const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
  
    // Create a Blob from the ArrayBuffer
    const blob = new Blob([ab], { type: mimeString });
    
    // Create a link element and trigger the download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'download.txt'; // Set the default download filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  
    // Revoke the Object URL after the download
    URL.revokeObjectURL(link.href);
  };
  
  const downloadAttachmentsFiles = (filepath: any) => {
    const newWindow = window.open(filepath, "_blank");
    if (newWindow) {
      newWindow.onload = () => {
        const link = newWindow.document.createElement("a");
        link.href = filepath;
        link.download = filepath.split("/").pop() || "download";
        newWindow.document.body.appendChild(link);
        link.click();
        newWindow.close();
      };
    }
  };
  const downloadFileFromDataUrl = (dataUrl: string,setfilename :string) => {
    // Extract the MIME type and Base64 data from the data URL
    const regex = /^data:(.*?);base64,(.*)$/;
    const matches = dataUrl.match(regex);
    
    if (!matches) {
      console.error("Invalid data URL format");
      return;
    }
  
    const mimeType = matches[1]; // The MIME type
    const base64Data = matches[2]; // The Base64 data
  
    // Determine the file extension based on the MIME type
    let fileExtension = '';
    switch (mimeType) {
      case 'text/csv':
        fileExtension = 'csv';
        break;
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': // Excel
        fileExtension = 'xlsx';
        break;
      case 'application/pdf':
        fileExtension = 'pdf';
        break;
      case 'image/png':
        fileExtension = 'png';
        break;
      case 'image/jpeg':
        fileExtension = 'jpg';
        break;
      
      // Add more MIME types and extensions as needed
      default:
        fileExtension = 'txt'; // Default file type if unknown
    }
  
    // Set the filename with the correct extension
    // const filename = `downloaded_file.${fileExtension}`;
    const filename = `${setfilename}.${fileExtension}`;
  
    console.log("base64Data", base64Data);
    console.log("filename", filename);
    console.log("mimeType", mimeType);
  
    // Call the downloadFile function with the extracted values
    downloadFile(filename, base64Data, mimeType);
  };
  
  const downloadFile = (filename: string, base64Data: string, mimeType: string) => {
    const link = document.createElement('a');
    link.href = `data:${mimeType};base64,${base64Data}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Cleanup
  };
  
 
  
  // const downloadFileFromDataUrl = (dataUrl: string) => {
  //   // Extract the MIME type and Base64 data from the data URL
  //   const regex = /^data:(.*?);base64,(.*)$/;
  //   const matches = dataUrl.match(regex);
    
  //   if (!matches) {
  //     console.error("Invalid data URL format");
  //     return;
  //   }
  
  //   const mimeType = matches[1]; // The MIME type
  //   const base64Data = matches[2]; // The Base64 data
  
  //   // Extract filename from the data URL (you can modify this according to your needs)
  //   const filename = "downloaded_file.csv"; // Set a default filename or extract it dynamically
  
  //   console.log("base64Data", base64Data);
  //   console.log("filename", filename);
  //   console.log("mimeType", mimeType);
  
  //   // Now call the downloadFile function with the extracted values
  //   downloadFile(filename, base64Data, mimeType);
  // };
  
  // const downloadFile = (filename: string, base64Data: string, mimeType: string) => {
  //   const link = document.createElement('a');
  //   link.href = `data:${mimeType};base64,${base64Data}`;
  //   link.download = filename;
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link); // Cleanup
  // };

  const renderFileTypeIcon = (filepath: any) => {
    const fileType = getFileType(filepath);
    switch (fileType) {
      case "pdf":
        return <i className="fa-solid fa-file-pdf fdf-file-color"></i>;
      // <i className="fa-solid fa-file-pdf fdf-file-color"></i>
      case "excel":
        return <i className="fa-solid fa-file-excel excel-icon-color"></i>;
      // <i className="fa-regular fa-file-excel excel-icon-color"></i>;
      case "word":
        return <i className="fa-solid fa-file-word word-icon-color"></i>;
      // default:
      //   return <img src="/path/to/unknown-icon.png" alt="File" />;
    }
  };
  const getFileType = (filepath: any) => {
    if (!filepath || typeof filepath !== 'string') {
      // If filepath is undefined, null, or not a string, return 'unknown'
      return 'unknown';
    }
    const extension = filepath.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return "pdf";
      case "xlsx":
      case "xls":
        return "excel";
      case "doc":
      case "docx":
        return "word";
      default:
        return "unknown";
    }
  };
  const formatFileName = (filepath: any) => {
    const maxLength = 30;
    if (!filepath || typeof filepath !== 'string') {
      return 'unknown_filename';  // Fallback value if filepath is undefined or invalid
    }
    
    const fileName =
      filepath.replace("http://localhost:8037/images/", "").split("/").pop() ||
      "";
    if (fileName.length > maxLength) {
      return fileName.substring(0, maxLength) + "...";
    }
    return fileName;
  };
  const successEmailPopUp = () => {
    setIsReplyEmail(false);
    setIsSendNewEmail(false);
    setisSendEmailSuccess(false);
    setSendAttachments([]);
  };
  const ClosingEmailPopUp = () => {
    setIsSendEmailError(false);
    setisSendEmailSuccess(false);
  };
  useEffect(() => {
    setSendingEmails((prevState: SendingEmails) => ({
      ...prevState,
      toemail: getToEmailValue(),
      ccemail: getCcEmailValue(),
      subject: getSubjectValue(),
    }));
  }, [
    isReplyEmail,
    isReplyAllEmailState,
    isForwardEmail,
    isSendNewEmail,
    emailData,
  ]);
  const CloseEmailpopup = () => {
    console.log("Inside CloseEmailpopup");
    setShowSendConfirmation(false);
    setisSendEmailSuccess(false);
  };
  console.log("sendAttachments", sendAttachments);
  const removeAttachment = (index: number) => {
    setSendAttachments((prevState) => prevState.filter((_, i) => i !== index));
  };
  const removeForwardAttachment = (index: number) => {
    const newAttachments = emailData?.attachments.filter(
      (_: any, i: number) => i !== index
    );
    setEmailData({
      attachments: newAttachments,
    });
    // setAttachments(newAttachments);
  };
  const toggleContent = (index: number) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };
  const handleSelectTemplateData = (item: any) => {
    setIsSelectedEmailTemplate(true);
    setSelectedEmailTemplateData(item);

    console.log("selected template body", item);
  };
  function nl2br(str: any) {
    return str.replace(/\n/g, "<br>");
  }
  // console.log("emailData", emailData);
  // const filterEmails = (emailString: string) =>
  //   emailString
  //     ?.split(",")
  //     .filter((email: string) => email.includes(userId))
  //     .join(",");

  // const filteredRecipients = filterEmails(emailDatas?.recipient);
  // const filteredCc = filterEmails(emailDatas?.cc_email);

  // const filteredEmails = [filteredRecipients, filteredCc]
  //   .filter(Boolean)
  //   .join(",");

  const handledisplay = (email: any) => {
    console.log("Selected Email:", email); // Log the selected email
    setnewEmail(true)
    // emailDatas.cc_email=email.cc
    // seetingEmailInformation(email)
    dispatch({
      type: "EMAIL_DATA",
      emaildata: email,
      iSIncomingEmailSameModule: true,
    });
  };

  const userName = () => {
    return userId;
  };
  const handleEmailClick = (email: any) => {
    console.log("Selected Email:", email); // Log the selected email
    setnewEmail(true)
    emailDatas.cc_email=email.cc
    seetingEmailInformation(email)
    // dispatch({
    //   type: "EMAIL_DATA",
    //   emaildata: email,
    //   iSIncomingEmailSameModule: true,
    // });

    
  };
  const toggleCloseButton = () => {
    setShowCloseButton(!showCloseButton);
   
  
  };
  const storetodb = (email: any) => {
    console.log("send the data to db", email);
    axios
    .post(
      Appsettings.AppSettings.WebApiBaseUrl + ApiConstants.store_emails_in_db,
      email
    )
    .then((responce) => {
      console.log("storng the email data into the data base api::", responce);
    })
    .catch((error) => {
      console.log("responce error in the storing data base::", error);
    });
    console.log("reducer in email.tsx")
    dispatch({
      type: "CLEAR_EMAIL_DATA"   
    });
    console.log("reducer in email.tsx after")
    setquill(true)
  };

  const setselectstatus =()=>{
    setstatus(['pending', 'finish'])
  }

  const searchEmails=(searchvalue: string)=>{
    console.log("search item is",searchvalue)
    setName(searchvalue)
    //fetchEmailsByName()
  }
 

  


  

  
  
  return (
    <>
      <div className="main-body-wrapper-section email-mainhead-section">
        <div className="sub-wrapper-section">
          <div className="row">
            <div className="col-lg-4">
              <div className="email-template-main">
                <div className="email-template-header-section">
                  {/* <span className="email-template-text">Email Templates</span> */}
                  <div className="emails-types-section">
                    <ul className="nav nav-pills email-templates-ul-section">
                      <li className="nav-item">
                        <a
                          className="nav-link active"
                          data-bs-toggle="pill"
                          href="#home"
                        >
                          Email Queues
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link"
                          data-bs-toggle="pill"
                          href="#menu1"
                        >
                          History
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link"
                          data-bs-toggle="pill"
                          href="#menu2"
                        >
                          Templates
                        </a>
                      </li>
                       <li className="nav-item">
                        <a
                          className="nav-link"
                          data-bs-toggle="pill"
                          href="#menu1"
                        >
                          My Queues
                        </a>
                      </li> 
                 
                    </ul>
                    <div className="email-button-section">
                      <button
                        type="button"
                        className="new-email-button"
                        onClick={() => sendNewEmail()}
                      >
                        <span>Compose</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="tab-content templtaes-content">
                  <div className="tab-pane containers active" id="home">
                    {redisData.length > 0 ? (
                      <div className="email-list">
                        
                        {redisData.map((email) => (
                          <div
                            key={email.message_id}
                            className="email-item"
                            onClick={() => handleEmailClick(email)}
                          >
                            <div className="email-sender1">
                              {email.sender}{" "}
                              
                              <div className="kar">
                              {email.attachments.length > 0 && (
                                <span className="email-attachments">📎</span>
                              )}
                              {/* {
                               
                               // email.direction==="incoming"?<i className="fa fa-long-arrow-down" aria-hidden="true"></i>:<i className="fa fa-long-arrow-up" aria-hidden="true"></i>
                               email.direction==="incoming"?<span className="arrow-dir">↑</span>:<span className="arrow-dir">↓</span>
                             } */}
                             {/* <i
                                className={`fa fa-trash`}
                                aria-hidden="true"
                                onMouseEnter={toggleCloseButton} // Add onMouseEnter handler
                                onMouseLeave={toggleCloseButton}
                                onClick={() => storetodb(email)}
                               
                              ></i> */}
                              <button
                                onMouseEnter={toggleCloseButton} // Add onMouseEnter handler
                                onMouseLeave={toggleCloseButton}
                                onClick={() => storetodb(email)}
                                className="wrap"
                              >
                                Wrap up
                              </button>
                              {
                               
                                email.direction==="incoming"?<i className="fa-solid fa-arrow-down-long arrow-dir"></i>:<i className="fa-solid fa-arrow-up-long arrow-dir"></i>
                              // email.direction==="incoming"?<span className="arrow-dir">▲</span>:<span className="arrow-dir">▼</span>
                             }
   
                              </div>
              
                            </div>

                            <div className="email-subject">{email.subject}</div>
                            <div className="email-data">
                              {email.body.substring(0, 6)}
                            </div>
            
                           
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="nomail">NO Mails</div>
                    )}
                  </div>
             
                  <div className="tab-pane containerss fade" id="menu1">
                  {/* <div className="emailsearch1">
                 
                  <input
                    type="text"
                    className="emailsearch email-input"
                    placeholder="🔍 Search emails"
                    onChange={(e) => setName(e.target.value)}
                  />
                   {isSearchPerformed ? (
        <button className="search-button" onClick={clearSearch}>Clear</button>
      ) : (
        <button className="search-button" onClick={fetchEmailsByName}>Search</button>
      )}
                  </div> */}
                  
                  {historyData.length > 0 ? (
                    
                      <div className="email-list1">
                        {historyData.map((email) => (
                          
                          <div
                            key={email.message_id}
                            className="email-item"
                            onClick={() => handleEmailClick(email)}
                          >
                            <div className="email-sender1">
                              {email.sender}{" "}
                              <div className="kar">
                              {email.attachments.length > 0 && (
                                <span className="email-attachments">📎</span>
                              )}
                               {
                                email.direction==="incoming"?<i className="fa-solid fa-arrow-down-long arrow-dir"></i>:<i className="fa-solid fa-arrow-up-long arrow-dir"></i>
                             }
                              </div>
              
                            </div>

                            <div className="email-subject">{email.subject}</div>
                            <div className="email-data">
                              {email.body.substring(0, 20)}
                            </div>
            
                           
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="nomail">NO Mails</div>
                    )}
                  </div>
                  <div className="tab-pane containerss fade" id="menu2">
                    <div className="templates-columns">
                      {templateData.map((item: any, index: any) => (
                        <div
                          key={index}
                          className={
                            expandedIndex === index
                              ? "templates-viewer-expand"
                              : "templates-viewer"
                          }
                        >
                          <div className="email-template-data">
                            <div className="">
                              <span className="email-template-name">
                                {item.name}
                              </span>
                            </div>
                            <div className="">
                              <span className="icons-section ml-auto">
                                {/* <i
                                  className="fa-solid fa-pen-to-square icons-templates"
                                  // onClick={() => handleEditTemplateData(item.template_id)}
                                ></i>
                                &nbsp;&nbsp; */}
                                {/* <i
                                  className="fa-solid fa-trash icons-templates"
                                  // onClick={() => handleRemoveTemplate(item.template_id)}
                                ></i> body*/}
                                {/* <i className="fa-regular fa-copy icons-templates"></i> */}
                                <i
                                  className="fa-solid fa-copy icons-templates"
                                  onClick={() =>
                                    handleSelectTemplateData(item.body)
                                  }
                                ></i>
                              </span>
                              &nbsp;&nbsp;
                              <span>
                                {expandedIndex === index ? (
                                  <i
                                    className="fa-solid fa-angle-up"
                                    onClick={() => toggleContent(index)}
                                  ></i>
                                ) : (
                                  <i
                                    className="fa-solid fa-angle-down"
                                    onClick={() => toggleContent(index)}
                                  ></i>
                                )}
                              </span>
                            </div>
                          </div>
                          {expandedIndex === index && (
                            <>
                              <div className="border-bodytemplate"></div>
                              <div
                                className="body-content-expands"
                                dangerouslySetInnerHTML={{
                                  __html: nl2br(item.body),
                                }}
                              >
                                {/* {item.body} */}
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="email-main-section">
                <div className="email-template-header">
                  {isReplyEmail ||
                  isSendNewEmail ||
                  isReplyAllEmailState ||
                  isForwardEmail ? (
                    <>
                      {isSendNewEmail && (
                        <span className="Re-subject-name">Subject:</span>
                      )}
                      {isReplyEmail ||
                      (isReplyAllEmailState && !isSendNewEmail) ? (
                        <span className="Re-subject-name">RE:</span>
                      ) : (
                        !isSendNewEmail &&
                        isForwardEmail && (
                          <span className="Re-subject-name">FW:</span>
                        )
                      )}

                      {/* {isForwardEmail ? (
                        <span className="Re-subject-name">Fw:</span>
                      ) : (
                        <span className="Re-subject-name">RE:</span>
                      )} */}
                      <input
                        type="text"
                        className={
                          isSendNewEmail
                            ? "form-control subject-input-send"
                            : "form-control subject-input"
                        }
                        id="subject"
                        name="subject"
                        value={sendingEmails.subject}
                        onChange={sendingEmailEvent}
                      />
                    </>
                  ) : emailData ? (
                    emailData.subject ? (
                      <span className="email-subject-text">
                        {emailData.subject}
                      </span>
                    ) : isIncomingEmailForSubject ? (
                      <span className="email-subject-text">(No Subject)</span>
                    ) : null
                  ) : null}

                  {/* {isForwardEmail && (
                    <span className="Re-subject-name">FW:</span>
                  )} */}

                  {/* <button
                    className="btn bt-primary new-email-button"
                    onClick={() => sendNewEmail()}
                  >
                    <span>New Email</span>
                  </button> */}
                  {/* <i className="fa-solid fa-envelope"></i>
                  <span className="email-template-text">Email</span> */}
                </div>
              </div>

              <div className="email-content-main">
                <div>
                  {/* <div className="email-subjetc-data-header">
                  <span className="email-subject-text">
                      {tempEmail.subject}
                    </span>
                    <span className="email-date-text">
                    {moment(tempEmail.date).format("MMMM D, YYYY h:mm A")}
                  </span>
                </div> */}
                  <div className="mail-full-details-section">
                    <div className="email-sub-section-wrapper">
                      {isReplyEmail ||
                      isSendNewEmail ||
                      isForwardEmail ||
                      isReplyAllEmailState ||
                      isSendNewEmail ? (
                        <>
                          <div className="replyemail-section">
                            <div className="from-and-delete-sections">
                              <div>
                                <span className="sending-from-lable">
                                  From :
                                </span>
                                {isSendNewEmail && (
                                  <span className="sending-from">
                                    {userName()}
                                  </span>
                                )}
                                <>
                                  {isReplyEmail &&
                                    !isReplyAllEmail &&
                                    !isForwardEmail && (
                                      <span className="sending-from">
                                        {userName()}
                                      </span>
                                    )}
                                  {isReplyAllEmail && !isForwardEmail && (
                                    <span className="sending-from">
                                      {userName()}
                                    </span>
                                  )}
                                  {isForwardEmail && (
                                    <span className="sending-from">
                                      {userName()}
                                    </span>
                                  )}
                                </>
                                {/* <span className="sending-from">
                                  {/* ashokreddy */}
                                {/* {emailData?.to_email?.replace(/'/g, " ")}
                                </span>} */}
                              </div>
                            </div>
                            <div className="to-cc-section">
                              <div>
                                <div className="reply-to-section">
                                  <div className="to-border-section">
                                    <span>To</span>
                                  </div>
                                  <input
                                    type="email"
                                    className="form-control reply-to-email-box"
                                    id="email"
                                    name="toemail"
                                    value={sendingEmails.toemail}
                                    onChange={(e) => sendingEmailEvent(e)}
                                    onKeyDown={handleKeyDown}
                                  />
                                </div>

                                <div className="reply-to-section">
                                  <div className="to-border-section">
                                    <span>Cc</span>
                                  </div>
                                  {(isReplyEmail ||
                                    isReplyAllEmailState ||
                                    isForwardEmail ||
                                    isSendNewEmail) && (
                                    <input
                                      type="email"
                                      className="form-control reply-to-email-box"
                                      id="email"
                                      name="ccemail"
                                      value={sendingEmails.ccemail}
                                      onChange={(e) => sendingEmailEvent(e)}
                                      onKeyDown={handleKeyDown}
                                    />
                                  )}
                                  {/* {isReplyEmail && !isReplyAllEmail ? (
                                    <div className="reply-to-section">
                                      <div className="to-border-section">
                                        <span>Cc</span>
                                      </div>
                                      <input
                                        type="email"
                                        className="form-control reply-to-email-box"
                                        id="email"
                                        name="ccemail"
                                        // value={emailDatas?.cc_email || ""}
                                        onChange={(e) => sendingEmailEvent(e)}
                                      />
                                    </div>
                                  ) : null} */}
                                </div>
                              </div>
                              <div className="send-delete-main-section">
                                <button
                                  type="button"
                                  className="delete-email-button"
                                  onClick={() => deleteReplyMail()}
                                >
                                  <span>Delete</span>
                                </button>
                                <button
                                  type="button"
                                  className="send-email-button"
                                  onClick={() => sendPostEmail()}
                                  data-bs-toggle="modal"
                                  data-bs-target="#myEmailCustomModal"
                                >
                                  <span>Send</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : emailData?.sender ? (
                        <>
                          <div className="replyall-section-withfrom-to">
                            <div className="d-flex">
                              <div className="email-name-slice">
                                <span>{emailData?.sender?.slice(0, 1)}</span>
                              </div>
                              <div className="email-from-to-section">
                                <span className="email-sender">
                                  {emailData?.sender}
                                </span>
                                <br />
                                <span className="to-text">To: </span>
                                <span className="to-email-text">
                                  {emailData?.recipient
                                    ?.replace(/"/g, " ")
                                    ?.replace(/<[^>]*>/g, "")}
                                </span>{" "}
                                <br />
                                {emailDatas?.cc_email ? (
                                  <>
                                    <span className="to-text">Cc: </span>
                                    <span className="to-email-text">
                                      {emailDatas.cc_email}
                                    </span>
                                  </>
                                ) : (
                                  ""
                                )}
                                                                {/* {emailData.cc ? (
                                  <>
                                    <span className="to-text">Cc: </span>
                                    <span className="to-email-text">
                                      {emailData.cc}
                                    </span>
                                  </>
                                ) : (
                                  ""
                                )} */}
                                {/* {emailData.cc || emailDatas.cc_email  ? (
  <>
    <span className="to-text">Cc: </span>
    <span className="to-email-text">{emailDatas.cc_email}</span>
  </>
) : emailData.cc ? (
  <>
    <span className="to-text">Cc: </span>
    <span className="to-email-text">{emailData.cc}</span>
  </>
) : (
  ""
)} */}

                              </div>
                            </div>
                            <div>
                              <span className="email-date-text">
                                {moment(emailData?.date).format(
                                  "MMMM D, YYYY h:mm A"
                                )}
                              </span>
                              <br />
                              <div className="reply-forward-section">
                                {/* <span
                                  className="email-reply-icon"
                                  id="reply-element-id"
                                  onClick={() => replyEmail()}
                                >
                                 <i className="fa-solid fa-reply"></i> *
                                  <span>Reply</span>
                                </span> */}
                                <button
                                  type="button"
                                  className="send-reply-button"
                                  style={{ marginRight: "1rem" }}
                                  onClick={() => replyEmail()}
                                >
                                  <span>Reply</span>
                                </button>
                                <Tooltip
                                  anchorSelect="#reply-element-id"
                                  content="Reply"
                                />
                                {/* <span
                                  className="email-reply-icon replyall-text"
                                  id="replyall-element-id"
                                  onClick={() => replyAllEmail()}
                                >
                                  <span>Reply All</span>
                                  
                                </span> */}
                                <button
                                  type="button"
                                  className="send-reply-button"
                                  onClick={() => replyAllEmail()}
                                  style={{ marginRight: "1rem" }}
                                >
                                  <span>Reply All</span>
                                </button>
                                <Tooltip
                                  anchorSelect="#replyall-element-id"
                                  content="Reply All"
                                />
                                {/* <span
                                  className="email-reply-icon forward-text"
                                  id="forward-element-id"
                                  onClick={() => forwardEmail()}
                                >
                                
                                  <span>Forward</span>
                                </span> */}
                                <button
                                  type="button"
                                  className="send-reply-button"
                                  onClick={() => forwardEmail()}
                                >
                                  <span>Forward</span>
                                </button>
                                <Tooltip
                                  anchorSelect="#forward-element-id"
                                  content="Forward"
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                      {isAttachmentsForward && (
                        <div className="grid-of-files-main">
                          {emailData?.attachments?.map(
                            (items: any, index: number) => (
                              <>
                                <div className="files-button-dowload">
                                  <button
                                    type="button"
                                    className="btn-disabled-the"
                                    id="file-element-id"
                                    onClick={() =>
                                      items.filename?downloadFileFromDataUrl(items.filepath,items.filename):
                                      downloadAttachmentsFiles(items.filepath)
                                    }
                                  >
                                    {renderFileTypeIcon(items.filepath)}
                                    &nbsp;&nbsp;
                                    {formatFileName(items.filename?items.filename:items.filepath)}
                                  </button>{" "}
                                  &nbsp;&nbsp;
                                  {isForwardEmail && (
                                    <i
                                      className="fa-solid fa-xmark remove-icon-attachements"
                                      onClick={() =>
                                        removeForwardAttachment(index)
                                      }
                                    ></i>
                                  )}
                                </div>

                                {/* <Tooltip
                                  anchorSelect="#file-element-id"
                                  content={`${items.filepath.replace(
                                    "http://localhost:8037/images/",
                                    ""
                                  )}`}
                                /> */}
                              </>
                            )
                          )}
                        </div>
                      )}
                    </div>

                    {/* {emailData?.sender && (!isReplyEmail ? <></> : "")} */}
                    {sendAttachments.length > 0 && (
                      <div className="grid-of-files-main">
                       
                        {sendAttachments.map((items: any, index: number) => (
                          
                          <> {console.log("item is:",items)}
                            <button
                              className="files-button-dowload-send"
                              id="file-element-id"
                   
                            >
                              
                              {renderFileTypeIcon(items.name)}
                              &nbsp;&nbsp;
                              {items.name.length > 30
                                ? `${items.name.slice(0, 27)}...`
                                : items.name}

                              {/* {formatFileName(items.name)} */}
                              &nbsp;&nbsp;
                              <i
                                className="fa-solid fa-xmark remove-icon-attachements"
                                onClick={() => removeAttachment(index)}
                              ></i>
                            </button>

                            {/* <Tooltip
                           anchorSelect="#file-element-id"
                           content={`${items.filepath.replace(
                             "http://localhost:8037/images/",
                             ""
                           )}`}
                         /> */}
                          </>
                        ))}
                      </div>
                    )}
                  </div>

                  


                  
                  {/*  */}
                  <div
                    className={`mail-body-section ${
                      isReplyEmail ||
                      isReplyAllEmailState ||
                      isForwardEmail ||
                      isSendNewEmail
                        ? "editable"
                        : ""
                    }`}
                  >
                    {(isSendNewEmail ||
                      emailData?.sender ||
                      iSIncomingEmailSameModule ||
                      emailData?.body !== "") && (
                      <Editor
                        key={editorKey}
                        readOnly={true}
                        ref={quillRef}
                        isReplyEmail={isReplyEmail}
                        isSendNewEmail={isSendNewEmail}
                        isReplyAllEmailState={isReplyAllEmailState}
                        emaildata={emailData}
                        isForwardEmail={isForwardEmail}
                        isSelectedEmailTemplate={isSelectedEmailTemplate}
                        selectedEmailTemplateData={selectedEmailTemplateData}
                        defaultValue={new Delta().insert(emailData?.body)}
                        onSelectionChange={setRange}
                        onTextChange={setLastChange}
                        setSendAttachments={setSendAttachments}
                      />
                    )}
                    {/* {
                      myArray.map((item) => (
                        <div>{item}</div>
                      ))
                      //   myArray.forEach(section => {
                      //     // Display each section in your UI
                      //     console.log(section);
                      //     // You can append each section to your HTML, create separate components, etc.
                      // });
                    } */}
                    {/* {emailData.body.map((item: any, index: number) => {
                      let className = "";
                      if (item.includes("From:")) {
                        className = "from-section";
                        const parts = item.split("From:");
                        return (
                          <div key={index} className="from-wrapper">
                            <span className={className}>From:</span>
                            {parts[1]}
                          </div>
                        );
                      } else if (item.includes("To:")) {
                        className = "from-section";
                        const parts = item.split("To:");
                        return (
                          <div key={index}>
                            <span className={className}>To:</span>
                            {parts[1]}
                          </div>
                        );
                      } else if (item.includes("Sent:")) {
                        className = "from-section";
                        const parts = item.split("Sent:");
                        return (
                          <div key={index}>
                            <span className={className}>Sent:</span>
                            {parts[1]}
                          </div>
                        );
                      } else if (item.includes("Subject:")) {
                        className = "from-section";
                        const parts = item.split("Subject:");
                        return (
                          <div key={index} className="subject-wrapper">
                            <span className={className}>Subject:</span>
                            {parts[1]}
                          </div>
                        );
                      } else if (
                        item.includes("Thanks & Regards") ||
                        item.includes("Regards") ||
                        item.includes("Thanks")
                      ) {
                        className = "thanks-regards-section";
                      } else if (
                        item.includes("________________________________")
                      ) {
                        className = "divid-section";
                      }
                      else if(item.includes({iamgs :"base64"})){
                        <div>
                          <img src=""></img>
                        </div>
                      }

                      return (
                        <div key={index} className={className}>
                          {item}
                        </div>
                      );
                    })} */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EmailCustomePopup
        isSendEmailSuccess={isSendEmailSuccess}
        isSendEmailError={isSendEmailError}
        isSendEmailProcess={isSendEmailProcess}
        sendAnyWay={sendAnyWay}
        showSendConfirmation={showSendConfirmation}
        // sendPostEmail={sendPostEmail}
        successEmailPopUp={successEmailPopUp}
        CloseEmailpopup={CloseEmailpopup}
        Closepopup={Closepopup}
        ClosingEmailPopUp={ClosingEmailPopUp}
      ></EmailCustomePopup>
    </>
  );
};

export default Email;
