"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Phone,
  Mail,
  Pencil,
  Eye,
  MoreHorizontal,
} from "lucide-react";

interface Usuario {
  id_usuario: number;
  nombre: string;
}

export default function TablaUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    const fetchUsuarios = async () => {
      const res = await fetch("/api/usuarios");
      const data = await res.json();
      setUsuarios(data);
    };
    fetchUsuarios();
  }, []);

  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Usuarios</h2>

      <input
        type="text"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        placeholder="Filtrar por nombre"
        className="border px-2 py-1 w-full md:w-1/3 rounded"
      />

      <div className="overflow-auto rounded-lg border shadow">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1 text-left">Nombre</th>
              <th className="border px-2 py-1">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map((usuario) => (
              <tr key={usuario.id_usuario}>
                <td className="border px-2 py-1 text-center">{usuario.id_usuario}</td>
                <td className="border px-2 py-1">{usuario.nombre}</td>
                <td className="border px-2 py-1 text-center space-x-1">
                  <Button size="icon" variant="ghost" className="h-6 w-6" title="Llamar">
                    <Phone size={12} />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-6 w-6" title="Enviar correo">
                    <Mail size={12} />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-6 w-6" title="Editar">
                    <Pencil size={12} />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-6 w-6" title="Ver detalle">
                    <Eye size={12} />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-6 w-6" title="Más acciones">
                    <MoreHorizontal size={12} />
                  </Button>
                </td>
              </tr>
            ))}
            {usuariosFiltrados.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center text-gray-500 py-4">
                  No se encontraron usuarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
