import { Link } from "react-router";
import LanguageFlag from "./LanguageFlag";
import { MessageCircle, VideoIcon } from "lucide-react";

const FriendCard = ({ friend }) => {
  return (
    <div className="card bg-base-100 border border-base-300 hover:border-primary hover:shadow-xl transition-all duration-300 group overflow-hidden">
      <div className="card-body p-5 space-y-4">
        {/* USER HEADER */}
        <div className="flex items-center gap-3 pb-2 border-b border-base-300">
          <div className="avatar">
            <div className="w-14 rounded-full ring-2 ring-primary ring-offset-base-100 ring-offset-1 group-hover:ring-4 transition-all">
              <img src={friend.profilePicture} alt={friend.fullName} />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-base truncate group-hover:text-primary transition-colors">
              {friend.fullName}
            </h3>
            <p className="text-xs text-success flex items-center gap-1 font-medium">
              <span className="size-2 rounded-full bg-success animate-pulse-subtle"></span>
              Online
            </p>
          </div>
        </div>

        {/* LANGUAGES - Better badges */}
        <div className="flex flex-wrap gap-2">
          <div className="badge badge-secondary badge-lg gap-1">
            <LanguageFlag language={friend.nativeLanguage} />
            <span className="text-xs font-semibold">{friend.nativeLanguage}</span>
          </div>
          <div className="badge badge-outline badge-lg gap-1">
            <LanguageFlag language={friend.learningLanguage} />
            <span className="text-xs font-semibold">{friend.learningLanguage}</span>
          </div>
        </div>

        {/* ACTION BUTTONS - Better layout */}
        <div className="flex gap-2 pt-2">
          <Link
            to={`/chat/${friend._id}`}
            className="btn btn-outline btn-sm flex-1 gap-2 group/msg hover:btn-primary"
            title="Send message"
          >
            <MessageCircle className="size-4 group-hover/msg:scale-110 transition-transform" />
            <span className="hidden sm:inline">Message</span>
            <span className="sm:hidden">Chat</span>
          </Link>
          <Link
            to={`/call/${friend._id}`}
            className="btn btn-primary btn-sm flex-1 gap-2 group/call"
            title="Start video call"
          >
            <VideoIcon className="size-4 group-hover/call:scale-110 transition-transform" />
            <span className="hidden sm:inline">Call</span>
            <span className="sm:hidden">Video</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default FriendCard;
