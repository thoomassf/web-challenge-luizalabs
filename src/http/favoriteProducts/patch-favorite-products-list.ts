import api from "@/lib/axios"

interface PatchFavoriteListRequest {
  id: string
  title: string
  description: string
}

export async function PatchFavoriteList({ id, title, description }: PatchFavoriteListRequest) {
  await api.patch(`/favorite-products/${id}`, {
    title: title ?? "",
    description: description ?? "",
  })
}