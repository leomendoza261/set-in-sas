'use client';

import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { CircleX, PlusCircle } from 'lucide-react';

export default function FormularioAgregarSubconjunto() {
  const [unidades, setUnidades] = useState<any[]>([]);
  const [depositos, setDepositos] = useState<any[]>([]);
  const [form, setForm] = useState<{
    nombre: string;
    prefijo: string;
    descripcion: string;
    cantidad_stock: number;
    unidad_medida: number | null;
    nivel_id: number;
    cantidad_reservada: number;
    deposito: number | null;
    articulos: { id_articulo: number; cantidad: number }[];
  }>({
    nombre: '',
    prefijo: '',
    descripcion: '',
    cantidad_stock: 0,
    unidad_medida: null,
    nivel_id: 2,
    cantidad_reservada: 0,
    deposito: null,
    articulos: [],
  });


  useEffect(() => {
    const fetchData = async () => {
      const [ unis, depos] = await Promise.all([
        fetch('/api/unidades_medida').then(r => r.json()),
        fetch('/api/depositos').then(r => r.json())
      ]);
      setUnidades(unis);
      setDepositos(depos)
    };
    fetchData();
  }, []);

  const handleSubconjuntoChange = (index: number, field: string, value: any) => {
    const nuevos = [...form.articulos];
    nuevos[index] = {
      ...nuevos[index],
      [field]: field === 'cantidad' ? Number(value) : Number(value)
    };
    setForm({ ...form, articulos: nuevos });
  };

  const agregarArticulo = () => {
    setForm({
      ...form,
      articulos: [...form.articulos, { id_articulo: 0, cantidad: 0 }]
    });
  };

  const eliminarArticulo = (index: number) => {
    const nuevos = [...form.articulos];
    nuevos.splice(index, 1);
    setForm({ ...form, articulos: nuevos });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(form)

    const res = await fetch('/api/articulos/agregar_subconjunto', {
      method: 'POST',
      body: JSON.stringify({
        ...form,
        prefijo: form.prefijo.toUpperCase(),
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const json = await res.json();
    alert(json.mensaje || json.error);
  };



  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded max-w-2xl ">
      <input
        type="text"
        placeholder="Nombre del subconjunto"
        value={form.nombre}
        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
        className="w-full border px-2 py-1 col-span-2"
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

      <input
        type="number"
        min="0"
        step="1"
        placeholder="Cantidad stock"
        value={form.cantidad_stock}
        onChange={(e) =>
          setForm({
            ...form,
            cantidad_stock: Math.max(0, Number(e.target.value)), // extra protección en JS
          })
        }
        className="w-full border px-2"
        required
      />
      <label htmlFor="cantidad en stock" className='text-gray-500 text-xs'>cantidad en stock</label>

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
        className="w-full border px-2 py-1 col-span-2"
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

      {/* Subcomponentes */}
      <div className="col-span-2">
        <h3 className="text-md font-semibold mb-2">Piezas o articulos</h3>
        {form.articulos.map((sub, index) => (
          <div key={index} className="grid grid-cols-3 gap-2 mb-2 ">
            <div>
              <input
                type="number"
                min="0"
                step="1"
                placeholder="ID artículo"
                value={sub.id_articulo}
                onChange={(e) => handleSubconjuntoChange(index, 'id_articulo', e.target.value)}
                className="border px-2 py-1 mr-2"
              />
              <label htmlFor="ID subconponente" className='text-gray-500 text-xs'>ID articulo</label>
            </div>
            <div>
              <input
                type="number"
                min="0"
                step="1"
                placeholder="Cantidad"
                value={sub.cantidad}
                onChange={(e) => handleSubconjuntoChange(index, 'cantidad', e.target.value)}
                className="border px-2 py-1 mr-2"
              />
              <label htmlFor="cantidad" className='text-gray-500 text-xs'>cantidad</label>
            </div>

            <Button type="button" onClick={() => eliminarArticulo(index)} className="bg-red-500 text-white px-2 rounded hover:bg-red-600"><CircleX className="h-3.5 w-3.5" /><span className="sr-only sm:not-sr-only sm:whitespace-nowrap"> Eliminar pieza/articulo</span></Button>
          </div>
        ))}
        <Button type="button" onClick={agregarArticulo} className="text-white text-sm">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap"> Agregar pieza o articulo</span>
        </Button>
      </div>

      <Button type="submit" className="rounded w-full col-span-2 px-4 py-2">
        Registrar Subonjunto
      </Button>
    </form>

  );
}



