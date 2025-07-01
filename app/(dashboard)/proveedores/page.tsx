import TablaClientes from '@/components/Contactos/Clientes';
import TablaProveedores from '@/components/Contactos/Proveedores';
import TablaUsuarios from '@/components/Contactos/Usuarios';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File, Link, PlusCircle } from 'lucide-react';

export default function ContactosPage() {
  return (

    <div>
      <Tabs defaultValue="usuarios">
        <div className="flex items-center justify-between">

          <TabsList>
            <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
            <TabsTrigger value="proveedores">Proveedores</TabsTrigger>
            <TabsTrigger value="clientes">Clientes</TabsTrigger>
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
              <Link href={'/articulos/agregarsubconjunto'} >
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
              <Link href={'/articulos/agregarconjunto'} >
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

        <TabsContent value="usuarios">
          <Card>
            <CardHeader>
              <CardTitle>Usuarios</CardTitle>
              <CardDescription>Tabla de los usuarios y su informacion</CardDescription>
            </CardHeader>
            <CardContent>
              <TablaUsuarios />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="proveedores">
          <Card>
            <CardHeader>
              <CardTitle>Proveedores</CardTitle>
              <CardDescription>Tabla de los proveedores y su informacion</CardDescription>
            </CardHeader>
            <CardContent>
              <TablaProveedores />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clientes">
          <Card>
            <CardHeader>
              <CardTitle>Clientes</CardTitle>
              <CardDescription>Tabla de los clientes y su informacion</CardDescription>
            </CardHeader>
            <CardContent>
              <TablaClientes />
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>




  );
} 
