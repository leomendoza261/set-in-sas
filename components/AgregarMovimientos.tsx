'use client';

import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import ModalConfirmacion from './ui/ModalConfirmacion';
import ModalMensaje from './ui/ModalMensaje';

type Props = {
  idArticulo: number | null;
  onSuccess?: () => void;
};

type Form = {
  id_proveedor: number | null;
  id_operador: number | null;
  id_articulo: number | null;
  cantidad: number | null;
  unidad_medida: number | null;
  id_proyecto: number | null;
  tipo_movimiento_id: number;
};

export default function FormularioMovimiento({ idArticulo, onSuccess }: Props) {
  const [tipo, setTipo] = useState('1');
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [unidades, setUnidades] = useState<any[]>([]);
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [stockInfo, setStockInfo] = useState({ stock: 0, reservado: 0 });

  const [form, setForm] = useState<Form>({
    tipo_movimiento_id: 1,
    id_proveedor: null,
    id_operador: null,
    id_articulo: idArticulo,
    cantidad: null,
    unidad_medida: 1,
    id_proyecto: null
  });

  const [modalConfirmar, setModalConfirmar] = useState(false);
  const [modalMensaje, setModalMensaje] = useState<{ mostrar: boolean; mensaje: string }>({ mostrar: false, mensaje: '' });

  useEffect(() => {
    setForm((prev) => ({ ...prev, id_articulo: idArticulo }));
    if (idArticulo) fetchStock(idArticulo);
  }, [idArticulo]);

  useEffect(() => {
    const fetchData = async () => {
      const [prov, user, uni, proj] = await Promise.all([
        fetch('/api/proveedores').then((r) => r.json()),
        fetch('/api/usuarios').then((r) => r.json()),
        fetch('/api/unidades_medida').then((r) => r.json()),
        fetch('/api/proyectos/activos').then((r) => r.json())
      ]);
      setProveedores(prov);
      setUsuarios(user);
      setUnidades(uni);
      setProyectos(proj);
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

  const handleCantidadChange = (value: string) => {
    const cantidad = Number(value);
    let limite = Infinity;

    if (tipo === '2') limite = stockInfo.reservado;
    if (tipo === '3') limite = stockInfo.stock - stockInfo.reservado;

    setForm((prev) => ({ ...prev, cantidad: Math.max(0, Math.min(cantidad, limite)) }));
  };

  const handleSubmit = async () => {
    const res = await fetch('/api/articulos/movimientos', {
      method: 'POST',
      body: JSON.stringify({
        ...form,
        tipo_movimiento_id: Number(tipo),
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
        <select
          value={tipo}
          onChange={(e) => {
            setTipo(e.target.value);
            setForm((prev) => ({
              ...prev,
              tipo_movimiento_id: Number(e.target.value),
              id_proveedor: null,
              id_operador: null
            }));
          }}
          className="w-full border px-2 py-1"
        >
          <option value="1">Ingreso</option>
          <option value="2">Egreso</option>
          <option value="3">Reserva</option>
        </select>

        {tipo === '1' ? (
          <select
            value={form.id_proveedor ?? ''}
            onChange={(e) => setForm({ ...form, id_proveedor: Number(e.target.value) })}
            className="w-full border px-2 py-1"
            required
          >
            <option value="">Seleccionar proveedor</option>
            {proveedores.map((p) => (
              <option key={p.id_proveedor} value={p.id_proveedor}>
                {p.nombre}
              </option>
            ))}
          </select>
        ) : (
          <select
            value={form.id_operador ?? ''}
            onChange={(e) => setForm({ ...form, id_operador: Number(e.target.value) })}
            className="w-full border px-2 py-1"
            required
          >
            <option value="">Seleccionar operador</option>
            {usuarios.map((u) => (
              <option key={u.id_usuario} value={u.id_usuario}>
                {u.nombre}
              </option>
            ))}
          </select>
        )}

        <input
          type="number"
          placeholder="ID Artículo"
          value={form.id_articulo ?? ''}
          onChange={(e) => {
            const id = Number(e.target.value);
            setForm((prev) => ({ ...prev, id_articulo: id }));
            if (id) fetchStock(id);
          }}
          className="w-full border px-2 py-1"
          required
        />

        <input
          type="number"
          min={1}
          placeholder="Cantidad"
          value={form.cantidad ?? ''}
          onChange={(e) => handleCantidadChange(e.target.value)}
          className="w-full border px-2 py-1"
          required
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

        {tipo !== '1' && (
          <select
            value={form.id_proyecto ?? ''}
            onChange={(e) => setForm({ ...form, id_proyecto: Number(e.target.value) })}
            className="w-full border px-2 py-1"
          >
            <option value="">Seleccionar proyecto</option>
            {proyectos.map((p) => (
              <option key={p.id_proyecto} value={p.id_proyecto}>
                {p.nombre}
              </option>
            ))}
          </select>
        )}

        <Button type="submit" className="w-full">
          Registrar movimiento
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
