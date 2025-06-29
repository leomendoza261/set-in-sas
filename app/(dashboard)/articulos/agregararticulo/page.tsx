
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import FormularioAgregarArticulo from '@/components/AgregarArticulo';


export default function AgregarArticuloPage() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Añadir Articulo</CardTitle>
          <CardDescription>Registrar un nuevo articulo al inventario.</CardDescription>
        </CardHeader>
        <CardContent>
            <FormularioAgregarArticulo />
        </CardContent>
      </Card>
    </div>
  );
}