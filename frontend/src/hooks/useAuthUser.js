import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../lib/api";

// Custom hook to query and cache authenticated user state across the app
const useAuthUser = () => {
  const authUser = useQuery({
    queryKey: ["authUser"], // Unique cache key for user session
    queryFn: getAuthUser,
    retry: false, // Important: Don't retry if 401 Unauthorized (avoids redundant network calls when logged out)
  });

  return { isLoading: authUser.isLoading, authUser: authUser.data?.user };
};
export default useAuthUser;

