'use client';

import { Html5Qrcode } from 'html5-qrcode';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Camera } from 'lucide-react';

type Props = {
  onCodigoDetectado: (codigo: string) => void;
};

export default function EscanerArticulo({ onCodigoDetectado }: Props) {
  const [scanning, setScanning] = useState(false);

  const startScanner = async () => {
    setScanning(true);

    // Esperar a que el DOM renderice el #qr-reader
    await new Promise((resolve) => setTimeout(resolve, 100));

    const qrElement = document.getElementById('qr-reader');
    if (!qrElement) {
      console.error('Elemento con id="qr-reader" no encontrado');
      return;
    }

    const scanner = new Html5Qrcode('qr-reader');

    await scanner.start(
      { facingMode: 'environment' },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      (decodedText) => {
        scanner.stop();
        setScanning(false);

        let id: number | null = null;

        // Caso 1: formato híbrido: "ID:1|http://..."
        if (decodedText.includes("ID:")) {
          const match = decodedText.match(/ID:(\d+)/);
          if (match) id = Number(match[1]);
        }
        // Caso 2: solo ID (por compatibilidad)
        else if (/^\d+$/.test(decodedText)) {
          id = Number(decodedText);
        }
        // Caso 3: solo URL con ?id=#
        else if (decodedText.includes("?id=")) {
          const url = new URL(decodedText);
          const idParam = url.searchParams.get("id");
          if (idParam) id = Number(idParam);
        }

        if (id && !isNaN(id)) {
          console.log("ID detectado:", id);
          onCodigoDetectado(String(id));
        } else {
          alert("No se pudo detectar un ID válido en el QR.");
        }
      },
      (err) => {
        // Puedes ignorar errores menores de escaneo
      }
    );
  };

  return (
    <div>
      <Button size="sm" className="h-8 gap-1" onClick={startScanner}>
        <Camera className="h-4 w-4" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          Lector QR
        </span>
      </Button>

      {scanning && <div id="qr-reader" className="mt-4 border p-2 rounded" />}
    </div>
  );
}
