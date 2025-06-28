"use client"

import { useEffect, useState } from "react"

type Subconjunto = {
  id_subconjunto: number
  codigo: string
  nombre_subconjunto: string
  prefijo: string
  nivel: string
  stock: number
  cantidad_reservada: number
  cantidad_disponible: number
  unidad_medida: string
  deposito: string
}

export default function TablaSubconjuntos() {
  const [data, setData] = useState<Subconjunto[]>([])
  const [filtroId, setFiltroId] = useState("")
  const [filtroNivel, setFiltroNivel] = useState("")
  const [filtroStockCero, setFiltroStockCero] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/articulos/vista_detalle_subconjunto")
      const json: Subconjunto[] = await res.json()
      setData(json)
    }
    fetchData()
  }, [])

  const subconjuntosFiltrados = data.filter((sc) => {
    const matchId = filtroId ? String(sc.id_subconjunto).includes(filtroId) : true
    const matchNivel = filtroNivel ? sc.nivel === filtroNivel : true
    const matchStock = filtroStockCero ? sc.stock === 0 : true
    return matchId && matchNivel && matchStock
  })

  const niveles = Array.from(new Set(data.map((s) => s.nivel)))

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          value={filtroId}
          onChange={(e) => setFiltroId(e.target.value)}
          placeholder="Filtrar por ID"
          className="border rounded px-2 py-1 w-full md:w-1/3"
        />
        <select
          value={filtroNivel}
          onChange={(e) => setFiltroNivel(e.target.value)}
          className="border rounded px-2 py-1 w-full md:w-1/3"
        >
          <option value="">Todos los niveles</option>
          {niveles.map((nivel) => (
            <option key={nivel} value={nivel}>
              {nivel}
            </option>
          ))}
        </select>
        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={filtroStockCero}
            onChange={() => setFiltroStockCero(!filtroStockCero)}
          />
          <span>Solo sin stock</span>
        </label>
      </div>

      <div className="overflow-auto rounded-lg border shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">Código</th>
              <th className="border px-2 py-1">Nombre</th>
              <th className="border px-2 py-1">Prefijo</th>
              <th className="border px-2 py-1">Nivel</th>
              <th className="border px-2 py-1">Stock</th>
              <th className="border px-2 py-1">Reservado</th>
              <th className="border px-2 py-1">Disponible</th>
              <th className="border px-2 py-1">Unidad</th>
              <th className="border px-2 py-1">Depósito</th>
            </tr>
          </thead>
          <tbody>
            {subconjuntosFiltrados.map((sc) => (
              <tr key={sc.id_subconjunto}>
                <td className="border px-2 py-1">{sc.id_subconjunto}</td>
                <td className="border px-2 py-1">{sc.codigo}</td>
                <td className="border px-2 py-1">{sc.nombre_subconjunto}</td>
                <td className="border px-2 py-1">{sc.prefijo}</td>
                <td className="border px-2 py-1">{sc.nivel}</td>
                <td className="border px-2 py-1">{sc.stock}</td>
                <td className="border px-2 py-1">{sc.cantidad_reservada}</td>
                <td className="border px-2 py-1">{sc.cantidad_disponible}</td>
                <td className="border px-2 py-1">{sc.unidad_medida}</td>
                <td className="border px-2 py-1">{sc.deposito}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {subconjuntosFiltrados.length === 0 && (
          <div className="mt-4 text-center text-gray-500">No se encontraron subconjuntos.</div>
        )}
      </div>
    </div>
  )
}
