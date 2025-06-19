import TablaArticulos from '@/components/TablaArticulos';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import { Tabs, TabsContent } from '@/components/ui/tabs';
import { ArrowLeftRight, File, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ArticulosPage() {
  return (
    <div>
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Exportar
              </span>
            </Button>
            <Link href={'/articulos/agregararticulo'} >
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
          <CardTitle>Articulos</CardTitle>
          <CardDescription>Tabla de articulos y sus detalles.</CardDescription>
        </CardHeader>
        <CardContent>
          <TablaArticulos />
        </CardContent>
      </Card>
    </div>
  );
}