import { PostAddProductToList } from "@/http/favoriteProducts/post-add-product-to-list"
import { PostRemoveProductToList } from "@/http/favoriteProducts/post-remove-product-to-list"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

interface useListControlProps {
  favoriteProductsListId: string
}

export default function useListControl({ favoriteProductsListId }: useListControlProps) {
  const queryClient = useQueryClient()

  async function handleFavoriteProduct(productId: string) {
    try {
      await PostAddProductToList({
        id: favoriteProductsListId,
        product_id: productId
      })

      toast.error("Produto adicionado aos favoritos")
      queryClient.invalidateQueries({ queryKey: ['favorite-list'] })
    } catch (err) {
      console.log(err)
      toast.error("Não foi possível adicionar o produto aos favoritos")
    }
  }

  async function handleRemoveProduct(productId: string) {
    try {
      await PostRemoveProductToList({
        id: favoriteProductsListId,
        product_id: productId
      })

      queryClient.invalidateQueries({ queryKey: ['favorite-list'] })
    } catch (err) {
      console.log(err)
    }
  }

  return {
    handleFavoriteProduct,
    handleRemoveProduct
  }
}