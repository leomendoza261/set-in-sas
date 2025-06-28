"use client"

import { useEffect, useState } from "react"

type Conjunto = {
  id_conjunto: number
  codigo: string
  nombre_conjunto: string
  prefijo: string
  categoria: string
  nivel: string
  stock: number
  cantidad_reservada: number
  cantidad_disponible: number
  unidad_medida: string
  deposito: string
}

export default function TablaConjuntos() {
  const [data, setData] = useState<Conjunto[]>([])
  const [categorias, setCategorias] = useState<string[]>([])
  const [filtroId, setFiltroId] = useState("")
  const [filtroCategoria, setFiltroCategoria] = useState("")
  const [filtroStockCero, setFiltroStockCero] = useState(false)

  useEffect(() => {
    const fetchConjuntos = async () => {
      const res = await fetch("/api/articulos/vista_detalle_conjunto")
      const json: Conjunto[] = await res.json()
      setData(json)
    }

    const fetchCategorias = async () => {
      const res = await fetch("/api/categoria")
      const json = await res.json()
      const nombres = json.map((cat: { nombre: string }) => cat.nombre)
      setCategorias(nombres)
    }

    fetchConjuntos()
    fetchCategorias()
  }, [])

  const conjuntosFiltrados = data.filter((c) => {
    const matchId = filtroId ? String(c.id_conjunto).includes(filtroId) : true
    const matchCategoria = filtroCategoria ? c.categoria === filtroCategoria : true
    const matchStock = filtroStockCero ? c.stock === 0 : true
    return matchId && matchCategoria && matchStock
  })

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
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="border rounded px-2 py-1 w-full md:w-1/3"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((categoria) => (
            <option key={categoria} value={categoria}>
              {categoria}
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
              <th className="border px-2 py-1">Categoría</th>
              <th className="border px-2 py-1">Nivel</th>
              <th className="border px-2 py-1">Stock</th>
              <th className="border px-2 py-1">Reservado</th>
              <th className="border px-2 py-1">Disponible</th>
              <th className="border px-2 py-1">Unidad</th>
              <th className="border px-2 py-1">Depósito</th>
            </tr>
          </thead>
          <tbody>
            {conjuntosFiltrados.map((c) => (
              <tr key={c.id_conjunto}>
                <td className="border px-2 py-1">{c.id_conjunto}</td>
                <td className="border px-2 py-1">{c.codigo}</td>
                <td className="border px-2 py-1">{c.nombre_conjunto}</td>
                <td className="border px-2 py-1">{c.prefijo}</td>
                <td className="border px-2 py-1">{c.categoria}</td>
                <td className="border px-2 py-1">{c.nivel}</td>
                <td className="border px-2 py-1">{c.stock}</td>
                <td className="border px-2 py-1">{c.cantidad_reservada}</td>
                <td className="border px-2 py-1">{c.cantidad_disponible}</td>
                <td className="border px-2 py-1">{c.unidad_medida}</td>
                <td className="border px-2 py-1">{c.deposito}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {conjuntosFiltrados.length === 0 && (
          <div className="mt-4 text-center text-gray-500">No se encontraron conjuntos.</div>
        )}
      </div>
    </div>
  )
}
