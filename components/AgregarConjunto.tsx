'use client'

import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { CircleX, PlusCircle } from 'lucide-react'
import ModalMensaje from '../components/ui/ModalMensaje'
import ModalConfirmacion from './ui/ModalConfirmacion'

export default function FormularioAgregarConjunto() {
  const [categorias, setCategorias] = useState<any[]>([])
  const [unidades, setUnidades] = useState<any[]>([])
  const [depositos, setDepositos] = useState<any[]>([])
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)
  const [mostrarMensaje, setMostrarMensaje] = useState(false)
  const [mensajeModal, setMensajeModal] = useState('')

  const [form, setForm] = useState<{
    nombre: string;
    prefijo: string;
    descripcion: string;
    cantidad_stock: number;
    unidad_medida: number | null;
    categoria_id: number | null;
    nivel_id: number;
    cantidad_reservada: number;
    deposito: number | null;
    subconjuntos: { id_articulo: number; cantidad: number }[];
  }>({
    nombre: '',
    prefijo: '',
    descripcion: '',
    cantidad_stock: 0,
    unidad_medida: null,
    categoria_id: null,
    nivel_id: 3,
    cantidad_reservada: 0,
    deposito: null,
    subconjuntos: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const [cats, unis, depos] = await Promise.all([
        fetch('/api/categoria').then(r => r.json()),
        fetch('/api/unidades_medida').then(r => r.json()),
        fetch('/api/depositos').then(r => r.json())
      ])
      setCategorias(cats)
      setUnidades(unis)
      setDepositos(depos)
    }
    fetchData()
  }, [])

  const handleSubconjuntoChange = (index: number, field: string, value: any) => {
    const nuevos = [...form.subconjuntos]
    nuevos[index] = {
      ...nuevos[index],
      [field]: Number(value)
    }
    setForm({ ...form, subconjuntos: nuevos })
  }

  const agregarSubconjunto = () => {
    setForm({
      ...form,
      subconjuntos: [...form.subconjuntos, { id_articulo: 0, cantidad: 0 }]
    })
  }

  const eliminarSubconjunto = (index: number) => {
    const nuevos = [...form.subconjuntos]
    nuevos.splice(index, 1)
    setForm({ ...form, subconjuntos: nuevos })
  }

  const enviarFormulario = async () => {
    try {
      const res = await fetch('/api/articulos/agregar_conjunto', {
        method: 'POST',
        body: JSON.stringify({ ...form, prefijo: form.prefijo.toUpperCase() }),
        headers: { 'Content-Type': 'application/json' }
      })

      const json = await res.json()
      setMensajeModal(json.mensaje || json.error || 'Error desconocido')
    } catch (e) {
      setMensajeModal('Hubo un error al enviar el formulario.')
    } finally {
      setMostrarMensaje(true)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setMostrarConfirmacion(true)
  }

  return (
    <>
      {/* Modal Confirmación */}
      <ModalConfirmacion
        open={mostrarConfirmacion}
        onClose={() => setMostrarConfirmacion(false)}
        onConfirm={() => {
          setMostrarConfirmacion(false)
          enviarFormulario()
        }}
        mensaje="¿Estás seguro de registrar este conjunto?"
      />

      {/* Modal Mensaje */}
      <ModalMensaje
        open={mostrarMensaje}
        onClose={() => setMostrarMensaje(false)}
        mensaje={mensajeModal}
      />

      <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded max-w-2xl">
        <input
          type="text"
          placeholder="Nombre del conjunto"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          className="w-full border px-2 py-1"
          required
        />

        <input
          type="text"
          placeholder="Prefijo (en mayúsculas)"
          value={form.prefijo}
          onChange={(e) => setForm({ ...form, prefijo: e.target.value })}
          className="w-full border px-2 py-1"
          required
        />

        <select
          value={form.categoria_id ?? ''}
          onChange={(e) => setForm({ ...form, categoria_id: Number(e.target.value) })}
          className="w-full border px-2 py-1"
          required>
          <option value="">Seleccionar categoría</option>
          {categorias.map((c) => (
            <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>
          ))}
        </select>

        <input
          type="number"
          min="0"
          step="1"
          placeholder="Cantidad stock"
          value={form.cantidad_stock}
          onChange={(e) => setForm({ ...form, cantidad_stock: Math.max(0, Number(e.target.value)) })}
          className="w-full border px-2"
          required
        />
        <label htmlFor="cantidad" className='text-gray-500 text-xs'>Cantidad en stock</label>

        <select
          value={form.unidad_medida ?? ''}
          onChange={(e) => setForm({ ...form, unidad_medida: Number(e.target.value) })}
          className="w-full border px-2 py-1"
          required>
          <option value="">Seleccionar unidad</option>
          {unidades.map((u) => (
            <option key={u.id_unidad_medida} value={u.id_unidad_medida}>{u.descripcion}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          className="w-full border px-2 py-1"
        />

        <select
          value={form.deposito ?? ''}
          onChange={(e) => setForm({ ...form, deposito: Number(e.target.value) })}
          className="w-full border px-2 py-1"
          required>
          <option value="">Seleccionar deposito</option>
          {depositos.map((d) => (
            <option key={d.id_deposito} value={d.id_deposito}>{d.nombre}</option>
          ))}
        </select>

        <div className="col-span-2">
          <h3 className="text-md font-semibold mb-2">Subcomponentes</h3>
          {form.subconjuntos.map((sub, index) => (
            <div key={index} className="grid grid-cols-3 gap-2 mb-2">
              <div>
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="ID artículo"
                  value={sub.id_articulo}
                  onChange={(e) => handleSubconjuntoChange(index, 'id_articulo', e.target.value)}
                  className="border px-2 py-1"
                />
                <label className="text-gray-500 text-xs">ID subconponente</label>
              </div>
              <div>
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Cantidad"
                  value={sub.cantidad}
                  onChange={(e) => handleSubconjuntoChange(index, 'cantidad', e.target.value)}
                  className="border px-2 py-1"
                />
                <label className="text-gray-500 text-xs">Cantidad</label>
              </div>
              <Button type="button" onClick={() => eliminarSubconjunto(index)} className="bg-red-500 text-white">
                <CircleX className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" onClick={agregarSubconjunto} className="text-sm">
            <PlusCircle className="h-4 w-4" />
            <span className="ml-1">Agregar subcomponente</span>
          </Button>
        </div>

        <Button type="submit" className="w-full">Registrar Conjunto</Button>
      </form>
    </>
  )
}
