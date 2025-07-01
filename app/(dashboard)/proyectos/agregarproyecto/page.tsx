
import FormularioAgregarProyecto from '@/components/AgregarProyecto';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link, PlusCircle } from 'lucide-react';


export default function ProyectosPage() {
    return (
        <div>


            <Tabs defaultValue="opcion1">

                <div className="flex items-center">
                    <div className="ml-auto flex items-center gap-2">
                        <Button size="sm" variant="outline" className="h-8 gap-1">

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
                            <CardTitle>Agregar proyecto</CardTitle>
                            <CardDescription></CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FormularioAgregarProyecto />
                        </CardContent>
                    </Card>
                </TabsContent>


            </Tabs>


        </div>
    );
}