// components/FormularioAgregarCliente.tsx
'use client';

import { useState } from 'react';
import { Button } from '../ui/button';

import ModalMensaje from '../ui/ModalMensaje';
import ModalConfirmacion from '../ui/ModalConfirmacion';

export default function FormularioAgregarCliente() {
  const [form, setForm] = useState({
    nombre: '',
    cuit: '',
  });

  const [modalConfirmar, setModalConfirmar] = useState(false);
  const [modalMensaje, setModalMensaje] = useState({
    mostrar: false,
    mensaje: '',
  });

  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/clientes/agregar_cliente', {
        method: 'POST',
        body: JSON.stringify(form),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const json = await res.json();

      setModalConfirmar(false);
      setModalMensaje({
        mostrar: true,
        mensaje: json.mensaje || json.error || 'Error desconocido',
      });

      if (res.ok) {
        setForm({ nombre: '', cuit: '' });
      }
    } catch (error) {
      console.error(error);
      setModalMensaje({
        mostrar: true,
        mensaje: 'Error al conectar con el servidor.',
      });
    }
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setModalConfirmar(true);
        }}
        className="space-y-4 max-w-md p-4 border rounded"
      >

        <input
          type="text"
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          className="w-full border px-2 py-1"
          required
        />

        <input
          type="text"
          placeholder="CUIT"
          value={form.cuit}
          onChange={(e) => setForm({ ...form, cuit: e.target.value })}
          className="w-full border px-2 py-1"
          required
        />

        <Button type="submit" className="w-full">
          Registrar Cliente
        </Button>
      </form>

      <ModalConfirmacion
        open={modalConfirmar}
        mensaje="¿Deseas confirmar el registro del cliente?"
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
