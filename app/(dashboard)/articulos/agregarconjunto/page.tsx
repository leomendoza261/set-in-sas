
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import FormularioAgregarConjunto from '@/components/AgregarConjunto';


export default function AgregarConjuntoPage() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Añadir Conjunto</CardTitle>
          <CardDescription>Registrar un nuevo conjunto al inventario.</CardDescription>
        </CardHeader>
        <CardContent>
            <FormularioAgregarConjunto />
        </CardContent>
      </Card>
    </div>
  );
}