import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";

// Top navigation bar containing notifications link, theme selector, user avatar, and logout button
const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  // Show logo inside navbar only when sidebar is hidden (e.g. on /chat pages)
  const isChatPage = location.pathname?.startsWith("/chat");

  const { logoutMutation } = useLogout();

  return (
    <nav className="bg-base-100 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between w-full">
          {/* LOGO - ONLY IN THE CHAT PAGE */}
          {isChatPage && (
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <ShipWheelIcon className="size-8 text-primary" />
              <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider hidden sm:inline">
                Streamify
              </span>
            </Link>
          )}

          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            <Link to={"/notifications"}>
              <button className="btn btn-ghost btn-circle hover:bg-base-200 transition-colors">
                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
              </button>
            </Link>

            <ThemeSelector />

            <div className="avatar">
              <div className="w-9 rounded-full ring-2 ring-primary ring-offset-base-100 ring-offset-1">
                <img src={authUser?.profilePicture} alt="User Avatar" />
              </div>
            </div>

            <button 
              className="btn btn-ghost btn-circle hover:bg-base-200 transition-colors" 
              onClick={logoutMutation}
              title="Logout"
            >
              <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;

