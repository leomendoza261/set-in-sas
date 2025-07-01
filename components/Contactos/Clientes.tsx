"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Pencil, Info, Trash2, Eye, MoreHorizontal } from "lucide-react";

export default function TablaClientes() {
    const [clientes, setClientes] = useState<any[]>([]);
    const [filtroNombre, setFiltroNombre] = useState("");

    useEffect(() => {
        const fetchClientes = async () => {
            const res = await fetch("/api/clientes");
            const data = await res.json();
            setClientes(data);
        };
        fetchClientes();
    }, []);

    const clientesFiltrados = clientes.filter((cliente) =>
        cliente.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
    );

    return (
        <div className="p-4 space-y-4">
            <h2 className="text-xl font-semibold">Listado de Clientes</h2>

            <input
                type="text"
                placeholder="Filtrar por nombre"
                value={filtroNombre}
                onChange={(e) => setFiltroNombre(e.target.value)}
                className="w-full border px-3 py-2 rounded"
            />

            <div className="overflow-auto rounded-lg border shadow-sm">
                <table className="w-full text-sm">
                    <thead className="bg-muted/40">
                        <tr>
                            <th className="border px-2 py-1 text-left">ID</th>
                            <th className="border px-2 py-1 text-left">Nombre</th>
                            <th className="border px-2 py-1 text-left">CUIT</th>
                            <th className="border px-2 py-1 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientesFiltrados.map((cliente) => (
                            <tr key={cliente.id_cliente}>
                                <td className="border px-2 py-1">{cliente.id_cliente}</td>
                                <td className="border px-2 py-1">{cliente.nombre}</td>
                                <td className="border px-2 py-1">{cliente.cuit}</td>
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
                    </tbody>
                </table>
                {clientesFiltrados.length === 0 && (
                    <div className="mt-4 text-center text-gray-500">No se encontraron clientes.</div>
                )}
            </div>
        </div>
    );
}