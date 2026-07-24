import { VideoIcon, Phone, PhoneOff } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

function CallButton({ handleVideoCall, targetUser }) {
  const [isCallActive, setIsCallActive] = useState(false);

  const onStartCall = () => {
    try {
      handleVideoCall();
      setIsCallActive(true);
      toast.success("Video call initiated!");
    } catch (error) {
      toast.error("Failed to start call");
    }
  };

  const onEndCall = () => {
    setIsCallActive(false);
    toast.success("Call ended");
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {/* Call Status Card */}
      {isCallActive && (
        <div className="bg-success text-white rounded-lg p-3 shadow-lg flex items-center gap-2 animate-pulse">
          <div className="size-2 bg-white rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Call in progress...</span>
        </div>
      )}

      {/* Call Button */}
      <button
        onClick={isCallActive ? onEndCall : onStartCall}
        className={`btn btn-circle btn-lg shadow-lg transition-all ${
          isCallActive
            ? "btn-error hover:btn-error"
            : "btn-success hover:btn-success"
        }`}
        title={isCallActive ? "End call" : "Start video call"}
      >
        {isCallActive ? (
          <PhoneOff className="size-6" />
        ) : (
          <VideoIcon className="size-6" />
        )}
      </button>
    </div>
  );
}

export default CallButton;

