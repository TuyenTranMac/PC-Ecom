import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/client";

export const UseCategory = () => {
    const  trpc = useTRPC();
    return useSuspenseQuery(trpc.categories.all.queryOptions());
}