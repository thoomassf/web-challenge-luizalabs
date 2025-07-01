import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { TabsContent } from "./ui/tabs";
import { Badge } from "./ui/badge";
import type { Product } from "@/types/Product";
import Image from "next/image";
import useListControl from "@/hooks/useListControl";

interface CatalogProductsProps {
  products: Product[]
  favoriteProducts: string[]
  favoriteProductsListId: string
}

export function ProductsCatalog({ products, favoriteProducts, favoriteProductsListId }: CatalogProductsProps) {
  const { handleFavoriteProduct, handleRemoveProduct } = useListControl({ favoriteProductsListId })

  return (
    <TabsContent value="catalog">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-square relative flex items-center justify-center">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.title}
                className="object-cover"
                width={200}
                height={200}
              />
              <Button
                size="sm"
                variant={favoriteProducts.includes(String(product.id)) ? "default" : "outline"}
                className="absolute top-2 right-2"
                onClick={() => {
                  if (favoriteProducts.includes(String(product.id))) {
                    handleRemoveProduct(String(product.id))
                  } else {
                    handleFavoriteProduct(String(product.id))
                  }
                }}
              >
                <Heart className={`h-4 w-4 ${favoriteProducts.includes(String(product.id)) ? "fill-current" : ""}`} />
              </Button>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
              <Badge variant="outline" className="mb-2">
                {product.category}
              </Badge>
              <p className="text-2xl font-bold text-green-600">R$ {product.price.toFixed(2).replace(".", ",")}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </TabsContent>
  )
}