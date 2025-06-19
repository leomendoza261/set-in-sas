'use client';

import { useEffect, useState } from 'react';

interface Material {
  cliente: string;
  proyecto: string;
  id_articulo: number
  articulo: string;
  tipo: string;
  cantidad: number;
  stock: number;
  comprar: number;
}
 
export default function TablaProyectos() {
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [clienteFiltro, setClienteFiltro] = useState('');
  const [proyectoFiltro, setProyectoFiltro] = useState('');

  const [clientesUnicos, setClientesUnicos] = useState<string[]>([]);
  const [proyectosUnicos, setProyectosUnicos] = useState<string[]>([]);

  useEffect(() => {
    const fetchMateriales = async () => {
      const params = new URLSearchParams();
      if (clienteFiltro) params.append('cliente', clienteFiltro);
      if (proyectoFiltro) params.append('proyecto', proyectoFiltro);

      const res = await fetch(`/api/proyectos?${params.toString()}`);
      const data: Material[] = await res.json();
      setMateriales(data);
      console.log(data)

      // Armar filtros únicos
      const clientes = Array.from(new Set(data.map((m) => m.cliente)));
      const proyectos = Array.from(new Set(data.map((m) => m.proyecto)));
      setClientesUnicos(clientes);
      setProyectosUnicos(proyectos);
    };

    fetchMateriales();
  }, [clienteFiltro, proyectoFiltro]);

  return (
    <div className="p-4 space-y-4">


      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-4">
        <select
          value={clienteFiltro}
          onChange={e => setClienteFiltro(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Todos los clientes</option>
          {clientesUnicos.map(cliente => (
            <option key={cliente} value={cliente}>
              {cliente}
            </option>
          ))}
        </select>

        <select
          value={proyectoFiltro}
          onChange={e => setProyectoFiltro(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Todos los proyectos</option>
          {proyectosUnicos.map(proyecto => (
            <option key={proyecto} value={proyecto}>
              {proyecto}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla */}
      <div className="overflow-auto rounded-lg border shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="border px-2 py-1">Cliente</th>
              <th className="border px-2 py-1">Proyecto</th>
              <th className="border px-2 py-1">ID articulo</th>
              <th className="border px-2 py-1">Articulo</th>
              <th className="border px-2 py-1">Tipo</th>
              <th className="border px-2 py-1">Cantidad</th>
              <th className="border px-2 py-1">Stock</th>
              <th className="border px-2 py-1">Comprar</th>
            </tr>
          </thead>
          <tbody>
            {materiales.map((m, i) => (
              <tr key={i} className="text-sm text-center">
                <td className="border px-2 py-1">{m.cliente}</td>
                <td className="border px-2 py-1">{m.proyecto}</td>
                <td className="border px-2 py-1">{m.id_articulo}</td>
                <td className="border px-2 py-1">{m.articulo}</td>
                <td className="border px-2 py-1">{m.tipo}</td>
                <td className="border px-2 py-1">{m.cantidad}</td>
                <td className="border px-2 py-1">{m.stock}</td>
                <td className="border px-2 py-1 font-semibold text-red-600">
                  {m.comprar}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
