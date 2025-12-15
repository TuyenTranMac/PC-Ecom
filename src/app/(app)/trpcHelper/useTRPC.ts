import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC as useTRPCClient } from "@/server/client";

export const useTRPC = () => useTRPCClient();

export const UseCategory = () => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.categories.getAll.queryOptions());
};
// export const useAuth = () => {
//     const trpc = useTRPC();
//     return useSuspenseQuery(trpc.auth.getMe.queryOptions());
// }
// export const UseRegister = () => {
//     const trpc = useTRPC();
//     return useMutation(trpc.auth.register.mutationOptions(
//     ));
// }
