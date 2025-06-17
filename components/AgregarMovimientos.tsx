'use client'

import { useEffect, useState } from 'react'

type Form = {
    id_proveedor: number | null;
    id_operador: number | null;
    id_articulo: number | null;
    cantidad: number | null;
    unidad_medida: number | null;
    id_proyecto: number | null;
    tipo_movimiento_id: number;
}

export default function FormularioMovimiento() {
    const [tipo, setTipo] = useState('1') // 1: ingreso, 2: egreso
    const [proveedores, setProveedores] = useState<any[]>([])
    const [usuarios, setUsuarios] = useState<any[]>([])
    const [unidades, setUnidades] = useState<any[]>([])
    const [proyectos, setProyectos] = useState<any[]>([])

    const [form, setForm] = useState<Form>({
        tipo_movimiento_id: 1,
        id_proveedor: null,
        id_operador: null,
        id_articulo: null,
        cantidad: null,
        unidad_medida: null,
        id_proyecto: null,
    });

    useEffect(() => {
        const fetchData = async () => {
            const [prov, user, uni, proj] = await Promise.all([
                fetch('/api/proveedores').then(r => r.json()),
                fetch('/api/usuarios').then(r => r.json()),
                fetch('/api/unidades_medida').then(r => r.json()),
                fetch('/api/proyectos/activos').then(r => r.json()) 
            ]);
            setProveedores(prov);
            setUsuarios(user);
            setUnidades(uni);
            setProyectos(proj);
            console.log(prov);
            console.log(user);
            console.log(uni);
            console.log(proj);
        };
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log(form);
        const res = await fetch('/api/proyectos/movimientos', {
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
        alert(json.mensaje || json.error);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded max-w-md">
            <select
                value={tipo}
                onChange={(e) => {
                    setTipo(e.target.value);
                    setForm({ 
                        ...form, 
                        id_proveedor: null, 
                        id_operador: null 
                    });
                }}
                className="w-full border px-2 py-1">
                <option value="1">Ingreso</option>
                <option value="2">Egreso</option>
            </select>

            {tipo === '1' ? (
                <select
                    value={form.id_proveedor ?? ""}
                    onChange={(e) => setForm({ ...form, id_proveedor: e.target.value ? Number(e.target.value) : null })}
                    className="w-full border px-2 py-1">
                    <option value="">Seleccionar proveedor</option>
                    {proveedores.map((p) => (
                        <option key={p.id_proveedor} value={p.id_proveedor}>
                            {p.nombre}
                        </option>
                    ))}
                </select>
            ) : (
                <select
                    value={form.id_operador ?? ""}
                    onChange={(e) => setForm({ ...form, id_operador: e.target.value ? Number(e.target.value) : null })}
                    className="w-full border px-2 py-1">
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
                value={form.id_articulo ?? ""}
                onChange={(e) => setForm({ ...form, id_articulo: e.target.value ? Number(e.target.value) : null })}
                className="w-full border px-2 py-1"
                required
            />

            <input
                type="number"
                placeholder="Cantidad"
                value={form.cantidad ?? ""}
                onChange={(e) => setForm({ ...form, cantidad: e.target.value ? Number(e.target.value) : null })}
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
                value={form.id_proyecto ?? ""}
                onChange={(e) => setForm({ ...form, id_proyecto: e.target.value ? Number(e.target.value) : null })}
                className="w-full border px-2 py-1">
                <option value="">Seleccionar proyecto</option>
                {proyectos.map((p) => (
                    <option key={p.id_proyecto} value={p.id_proyecto}>
                        {p.nombre}
                    </option>
                ))}
            </select>

            <button type="submit" className="bg-blue-600 text-gray-50 px-4 py-2 rounded w-full">
                Registrar movimiento
            </button>
        </form>
    )
}

