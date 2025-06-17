"use client"

import React, { useState, useEffect } from 'react';

type MovimientosRaw = {
  articulo: string
  cantidad : number
  fecha: string
  id_articulo: number
  id_movimiento: number
  operador: string
  proveedor: string
  proyecto: string
  tipo_movimiento: string
  unidad_medida: string
}

type Articulos = {
  id_articulo: number
  nombre: string
  tipo_articulo: string
  stock: number
  unidad_medida: string
  deposito: string
  atributos: Record<string, string>
}

type Tipos = {
    id_tipo_movimiento: number
    nombre: string
}


function MovimientosTable() {
    const [movimientos, setMovimientos] = useState<MovimientosRaw[]>([]);
    const [tipos, setTipos] = useState<Tipos[]>([]);
    const [articulos, setArticulos] = useState<Articulos[]>([]);

    const [id, setId] = useState('');
    const [tipo, setTipo] = useState('');
    const [articulo, setArticulo] = useState('');
    const [fecha, setFecha] = useState('');

    const [loading, setLoading] = useState(true);

    // Implementamos debounce
    // Esto significa que el fetch se va a ejecutar 500ms despues que el usuario deja de escribir.
    useEffect(() => {
        const delay = setTimeout(() => {
            fetchMovimientos();
        }, 500);
        return () => clearTimeout(delay);
    }, [id, tipo, articulo, fecha]);

    const fetchMovimientos = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `/api/articulos/vista_lista_movimientos?id_movimiento=${id}&tipo_movimiento=${tipo}&articulo=${articulo}&fecha=${fecha}`
            );
            const data = await res.json();
            setMovimientos(data);
            console.log(data)
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTipos = async () => {
        try {
            const res = await fetch('/api/tipos_movimiento');
            const data = await res.json();
            setTipos(data);
            console.log("tipo movimiento",data)
        } catch (error) {
            console.error(error);
        }
    }

    const fetchArticulos = async () => {
        try {
            const res = await fetch('/api/articulos');
            const data = await res.json();
            setArticulos(data);
            console.log(data)
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchTipos();
        fetchArticulos();
        fetchMovimientos();
    }, []);

    return (
        <div className="p-4 space-y-4">
            {/* Filtros */}
            <div className='flex gap-4 mb-4 items-center'>
                <input
                    type='number'
                    placeholder='ID'
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    className="border rounded px-2 py-1 w-full md:w-1/4"
                />

                <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    className="border rounded px-2 py-1 w-full md:w-1/4"
                >
                    <option value="">Todos los tipos</option>
                    {tipos.map((item) => (
                        <option key={item.id_tipo_movimiento} value={item.nombre}>
                            {item.nombre}
                        </option>
                    ))}
                </select>

                <select
                    value={articulo}
                    onChange={(e) => setArticulo(e.target.value)}
                    className="border rounded px-2 py-1 w-full md:w-1/4"
                >
                    <option value="">Todos los artículos</option>
                    {articulos.map((item) => (
                        <option key={item.id_articulo} value={item.nombre}>
                            {item.nombre}
                        </option>
                    ))}
                </select>

                <input
                    type='date'
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="border rounded px-2 py-1 w-full md:w-1/4"
                />

            </div>

            {/* Tabla */}
            {loading ? (
                <h1>cargando</h1>
            ) : (
                <div className="overflow-auto rounded-lg border shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/40">
                            <tr>
                                <th className="border px-2 py-1">ID</th>
                                <th className="border px-2 py-1"> Fecha</th>
                                <th className="border px-2 py-1"> Tipo</th>
                                <th className="border px-2 py-1"> Proyecto</th>
                                <th className="border px-2 py-1"> Artículo</th>
                                <th className="border px-2 py-1"> Proveedor/Operador</th>
                                <th className="border px-2 py-1"> Unidad</th>
                                <th className="border px-2 py-1"> Cantidad</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {movimientos.map((mov) => (
                                <tr key={mov.id_movimiento}>
                                    <td className="border px-2 py-1">{mov.id_movimiento}</td>
                                    <td className="border px-2 py-1">{mov.fecha}</td>
                                    <td className="border px-2 py-1">{mov.tipo_movimiento}</td>
                                    <td className="border px-2 py-1">{mov.proyecto}</td>
                                    <td className="border px-2 py-1">{mov.articulo}</td>
                                    <td className="border px-2 py-1">{mov.proveedor? mov.proveedor : mov.operador}</td>
                                    <td className="border px-2 py-1">{mov.unidad_medida}</td>
                                    <td className="border px-2 py-1">{mov.cantidad}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
    );
}

export default MovimientosTable;

