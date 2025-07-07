'use client';

import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import ModalConfirmacion from '../ui/ModalConfirmacion';
import ModalMensaje from '../ui/ModalMensaje';

type Props = {
  idArticulo: number | null;
  onSuccess?: () => void;
};

type Form = {
  id_articulo: number | null;
  nombre: string;
  descripcion: string;
  unidad_medida: number| null;
  deposito: number | null;
  tipo_articulo: number | null;
  caracteristica_fabricacion_id: number| null;
  nivel: number | null;
};

export default function FormularioModificarArticulo({ idArticulo, onSuccess }: Props) {

  const [depositos, setDepositos] = useState<any[]>([]);
  const [tiposArticulos, setTiposArticulos] = useState<any[]>([]);
  const [unidades, setUnidades] = useState<any[]>([]);
  const [caracteristicaFabricacion, setCaracteristicasFabricacion] = useState<any[]>([]);
  const [niveles, setNiveles] = useState<any[]>([]);
  const [stockInfo, setStockInfo] = useState({ stock: 0, reservado: 0 });

  const [form, setForm] = useState<Form>({
    id_articulo: idArticulo,
    nombre: "",
    descripcion: "",
    unidad_medida: null,
    deposito: null,
    tipo_articulo: null,
    caracteristica_fabricacion_id: null,
    nivel: null,
  });

  const [modalConfirmar, setModalConfirmar] = useState(false);
  const [modalMensaje, setModalMensaje] = useState<{ mostrar: boolean; mensaje: string }>({ mostrar: false, mensaje: '' });

  useEffect(() => {
    setForm((prev) => ({ ...prev, id_articulo: idArticulo }));
    if (idArticulo) fetchStock(idArticulo);
  }, [idArticulo]);

  useEffect(() => {
    const fetchData = async () => {
      const [depo, tipo_arts, uni, carc, nvels] = await Promise.all([
        fetch('/api/depositos').then((r) => r.json()),
        fetch('/api/tipo_articulo').then((r) => r.json()),
        fetch('/api/unidades_medida').then((r) => r.json()),
        fetch('/api/caracteristicas_fabricacion').then((r) => r.json()),
        fetch('/api/niveles').then((r) => r.json())
      ]);
      setDepositos(depo);
      setTiposArticulos(tipo_arts);
      setUnidades(uni);
      setCaracteristicasFabricacion(carc);
      setNiveles(nvels)
    };
    fetchData();
  }, []);

  const fetchStock = async (id: number) => {
    const res = await fetch(`/api/articulos/cantidades?id=${id}`);
    const json = await res.json();

    if (!json.error) {
      setStockInfo({
        stock: json.cantidad_stock,
        reservado: json.cantidad_reservada
      });
    }
  };

 

  const handleSubmit = async () => {
    console.log(form)

    const res = await fetch('/api/articulos/modicar_articulo', {
      method: 'PUT',
      body: JSON.stringify({
        ...form,
        fecha: new Date().toISOString()
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const json = await res.json();
    setModalConfirmar(false);
    setModalMensaje({ mostrar: true, mensaje: json.mensaje || json.error });

    if (json.ok && typeof onSuccess === 'function') {
      onSuccess();
    }
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setModalConfirmar(true);
        }}
        className="space-y-4 p-4 border rounded max-w-md"
      >

         <input
          type="text"
          placeholder="nombre"
          value={form.nombre ?? ''}
          onChange={(e) => setForm({ ...form, nombre: String(e.target.value) })}
          className="w-full border px-2 py-1"
    
        />

        <input
          type="text"
          placeholder="descripcion"
          value={form.descripcion ?? ''}
          onChange={(e) => setForm({ ...form, descripcion: String(e.target.value) })}
          className="w-full border px-2 py-1"
    
        />

        <select
          value={form.unidad_medida ?? ''}
          onChange={(e) => setForm({ ...form, unidad_medida: Number(e.target.value) })}
          className="w-full border px-2 py-1"
          required
        >
          <option value="">Seleccionar unidad</option>
          {unidades.map((u) => (
            <option key={u.id_unidad_medida} value={u.id_unidad_medida}>
              {u.descripcion}
            </option>
          ))}
        </select>

        <select
          value={form.deposito ?? ''}
          onChange={(e) => setForm({ ...form, deposito: Number(e.target.value) })}
          className="w-full border px-2 py-1"
          required
        >
          <option value="">Seleccionar deposito</option>
          {depositos.map((u) => (
            <option key={u.id_deposito} value={u.id_deposito}>
              {u.nombre}
            </option>
          ))}
        </select>

         <select
          value={form.tipo_articulo ?? ''}
          onChange={(e) => setForm({ ...form, tipo_articulo: Number(e.target.value) })}
          className="w-full border px-2 py-1"
          required
        >
          <option value="">Seleccionar tipo de artículo</option>
          {tiposArticulos.map((u) => (
            <option key={u.id_tipo_articulo} value={u.id_tipo_articulo}>
              {u.nombre}
            </option>
          ))}
        </select>

        <select
          value={form.caracteristica_fabricacion_id ?? ''}
          onChange={(e) => setForm({ ...form, caracteristica_fabricacion_id: Number(e.target.value) })}
          className="w-full border px-2 py-1"
          required
        >
          <option value="">Seleccionar caracterisicas de fabricacion</option>
          {caracteristicaFabricacion.map((u) => (
            <option key={u.id_fabricacion} value={u.id_fabricacion}>
              {u.nombre}
            </option>
          ))}
        </select>

        <select
          value={form.nivel ?? ''}
          onChange={(e) => setForm({ ...form, nivel: Number(e.target.value) })}
          className="w-full border px-2 py-1"
          required
        >
          <option value="">Seleccionar nivel</option>
          {niveles.map((u) => (
            <option key={u.id_nivel} value={u.id_nivel}>
              {u.nombre}
            </option>
          ))}
        </select>


        <Button type="submit" className="w-full">
          Guardar cambios
        </Button>
      </form>

      <ModalConfirmacion
        open={modalConfirmar}
        mensaje="¿Deseas confirmar el registro del movimiento?"
        onClose={() => setModalConfirmar(false)}
        onConfirm={handleSubmit}
      />

      <ModalMensaje
        open={modalMensaje.mostrar}
        mensaje={modalMensaje.mensaje}
        onClose={() => setModalMensaje({ mostrar: false, mensaje: '' })}
      />
    </>
  );
}
