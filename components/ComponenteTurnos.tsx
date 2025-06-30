'use client';

import "../styles/frappe-gantt.css";
import React, { useEffect, useRef, useState } from 'react';
import Gantt from 'frappe-gantt';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');

interface Props {
    usuario: string;
}

interface Tarea {
    id: string;
    name: string;
    proyecto: string;
    start: string;
    end: string;
    progress: number;
    dependencies: string;
    custom_class: string;
    color: string;
}


const ComponenteTurnos = ({ usuario }: Props) => {
    const ganttRef = useRef<HTMLDivElement>(null);
    const [viewMode, setViewMode] = useState<'Hour' | 'Day' | 'Week' | 'Month'>('Day');

    const tareasPorUsuario: Record<string, Tarea[]> = {
        'usuario 1': [
            {
                id: '1',
                name: 'Revisión inicial',
                proyecto: "SW16",
                start: dayjs().day(1).hour(6).format('YYYY-MM-DD HH:mm:ss'), // Lunes
                end: dayjs().day(1).hour(9).format('YYYY-MM-DD HH:mm:ss'),
                progress: 70,
                dependencies: '',
                custom_class: 'fill-verde',
                color: "green"
            },
            {
                id: '2',
                name: 'Montaje base',
                proyecto: "TN16",
                start: dayjs().day(2).hour(9).format('YYYY-MM-DD HH:mm:ss'), // Martes
                end: dayjs().day(2).hour(12).format('YYYY-MM-DD HH:mm:ss'),
                progress: 40,
                dependencies: '1',
                custom_class: 'fill-rojo',
                color: "red"
            },
            {
                id: '3',
                name: 'Supervisión',
                proyecto: "QU1",
                start: dayjs().day(5).hour(8).format('YYYY-MM-DD HH:mm:ss'), // Sábado (se filtrará)
                end: dayjs().day(5).hour(10).format('YYYY-MM-DD HH:mm:ss'),
                progress: 10,
                dependencies: '',
                custom_class: 'fill-azul',
                color: "blue"
            }
        ],
        'usuario 2': [
            {
                id: '1',
                name: 'Corte de material',
                proyecto: "QU1",
                start: dayjs().day(1).hour(6).format('YYYY-MM-DD HH:mm:ss'), // Lunes
                end: dayjs().day(1).hour(12).format('YYYY-MM-DD HH:mm:ss'),
                progress: 70,
                dependencies: '',
                custom_class: 'fill-azul',
                color: "blue"
            },
            {
                id: '2',
                name: 'Corte con maquina laser turbo',
                proyecto: "TN16",
                start: dayjs().day(2).hour(12).format('YYYY-MM-DD HH:mm:ss'), // Martes
                end: dayjs().day(2).hour(16).format('YYYY-MM-DD HH:mm:ss'),
                progress: 40,
                dependencies: '1',
                custom_class: 'fill-rojo',
                color: "red"
            },
            {
                id: '3',
                name: 'Supervisión',
                proyecto: "QU1",
                start: dayjs().day(2).hour(16).format('YYYY-MM-DD HH:mm:ss'), // Sábado (se filtrará)
                end: dayjs().day(2).hour(18).format('YYYY-MM-DD HH:mm:ss'),
                progress: 10,
                dependencies: '2',
                custom_class: 'fill-azul',
                color: "blue"
            }
        ],
    };

    // ⛔ Solo tareas de lunes (1) a viernes (5)
    const tareasFiltradas = (tareasPorUsuario[usuario] || []).filter(tarea => {
        const dia = dayjs(tarea.start).day(); // 0 = domingo, 6 = sábado
        return dia >= 1 && dia <= 5;
    });

    useEffect(() => {
        if (!ganttRef.current) return;

        ganttRef.current.innerHTML = '';

        new Gantt(ganttRef.current, tareasFiltradas, {
            view_mode: viewMode,
            date_format: 'HH:mm',
            // @ts-expect-error: Opción extendida fuera del tipo original
            custom_popup_html: (task: Tarea) => `
    <div class="bg-white p-2 rounded shadow">
      <h3 class="text-lg font-bold">${task.name}</h3>
      <p>Inicio: ${dayjs(task.start).format('HH:mm')}</p>
      <p>Fin: ${dayjs(task.end).format('HH:mm')}</p>
      <p>Progreso: ${task.progress}%</p>
    </div>
  `
        });
    }, [usuario, viewMode]);

    return (
        <div className="bg-white rounded-md p-4 space-y-4">

            <div className="inline-flex border border-gray-300 rounded overflow-hidden mb-4">
                {['Hour', 'Day', 'Week'].map(mode => (
                    <button
                        key={mode}
                        onClick={() => setViewMode(mode as any)}
                        className={`px-3 py-1 text-sm transition ${viewMode === mode
                            ? 'bg-gray-200 text-black font-semibold'
                            : 'bg-white hover:bg-gray-100 text-gray-600'
                            }`}
                    >
                        {mode}
                    </button>
                ))}
            </div>

            <div className="flex overflow-x-auto gap-4">
                {/* 🟢 Columna izquierda: resumen de tareas */}
                <div className="min-w-[400px]">
                    <h3 className="font-semibold text-gray-700 mb-2">Resumen de tareas</h3>

                    <table className="w-full text-sm border-collapse">
                        <thead className="bg-gray-100 text-left">
                            <tr>
                                <th className="px-3 py-2 border">Fecha</th>
                                <th className="px-3 py-2 border">Tarea</th>
                                <th className="px-3 py-2 border">Proyecto</th>
                                <th className="px-3 py-2 border">Inicio</th>
                                <th className="px-3 py-2 border">Fin</th>
                                <th className="px-3 py-2 border">Duración</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(
                                tareasFiltradas.reduce((acc, tarea) => {
                                    const fecha = dayjs(tarea.start).format('YYYY-MM-DD');
                                    acc[fecha] = acc[fecha] || [];
                                    acc[fecha].push(tarea);
                                    return acc;
                                }, {} as Record<string, typeof tareasFiltradas>)
                            )
                                .sort(([a], [b]) => a.localeCompare(b))
                                .map(([fecha, tareas]) =>
                                    tareas.map((tarea, idx) => {
                                        const inicio = dayjs(tarea.start);
                                        const fin = dayjs(tarea.end);
                                        const duracion = fin.diff(inicio, 'hour');
                                        return (
                                            <tr key={tarea.id} className="border-t">
                                                {idx === 0 && (
                                                    <td className="px-3 py-2 border font-medium align-top" rowSpan={tareas.length}>
                                                        {inicio.format('ddd DD/MM')}
                                                    </td>
                                                )}
                                                <td className="px-3 py-2 border">{tarea.name} </td>
                                                <td className={`px-3 py-2 border bg-${tarea.color}-500 text-white`}>{tarea.proyecto}</td>
                                                <td className="px-3 py-2 border">{inicio.format('HH:mm')}</td>
                                                <td className="px-3 py-2 border">{fin.format('HH:mm')}</td>
                                                <td className="px-3 py-2 border">{duracion} hs</td>
                                            </tr>
                                        );
                                    })
                                )}
                        </tbody>
                    </table>
                </div>


                {/* 🔵 Columna derecha: el Gantt */}
                <div ref={ganttRef} className="overflow-x-auto flex-1 max-w-screen-xl " />
            </div>
        </div>
    );

};

export default ComponenteTurnos;