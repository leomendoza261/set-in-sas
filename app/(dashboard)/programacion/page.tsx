
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

import Link from 'next/link';
import ComponenteTurnos from '@/components/ComponenteTurnos';


export default function ProgramacionPage() {
  return (
    <div>


      <Tabs defaultValue="usuario 1">
        <div className="flex items-center">

          <TabsList>
            <TabsTrigger value="usuario 1">Usuario 1</TabsTrigger>
            <TabsTrigger value="usuario 2">Usuario 2</TabsTrigger>
            <TabsTrigger value="usuario 3">Usuario 3</TabsTrigger>
            <TabsTrigger value="usuario 4">Usuario 4</TabsTrigger>
            <TabsTrigger value="usuario 5">Usuario 5</TabsTrigger>
          </TabsList>

          <div className="ml-auto flex items-center gap-2">
            <Link href={'/programacion/agregartarea'} >
              <Button size="sm" className="h-8 gap-1">
                <CalendarPlus className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Asignar Tarea
                </span>
              </Button>
            </Link>
          </div>
        </div>

        <TabsContent value="usuario 1">
          <Card>
            <CardHeader>
              <CardTitle>usuario 1</CardTitle>
              <CardDescription>Visualizacion de tareas programadas</CardDescription>
            </CardHeader>
            <CardContent>
              <ComponenteTurnos usuario="usuario 1"/>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usuario 2">
          <Card>
            <CardHeader>
              <CardTitle>usuario 2</CardTitle>
              <CardDescription>Visualizacion de tareas programadas</CardDescription>
            </CardHeader>
            <CardContent>
              <ComponenteTurnos usuario="usuario 2" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

    </div>
  );
}