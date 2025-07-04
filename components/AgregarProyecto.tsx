'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PlusCircle, XCircle } from 'lucide-react';
import ModalConfirmacion from '@/components/ui/ModalConfirmacion';
import ModalMensaje from '@/components/ui/ModalMensaje';

export default function FormularioAgregarProyecto() {
  const router = useRouter();

  const [clientes, setClientes] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);

  const [form, setForm] = useState({
    nombre_proyecto: '',
    cliente_id: 0 as number | null,
    estado_entrega_id: 1,
    lista_nombre: '',
    lista_usuario_id: 0 as number | null,
    conjuntos: [] as { id: number; cantidad: number; nombre?: string }[],
    subconjuntos: [] as { id: number; cantidad: number; nombre?: string }[],
    articulos: [] as { id: number; cantidad: number; nombre?: string }[]
  });

  const [mostrarNuevaLista, setMostrarNuevaLista] = useState(false);
  const listasPredefinidas = ['juego de comedor', 'antena 32mts', 'antena 45mts'];
  const [listaSeleccionada, setListaSeleccionada] = useState('');

  const [modalConfirmar, setModalConfirmar] = useState(false);
  const [modalMensaje, setModalMensaje] = useState({ mostrar: false, mensaje: '' });

  useEffect(() => {
    const fetchData = async () => {
      const [cli, usu] = await Promise.all([
        fetch('/api/clientes/clientes_nombre').then((r) => r.json()),
        fetch('/api/usuarios').then((r) => r.json())
      ]);
      setClientes(cli);
      setUsuarios(usu);
    };
    fetchData();
  }, []);

  const fetchNombreElemento = async (tipo: string, id: number) => {
    if (!id) return;
    const ruta =
      tipo === 'conjuntos'
        ? '/api/articulos/conjunto_unico'
        : tipo === 'subconjuntos'
        ? '/api/articulos/subconjunto_unico'
        : '/api/articulos/articulo_unico';

    const res = await fetch(`${ruta}?id=${id}`);
    if (!res.ok) return 'No encontrado';
    const json = await res.json();
    return json?.nombre || 'No encontrado';
  };

  const debounceTimers: Record<string, NodeJS.Timeout> = {};

  const actualizarElemento = (
    tipo: 'conjuntos' | 'subconjuntos' | 'articulos',
    index: number,
    campo: 'id' | 'cantidad',
    valor: any
  ) => {
    const copia = [...form[tipo]];
    copia[index][campo] = Number(valor);
    setForm({ ...form, [tipo]: copia });

    if (campo === 'id') {
      if (debounceTimers[`${tipo}-${index}`]) {
        clearTimeout(debounceTimers[`${tipo}-${index}`]);
      }

      debounceTimers[`${tipo}-${index}`] = setTimeout(async () => {
        const nombre = await fetchNombreElemento(tipo, Number(valor));
        const copiaConNombre = [...form[tipo]];
        copiaConNombre[index].nombre = nombre;
        setForm((prev) => ({ ...prev, [tipo]: copiaConNombre }));
      }, 100);
    }
  };

  const agregarElemento = (tipo: 'conjuntos' | 'subconjuntos' | 'articulos') => {
    setForm({
      ...form,
      [tipo]: [...form[tipo], { id: 0, cantidad: 0, nombre: '' }]
    });
  };

  const eliminarElemento = (tipo: 'conjuntos' | 'subconjuntos' | 'articulos', index: number) => {
    const copia = [...form[tipo]];
    copia.splice(index, 1);
    setForm({ ...form, [tipo]: copia });
  };

  const handleToggleNuevaLista = () => {
    const nuevaVisibilidad = !mostrarNuevaLista;
    setMostrarNuevaLista(nuevaVisibilidad);

    if (nuevaVisibilidad) {
      setListaSeleccionada('');
    } else {
      setForm((prev) => ({
        ...prev,
        lista_nombre: '',
        lista_usuario_id: null,
        conjuntos: [],
        subconjuntos: [],
        articulos: []
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalConfirmar(true);
  };

  const registrarProyecto = async () => {
    try {
      const res = await fetch('/api/proyectos/agregar_proyecto', {
        method: 'POST',
        body: JSON.stringify(form),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const json = await res.json();
      setModalConfirmar(false);

      if (json.ok) {
        setModalMensaje({ mostrar: true, mensaje: 'Proyecto registrado exitosamente' });
        setTimeout(() => {
          router.push('/proyectos');
        }, 2000);
      } else {
        setModalMensaje({ mostrar: true, mensaje: json.error || 'Error al registrar' });
      }
    } catch (err) {
      setModalConfirmar(false);
      setModalMensaje({ mostrar: true, mensaje: 'Error inesperado al registrar el proyecto' });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold">Nuevo Proyecto</h2>

        <input
          type="text"
          placeholder="Nombre del proyecto"
          value={form.nombre_proyecto}
          onChange={(e) => setForm({ ...form, nombre_proyecto: e.target.value })}
          className="w-full border px-2 py-1"
          required
        />

        <select
          value={form.cliente_id ?? ''}
          onChange={(e) =>
            setForm({ ...form, cliente_id: e.target.value === '' ? null : Number(e.target.value) })
          }
          className="w-full border px-2 py-1"
          required
        >
          <option value="">Seleccionar cliente</option>
          {clientes.map((c) => (
            <option key={c.id_cliente} value={c.id_cliente}>
              {c.nombre}
            </option>
          ))}
        </select>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="font-semibold">Lista de materiales</label>
            <Button type="button" onClick={handleToggleNuevaLista} className="ml-4">
              {mostrarNuevaLista ? 'Cancelar nueva lista' : 'Crear nueva lista de materiales'}
            </Button>
          </div>

          {!mostrarNuevaLista && (
            <select
              value={listaSeleccionada}
              onChange={(e) => setListaSeleccionada(e.target.value)}
              className="w-full border px-2 py-1"
              required
            >
              <option value="">Seleccionar predefinida</option>
              {listasPredefinidas.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          )}
        </div>

        {mostrarNuevaLista && (
          <div className="space-y-2 border p-3 rounded">
            <input
              type="text"
              placeholder="Nombre de la nueva lista"
              value={form.lista_nombre}
              onChange={(e) => setForm({ ...form, lista_nombre: e.target.value })}
              className="w-full border px-2 py-1"
              required
            />

            <select
              value={form.lista_usuario_id ?? ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  lista_usuario_id: e.target.value === '' ? null : Number(e.target.value)
                })
              }
              className="w-full border px-2 py-1"
              required
            >
              <option value="">Seleccionar usuario</option>
              {usuarios.map((u) => (
                <option key={u.id_usuario} value={u.id_usuario}>
                  {u.nombre}
                </option>
              ))}
            </select>

            {(['conjuntos', 'subconjuntos', 'articulos'] as const).map((tipo) => (
              <div className="space-y-2" key={tipo}>
                <h3 className="capitalize">{tipo}</h3>
                {form[tipo].map((el, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <label className="text-sm">ID:</label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={el.id}
                      onChange={(e) => actualizarElemento(tipo, i, 'id', e.target.value)}
                      className="border px-2 py-1 w-24"
                    />
                    <label className="text-sm">Cantidad:</label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={el.cantidad}
                      onChange={(e) => actualizarElemento(tipo, i, 'cantidad', e.target.value)}
                      className="border px-2 py-1 w-24"
                    />
                    <span className="text-xs text-gray-500">{el.nombre || 'No encontrado'}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => eliminarElemento(tipo, i)}
                    >
                      <XCircle className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
                <Button type="button" size="sm" onClick={() => agregarElemento(tipo)}>
                  <PlusCircle className="h-3.5 w-3.5" /> Agregar {tipo}
                </Button>
              </div>
            ))}
          </div>
        )}

        <Button type="submit" className="w-full">
          Registrar Proyecto
        </Button>
      </form>

      <ModalConfirmacion
        open={modalConfirmar}
        mensaje="¿Deseas confirmar el registro del proyecto?"
        onClose={() => setModalConfirmar(false)}
        onConfirm={registrarProyecto}
      />

      <ModalMensaje
        open={modalMensaje.mostrar}
        mensaje={modalMensaje.mensaje}
        onClose={() => setModalMensaje({ mostrar: false, mensaje: '' })}
      />
    </>
  );
}
