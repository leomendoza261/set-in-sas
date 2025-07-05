import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import FormularioMovimiento from './AgregarMovimientos';

type Props = {
  open: boolean;
  onClose: () => void;
  idArticulo: number | null;
  onSuccess?: () => void;
};

export default function ModalMovimiento({ open, onClose, idArticulo, onSuccess }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Registrar Movimiento</DialogTitle>
        </DialogHeader>

        <FormularioMovimiento idArticulo={idArticulo} onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
}
