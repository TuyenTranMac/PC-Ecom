import 'server-only'; // <-- ensure this file cannot be imported from the client
import { createTRPCOptionsProxy, TRPCQueryOptions } from '@trpc/tanstack-react-query';
import { cache } from 'react';
import { createTRPCContext } from './init';
import { makeQueryClient } from './query-client';
import { appRouter } from './routers/_app';
import { createTRPCClient, httpLink } from '@trpc/client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
export const getQueryClient = cache(makeQueryClient);
export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
});
// If your router is on a separate server, pass a client:
createTRPCOptionsProxy({
  client: createTRPCClient({
    links: [httpLink({ url: '...' })],
  }),
  queryClient: getQueryClient,
});


/**
 * Wraps children with a React Query HydrationBoundary seeded from the shared query client.
 *
 * @param props.children - React nodes to render inside the hydration boundary
 * @returns A React element that provides dehydrated React Query state to descendant hooks
 */
export function HydrateClient(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
}
/**
 * Prefetches data for a TRPC query using the shared query client.
 *
 * Prefetch behavior adapts to the query shape: if `queryOptions.queryKey[1]?.type` equals
 * `'infinite'`, the options are prefetched as an infinite query; otherwise they are
 * prefetched as a standard query.
 *
 * @param queryOptions - Query options produced by TRPC/React-Query (`TRPCQueryOptions` return shape)
 */
export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
  queryOptions: T,
) {
  const queryClient = getQueryClient();
  if (queryOptions.queryKey[1]?.type === 'infinite') {
    void queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    void queryClient.prefetchQuery(queryOptions);
  }
}