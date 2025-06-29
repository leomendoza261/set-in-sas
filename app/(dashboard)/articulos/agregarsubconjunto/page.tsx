
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import FormularioAgregarSubconjunto from '@/components/AgregarSubconjunto';


export default function AgregarSubconjuntoPage() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Añadir Subconjunto</CardTitle>
          <CardDescription>Registrar un nuevo subconjunto al inventario.</CardDescription>
        </CardHeader>
        <CardContent>
            <FormularioAgregarSubconjunto />
        </CardContent>
      </Card>
    </div>
  );
}