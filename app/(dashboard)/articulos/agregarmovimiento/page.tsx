
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Camera, File, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FormularioMovimiento from '@/components/AgregarMovimientos';

export default function AgregarMovimientoPage() {
  return (
    <div>


      <Tabs >
        <div className="flex items-center">
          <div className="ml-auto flex items-center gap-2 mb-1">
            <Button size="sm" className="h-8 gap-1">
              <Camera className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Lector QR
              </span>
            </Button>
          </div>
        </div>
        
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Añadir movimiento</CardTitle>
          <CardDescription>Registrar ingreso o egreso de un articulo.</CardDescription>
        </CardHeader>
        <CardContent>
            <FormularioMovimiento idArticulo={null} />
        </CardContent>
      </Card>
    </div>
  );
}