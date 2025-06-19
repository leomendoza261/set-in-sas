"use client"

import { Arrow } from '@radix-ui/react-tooltip';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';

const usuarios = [
  { id: 1, nombre: 'Carlos Gonzales', estado:"Normal", color:"green", eficiencia: '97%', SW16: "3hs", SFF2050: "2:30hs", ZKX300: "2:30hs" },
  { id: 2, nombre: 'Franco Perez', estado:"Normal", color:"green", eficiencia: '97%', SW16: "3hs", SFF2050: "2:30hs", ZKX300: "2:30hs" },
  { id: 3, nombre: 'Marcelo Gomez', estado:"Sin planos", color:"red", eficiencia: '97%', SW16: "3hs", SFF2050: "2:30hs", ZKX300: "2:30hs" },
  { id: 4, nombre: 'Lionel Messi', estado:"Sin EPP", color:"red", eficiencia: '97%', SW16: "3hs", SFF2050: "2:30hs", ZKX300: "2:30hs" },
  { id: 5, nombre: 'Rodrigo De Paul', estado:"Normal", color:"green", eficiencia: '97%', SW16: "3hs", SFF2050: "2:30hs", ZKX300: "2:30hs" }
];

const bloquesHorarios = [
  '6:00 - 6:30', '6:30 - 7:00', '7:00 - 7:30', '7:30 - 8:00',
  '8:00 - 8:30', '8:30 - 9:00', '9:00 - 9:30', '9:30 - 10:00',
  '10:00 - 10:30', '10:30 - 11:00', '11:00 - 11:30', '11:30 - 12:00',
  '12:00 - 12:30', '12:30 - 13:00', '13:00 - 13:30', '13:30 - 14:00'
];

const actividades = ['SW16', 'SFF2050', 'ZKX300'];
const coloresPorProyecto: Record<string, string> = {
  SW16: 'bg-blue-500',
  SFF2050: 'bg-red-500',
  ZKX300: 'bg-green-500'
};

const ComponenteTurnos = () => {
  const [fechaActual, setFechaActual] = useState(new Date());

  const cambiarFecha = (dias: number) => {
    const nuevaFecha = new Date(fechaActual);
    nuevaFecha.setDate(fechaActual.getDate() + dias);
    setFechaActual(nuevaFecha);
  };

  const formatearFecha = (fecha: Date) => {
    return fecha.toLocaleDateString('es-AR', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-muted/40 p-4 w-full h-full overflow-x-hidden">
      {/* Barra de fecha con navegación */}
      <div className="bg-gray-800 text-white p-2 rounded-md flex items-center justify-between mb-2">
        <button onClick={() => cambiarFecha(-1)} className="text-2xl font-bold px-4"><ChevronLeft className="h-5 w-5" /> </button>
        <div className="text-xl font-semibold">{formatearFecha(fechaActual)}</div>
        <button onClick={() => cambiarFecha(1)} className="text-2xl font-bold px-4"><ChevronRight className="h-5 w-5" /></button>
      </div>

      {/* Grilla de usuarios y actividades */}
      <div className="grid grid-cols-[150px_1fr] gap-4">
        {usuarios.map((usuario) => (
          <React.Fragment key={usuario.id}>
            <div className="bg-white border rounded-md p-2 text-center sticky left-0 z-10">
              <div className="font-bold">{usuario.nombre}</div>
              <div className="flex items-center text-sm text-gray-800">
                <span className={`h-3 w-3 rounded-full bg-${usuario.color}-500 animate-pulseSlow`}></span>
                <p className="m-2 text-gray-500"> {usuario.estado}</p>
              </div>
              <div className=''>Eficiencia {usuario.eficiencia}</div>
              <div className='text-xs text-red-500'>SFF2050: <span className='text-gray-500'>{usuario.SFF2050}</span> </div>
              <div className='text-xs text-blue-500'>SW16:  <span className='text-gray-500'>{usuario.SW16}</span></div>
              <div className='text-xs text-green-500'>ZKX300:  <span className='text-gray-500'>{usuario.ZKX300}</span></div>
            </div>
            <div className="overflow-x-auto">
              <div className="grid grid-cols-[repeat(16,160px)] gap-2">
                {bloquesHorarios.map((bloque, i) => {
                  const proyecto = actividades[i % actividades.length];
                  const color = coloresPorProyecto[proyecto] || 'bg-gray-300';

                  return (
                    <div
                      key={i}
                      className={`${color} text-white text-xs rounded-md p-2 text-center shadow-md w-40`}
                      title={`Turno ${bloque} - Proyecto ${proyecto}`}
                    >
                      <div>{bloque}</div>
                      <div className="font-semibold">{proyecto}</div>
                      <div>Nombre proyecto</div>
                      <div>Cliente</div>
                      <div>Pieza/subconjunto</div>
                      <div>Maquina</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ComponenteTurnos;
