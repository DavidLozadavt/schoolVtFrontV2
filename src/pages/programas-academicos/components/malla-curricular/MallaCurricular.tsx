import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MallaCurricularProps } from '../../types';
import AsignarMateria from './AsignarMateria';
import { CardRap } from './CardRap';
import { Calendario } from './Calendario'; // Asegúrate de que el archivo se llame así
import { Calendar, List } from 'lucide-react';
import Select from "react-select"; // Asegúrate de tenerlo instalado

export const MallaCurricular = ({ isOpen, onClose, program }: MallaCurricularProps) => {
  const [niveles, setNiveles] = useState([{ id: '1', nombre: 'Transición Inicial' }]);
  const [loading, setLoading] = useState(false);
  const [errorApi, setErrorApi] = useState<string | null>(null);
  
  // Cambiamos el nombre del estado a 'viewMode' para que no choque con el componente <Calendario />
  const [viewMode, setViewMode] = useState<'lista' | 'calendario'>('lista');

  const [isMateriaModalOpen, setIsMateriaModalOpen] = useState(false);
  const [selectedNivelId, setSelectedNivelId] = useState('');
  const [fichas, setFichas] = useState<any[]>([]);
  const [loadingFichas, setLoadingFichas] = useState(false);

  useEffect(() => {
    const fetchFichas = async () => {
      if (!isOpen || !program?.id) return;
      setLoadingFichas(true);
      try {
        const res = await axios.get(`fichas/programa/${program.id}`);
        if (Array.isArray(res.data?.data)) {
          setFichas(res.data.data);
        } else {
          setFichas([]);
        }
      } catch {
        setFichas([]);
      } finally {
        setLoadingFichas(false);
      }
    };
    fetchFichas();
  }, [isOpen, program?.id]);

  if (!isOpen || !program) return null;

  const agregarNivel = () => {
    const nuevoId = `${niveles.length + 1}`;
    setNiveles([...niveles, { id: nuevoId, nombre: 'Nuevo Nivel Académico' }]);
  };

  const quitarNivel = () => {
    if (niveles.length > 0) setNiveles(niveles.slice(0, -1));
  };

  const handleOpenMateria = (nivelId: string) => {
    setSelectedNivelId(nivelId);
    setIsMateriaModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-5xl bg-white dark:bg-coal-500 rounded-xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden border border-gray-300 dark:border-gray-800">
        
        {/* Overlay de Carga (Corregido a 'loading') */}
        {loading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-coal-500/60 backdrop-blur-sm">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              <span className="mt-2 text-xs font-bold tracking-widest text-blue-600 uppercase">Sincronizando...</span>
            </div>
          </div>
        )}

        {/* Header con Banner */}
        <div className="relative flex-shrink-0 w-full h-32 overflow-hidden md:h-40">
          <img src={program.imageUrl || 'https://via.placeholder.com/800x200'} className="absolute inset-0 object-cover w-full h-full brightness-[0.35]" alt="Banner" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          <button onClick={onClose} className="absolute z-10 flex items-center justify-center w-8 h-8 text-white transition-all border rounded-full top-4 right-4 bg-white/10 hover:bg-red-500 backdrop-blur-md border-white/30">
            <i className="ki-outline ki-cross"></i>
          </button>

          <div className="absolute text-white bottom-4 left-6">
            <h2 className="text-2xl font-bold leading-none tracking-tight uppercase">{program.name}</h2>
            <p className="mt-1 font-bold tracking-wider text-gray-300 uppercase text-[10px]">
              Código: {program.codigo} • Malla Curricular
            </p>
          </div>
        </div>

        {/* Área de Contenido */}
        <div className="flex-grow p-5 overflow-y-auto bg-gray-50 md:p-7 dark:bg-coal-600 no-scrollbar">
          
          <div className="flex flex-col gap-4 p-4 mb-6 bg-white border border-gray-200 shadow-sm md:flex-row dark:bg-coal-300 rounded-xl dark:border-gray-800">
            <div className="flex-grow">
               <label className="block mb-1 text-[10px] font-bold text-gray-400 uppercase">Seleccionar Ficha</label>
               <Select
                options={fichas.map((f) => ({ value: f.id, label: `#${f.codigo}` }))} 
                placeholder="Busque o seleccione una ficha..."
                onChange={(opcion: any) => console.log("Ficha seleccionada:", opcion)}
                classNamePrefix="react-select"
                className="text-sm"
              />
            </div>

            <div className="flex items-center gap-2 border-gray-200 md:pl-4 md:border-l dark:border-gray-700">
              <button onClick={quitarNivel} className="flex items-center justify-center w-10 h-10 text-red-500 transition-all border border-gray-200 rounded-lg hover:bg-red-50 dark:border-gray-700"><i className="ki-outline ki-minus"></i></button>
              <button onClick={agregarNivel} className="flex items-center justify-center w-10 h-10 text-white transition-all bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700"><i className="ki-outline ki-plus"></i></button>
            </div>
          </div>

          {/* Selector de Vista */}
          <div className="flex p-1 mb-6 bg-gray-200 dark:bg-coal-400 rounded-xl">
            <button 
              onClick={() => setViewMode('lista')}
              className={`flex-1 py-2 text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all ${viewMode === 'lista' ? 'bg-white dark:bg-coal-100 shadow-sm rounded-lg text-blue-600' : 'text-gray-500'}`}
            >
              <List size={14} /> Competencias (RAPs)
            </button>
            <button 
              onClick={() => setViewMode('calendario')}
              className={`flex-1 py-2 text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all ${viewMode === 'calendario' ? 'bg-white dark:bg-coal-100 shadow-sm rounded-lg text-blue-600' : 'text-gray-500'}`}
            >
              <Calendar size={14} /> Calendario
            </button>
          </div>

          <div className="space-y-6">
            {viewMode === 'lista' ? (
              niveles.map((nivel) => (
                <div key={nivel.id} className="p-5 bg-white border border-gray-200 shadow-sm dark:bg-coal-300 rounded-xl dark:border-gray-700 animate-fade-in-up">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl italic font-black text-gray-400 uppercase">Trimestre {nivel.id}</h2>
                    <span className="px-3 py-1 text-[10px] font-bold text-orange-600 bg-orange-100 rounded-full uppercase">Planificado</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 p-4 mb-6 rounded-lg md:grid-cols-4 bg-gray-50 dark:bg-coal-400">
                    <div><p className="text-[10px] text-gray-500 uppercase font-bold">Inicio</p><p className="text-xs font-medium">Por definir</p></div>
                    <div><p className="text-[10px] text-gray-500 uppercase font-bold">Fin</p><p className="text-xs font-medium">Por definir</p></div>
                    <div><p className="text-[10px] text-gray-500 uppercase font-bold">RAPs</p><p className="text-xs font-medium">0</p></div>
                    <div><p className="text-[10px] text-gray-500 uppercase font-bold">Estado</p><p className="text-xs font-bold text-blue-500">0%</p></div>
                  </div>
                  
                  <div className='my-4'>
                    <h4 className="pl-3 mb-3 text-[10px] font-black text-gray-700 uppercase border-l-4 border-blue-600 dark:text-gray-200">Competencias Asignadas</h4>
                    <CardRap />
                  </div>

                  <button
                    onClick={() => handleOpenMateria(nivel.id)}
                    className="w-full py-3 mt-2 text-xs font-bold text-gray-400 uppercase transition-all border-2 border-gray-200 border-dashed rounded-xl hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50"
                  >
                    + Agregar competencia al trimestre
                  </button>
                </div>
              ))
            ) : (
              <Calendario />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-4 px-6 bg-white border-t border-gray-200 dark:bg-coal-400 dark:border-gray-800">
          <button onClick={onClose} className="px-8 py-2.5 bg-gray-800 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-black transition-all shadow-lg">
            Cerrar Malla
          </button>
        </div>
      </div>

      <AsignarMateria isOpen={isMateriaModalOpen} onClose={() => setIsMateriaModalOpen(false)} nivelId={selectedNivelId} />
    </div>
  );
};

export default MallaCurricular;