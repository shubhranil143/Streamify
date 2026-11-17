import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../lib/api";

// Custom hook to handle user signup mutation with cache invalidation
const useSignUp = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: signup,
    // On successful signup, invalidate authUser query so React Query refetches user data automatically
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  return { isPending, error, signupMutation: mutate };
};
export default useSignUp;

