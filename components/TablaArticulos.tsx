"use client"

import { useEffect, useState } from "react"

type ArticuloRaw = {
  id_articulo: number
  nombre_articulo: string
  tipo_articulo: string
  stock: number
  unidad_medida: string
  deposito: string
  atributo: string | null
  unidad_atributo: string | null
  valor: string | null
}

type ArticuloAgrupado = {
  id_articulo: number
  nombre_articulo: string
  tipo_articulo: string
  stock: number
  unidad_medida: string
  deposito: string
  atributos: Record<string, string>
}

export default function TablaArticulos() {
  const [data, setData] = useState<ArticuloRaw[]>([])
  const [articulos, setArticulos] = useState<ArticuloAgrupado[]>([])
  const [filtroId, setFiltroId] = useState("")
  const [filtroTipo, setFiltroTipo] = useState("")
  const [filtroStockCero, setFiltroStockCero] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/articulos/vista_detalle_articulo")
      const json: ArticuloRaw[] = await res.json()
      setData(json)
    }
    fetchData()
  }, [])

  useEffect(() => {
    const agrupados: Record<number, ArticuloAgrupado> = {}

    data.forEach((item) => {
      const existing = agrupados[item.id_articulo]
      if (!existing) {
        agrupados[item.id_articulo] = {
          id_articulo: item.id_articulo,
          nombre_articulo: item.nombre_articulo,
          tipo_articulo: item.tipo_articulo,
          stock: item.stock,
          unidad_medida: item.unidad_medida,
          deposito: item.deposito,
          atributos: {},
        }
      }

      if (item.atributo && item.valor) {
        agrupados[item.id_articulo].atributos[item.atributo] = `${item.valor} ${item.unidad_atributo ?? ""}`.trim()
      }
    })

    const resultado = Object.values(agrupados)
    setArticulos(resultado)
  }, [data])

  const articulosFiltrados = articulos.filter((art) => {
    const matchId = filtroId ? String(art.id_articulo).includes(filtroId) : true
    const matchTipo = filtroTipo ? art.tipo_articulo === filtroTipo : true
    const matchStock = filtroStockCero ? art.stock === 0 : true
    return matchId && matchTipo && matchStock
  })

  const tiposArticulo = Array.from(new Set(articulos.map((a) => a.tipo_articulo)))

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
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="border rounded px-2 py-1 w-full md:w-1/3"
        >
          <option value="">Todos los tipos</option>
          {tiposArticulo.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
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
              <th className="border px-2 py-1">Nombre</th>
              <th className="border px-2 py-1">Tipo</th>
              <th className="border px-2 py-1">Stock</th>
              <th className="border px-2 py-1">Unidad</th>
              <th className="border px-2 py-1">Depósito</th>
              <th className="border px-2 py-1">Atributos</th>
            </tr>
          </thead>
          <tbody>
            {articulosFiltrados.map((art) => (
              <tr key={art.id_articulo}>
                <td className="border px-2 py-1">{art.id_articulo}</td>
                <td className="border px-2 py-1">{art.nombre_articulo}</td>
                <td className="border px-2 py-1">{art.tipo_articulo}</td>
                <td className="border px-2 py-1">{art.stock}</td>
                <td className="border px-2 py-1">{art.unidad_medida}</td>
                <td className="border px-2 py-1">{art.deposito}</td>
                <td className="border px-2 py-1">
                  {Object.entries(art.atributos).map(([clave, valor]) => (
                    <div className="text-xs" key={clave}>
                      <strong>{clave}:</strong> {valor}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {articulosFiltrados.length === 0 && (
          <div className="mt-4 text-center text-gray-500">No se encontraron artículos.</div>
        )}
      </div>
    </div>
  )
}
