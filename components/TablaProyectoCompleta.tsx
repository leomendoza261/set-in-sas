"use client";

import { useEffect, useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Eye, Pencil, MoreHorizontal } from "lucide-react";

interface Material {
  cliente: string;
  proyecto: string;
  id_material: number;
  nivel: "C" | "S" | "P";
  nombre: string;
  cantidad: string;
  stock: number;
  cantidad_reservada: number;
  disponible: number;
  comprar_o_fabricar: number;
  id_receta_padre: number | null;
  id_padre: number | null;
  nivel_padre: "C" | "S" | null;
  nombre_padre: string | null;
}

export default function TablaMaterialesJerarquica() {
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [clientes, setClientes] = useState<string[]>([]);
  const [proyectos, setProyectos] = useState<string[]>([]);
  const [filtroCliente, setFiltroCliente] = useState("");
  const [filtroProyecto, setFiltroProyecto] = useState("");
  const [expandido, setExpandido] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const fetchMateriales = async () => {
      const res = await fetch("/api/proyectos/activos_completa");
      const data: Material[] = await res.json();
      setMateriales(data);

      const clientesUnicos = Array.from(new Set(data.map((m) => m.cliente)));
      setClientes(clientesUnicos);
    };

    fetchMateriales();
  }, []);

  useEffect(() => {
    if (!filtroCliente) return setProyectos([]);
    const proyectosFiltrados = Array.from(
      new Set(
        materiales
          .filter((m) => m.cliente === filtroCliente)
          .map((m) => m.proyecto)
      )
    );
    setProyectos(proyectosFiltrados);
  }, [filtroCliente, materiales]);

  const toggleExpandido = (id: number) => {
    setExpandido((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const materialesFiltrados = materiales.filter((m) => {
    return (
      (!filtroCliente || m.cliente === filtroCliente) &&
      (!filtroProyecto || m.proyecto === filtroProyecto)
    );
  });

  const materialesRaiz = materialesFiltrados.filter((m) => !m.id_padre);

  const getChildren = (padre: Material): Material[] => {
    return materialesFiltrados.filter(
      (m) => m.id_padre === padre.id_material && m.nivel_padre === padre.nivel
    );
  };

  const renderFila = (material: Material, nivel: number = 0): ReactNode => {
    const hijos = getChildren(material);
    const tieneHijos = hijos.length > 0;
    const indent = nivel * 16;

    return (
      <>
        <tr key={`${material.nivel}-${material.id_material}`}>
          <td className="border px-2 py-1 text-sm">{material.cliente}</td>
          <td className="border px-2 py-1 text-sm">{material.proyecto}</td>
          <td className="border px-2 py-1 text-sm" style={{ paddingLeft: indent }}>
            {tieneHijos && (
              <button
                className="mr-1 text-gray-500 hover:text-black"
                onClick={() => toggleExpandido(material.id_material)}
              >
                {expandido[material.id_material] ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </button>
            )}
            {material.nombre}
          </td>
          <td className="border px-2 py-1 text-sm">{material.nivel}</td>
          <td className="border px-2 py-1 text-sm">{material.cantidad}</td>
          <td className="border px-2 py-1 text-sm">{material.stock}</td>
          <td className="border px-2 py-1 text-sm">{material.cantidad_reservada}</td>
          <td className="border px-2 py-1 text-sm">{material.disponible}</td>
          <td className="border px-2 py-1 text-sm">{material.comprar_o_fabricar}</td>
          <td className="border px-1 py-1 text-sm space-x-1">
            <Button size="icon" variant="ghost" className="h-6 w-6"><Eye size={12} /></Button>
            <Button size="icon" variant="ghost" className="h-6 w-6"><Pencil size={12} /></Button>
            <Button size="icon" variant="ghost" className="h-6 w-6"><MoreHorizontal size={12} /></Button>
          </td>
        </tr>
        {expandido[material.id_material] &&
          hijos.map((hijo) => renderFila(hijo, nivel + 1))}
      </>
    );
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-wrap gap-4">
        <select
          value={filtroCliente}
          onChange={(e) => setFiltroCliente(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="">Todos los clientes</option>
          {clientes.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={filtroProyecto}
          onChange={(e) => setFiltroProyecto(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="">Todos los proyectos</option>
          {proyectos.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div className="overflow-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="border px-2 py-1">Cliente</th>
              <th className="border px-2 py-1">Proyecto</th>
              <th className="border px-2 py-1 text-left">Nombre</th>
              <th className="border px-2 py-1">Nivel</th>
              <th className="border px-2 py-1">Cantidad</th>
              <th className="border px-2 py-1">Stock</th>
              <th className="border px-2 py-1">Reservado</th>
              <th className="border px-2 py-1">Disponible</th>
              <th className="border px-2 py-1">A comprar/fabricar</th>
              <th className="border px-2 py-1">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {materialesRaiz.map((m) => renderFila(m))}
            {materialesRaiz.length === 0 && (
              <tr>
                <td colSpan={10} className="text-center py-4 text-gray-500">
                  No hay datos para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
