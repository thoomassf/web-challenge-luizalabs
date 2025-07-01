'use client'

import { Edit, Heart, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFavoriteProductsList } from "@/http/favoriteProducts/post-create-favorite-products-list";
import { toast } from "sonner";
import { useState } from "react";
import { getFavoritesProductsList } from "@/http/favoriteProducts/get-favorites-products-list";
import { useUserStore } from "@/store/userStore";
import { EditFavoriteListDialog } from "./edit-favorite-list-dialog";
import { RemoveFavoriteListDialog } from "./remove-favorite-list-dialog";


const newFavoritesListSchema = z.object({
  title: z.string().min(3, { message: "O título deve ter pelo menos 3 caracteres" }),
  description: z.string().optional(),
})

type NewFavoriteSList = z.infer<typeof newFavoritesListSchema>

export function FavoritesManager() {
  const queryClient = useQueryClient()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false)

  const { userData } = useUserStore()

  const { data: favoritesList, isLoading } = useQuery({
    queryKey: ['favorite-list'],
    queryFn: () => getFavoritesProductsList({ user_id: userData.id })
  })

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<NewFavoriteSList>({
    resolver: zodResolver(newFavoritesListSchema),
  })

  const { mutateAsync: createFavoriteListFn } = useMutation({
    mutationFn: createFavoriteProductsList,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['favorite-list'] })
    },
  })

  async function handleCreateFavoriteList(data: NewFavoriteSList) {
    try {
      await createFavoriteListFn({
        title: data.title,
        description: data.description || "",
        user_id: userData.id,
      })

      toast.success("Lista de favoritos criada com sucesso!")
      setIsCreateDialogOpen(false)
    } catch (err) {
      console.error(err)

      toast.error("Ocorreu um erro ao criar a lista de favoritos")
    }
  }

  return (
    <>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Minha Lista de Favoritos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {favoritesList && favoritesList.favoriteProducts ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{favoritesList.favoriteProducts?.title}</h3>
                <p className="text-gray-600">{favoritesList.favoriteProducts?.description}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setIsEditDialogOpen(true)} variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button onClick={() => setIsRemoveDialogOpen(true)} variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remover Lista
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{favoritesList.favoriteProducts.product_ids.length}/5 produtos favoritos</Badge>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma lista de favoritos</h3>
              <p className="text-gray-600 mb-4">Crie sua primeira lista para começar a favoritar produtos</p>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Lista de Favoritos
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Criar Lista de Favoritos</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit(handleCreateFavoriteList)}>
                    <div className="space-y-4">
                      <div>
                        <Label className="mb-2" htmlFor="title">Título *</Label>
                        <Input
                          type="text"                        
                          placeholder="Ex: Meus produtos favoritos"
                          {...register("title")}
                        />
                        {errors?.title ? (
                          <span className="text-red-500 text-sm ml-1">
                            {errors?.title.message}
                          </span>
                        ) : (
                          <br />
                        )}
                      </div>
                      <div>
                        <Label className="mb-2" htmlFor="description">Descrição</Label>
                        <Textarea
                          placeholder="Descreva sua lista de favoritos..."
                          {...register("description")}
                        />
                        {errors?.description ? (
                          <span className="text-red-500 text-sm ml-1">
                            {errors?.description.message}
                          </span>
                        ) : (
                          <br />
                        )}
                      </div>
                      <Button type="submit" disabled={isSubmitting} className="w-full">
                        Criar Lista
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardContent>
      </Card>

      {favoritesList && favoritesList.favoriteProducts && (
        <>
          <EditFavoriteListDialog 
            isOpen={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            description={favoritesList?.favoriteProducts.description || ""}
            title={favoritesList?.favoriteProducts.title || ""}
            id={favoritesList?.favoriteProducts.id || ""}
          />

          <RemoveFavoriteListDialog 
            isOpen={isRemoveDialogOpen}
            onClose={() => setIsRemoveDialogOpen(false)}
            id={favoritesList?.favoriteProducts.id || ""}
          />
        </>
      )}
    </>
  )
}