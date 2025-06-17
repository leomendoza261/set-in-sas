
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import { Tabs, TabsContent } from '@/components/ui/tabs';
import { File, Package, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import TablaMovimientos from '@/components/TablaMovimientos';

export default function MovimientosPage() {
  return (
    <div>


      <Tabs defaultValue="all">
        <div className="flex items-center">
          <div className="ml-auto flex items-center gap-2">
            <Link href={'/articulos'} >
              <Button size="sm" variant="outline" className="h-8 gap-1">
                <Package className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Articulos
                </span>
              </Button>
            </Link>

            <Button size="sm" variant="outline" className="h-8 gap-1">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Exportar Movimientos de la fecha
              </span>
            </Button>
            <Link href={'/articulos/agregarmovimiento'} >
              <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Añadir articulo
                </span>
              </Button>
            </Link>
          </div>
        </div>
        <TabsContent value="all">

        </TabsContent>
      </Tabs>
      <Card>
        <CardHeader>
          <CardTitle>Movimiento de articulos</CardTitle>
          <CardDescription>Tabla detallada de movimientos de articulos.</CardDescription>
        </CardHeader>
        <CardContent>
            <TablaMovimientos />
        </CardContent>
      </Card>
    </div>
  );
}