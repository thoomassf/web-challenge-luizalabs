import api from "@/lib/axios"

interface FavoriteProductsListRequest {
  user_id: string
}

export interface FavoriteProductsListResponse {
  favoriteProducts: {
    id: string
    title: string
    description: string | null
    product_ids: string[]
    user_id: string
  }
}

export async function getFavoritesProductsList({ user_id }: FavoriteProductsListRequest) {
  const response = await api.get(`/favorite-products/${user_id}`)

  const data: FavoriteProductsListResponse = response.data

  return data
}