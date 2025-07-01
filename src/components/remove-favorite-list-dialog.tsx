import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteFavoriteList } from "@/http/favoriteProducts/delete-favorite-products-list";

interface RemoveFavoriteListDialogProps {
  isOpen: boolean
  onClose: () => void  
  id: string
}

export function RemoveFavoriteListDialog({ isOpen, onClose, id }: RemoveFavoriteListDialogProps) {
  const queryClient = useQueryClient()

  const { mutateAsync: removeFavoriteListFn } = useMutation({
    mutationFn: DeleteFavoriteList,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['favorite-list'] })
    },
  })

  async function handleDeleteFavoriteList() {
    try {
      await removeFavoriteListFn({ id })

      toast.success("Lista de favoritos deletada com sucesso!")
      onClose()
    } catch (err) {
      console.error(err)

      toast.error("Ocorreu um erro ao deletar a lista de favoritos")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Lista de Favoritos</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-4">
          <p>Tem certeza que deseja remover está lista de favoritos ? <br /> Todos os produtos dentro dela serão desmarcados. </p>
          <Button className="hover:cursor-pointer" onClick={handleDeleteFavoriteList}>Deletar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}