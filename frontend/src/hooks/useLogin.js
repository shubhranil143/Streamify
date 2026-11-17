import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../lib/api";

// Custom hook to handle user login mutation
const useLogin = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: login,
    // Invalidate authUser cache to trigger an immediate fetch of the newly logged-in user profile
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  return { error, isPending, loginMutation: mutate };
};

export default useLogin;

