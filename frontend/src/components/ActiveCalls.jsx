import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api";
import { Link } from "react-router";
import { VideoIcon } from "lucide-react";
import { useState } from "react";

const ActiveCalls = () => {
  const [activeCalls] = useState([]);

  const { data: friends = [] } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  return (
    <section className="space-y-6 animate-slide-in-up">
      {/* Section Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary flex items-center gap-3">
              <div className="p-2 bg-primary bg-opacity-10 rounded-lg">
                <VideoIcon className="size-7 text-primary" />
              </div>
              Quick Calls
            </h2>
            <p className="text-sm text-base-content opacity-70 ml-1">
              Connect with your friends instantly
            </p>
          </div>
        </div>
      </div>

      {/* Active Calls Alert */}
      {activeCalls.length > 0 && (
        <div className="bg-warning bg-opacity-15 border-l-4 border-warning rounded-lg p-4 animate-slide-in-left">
          <h3 className="font-bold text-warning mb-3">Active Calls</h3>
          <div className="space-y-2">
            {activeCalls.map((call) => (
              <div
                key={call.id}
                className="flex items-center justify-between bg-base-200 rounded-lg p-3 hover:bg-base-300 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="size-3 bg-warning rounded-full animate-pulse-subtle"></span>
                  <span className="text-sm font-medium">{call.userName}</span>
                </div>
                <Link to={`/call/${call.callId}`} className="btn btn-warning btn-xs">
                  Join
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Call Friends Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {friends.slice(0, 4).map((friend, index) => (
          <div
            key={friend._id}
            className="card bg-base-100 border border-base-300 hover:shadow-lg hover:border-primary transition-all duration-300 overflow-hidden"
            style={{
              animation: `slideInUp 0.5s ease-out ${index * 0.1}s both`,
            }}
          >
            <div className="card-body p-4 space-y-3">
              {/* Avatar with gradient border */}
              <div className="flex justify-center pt-2">
                <div className="avatar">
                  <div className="w-24 rounded-full ring-4 ring-primary ring-offset-base-100 ring-offset-2 hover:scale-110 transition-transform duration-300">
                    <img src={friend.profilePicture} alt={friend.fullName} />
                  </div>
                </div>
              </div>

              {/* Friend Info */}
              <div className="text-center space-y-2">
                <h3 className="font-bold text-lg truncate">{friend.fullName}</h3>
                <div className="flex items-center justify-center gap-2">
                  <span className="size-2 rounded-full bg-success animate-pulse-subtle"></span>
                  <span className="text-xs font-medium text-success">Online</span>
                </div>
              </div>

              {/* Call Button */}
              <Link
                to={`/call/${friend._id}`}
                className="btn btn-primary btn-sm w-full gap-2 mt-2 group"
              >
                <VideoIcon className="size-4 group-hover:scale-110 transition-transform" />
                Call
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* View All Link */}
      {friends.length > 4 && (
        <div className="text-center pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-focus font-medium transition-colors group"
          >
            View all friends
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      )}
    </section>
  );
};

export default ActiveCalls;
