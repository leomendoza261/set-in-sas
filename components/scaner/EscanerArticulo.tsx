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
        onCodigoDetectado(decodedText);
      },
      (err) => {
        // podés ignorar errores por ahora
      }
    );
  };

  return (
    <div>
      <Button size="sm" className="h-8 gap-1" onClick={startScanner}>
        <Camera className="h-4 w-4" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Lector QR</span>
      </Button>

      {scanning && <div id="qr-reader" className="mt-4 border p-2 rounded" />}
    </div>
  );
}
