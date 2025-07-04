import FormularioAgregarCliente from '@/components/Contactos/FormularioAgregarCliente';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export default function AgregarClientePage() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Añadir Cliente</CardTitle>
          <CardDescription>Registrar un nuevo cliente.</CardDescription>
        </CardHeader>
        <CardContent>
            <FormularioAgregarCliente />
        </CardContent>
      </Card>
    </div>
  );
}