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
import { File, PlusCircle } from 'lucide-react';
import Link from 'next/link';

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

          <TabsContent value="usuarios">
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
                    Añadir usuario
                  </span>
                </Button>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="proveedores">
            <div className="ml-auto flex items-end gap-2">
              <Button size="sm" variant="outline" className="h-8 gap-1">
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Exportar
                </span>
              </Button>
              <Link href={'/proveedores/agregarproveedor'} >
                <Button size="sm" className="h-8 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Añadir proveedor
                  </span>
                </Button>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="clientes">
            <div className="ml-auto flex items-end gap-2">
              <Button size="sm" variant="outline" className="h-8 gap-1">
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Exportar
                </span>
              </Button>
              <Link href={'/proveedores/agregarcliente'} >
                <Button size="sm" className="h-8 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Añadir cliente
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
