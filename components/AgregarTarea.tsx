"use client"

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  proyectos: ['SW16', 'SW17', 'SW18', 'TN16', 'TN17', 'QU1', 'QU2', 'QU3'],
  usuarios: ['usuario 1', 'usuario 2', 'usuario n°'],
  maquinas: ['máquina 1', 'máquina 2']
};

const coloresProyectos: Record<string, string> = {
  SW16: 'bg-blue-300',
  SW17: 'bg-blue-400',
  SW18: 'bg-blue-500',
  TN16: 'bg-pink-300',
  TN17: 'bg-pink-400',
  QU1: 'bg-green-300',
  QU2: 'bg-green-400',
  QU3: 'bg-green-500'
};

const ComponenteAsignacionSemanal = () => {
  const [semana, setSemana] = useState(1);
  const [modalInfo, setModalInfo] = useState<{ dia: string; hora: string } | null>(null);
  const [formulario, setFormulario] = useState({
    cliente: '',
    proyecto: '',
    usuario: '',
    maquina: '',
    pieza: ''
  });
  const [asignaciones, setAsignaciones] = useState<Record<string, typeof formulario>>({});

  const abrirModal = (dia: string, hora: string) => {
    setModalInfo({ dia, hora });
  };

  const cerrarModal = () => {
    setModalInfo(null);
    setFormulario({ cliente: '', proyecto: '', usuario: '', maquina: '', pieza: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const guardarAsignacion = () => {
    if (modalInfo) {
      const key = `${modalInfo.dia}-${modalInfo.hora}`;
      setAsignaciones((prev) => ({ ...prev, [key]: formulario }));
      cerrarModal();
    }
  };

  return (
    <div className="p-4 w-full h-full">
      <div className="flex justify-center items-center gap-6 mb-4">
        <button className="px-4 py-2 bg-gray-800 text-white rounded flex items-center gap-2" onClick={() => setSemana(semana - 1)}>
          <ChevronLeft /> Semana {semana - 1}
        </button>
        <h2 className="text-xl font-semibold">Semana {semana}</h2>
        <button className="px-4 py-2 bg-gray-800 text-white rounded flex items-center gap-2" onClick={() => setSemana(semana + 1)}>
          Semana {semana + 1} <ChevronRight />
        </button>
      </div>

      <div className="overflow-x-auto flex justify-center">
        <table className="table-auto border border-gray-300">
          <thead>
            <tr>
              <th className="border px-2 py-1 text-xs">H. INICIO<br />H. FIN</th>
              {diasSemana.map((dia, i) => (
                <th
                  key={i}
                  className={`border px-2 py-1 text-xs w-24 ${i === 0 || i === 6 ? 'bg-gray-200 text-gray-500' : ''}`}
                >
                  {dia}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bloquesHorarios.map((hora, i) => (
              <tr key={i}>
                <td className="border px-1 text-xs text-center whitespace-nowrap">{hora}</td>
                {diasSemana.map((dia, j) => {
                  const key = `${dia}-${hora}`;
                  const asignado = asignaciones[key];
                  const bgColor = asignado ? coloresProyectos[asignado.proyecto] || 'bg-gray-300' : '';

                  return (
                    <td
                      key={j}
                      className={`border text-center text-xs h-12 relative ${j === 0 || j === 6 ? 'bg-gray-100 text-gray-400' : ''} ${bgColor}`}
                    >
                      {(j !== 0 && j !== 6) && (
                        <button
                          className="absolute top-1 right-1 text-gray-500 hover:text-blue-600"
                          onClick={() => abrirModal(dia, hora)}
                        >
                          +
                        </button>
                      )}
                      {asignado && (
                        <div className="text-[10px] leading-tight pt-1">
                          <div>{asignado.proyecto}</div>
                          <div>{asignado.cliente}</div>
                          <div>{asignado.maquina}</div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-2">Asignar turno</h3>
            <p className="text-sm mb-4">{modalInfo.dia} - {modalInfo.hora}</p>

            <div className="space-y-3">
              <div>
                <label className="text-sm">Cliente</label>
                <select name="cliente" value={formulario.cliente} onChange={handleChange} className="w-full border rounded px-2 py-1">
                  <option value="">Seleccionar cliente</option>
                  {opciones.clientes.map((c, i) => <option key={i} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="text-sm">Proyecto</label>
                <select name="proyecto" value={formulario.proyecto} onChange={handleChange} className="w-full border rounded px-2 py-1">
                  <option value="">Seleccionar proyecto</option>
                  {opciones.proyectos.map((p, i) => <option key={i} value={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label className="text-sm">Usuario</label>
                <select name="usuario" value={formulario.usuario} onChange={handleChange} className="w-full border rounded px-2 py-1">
                  <option value="">Seleccionar usuario</option>
                  {opciones.usuarios.map((u, i) => <option key={i} value={u}>{u}</option>)}
                </select>
              </div>

              <div>
                <label className="text-sm">Máquina</label>
                <select name="maquina" value={formulario.maquina} onChange={handleChange} className="w-full border rounded px-2 py-1">
                  <option value="">Seleccionar máquina</option>
                  {opciones.maquinas.map((m, i) => <option key={i} value={m}>{m}</option>)}
                </select>
              </div>

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
              <button onClick={guardarAsignacion} className="bg-blue-600 text-white px-4 py-2 rounded">Asignar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComponenteAsignacionSemanal;
