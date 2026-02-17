/** Product metadata from mock REST API — used for demo and TanStack Query integration */
export interface ProductMeta {
  id: string
  name: string
  description: string
  modelUrl: string
  thumbnail?: string
}

const MOCK_PRODUCTS: Record<string, ProductMeta> = {
  '1': {
    id: '1',
    name: 'Demo Product',
    description: 'A sample 3D product for the viewer.',
    modelUrl: '/models/demo.glb',
  },
}

const MOCK_DELAY_MS = 400

/** Fetches product metadata — in production would call real API; here we simulate with delay */
async function fetchProductMeta(id: string): Promise<ProductMeta> {
  await new Promise((r) => setTimeout(r, MOCK_DELAY_MS))
  const product = MOCK_PRODUCTS[id]
  if (!product) throw new Error(`Product not found: ${id}`)
  return product
}

/** TanStack Query key factory */
export const productKeys = {
  all: ['products'] as const,
  detail: (id: string) => [...productKeys.all, id] as const,
}

import { useQuery } from '@tanstack/react-query'

/** Hook to fetch product metadata with caching and offline fallback */
export function useProductQuery(productId: string) {
  return useQuery({
    queryKey: productKeys.detail(productId),
    queryFn: () => fetchProductMeta(productId),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  })
}
