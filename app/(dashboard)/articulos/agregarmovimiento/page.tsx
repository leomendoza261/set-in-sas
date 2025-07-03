
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import { Tabs, TabsContent } from '@/components/ui/tabs';
import { File, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FormularioMovimiento from '@/components/AgregarMovimientos';

export default function AgregarMovimientoPage() {
  return (
    <div>


      <Tabs defaultValue="all">
        <div className="flex items-center">
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Exportar Movimientos de la fecha
              </span>
            </Button>
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Algo?
              </span>
            </Button>
          </div>
        </div>
        <TabsContent value="all">

        </TabsContent>
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