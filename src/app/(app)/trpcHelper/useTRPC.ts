import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/server/client";


export const UseCategory = () => {
    const trpc = useTRPC();
    return useSuspenseQuery(trpc.categories.all.queryOptions());
}
export const useAuth = () => {
    const trpc = useTRPC();
    return useSuspenseQuery(trpc.auth.getMe.queryOptions());
}
export const UseRegister = () => {
    const trpc = useTRPC();
    return useMutation(trpc.auth.register.mutationOptions(
    ));
}