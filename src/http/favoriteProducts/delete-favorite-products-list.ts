import api from "@/lib/axios"

interface DeleteFavoriteListRequest {
  id: string
}

export async function DeleteFavoriteList({ id }: DeleteFavoriteListRequest) {
  await api.delete(`/favorite-products/${id}`)
}