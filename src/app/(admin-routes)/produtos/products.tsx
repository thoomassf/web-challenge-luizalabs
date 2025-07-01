'use client'

import { FavoriteProducts } from "@/components/favorite-products";
import { FavoritesManager } from "@/components/favorites-manager";
import { ProductsCatalog } from "@/components/products-catalog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, LogOut, ShoppingBag } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/http/fakestore/get-products";
import { useUserStore } from "@/store/userStore";
import { getFavoritesProductsList } from "@/http/favoriteProducts/get-favorites-products-list";
import { Button } from "@/components/ui/button";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export default function Products() {
  const router = useRouter()

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  })

  const { userData } = useUserStore()

  const { data: favoritesList, isLoading } = useQuery({
    queryKey: ['favorite-list'],
    queryFn: () => getFavoritesProductsList({ user_id: userData.id })
  })

  if (isLoading) {
    return <p>Carregando...</p>
  }
  
  const currentFavoriteProducts = () => {
    if (favoritesList?.favoriteProducts) {
      products?.filter((product) => favoritesList?.favoriteProducts?.product_ids.includes(String(product.id)))
    } else {
      return 0
    }
  }

  function handleLogout() {
    deleteCookie("token")
    router.push("/entrar")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Loja de Produtos</h1>
            <p className="text-gray-600">Gerencie sua lista de produtos favoritos</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium text-gray-900">{userData.username}</p>
              <p className="text-sm text-gray-600">{userData.email}</p>
            </div>
            <Button onClick={() => handleLogout()} variant="outline" size="sm" className="hover:cursor-pointer">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        <FavoritesManager />

        <Tabs defaultValue="catalog" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="catalog" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Catálogo de Produtos
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Meus Favoritos ({favoritesList?.favoriteProducts?.product_ids.length || 0})
            </TabsTrigger>
          </TabsList>

          <ProductsCatalog 
            products={products || []} 
            favoriteProducts={favoritesList?.favoriteProducts?.product_ids || []}
            favoriteProductsListId={favoritesList?.favoriteProducts?.id || ''}
          />
          <FavoriteProducts 
            favoriteProducts={currentFavoriteProducts || []} 
            favoriteProductsListId={favoritesList?.favoriteProducts?.id || ''}
          />
        </Tabs>
      </div>
    </div>
  )
}