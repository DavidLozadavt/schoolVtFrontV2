import React, { useState } from 'react';
import { MallaCurricularProps } from '../../types';
import AsignarMateria from './AsignarMateria';

export const MallaCurricular = ({
  isOpen,
  onClose,
  program,
}: MallaCurricularProps) => {
  const [niveles, setNiveles] = useState([{ id: 'A1', nombre: 'Transición Inicial' }]);

  const [isMateriaModalOpen, setIsMateriaModalOpen] = useState(false);
  const [selectedNivelId, setSelectedNivelId] = useState('');

  // Simulación de datos para los selectores
  const [jornadas] = useState(['Única', 'Mañana', 'Tarde', 'Nocturna']);
  const [tiposPrograma] = useState(['ANUAL', 'SEMESTRAL', 'TRIMESTRAL']);

  if (!isOpen || !program) return null;

  const agregarNivel = () => {
    const nuevoId = `A${niveles.length + 1}`;
    setNiveles([...niveles, { id: nuevoId, nombre: 'Nuevo Nivel Académico' }]);
  };

  const quitarNivel = () => {
    if (niveles.length > 0) {
      setNiveles(niveles.slice(0, -1));
    }
  };

  const handleOpenMateria = (nivelId: string) => {
    setSelectedNivelId(nivelId);
    setIsMateriaModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-5xl bg-white dark:bg-coal-500 rounded-xl shadow-card dark:shadow-dark-default overflow-hidden border border-gray-300 dark:border-gray-dark-300 flex flex-col max-h-[95vh]">

        {/* Header con Banner */}
        <div className="relative flex-shrink-0 w-full h-32 overflow-hidden md:h-40">
          <img
            src={program.imageUrl}
            className="absolute inset-0 object-cover w-full h-full brightness-[0.35]"
            alt="Banner"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-coal-500 via-coal-500/20 to-transparent" />

          <button
            onClick={onClose}
            className="absolute z-10 flex items-center justify-center w-8 h-8 text-white transition-all border rounded-full top-4 right-4 bg-white/10 hover:bg-danger backdrop-blur-md border-white/30"
          >
            <i className="text-lg ki-outline ki-cross"></i>
          </button>

          <div className="absolute text-white bottom-4 left-6">
            <span className="px-2 py-0.5 text-4xs font-extrabold tracking-widest uppercase bg-primary rounded mb-1 inline-block">
              {program.nivel}
            </span>
            <h2 className="text-1.5xl font-bold uppercase tracking-tight leading-none text-white">{program.name}</h2>
            <p className="mt-1 font-bold tracking-tighter text-gray-300 uppercase text-2xs">
              Código: {program.codigo} • Malla Curricular
            </p>
          </div>
        </div>

        {/* Área de Contenido */}
        <div className="flex-grow p-5 overflow-y-auto bg-gray-100 md:p-7 no-scrollbar dark:bg-coal-600">

          {/* Toolbar de Gestión: Distribución mejorada de los 3 selectores */}
          <div className="flex flex-col items-stretch justify-between gap-4 p-4 mb-6 bg-white border border-gray-300 shadow-sm xl:flex-row dark:bg-coal-300 rounded-xl dark:border-gray-dark-100">

            <div className="grid flex-grow grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-2">

              {/* 1. Periodo Lectivo */}
              <div className="flex items-center gap-3 px-2">
                <div className="flex items-center justify-center flex-shrink-0 rounded-lg w-9 h-9 bg-primary-light dark:bg-primary-clarity text-primary">
                  <i className="text-lg ki-outline ki-calendar"></i>
                </div>
                <div className="flex flex-col min-w-0">
                  <label className="font-bold text-gray-500 uppercase truncate text-3xs dark:text-gray-400">Periodo Lectivo</label>
                  <select className="p-0 font-extrabold text-gray-800 bg-transparent border-none cursor-pointer dark:text-white focus:ring-0 text-2sm">
                    <option className="dark:bg-coal-300">2024 - Ciclo A</option>
                    <option className="dark:bg-coal-300">2024 - Ciclo B</option>
                  </select>
                </div>
              </div>

              {/* 2. Jornada */}
              <div className="flex items-center gap-3 px-2 border-gray-200 sm:border-l dark:border-gray-dark-300">
                <div className="flex flex-col w-full min-w-0">
                  <label className="font-bold text-gray-500 uppercase truncate text-3xs dark:text-gray-400">Jornada</label>
                  {jornadas.length > 0 ? (
                    <select className="p-0 font-extrabold text-gray-800 bg-transparent border-none cursor-pointer dark:text-white focus:ring-0 text-2sm">
                      {jornadas.map((j, idx) => (
                        <option key={idx} value={j} className="dark:bg-coal-300">{j}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="italic font-bold uppercase text-danger text-3xs">Sin registros</span>
                  )}
                </div>
              </div>

              {/* 3. Tipo de Programa */}
              <div className="flex items-center gap-3 px-2 border-gray-200 sm:border-l dark:border-gray-dark-300">
                <div className="flex flex-col w-full min-w-0">
                  <label className="font-bold text-gray-500 uppercase truncate text-3xs dark:text-gray-400">Tipo de Programa</label>
                  <select className="p-0 font-extrabold uppercase bg-transparent border-none cursor-pointer text-primary focus:ring-0 text-2sm">
                    {tiposPrograma.map((t, idx) => (
                      <option key={idx} value={t} className="dark:bg-coal-300">{t}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Controles de Acción  */}
            <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-200 xl:pt-0 xl:border-t-0 xl:pl-4 xl:border-l dark:border-gray-dark-300">
              <button
                onClick={quitarNivel}
                className="flex items-center justify-center w-10 h-10 transition-all border border-gray-300 rounded-lg bg-gray-50 dark:bg-coal-400 dark:border-gray-dark-300 text-danger hover:bg-danger hover:text-white group"
                title="Quitar nivel"
              >
                <i className="text-xl transition-transform ki-outline ki-minus group-active:scale-75"></i>
              </button>
              <button
                onClick={agregarNivel}
                className="flex items-center justify-center w-10 h-10 text-white transition-all rounded-lg bg-primary shadow-primary hover:bg-primary-active group"
                title="Agregar nivel"
              >
                <i className="text-xl transition-transform ki-outline ki-plus group-hover:rotate-90"></i>
              </button>
            </div>
          </div>

          {/* Grid de Tarjetas */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {niveles.map((nivel) => (
              <div key={nivel.id} className="p-5 transition-all bg-white border border-gray-400 shadow-sm group dark:bg-coal-300 rounded-xl dark:border-gray-dark-100 hover:border-gray-500 hover:shadow-md animate-fade-in-up">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2.5xl font-black text-gray-500 dark:text-gray-dark-100 group-hover:text-primary/40 transition-colors italic">
                    {nivel.id}
                  </span>
                  <div className="flex gap-1 transition-opacity opacity-0 group-hover:opacity-100">
                    <button className="flex items-center justify-center text-gray-600 bg-gray-100 rounded-md w-7 h-7 dark:bg-coal-200 dark:text-gray-400 hover:text-primary"><i className="text-xs ki-outline ki-pencil"></i></button>
                    <button className="flex items-center justify-center text-gray-500 bg-gray-100 rounded-md w-7 h-7 dark:bg-coal-200 dark:text-gray-400 hover:text-danger"><i className="text-xs ki-outline ki-trash"></i></button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="pl-3 text-xs font-black tracking-tight text-gray-800 uppercase border-l-3 dark:text-white border-primary">
                    {nivel.nombre}
                  </h4>
                  <div className="p-3 border border-gray-300 border-dashed rounded-lg bg-gray-50 dark:bg-coal-400 dark:border-gray-dark-300">

                    <p className="italic font-medium text-gray-600 text-2xs dark:text-gray-500">No se han registrado datos para este nivel.</p>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenMateria(nivel.id)}
                  className="w-full py-2.5 mt-5 font-bold text-gray-500 uppercase transition-all border border-gray-400 border-dashed rounded-lg dark:border-gray-dark-300 dark:text-gray-800 hover:border-primary hover:text-white hover:bg-blue-500 text-4xs ">
                  <i className="mr-1.5 ki-outline ki-plus"></i>
                </button>
              </div>
            ))}

            {/* Botón rápido para añadir nivel al final de la lista */}
            <button
              onClick={agregarNivel}
              className="h-full min-h-[200px] flex flex-col items-center justify-center border-2 border-dashed border-gray-400 dark:border-gray-dark-300 rounded-xl hover:bg-white dark:hover:bg-coal-300 transition-all group hover:border-primary"
            >
              <div className="flex items-center justify-center w-12 h-12 mb-3 text-gray-400 transition-all bg-gray-200 rounded-full dark:bg-coal-200 dark:text-gray-400 group-hover:bg-primary group-hover:text-white">
                <i className="text-2xl ki-outline ki-plus"></i>
              </div>
              <span className="font-bold tracking-widest text-gray-500 uppercase text-3xs dark:text-gray-400 group-hover:text-primary">Nuevo Nivel</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 px-6 bg-white border-t border-gray-300 dark:bg-coal-400 dark:border-gray-dark-100">
          <div className="items-center hidden gap-2 sm:flex">
            <i className="text-sm ki-outline ki-information-2 text-primary"></i>
            <p className="italic font-bold text-gray-600 text-3xs dark:text-gray-400">
              Cambios sincronizados automáticamente con el programa.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-10 py-2.5 font-black tracking-widest text-white uppercase transition-all rounded-lg bg-dark dark:bg-primary dark:text-white text-3xs hover:opacity-90 active:scale-95 shadow-lg"
          >
            Finalizar
          </button>
        </div>

      </div>

      <AsignarMateria
        isOpen={isMateriaModalOpen}
        onClose={() => setIsMateriaModalOpen(false)}
        nivelId={selectedNivelId}
      />



    </div>
  );
};

export default MallaCurricular;