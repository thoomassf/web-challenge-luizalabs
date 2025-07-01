import api from "@/lib/axios"

interface PostRemoveProductToListRequest {
  id: string
  product_id: string
}

export async function PostRemoveProductToList({ id, product_id }: PostRemoveProductToListRequest) {
  await api.post(`/favorite-products/${id}/remove`, {
    product_id
  })
}