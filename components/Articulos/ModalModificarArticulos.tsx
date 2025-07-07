// components/modals/ModalEditarArticulo.tsx
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import FormularioModificarArticulo from './ModificarArticulo';

type Props = {
  open: boolean;
  onClose: () => void;
  idArticulo: number | null;
  onSuccess?: () => void;
};

export default function ModalEditarArticulo({ open, onClose, idArticulo, onSuccess }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle >Editar artículo</DialogTitle>
        </DialogHeader>

        <FormularioModificarArticulo idArticulo={idArticulo} onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
}
