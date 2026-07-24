import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";
import { ArrowLeft } from "lucide-react";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id: callId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const { authUser, isLoading } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initCall = async () => {
      if (!tokenData?.token || !authUser || !callId) return;

      try {
        console.log("Initializing Stream video client...");

        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePicture,
        };

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
        });

        const callInstance = videoClient.call("default", callId);

        await callInstance.join({ create: true });

        console.log("Joined call successfully");

        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.error("Error joining call:", error);
        toast.error("Could not join the call. Please try again.");
        setTimeout(() => navigate("/"), 3000);
      } finally {
        setIsConnecting(false);
      }
    };

    initCall();
  }, [tokenData, authUser, callId, navigate]);

  const handleEndCall = () => {
    toast.success("Call ended");
    navigate("/");
  };

  if (isLoading || isConnecting) return <PageLoader />;

  return (
    <div className="h-screen w-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-black bg-opacity-50 backdrop-blur p-4 flex items-center justify-between z-10">
        <button
          onClick={() => navigate("/")}
          className="btn btn-ghost btn-circle text-white hover:bg-white hover:bg-opacity-10"
          title="Go back"
        >
          <ArrowLeft className="size-5" />
        </button>
        <h1 className="text-white font-bold text-lg">Video Call</h1>
        <div className="w-10"></div>
      </div>

      {/* Call Content */}
      <div className="flex-1 relative">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent onEndCall={handleEndCall} />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-white">Could not initialize call. Please refresh or try again later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CallContent = ({ onEndCall }) => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const navigate = useNavigate();

  if (callingState === CallingState.LEFT) return navigate("/");

  return (
    <StreamTheme className="h-full">
      <div className="h-full flex flex-col">
        <div className="flex-1">
          <SpeakerLayout />
        </div>
        <div className="bg-black bg-opacity-50 backdrop-blur p-4 flex justify-center gap-4">
          <CallControls onLeave={onEndCall} />
        </div>
      </div>
    </StreamTheme>
  );
};

export default CallPage;

