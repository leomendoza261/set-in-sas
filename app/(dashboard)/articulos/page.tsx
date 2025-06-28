import TablaArticulos from '@/components/TablaArticulos';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeftRight, File, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import TablaSubconjuntos from '@/components/TablaSubconjuntos';
import TablaConjuntos from '@/components/TablaConjuntos';

export default function ArticulosPage() {
  return (
    <div>
      <Tabs defaultValue="articulos">
        <div className="flex items-center justify-between">

          <TabsList>
            <TabsTrigger value="articulos">Articulos</TabsTrigger>
            <TabsTrigger value="subconjuntos">Subconjuntos</TabsTrigger>
            <TabsTrigger value="conjuntos">Conjuntos</TabsTrigger>
          </TabsList>

          <TabsContent value="articulos">
            <div className="ml-auto flex items-end gap-2">
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
          </TabsContent>

          <TabsContent value="subconjuntos">
            <div className="ml-auto flex items-end gap-2">
              <Button size="sm" variant="outline" className="h-8 gap-1">
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Exportar
                </span>
              </Button>
              <Link href={'#'} >
                <Button size="sm" className="h-8 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Añadir subconjunto
                  </span>
                </Button>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="conjuntos">
            <div className="ml-auto flex items-end gap-2">
              <Button size="sm" variant="outline" className="h-8 gap-1">
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Exportar
                </span>
              </Button>
              <Link href={'#'} >
                <Button size="sm" className="h-8 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Añadir conjunto
                  </span>
                </Button>
              </Link>
            </div>
          </TabsContent>

        </div>

        <TabsContent value="articulos">
          <Card>
            <CardHeader>
              <CardTitle>Articulos</CardTitle>
              <CardDescription>Tabla de articulos y sus detalles.</CardDescription>
            </CardHeader>
            <CardContent>
              <TablaArticulos />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subconjuntos">
          <Card>
            <CardHeader>
              <CardTitle>Subconjuntos</CardTitle>
              <CardDescription>Tabla de subconjuntos y sus detalles.</CardDescription>
            </CardHeader>
            <CardContent>
              <TablaSubconjuntos />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="conjuntos">
          <Card>
            <CardHeader>
              <CardTitle>Conjuntos</CardTitle>
              <CardDescription>Tabla de conjuntos y sus detalles.</CardDescription>
            </CardHeader>
            <CardContent>
              <TablaConjuntos />
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

    </div>
  );
}