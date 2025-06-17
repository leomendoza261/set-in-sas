'use client';

import { useEffect, useState } from 'react';

interface Material {
  cliente: string;
  proyecto: string;
  item: string;
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
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Materiales por Proyecto</h2>

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
      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Cliente</th>
              <th className="p-2 border">Proyecto</th>
              <th className="p-2 border">Item</th>
              <th className="p-2 border">Tipo</th>
              <th className="p-2 border">Cantidad</th>
              <th className="p-2 border">Stock</th>
              <th className="p-2 border">Comprar</th>
            </tr>
          </thead>
          <tbody>
            {materiales.map((m, i) => (
              <tr key={i} className="text-sm text-center">
                <td className="p-2 border">{m.cliente}</td>
                <td className="p-2 border">{m.proyecto}</td>
                <td className="p-2 border">{m.item}</td>
                <td className="p-2 border">{m.tipo}</td>
                <td className="p-2 border">{m.cantidad}</td>
                <td className="p-2 border">{m.stock}</td>
                <td className="p-2 border font-semibold text-red-600">
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
