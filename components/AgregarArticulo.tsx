'use client'

import { useEffect, useState } from 'react'
import { Button } from './ui/button';

type Form = {
    id_articulo: number | null;
    nombre: string | null;
    descripcion: string | null;
    cantidad_stock: number | null;
    unidad_medida: number | null;
    deposito: number | null;
    usuario: number | null;
    tipo_articulo: number | null;
}

export default function FormularioAgregarArticulo() {
    const [tipo, setTipo] = useState('1') // 1: ingreso, 2: egreso

    const [tipoArticulo, setTipoArticulo] = useState<any[]>([])
    const [usuarios, setUsuarios] = useState<any[]>([])
    const [unidades, setUnidades] = useState<any[]>([])
    const [depositos, setDepositos] = useState<any[]>([])

    const [form, setForm] = useState<Form>({
        id_articulo: null,
        nombre: null,
        descripcion: null,
        cantidad_stock: null,
        unidad_medida: null,
        deposito: null,
        usuario: null,
        tipo_articulo: null,
    });


    const [atributosForm, setAtributosForm] = useState<Form>({
        id_articulo: null,
        nombre: null,
        descripcion: null,
        cantidad_stock: null,
        unidad_medida: null,
        deposito: null,
        usuario: null,
        tipo_articulo: null,
    });

    useEffect(() => {
        const fetchData = async () => {
            const [tipoart, user, uni, depo] = await Promise.all([
                fetch('/api/tipo_articulo').then(r => r.json()),
                fetch('/api/usuarios').then(r => r.json()),
                fetch('/api/unidades_medida').then(r => r.json()),
                fetch('/api/depositos').then(r => r.json())
            ]);
            setTipoArticulo(tipoart);
            setUsuarios(user);
            setUnidades(uni);
            setDepositos(depo);
        };
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log(form);
        const res = await fetch('/api/articulos/agregar_articulo', {
            method: 'POST',
            body: JSON.stringify({
                ...form,
                fecha_modificacion: new Date().toISOString(),
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const json = await res.json();
        alert(json.mensaje || json.error);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded max-w-md">

            {/* <input
                type="number"
                placeholder="ID Artículo"
                value={form.id_articulo ?? ""}
                onChange={(e) => setForm({ ...form, id_articulo: e.target.value ? Number(e.target.value) : null })}
                className="w-full border px-2 py-1"
            /> */}

            <select
                value={form.tipo_articulo ?? ""}
                onChange={(e) => {
                    setForm({ ...form, tipo_articulo: e.target.value ? Number(e.target.value) : null });
                    setTipo(e.target.value); // o lo que necesites enviarle
                }}
                className="w-full border px-2 py-1"
                required>
                <option value="">Seleccionar tipo de articulo</option>
                {tipoArticulo.map((p) => (
                    <option key={p.id_tipo_articulo} value={p.id_tipo_articulo}>
                        {p.nombre}
                    </option>
                ))}
            </select>

            <input
                type="text"
                placeholder="Nombre del artículo"
                value={form.nombre ?? ""}
                onChange={(e) => setForm({ ...form, nombre: e.target.value ? String(e.target.value) : null })}
                className="w-full border px-2 py-1"
                required
            />

            <input
                type="text"
                placeholder="Descripcion del artículo"
                value={form.descripcion ?? ""}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value ? String(e.target.value) : null })}
                className="w-full border px-2 py-1"
            />

            <input
                type="number"
                placeholder="Cantidad"
                value={form.cantidad_stock ?? ""}
                onChange={(e) => setForm({ ...form, cantidad_stock: e.target.value ? Number(e.target.value) : null })}
                className="w-full border px-2 py-1"
                required
            />

            <select
                value={form.unidad_medida ?? ""}
                onChange={(e) => setForm({ ...form, unidad_medida: e.target.value ? Number(e.target.value) : null })}
                className="w-full border px-2 py-1"
                required>
                <option value="">Seleccionar unidad</option>
                {unidades.map((u) => (
                    <option key={u.id_unidad_medida} value={u.id_unidad_medida}>
                        {u.descripcion}
                    </option>
                ))}
            </select>

            <select
                value={form.deposito ?? ""}
                onChange={(e) => setForm({ ...form, deposito: e.target.value ? Number(e.target.value) : null })}
                className="w-full border px-2 py-1"
                required>
                <option value="">Seleccionar deposito</option>
                {depositos.map((p) => (
                    <option key={p.id_deposito} value={p.id_deposito}>
                        {p.nombre}
                    </option>
                ))}
            </select>

            <select
                value={form.usuario ?? ""}
                onChange={(e) => setForm({ ...form, usuario: e.target.value ? Number(e.target.value) : null })}
                className="w-full border px-2 py-1"
                required>
                <option value="">Seleccionar Usuario</option>
                {usuarios.map((u) => (
                    <option key={u.id_usuario} value={u.id_usuario}>
                        {u.nombre}
                    </option>
                ))}
            </select>

            <Button type="submit" className="rounded w-full px-4 py-2">
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Registrar Articulo
                </span>
            </Button>
        </form>
    )
}

