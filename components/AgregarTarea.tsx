"use client"

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CirclePlus } from 'lucide-react';

const diasSemana = ['D', 'L', 'M', 'Mi', 'J', 'V', 'S'];
const bloquesHorarios = [
  '6:00 - 6:30', '6:30 - 7:00', '7:00 - 7:30', '7:30 - 8:00',
  '8:00 - 8:30', '8:30 - 9:00', '9:00 - 9:30', '9:30 - 10:00',
  '10:00 - 10:30', '10:30 - 11:00', '11:00 - 11:30', '11:30 - 12:00',
  '12:00 - 12:30', '12:30 - 13:00', '13:00 - 13:30', '13:30 - 14:00',
  '14:00 - 14:30'
];

const opciones = {
  clientes: ['Cliente A', 'Cliente B'],
  proyectos: ['SW16', 'SFF2050', 'ZKX300'],
  usuarios: ['usuario 1', 'usuario 2', 'usuario n°'],
  maquinas: ['máquina 1', 'máquina 2']
};

const coloresProyectos: Record<string, string> = {
  SW16: 'bg-blue-500 text-white',
  SFF2050: 'bg-red-500 text-white',
  ZKX300: 'bg-green-500 text-white'
};

const ComponenteAsignacionSemanal = () => {
  const [fechaBase, setFechaBase] = useState(() => {
    const hoy = new Date();
    const dia = hoy.getDay(); // 0 (domingo) a 6 (sábado)
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() - ((dia + 6) % 7)); // obtener lunes de la semana actual
    lunes.setHours(0, 0, 0, 0);
    return lunes;
  });

  const [modalInfo, setModalInfo] = useState<{ diaIndex: number; hora: string } | null>(null);
  const [formulario, setFormulario] = useState({
    cliente: '',
    proyecto: '',
    usuario: '',
    maquina: '',
    pieza: ''
  });
  const [asignaciones, setAsignaciones] = useState<Record<string, typeof formulario>>({});

  const diasConFecha = Array.from({ length: 7 }, (_, i) => {
    const fecha = new Date(fechaBase);
    fecha.setDate(fechaBase.getDate() + i);
    return {
      etiqueta: `${diasSemana[i]} - ${fecha.getDate()}`,
      key: fecha.toISOString().split('T')[0]
    };
  });

  const semanaNum = getNumeroSemana(fechaBase);
  const nombreMes = fechaBase.toLocaleDateString('es-ES', { month: 'long' });
  const anio = fechaBase.getFullYear();

  const abrirModal = (diaIndex: number, hora: string) => {
    setModalInfo({ diaIndex, hora });
  };

  const cerrarModal = () => {
    setModalInfo(null);
    setFormulario({ cliente: '', proyecto: '', usuario: '', maquina: '', pieza: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const asignarTurno = () => {
    if (!modalInfo) return;
    const diaKey = diasConFecha[modalInfo.diaIndex].key;
    const clave = `${diaKey}_${modalInfo.hora}`;
    setAsignaciones((prev) => ({ ...prev, [clave]: formulario }));
    cerrarModal();
  };

  const cambiarSemana = (direccion: number) => {
    const nuevaFecha = new Date(fechaBase);
    nuevaFecha.setDate(fechaBase.getDate() + direccion * 7);
    setFechaBase(nuevaFecha);
  };

  return (
    <div className="p-4 w-full h-full">
      <div className="flex justify-center items-center gap-6 mb-4">
        <button className="px-4 py-2 bg-gray-800 text-white rounded flex items-center gap-2" onClick={() => cambiarSemana(-1)}>
          <ChevronLeft /> Semana {semanaNum - 1}
        </button>
        <h2 className="text-xl font-semibold">Semana {semanaNum} - {nombreMes} {anio}</h2>
        <button className="px-4 py-2 bg-gray-800 text-white rounded flex items-center gap-2" onClick={() => cambiarSemana(1)}>
          Semana {semanaNum + 1} <ChevronRight />
        </button>
      </div>

      <div className="overflow-x-auto flex justify-center">
        <table className="table-auto border border-gray-300">
          <thead>
            <tr>
              <th className="border px-2 py-1 text-xs">H. INICIO<br />H. FIN</th>
              {diasConFecha.map((dia, i) => (
                <th
                  key={i}
                  className={`border px-2 py-1 text-xs w-24 ${i === 0 || i === 6 ? 'bg-gray-200 text-gray-500' : ''}`}
                >
                  {dia.etiqueta}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bloquesHorarios.map((hora, i) => (
              <tr key={i}>
                <td className="border px-1 text-xs text-center whitespace-nowrap">{hora}</td>
                {diasConFecha.map((dia, j) => {
                  const clave = `${dia.key}_${hora}`;
                  const asignacion = asignaciones[clave];
                  const proyecto = asignacion?.proyecto;
                  return (
                    <td
                      key={j}
                      className={`border text-center text-xs h-12 relative ${j === 0 || j === 6 ? 'bg-gray-100 text-gray-400' : ''}`}
                    >
                      {(j !== 0 && j !== 6) && (
                        <>
                          {!asignacion ? (
                            <button
                              className="absolute top-1 right-1 text-gray-500 hover:text-blue-600"
                              onClick={() => abrirModal(j, hora)}
                            >
                              <CirclePlus className="h-3.5 w-3.5" />
                            </button>
                          ) : (
                            <div className={`text-xs p-1 rounded ${coloresProyectos[proyecto] || 'bg-gray-300'}`}>
                              <strong>{proyecto}</strong><br />
                              <span className="text-[10px]">{asignacion.cliente}</span><br />
                              <span className="text-[10px]">{asignacion.maquina}</span>
                            </div>
                          )}
                        </>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-2">Asignar turno</h3>
            <p className="text-sm mb-4">{diasConFecha[modalInfo.diaIndex].etiqueta} - {modalInfo.hora}</p>

            <div className="space-y-3">
              {['cliente', 'proyecto', 'usuario', 'maquina'].map((campo) => (
                <div key={campo}>
                  <label className="text-sm capitalize">{campo}</label>
                  <select
                    name={campo}
                    value={(formulario as any)[campo]}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="">Seleccionar {campo}</option>
                    {(opciones as any)[`${campo}s`].map((item: string, i: number) => (
                      <option key={i} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
              ))}
              <div>
                <label className="text-sm">Pieza</label>
                <input
                  type="text"
                  name="pieza"
                  value={formulario.pieza}
                  onChange={handleChange}
                  placeholder="Nombre de la pieza"
                  className="w-full border rounded px-2 py-1"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={cerrarModal} className="bg-gray-300 px-4 py-2 rounded">Cancelar</button>
              <button onClick={asignarTurno} className="bg-blue-600 text-white px-4 py-2 rounded">Asignar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ✅ Función para obtener el número de semana ISO
function getNumeroSemana(fecha: Date) {
  const temp = new Date(fecha.getTime());
  temp.setHours(0, 0, 0, 0);
  temp.setDate(temp.getDate() + 3 - ((temp.getDay() + 6) % 7)); // jueves de la semana actual
  const semana1 = new Date(temp.getFullYear(), 0, 4); // jueves de la semana 1
  return 1 + Math.round(
    ((temp.getTime() - semana1.getTime()) / 86400000 - 3 + ((semana1.getDay() + 6) % 7)) / 7
  );
}

export default ComponenteAsignacionSemanal;

