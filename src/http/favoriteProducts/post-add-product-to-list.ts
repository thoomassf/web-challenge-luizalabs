import api from "@/lib/axios"

interface PostAddProductToListRequest {
  id: string
  product_id: string
}

export async function PostAddProductToList({ id, product_id }: PostAddProductToListRequest) {
  await api.post(`/favorite-products/${id}/add`, {
    product_id
  })
}