
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

            <Card>
                <CardHeader>
                    <CardTitle>Agregar proyecto</CardTitle>
                    <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                    <FormularioAgregarProyecto />
                </CardContent>
            </Card>

        </div>
    );
}