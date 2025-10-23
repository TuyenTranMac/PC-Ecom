import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from '@tanstack/react-query';
/**
 * Create a preconfigured QueryClient with sensible defaults for queries, dehydrate, and hydrate.
 *
 * @returns A configured `QueryClient` instance with a 30-second query `staleTime` and a dehydrate policy that treats queries selected by the default policy or queries whose state is `pending` as dehydrated.
 */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
      },
      dehydrate: {
        // serializeData: superjson.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
      hydrate: {
        // deserializeData: superjson.deserialize,
      },
    },
  });
}