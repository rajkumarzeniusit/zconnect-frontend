import react, { useEffect, useRef, useState } from "react";
import "./softPhone.scss";
import SoftPhoneFeatures from "../softPhoneFeatures/softPhoneFeatures";
//import  ServerDetails  from "../../../serverConfig.json";
//import adiofile from "../../../assets/audio/ringtone.mp3"
import { useLocation, useNavigate } from "react-router-dom";
import {
  Invitation,
  Inviter,
  Registerer,
  Session,
  SessionState,
  SIPExtension,
  UserAgent,
  UserAgentOptions,
} from "sip.js";
import { Web } from "sip.js";
import { SessionDescriptionHandler } from "sip.js/lib/platform/web";
import { useSelector, useDispatch } from "react-redux";

interface Iprops {
  setIsAgentReady?: React.Dispatch<React.SetStateAction<boolean>>;
}
let inviter: Inviter;
// let outGoingCallConnectioEstablished = false;
const SoftPhone = (props: Iprops) => {
  useEffect(() => {
    console.log("The phone.tsx rendering ");
  }, []);
  const [incomingSession, setIncomingSession] = useState<Session | null>(null);
  const [updateNewState, setUpdateNewState] = useState<Session | null | any>();
  const [ringtone, setRingtone] = useState<HTMLAudioElement | null | any>(null);
  const [exstensionPhoneNumber, setExstensionPhoneNumber] = useState<any>();
  const [
    incomingCallConnectioEstablished,
    setIncomingCallConnectioEstablished,
  ] = useState<boolean>(false);
  const [
    outGoingCallConnectioEstablished,
    setOutGoingCallConnectioEstablished,
  ] = useState<boolean>(false);
  const [isCallAnswered, setIsCallAnswered] = useState<boolean>(false);
  const [isIncommingCall, setIsIncommingCall] = useState<boolean>(false);
  const [isOutgoingCallSession, setIsOutgoingCallSession] =
    useState<Session | null>(null);
  // const [isSoftPhoneFeatures, setIsSoftPhoneFeatures] =
  //   useState<boolean>(false);
  const [isMutePhone, setIsMutePhone] = useState<boolean>(false);
  const [isHoldPhone, setIsHoldPhone] = useState<boolean>(false);
  const [isDialPadOpen, setIsDialPadOPen] = useState<boolean>(false);
  const [isTransferCall, setIsTransferCall] = useState<boolean>(false);
  const [isoutBoundCall, setIsOutBoundCall] = useState<boolean>(false);
  const [isConferencecall, setIsConferenceCall] = useState<boolean>(false);
  const [isConferenceIcon, setIsConferenceIcon] = useState<boolean>(false);
  const [isOnCallText, setIsOnCallText] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const invitationRef = useRef<Invitation | null>(null);
  const localStream = new MediaStream();
  const remoteStream = new MediaStream();
  const remoteMedia = useRef(null);
  const localMedia = useRef(null);
  const outgoingCallSessionRef = useRef<Session | null>(null);
  const usersAgents = useSelector((state: any) => state.softPhoneUserAgent);
  const userTransferCall = useSelector((state: any) => state.transforCall);
  const userOutBoundCall = useSelector((state: any) => state.outBoundDialCall);
  const isSoftPhoneFeatures = useSelector(
    (state: any) => state.softPhoneUserAgent.isSoftPhoneFeatures
  );

  useEffect(() => {
    if (userOutBoundCall.isOutBoundCall === true || isIncommingCall) {
      // setIsSoftPhoneFeatures(true);
    }
  }, [isIncommingCall, location, userOutBoundCall.isOutBoundCall]);

  useEffect(() => {
    dispatch({ type: "INCOMING_CALL", isIncommingCall: true });
  }, [isIncommingCall]);

  const dialPadOpen = () => {
    setIsDialPadOPen(true);
  };
  const transferCall = () => {
    setIsTransferCall(true);
    setIsDialPadOPen(false);
  };

  const outBoundCallLift = () => {
    setIsOutBoundCall(false);
    setIsCallAnswered(true);
  };

  return (
    <div>
      {isSoftPhoneFeatures && (
        <SoftPhoneFeatures
          isDialPadOpen={isDialPadOpen}
          // isTransferCall={isTransferCall}
          setIsDialPadOPen={setIsDialPadOPen}
          setIsOutBoundCall={setIsOutBoundCall}
          setIsIncommingCall={setIsIncommingCall}
          // outBoundcall={outBoundcall}
          exstensionPhoneNumber={exstensionPhoneNumber}
        ></SoftPhoneFeatures>
      )}
    </div>
  );
};

export default SoftPhone;
