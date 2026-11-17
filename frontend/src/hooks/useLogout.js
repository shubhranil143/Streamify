import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api";

// Custom hook to handle user logout mutation
const useLogout = () => {
  const queryClient = useQueryClient();

  const {
    mutate: logoutMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: logout,
    // Clearing the server cookie and invalidating authUser resets state back to unauthenticated
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  return { logoutMutation, isPending, error };
};
export default useLogout;

