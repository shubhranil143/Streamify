import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api";
import { Link, useParams } from "react-router";
import { SearchIcon, MessageCircleOff } from "lucide-react";
import { useState } from "react";

// Sidebar in ChatPage displaying list of friends with real-time search filtering
const ConversationsSidebar = () => {
  const { id: selectedUserId } = useParams(); // URL param matching active conversation partner
  const [searchTerm, setSearchTerm] = useState("");

  // Reuses the cached ["friends"] query without making redundant network calls
  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const safeFriends = Array.isArray(friends) ? friends.filter(Boolean) : [];

  // Client-side search filtering by friend name
  const filteredFriends = safeFriends.filter((friend) =>
    friend?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-80 bg-base-100 border-r border-base-300 flex flex-col h-[93vh] shadow-lg">
      {/* Header with subtle gradient */}
      <div className="p-4 border-b border-base-300 bg-gradient-to-br from-base-100 to-base-200">
        <h2 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Messages
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            className="input input-bordered input-sm w-full pl-10 focus:input-primary transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchIcon className="absolute left-3 top-3 size-4 opacity-50 pointer-events-none" />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : filteredFriends.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <MessageCircleOff className="size-12 mx-auto opacity-30" />
            <p className="text-base-content opacity-70 font-medium">
              {searchTerm ? "No conversations found" : "Start a conversation"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-base-300">
            {filteredFriends.map((friend) => (
              <Link
                key={friend._id}
                to={`/chat/${friend._id}`}
                className={`p-4 flex gap-3 items-start hover:bg-base-200 transition-all duration-200 cursor-pointer group ${
                  selectedUserId === friend._id 
                    ? "bg-primary bg-opacity-10 border-l-4 border-primary" 
                    : "border-l-4 border-transparent"
                }`}
              >
                <div className="avatar flex-shrink-0">
                  <div className="w-12 rounded-full ring-2 ring-base-300 group-hover:ring-primary transition-all">
                    <img src={friend.profilePicture} alt={friend.fullName} />
                  </div>
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                    {friend.fullName}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="size-2 rounded-full bg-success flex-shrink-0"></span>
                    <p className="text-xs text-base-content opacity-60 truncate">
                      Online
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationsSidebar;
