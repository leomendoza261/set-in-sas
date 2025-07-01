"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, XCircle } from "lucide-react";

export default function FormularioAgregarProyecto() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);

  const [form, setForm] = useState({
    nombre_proyecto: "",
    cliente_id: 0 as number | null,
    estado_entrega_id: 1,
    lista_nombre: "",
    lista_usuario_id: 0 as number | null,
    conjuntos: [] as { id: number; cantidad: number; nombre?: string }[],
    subconjuntos: [] as { id: number; cantidad: number; nombre?: string }[],
    articulos: [] as { id: number; cantidad: number; nombre?: string }[],
  });

  const [mostrarNuevaLista, setMostrarNuevaLista] = useState(false);
  const listasPredefinidas = ["juego de comedor", "antena 32mts", "antena 45mts"];
  const [listaSeleccionada, setListaSeleccionada] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const [cli, usu] = await Promise.all([
        fetch("/api/clientes/clientes_nombre").then((r) => r.json()),
        fetch("/api/usuarios").then((r) => r.json()),
      ]);
      setClientes(cli);
      setUsuarios(usu);
    };
    fetchData();
  }, []);

  const fetchNombreElemento = async (tipo: string, id: number) => {
    if (!id) return;
    const ruta = tipo === "conjuntos"
      ? "/api/articulos/conjunto_unico"
      : tipo === "subconjuntos"
        ? "/api/articulos/subconjunto_unico"
        : "/api/articulos/articulo_unico";

    const res = await fetch(`${ruta}?id=${id}`);
    if (!res.ok) return "No encontrado";
    const json = await res.json();
    return json?.nombre || "No encontrado";
  };

  const debounceTimers: Record<string, NodeJS.Timeout> = {};

  const actualizarElemento = (tipo: "conjuntos" | "subconjuntos" | "articulos", index: number, campo: "id" | "cantidad", valor: any) => {
    const copia = [...form[tipo]];
    copia[index][campo] = Number(valor);
    setForm({ ...form, [tipo]: copia });

    if (campo === "id") {
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

  const agregarElemento = (tipo: "conjuntos" | "subconjuntos" | "articulos") => {
    setForm({
      ...form,
      [tipo]: [...form[tipo], { id: 0, cantidad: 0, nombre: "" }],
    });
  };

  const eliminarElemento = (tipo: "conjuntos" | "subconjuntos" | "articulos", index: number) => {
    const copia = [...form[tipo]];
    copia.splice(index, 1);
    setForm({ ...form, [tipo]: copia });
  };

  const handleToggleNuevaLista = () => {
    const nuevaVisibilidad = !mostrarNuevaLista;
    setMostrarNuevaLista(nuevaVisibilidad);

    if (nuevaVisibilidad) {
      setListaSeleccionada("");
    } else {
      setForm((prev) => ({
        ...prev,
        lista_nombre: "",
        lista_usuario_id: null,
        conjuntos: [],
        subconjuntos: [],
        articulos: []
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
  };

  return (
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
        value={form.cliente_id ?? ""}
        onChange={(e) => setForm({ ...form, cliente_id: e.target.value === "" ? null : Number(e.target.value) })}
        className="w-full border px-2 py-1"
        required
      >
        <option value="">Seleccionar cliente</option>
        {clientes.map((c) => (
          <option key={c.id_cliente} value={c.id_cliente}>{c.nombre}</option>
        ))}
      </select>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="font-semibold">Lista de materiales</label>
          <Button type="button" onClick={handleToggleNuevaLista} className="ml-4">
            {mostrarNuevaLista ? "Cancelar nueva lista" : "Crear nueva lista de materiales"}
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
              <option key={l} value={l}>{l}</option>
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
            value={form.lista_usuario_id ?? ""}
            onChange={(e) => setForm({ ...form, lista_usuario_id: e.target.value === "" ? null : Number(e.target.value) })}
            className="w-full border px-2 py-1"
            required
          >
            <option value="">Seleccionar usuario</option>
            {usuarios.map((u) => (
              <option key={u.id_usuario} value={u.id_usuario}>{u.nombre}</option>
            ))}
          </select>

          {/* Conjuntos */}
          <div className="space-y-2">
            <h3>Conjuntos</h3>
            {form.conjuntos.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <label className="text-sm">ID Conjunto:</label>
                <input type="number" min={1} required value={c.id} onChange={(e) => actualizarElemento("conjuntos", i, "id", e.target.value)} className="border px-2 py-1 w-24" />
                <label className="text-sm">Cantidad:</label>
                <input type="number" min={1} required value={c.cantidad} onChange={(e) => actualizarElemento("conjuntos", i, "cantidad", e.target.value)} className="border px-2 py-1 w-24" />
                <span className="text-xs text-gray-500">{c.nombre || "No encontrado"}</span>
                <Button type="button" variant="ghost" size="icon" onClick={() => eliminarElemento("conjuntos", i)}><XCircle className="w-4 h-4 text-red-500" /></Button>
              </div>
            ))}
            <Button type="button" size="sm" onClick={() => agregarElemento("conjuntos")}><PlusCircle className="h-3.5 w-3.5" /> Conjunto</Button>
          </div>

          {/* Subconjuntos */}
          <div className="space-y-2">
            <h3>Subconjuntos</h3>
            {form.subconjuntos.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <label className="text-sm">ID Subconjunto:</label>
                <input type="number" min={1} required value={s.id} onChange={(e) => actualizarElemento("subconjuntos", i, "id", e.target.value)} className="border px-2 py-1 w-24" />
                <label className="text-sm">Cantidad:</label>
                <input type="number" min={1} required value={s.cantidad} onChange={(e) => actualizarElemento("subconjuntos", i, "cantidad", e.target.value)} className="border px-2 py-1 w-24" />
                <span className="text-xs text-gray-500">{s.nombre || "No encontrado"}</span>
                <Button type="button" variant="ghost" size="icon" onClick={() => eliminarElemento("subconjuntos", i)}><XCircle className="w-4 h-4 text-red-500" /></Button>
              </div>
            ))}
            <Button type="button" size="sm" onClick={() => agregarElemento("subconjuntos")}><PlusCircle className="h-3.5 w-3.5" /> Subconjunto</Button>
          </div>

          {/* Artículos */}
          <div className="space-y-2">
            <h3>Artículos</h3>
            {form.articulos.map((a, i) => (
              <div key={i} className="flex items-center gap-2">
                <label className="text-sm">ID Artículo:</label>
                <input type="number" min={1} required value={a.id} onChange={(e) => actualizarElemento("articulos", i, "id", e.target.value)} className="border px-2 py-1 w-24" />
                <label className="text-sm">Cantidad:</label>
                <input type="number" min={1} required value={a.cantidad} onChange={(e) => actualizarElemento("articulos", i, "cantidad", e.target.value)} className="border px-2 py-1 w-24" />
                <span className="text-xs text-gray-500">{a.nombre || "No encontrado"}</span>
                <Button type="button" variant="ghost" size="icon" onClick={() => eliminarElemento("articulos", i)}><XCircle className="w-4 h-4 text-red-500" /></Button>
              </div>
            ))}
            <Button type="button" size="sm" onClick={() => agregarElemento("articulos")}><PlusCircle className="h-3.5 w-3.5" /> Artículo</Button>
          </div>
        </div>
      )}

      <Button type="submit" className="w-full">Registrar Proyecto</Button>
    </form>
  );
}