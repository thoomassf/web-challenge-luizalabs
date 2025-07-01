import type { Product } from "@/types/Product";

export async function getProducts() {
  const response = await fetch(process.env.NEXT_PUBLIC_FAKESTORE_API_URL + '/products', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const data: Product[] = await response.json()

  return data
}