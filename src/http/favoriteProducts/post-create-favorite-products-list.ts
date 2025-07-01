import api from "@/lib/axios"

interface FavoriteProductsListRequest {
  title: string
  description: string | null
  user_id: string
}

export async function createFavoriteProductsList({ title, description, user_id }: FavoriteProductsListRequest) {
  await api.post('/favorite-products', {
    title,
    description: description ?? "",
    user_id
  })
}