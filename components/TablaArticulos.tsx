"use client"

import { ArrowLeftRight, Pencil } from "lucide-react"
import { useEffect, useState } from "react"
import ModalMovimiento from "./ModalMovimiento"
import { Skeleton } from "./ui/skeleton"
import ModalEditarArticulo from "./Articulos/ModalModificarArticulos"


type ArticuloRaw = {
  id_articulo: number
  codigo: string
  nombre_articulo: string
  tipo_articulo: string
  caracteristica: string
  stock: number
  cantidad_reservada: number
  cantidad_disponible: number
  unidad_medida: string
  deposito: string
  atributo: string | null
  unidad_atributo: string | null
  valor: string | null
}

type ArticuloAgrupado = {
  caracteristica: string
  cantidad_reservada: number
  cantidad_disponible: number
  codigo: string
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
  const [tiposArticulo, setTiposArticulo] = useState<string[]>([])
  const [caracteristicas, setCaracteristicas] = useState<string[]>([])

  const [filtroId, setFiltroId] = useState("")
  const [filtroNombre, setFiltroNombre] = useState("")
  const [filtroTipo, setFiltroTipo] = useState("")
  const [filtroCaracteristica, setFiltroCaracteristica] = useState("")
  const [filtroStockCero, setFiltroStockCero] = useState(false)

  const [modalAbierto, setModalAbierto] = useState(false)
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<number | null>(null)

  const abrirModalMovimiento = (id: number) => {
    setArticuloSeleccionado(id)
    setModalAbierto(true)
  }

  const abrirModalModificar = (id: number) => {
    setArticuloSeleccionado(id);
    setModalEditarAbierto(true);
  };


  const refetchData = async () => {
    const res = await fetch("/api/articulos/vista_detalle_articulo");
    const json: ArticuloRaw[] = await res.json();
    setData(json);
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/articulos/vista_detalle_articulo")
      const json: ArticuloRaw[] = await res.json()
      setData(json)
      console.log(json)
    }

    const fetchTipos = async () => {
      const res = await fetch("/api/tipo_articulo")
      const json = await res.json()
      const nombres = json.map((tipo: { nombre: string }) => tipo.nombre)
      setTiposArticulo(nombres)
    }

    const fetchCaracteristicas = async () => {
      const res = await fetch("/api/caracteristicas_fabricacion")
      const json = await res.json()
      const nombres = json.map((c: { nombre: string }) => c.nombre)
      setCaracteristicas(nombres)
    }

    fetchData()
    fetchTipos()
    fetchCaracteristicas()
  }, [setModalAbierto])

  useEffect(() => {
    const agrupados: Record<number, ArticuloAgrupado> = {}

    data.forEach((item) => {
      const existing = agrupados[item.id_articulo]
      if (!existing) {
        agrupados[item.id_articulo] = {
          id_articulo: item.id_articulo,
          codigo: item.codigo,
          nombre_articulo: item.nombre_articulo,
          tipo_articulo: item.tipo_articulo,
          caracteristica: item.caracteristica,
          stock: item.stock,
          cantidad_reservada: item.cantidad_reservada,
          cantidad_disponible: item.cantidad_disponible,
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
    const matchCaract = filtroCaracteristica ? art.caracteristica === filtroCaracteristica : true
    const matchStock = filtroStockCero ? art.stock === 0 : true
    const matchNombre = filtroNombre ? art.nombre_articulo.toLowerCase().includes(filtroNombre.toLowerCase()) : true
    return matchId && matchTipo && matchCaract && matchStock && matchNombre
  })

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col md:flex-row gap-6 flex-wrap">
        <input
          type="text"
          value={filtroId}
          onChange={(e) => setFiltroId(e.target.value)}
          placeholder="Filtrar por ID"
          className="border rounded px-2 py-1 w-full md:w-1/5"
        />

        <input
          type="text"
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
          placeholder="Filtrar por nombre"
          className="border rounded px-2 py-1 w-full md:w-1/5"
        />

        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="border rounded px-2 py-1 w-full md:w-1/5"
        >
          <option value="">Todos los tipos</option>
          {tiposArticulo.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>

        <select
          value={filtroCaracteristica}
          onChange={(e) => setFiltroCaracteristica(e.target.value)}
          className="border rounded px-2 py-1 w-full md:w-1/5"
        >
          <option value="">Todas las características</option>
          {caracteristicas.map((c) => (
            <option key={c} value={c}>
              {c}
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
              <th className="border px-2 py-1">Tipo de material</th>
              <th className="border px-2 py-1">Característica fab.</th>
              <th className="border px-2 py-1">Stock</th>
              <th className="border px-2 py-1">Reservado</th>
              <th className="border px-2 py-1">Disponible</th>
              <th className="border px-2 py-1">Unidad</th>
              <th className="border px-2 py-1">Depósito</th>
              <th className="border px-2 py-1">Atributos</th>
              <th className="border px-2 py-1">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {articulosFiltrados.map((art) => (
              <tr key={art.id_articulo}>
                <td className="border px-2 py-1">{art.id_articulo}</td>
                <td className="border px-2 py-1">{art.codigo}</td>
                <td className="border px-2 py-1">{art.nombre_articulo}</td>
                <td className="border px-2 py-1">{art.tipo_articulo}</td>
                <td className="border px-2 py-1">{art.caracteristica}</td>
                <td className="border px-2 py-1">{art.stock}</td>
                <td className="border px-2 py-1">{art.cantidad_reservada}</td>
                <td className="border px-2 py-1">{art.cantidad_disponible}</td>
                <td className="border px-2 py-1">{art.unidad_medida}</td>
                <td className="border px-2 py-1">{art.deposito}</td>
                <td className="border px-2 py-1">
                  {Object.entries(art.atributos).map(([clave, valor]) => (
                    <div className="text-xs" key={clave}>
                      <strong>{clave}:</strong> {valor}
                    </div>
                  ))}
                </td>
                <td className="border px-2 py-1 space-x-1 text-center">
                  <button className="text-blue-500 " onClick={() => abrirModalMovimiento(art.id_articulo)}><ArrowLeftRight className="h-3.5 w-3.5" /></button>
                  <button className="text-blue-500 " onClick={() => abrirModalModificar(art.id_articulo)}><Pencil className="h-3.5 w-3.5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {articulosFiltrados.length === 0 && (
          <>
            <Skeleton className="h-[20px] w-full rounded-full my-2">Cargando</Skeleton>
            {/* <div className="mt-4 text-center text-gray-500">No se encontraron artículos.</div> */}
          </>

        )}
      </div>

      <ModalMovimiento
        open={modalAbierto}
        onClose={() => setModalAbierto(false)}
        idArticulo={articuloSeleccionado}
        onSuccess={() => {
          setModalAbierto(false);
          refetchData(); // vuelve a hacer fetch y actualiza la tabla
        }}
      />

      <ModalEditarArticulo
        open={modalEditarAbierto}
        onClose={() => setModalEditarAbierto(false)}
        idArticulo={articuloSeleccionado}
        onSuccess={() => {
          setModalEditarAbierto(false);
          refetchData();
        }}
      />

    </div>
  )
}
