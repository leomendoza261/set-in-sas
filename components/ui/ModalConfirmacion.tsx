"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./dialog";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  titulo?: string;
  mensaje: string;
  textoConfirmar?: string;
  textoCancelar?: string;
};

export default function ModalConfirmacion({
  open,
  onClose,
  onConfirm,
  titulo = "¿Estás seguro?",
  mensaje,
  textoConfirmar = "Aceptar",
  textoCancelar = "Cancelar"
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
        </DialogHeader>
        <div className="py-2 text-sm">{mensaje}</div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>{textoCancelar}</Button>
          <Button onClick={() => { onConfirm(); onClose(); }}>{textoConfirmar}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
