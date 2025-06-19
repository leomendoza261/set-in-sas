
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import { Tabs, TabsContent } from '@/components/ui/tabs';
import { CalendarPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ComponenteTurnos from '@/components/DashboardProgramacion';
import Link from 'next/link';


export default function ProgramacionPage() {
  return (
    <div>


      <Tabs defaultValue="all">
        <div className="flex items-center">
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
        <TabsContent value="all">

        </TabsContent>
      </Tabs>
      <Card>
        <CardHeader>
          <CardTitle>Programacion</CardTitle>
          <CardDescription>Visualizacion de tareas programadas</CardDescription>
        </CardHeader>
        <CardContent>
          <ComponenteTurnos />
        </CardContent>
      </Card>
    </div>
  );
}