'use client';

import { Html5Qrcode } from 'html5-qrcode';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Camera } from 'lucide-react';
import ModalMensaje from '../ui/ModalMensaje';

type Props = {
  onCodigoDetectado: (codigo: string) => void;
};

export default function EscanerArticulo({ onCodigoDetectado }: Props) {
  const [scanning, setScanning] = useState(false);
  const [modalMensaje, setModalMensaje] = useState<{
    mostrar: boolean;
    mensaje: string;
  }>({
    mostrar: false,
    mensaje: '',
  });

  const startScanner = async () => {
    setScanning(true);

    setTimeout(async () => {
      const scanner = new Html5Qrcode('qr-reader');

      try {
        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 300, height: 300 } },
          (decodedText) => {
            scanner.stop().then(() => {
              setScanning(false);

              let id = null;

              try {
                if (decodedText.startsWith('http')) {
                  const url = new URL(decodedText);
                  id = url.searchParams.get('id');
                } else {
                  id = decodedText;
                }

                const num = Number(id);

                if (!isNaN(num)) {
                  onCodigoDetectado(num.toString());
                } else {
                  throw new Error();
                }
              } catch {
                setModalMensaje({
                  mostrar: true,
                  mensaje: `Código inválido: ${decodedText}`,
                });
              }
            });
          },
          (error) => {
            // Errores silenciosos durante el escaneo
          }
        );
      } catch (err) {
        console.error('Error iniciando scanner:', err);
        setScanning(false);
      }
    }, 100);
  };

  return (
    <>
      <Button size="sm" className="h-8 gap-1" onClick={startScanner}>
        <Camera className="h-4 w-4" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          Lector QR
        </span>
      </Button>

      {scanning && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="relative">
            <div
              id="qr-reader"
              className="w-[300px] h-[300px] rounded-md shadow-lg border-4 border-white"
            />
            <button
              className="absolute top-0 right-0 m-2 text-white bg-red-500 hover:bg-red-600 rounded-full px-2 py-1 text-xs"
              onClick={() => setScanning(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <ModalMensaje
        open={modalMensaje.mostrar}
        mensaje={modalMensaje.mensaje}
        onClose={() => setModalMensaje({ mostrar: false, mensaje: '' })}
      />
    </>
  );
}
