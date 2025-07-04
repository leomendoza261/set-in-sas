import FormularioAgregarProveedor from '@/components/Contactos/FormularioAgregarProveedor';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export default function AgregarProveedorPage() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Añadir Proveedor</CardTitle>
          <CardDescription>Registrar un nuevo proveedor.</CardDescription>
        </CardHeader>
        <CardContent>
            <FormularioAgregarProveedor />
        </CardContent>
      </Card>
    </div>
  );
}