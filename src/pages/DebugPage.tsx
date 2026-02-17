import { useQueryClient } from '@tanstack/react-query'
import { useProductQuery } from '../api/productApi'
import { useLoaderStore } from '../store/loaderStore'

/** Debug panel: cache state, network, loader state, WebGL info (when available) */
export function DebugPage() {
  const queryClient = useQueryClient()
  const { data, status, isFetching, error } = useProductQuery('1')
  const loading = useLoaderStore((s) => s.loading)
  const progress = useLoaderStore((s) => s.progress)
  const loaderError = useLoaderStore((s) => s.error)
  const cache = queryClient.getQueryCache()
  const queries = cache.getAll()

  return (
    <div className="debug-page">
      <h1>Debug</h1>
      <section aria-label="Product API">
        <h2>Product API</h2>
        <p>Status: {status}</p>
        <p>Fetching: {String(isFetching)}</p>
        {error != null && <p>Error: {String(error)}</p>}
        {data != null && <pre>{JSON.stringify(data, null, 2)}</pre>}
      </section>
      <section aria-label="Loader state">
        <h2>Loader</h2>
        <pre>{JSON.stringify({ loading, progress, error: loaderError }, null, 2)}</pre>
      </section>
      <section aria-label="Query cache">
        <h2>Query cache ({queries.length} queries)</h2>
        <ul>
          {queries.map((q) => (
            <li key={q.queryKey.join('-')}>
              {q.queryKey.join(', ')} — {q.state.status}
            </li>
          ))}
        </ul>
        <button type="button" onClick={() => queryClient.clear()}>
          Clear cache
        </button>
      </section>
    </div>
  )
}
