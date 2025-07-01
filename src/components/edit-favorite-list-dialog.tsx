import { z } from "zod";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PatchFavoriteList } from "@/http/favoriteProducts/patch-favorite-products-list";

interface EditFavoriteListDialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  id: string
}

const updateFavoritesListSchema = z.object({
  title: z.string().min(3, { message: "O título deve ter pelo menos 3 caracteres" }),
  description: z.string().optional(),
})

type UpdateFavoriteSList = z.infer<typeof updateFavoritesListSchema>

export function EditFavoriteListDialog({ isOpen, onClose, title, description, id }: EditFavoriteListDialogProps) {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<UpdateFavoriteSList>({
    resolver: zodResolver(updateFavoritesListSchema),
  })

  const { mutateAsync: uodateFavoriteListFn } = useMutation({
    mutationFn: PatchFavoriteList,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['favorite-list'] })
    },
  })

  async function handleUpdateFavoriteList(data: UpdateFavoriteSList) {
    try {
      await uodateFavoriteListFn({
        id,
        title: data.title,
        description: data.description || "",
      })

      toast.success("Lista de favoritos atualizada com sucesso!")
      onClose()
    } catch (err) {
      console.error(err)

      toast.error("Ocorreu um erro ao atualizar a lista de favoritos")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Lista de Favoritos</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleUpdateFavoriteList)}>
          <div className="space-y-4">
            <div>
              <Label className="mb-2" htmlFor="edit-title">Título *</Label>
              <Input
                type="text"
                defaultValue={title}
                {...register("title")}
                placeholder="Ex: Meus produtos favoritos"
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
              <Label className="mb-2" htmlFor="edit-description">Descrição</Label>
              <Textarea
                defaultValue={description}
                {...register("description")}
                placeholder="Descreva sua lista de favoritos..."
              />
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}