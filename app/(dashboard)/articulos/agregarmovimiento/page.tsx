'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import { Tabs } from '@/components/ui/tabs';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FormularioMovimiento from '@/components/AgregarMovimientos';
import EscanerArticulo from "@/components/scaner/EscanerArticulo"; // lo creamos ahora
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function AgregarMovimientoPage() {
  const searchParams = useSearchParams();
  const idFromUrl = searchParams.get('id');
  const [idArticulo, setIdArticulo] = useState<number | null>(
    idFromUrl ? Number(idFromUrl) : null
  );

  return (
    <div>
      <Tabs>
        <div className="flex items-center">
          <div className="ml-auto flex items-center gap-2 mb-1">
            <EscanerArticulo
              onCodigoDetectado={(codigo) => {
                const num = Number(codigo);
                if (!isNaN(num)) {
                  setIdArticulo(num);
                }
              }}
            />
          </div>
        </div>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Añadir movimiento</CardTitle>
          <CardDescription>
            Registrar ingreso o egreso de un artículo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormularioMovimiento idArticulo={idArticulo} />
        </CardContent>
      </Card>
    </div>
  );
}
