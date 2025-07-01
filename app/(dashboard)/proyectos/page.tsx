
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TablaProyectos from '@/components/TablaProyectos';
import TablaMaterialesJerarquica from '@/components/TablaProyectoCompleta';
import Link from 'next/link';

export default function ProyectosPage() {
  return (
    <div>

      <Tabs defaultValue="opcion1">

        <TabsList>
          <TabsTrigger value="opcion1">opcion 1 </TabsTrigger>
          <TabsTrigger value="opcion2">opcion 2</TabsTrigger>
        </TabsList>

        <div className="flex items-center">
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Exportar
              </span>
            </Button>
            <Link href={'/proyectos/agregarproyecto'}>
              <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Añadir proyecto
                </span>
              </Button>
            </Link>

          </div>
        </div>

        <TabsContent value="opcion1">
          <Card>
            <CardHeader>
              <CardTitle>Proyectos</CardTitle>
              <CardDescription>Tabla de detalle de articulos por proyecto</CardDescription>
            </CardHeader>
            <CardContent>
              <TablaMaterialesJerarquica />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="opcion2">
          <Card>
            <CardHeader>
              <CardTitle>Proyectos</CardTitle>
              <CardDescription>Tabla de detalle de articulos por proyecto</CardDescription>
            </CardHeader>
            <CardContent>
              <TablaProyectos />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

    </div>
  );
}