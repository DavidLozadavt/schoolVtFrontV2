import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MallaCurricularProps, RecursoItem } from '../../types';
import AsignarMateria from './AsignarMateria';

export const MallaCurricular = ({ isOpen, onClose, program }: MallaCurricularProps) => {
  const [niveles, setNiveles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorApi, setErrorApi] = useState<string | null>(null);

  // Catálogos de la API
  const [recursos, setRecursos] = useState<{
    periodos: any[];
    tipos_grado: any[];
    jornadas_disponibles: any[];
  } | null>(null);

  // --- ESTADOS DE SELECCIÓN ---
  const [selectedPeriodo, setSelectedPeriodo] = useState<number | string>('');
  const [selectedTipoGrado, setSelectedTipoGrado] = useState<number | string>('');
  const [selectedJornada, setSelectedJornada] = useState<number | string>('');
  
  // Estado para bloquear el select de grado
  const [isGradoDisabled, setIsGradoDisabled] = useState(false);

  // --- ESTADOS PARA MODAL ASIGNAR MATERIA ---
  const [isMateriaModalOpen, setIsMateriaModalOpen] = useState(false);
  const [selectedNivelId, setSelectedNivelId] = useState('');

  useEffect(() => {
    const fetchConfiguracion = async () => {
      if (isOpen && program?.id) {
        setLoading(true);
        try {
          const response = await axios.get(`/asignacion_detalle_completo/${program.id}`);
          const { data } = response.data;
          setRecursos(data.recursos);

          if (data.detalle) {
            setSelectedPeriodo(data.detalle.idPeriodo);

            const gradoId = data.idTipoGradoAsignado || data.detalle.programa.idTipoGrado || '';
            setSelectedTipoGrado(gradoId);
            
            if (data.idTipoGradoAsignado) {
              setIsGradoDisabled(true);
            } else {
              setIsGradoDisabled(false);
            }

            if (data.detalle.jornadas?.length > 0) {
              setSelectedJornada(data.detalle.jornadas[0].id);
            }
          }
        } catch (error: any) {
          setErrorApi("Error al cargar recursos");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchConfiguracion();
  }, [isOpen, program?.id]);

  const handleOpenMateria = (nivelId: string) => {
    setSelectedNivelId(nivelId);
    setIsMateriaModalOpen(true);
  };

  const agregarNivelAMalla = () => {
    if (!selectedPeriodo || !selectedJornada) {
      alert("Seleccione un periodo y una jornada antes de agregar.");
      return;
    }

    const periodoNombre = recursos?.periodos.find(p => p.id == selectedPeriodo)?.nombre;
    const jornadaNombre = recursos?.jornadas_disponibles.find(j => j.id == selectedJornada)?.nombre;

    const nuevoNivel = {
      id: `M${niveles.length + 1}`,
      nombre: `Nivel Académico - ${periodoNombre}`,
      infoSub: `Jornada: ${jornadaNombre}`,
      periodoId: selectedPeriodo,
      jornadaId: selectedJornada
    };

    setNiveles([...niveles, nuevoNivel]);
  };

  const quitarNivel = () => {
    if (niveles.length > 0) setNiveles(niveles.slice(0, -1));
  };

  if (!isOpen || !program) return null;

  const nombreGradoActual = recursos?.tipos_grado.find(t => t.id == selectedTipoGrado)?.nombre || 'SIN ASIGNAR';

  // Clase común para los selectores en modo oscuro
  const selectDarkClass = "p-0 font-extrabold bg-transparent border-none focus:ring-0 text-2sm dark:text-white dark:[color-scheme:dark]";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-5xl bg-white dark:bg-coal-500 rounded-xl shadow-card flex flex-col max-h-[95vh] overflow-hidden border border-gray-300 dark:border-gray-dark-300">

        {loading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-coal-500/60 backdrop-blur-sm">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 rounded-full border-primary border-t-transparent animate-spin"></div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="relative flex-shrink-0 w-full h-32 overflow-hidden md:h-40">
          <img src={program.imageUrl} className="absolute inset-0 object-cover w-full h-full brightness-[0.35]" alt="Banner" />
          <button onClick={onClose} className="absolute z-10 flex items-center justify-center w-8 h-8 text-white border rounded-full top-4 right-4 bg-white/10 hover:bg-danger border-white/30">
            <i className="ki-outline ki-cross"></i>
          </button>
          <div className="absolute text-white bottom-4 left-6">
            <h2 className="text-1.5xl font-bold uppercase">{program.name}</h2>
            <div className="italic font-bold text-gray-300 uppercase dark:text-gray-200 text-2xs">
              <p>Gestión de Malla Curricular</p>
              <p>Grado: {nombreGradoActual}</p>
              <p>ID : {program.id}</p>
            </div>
          </div>
        </div>

        {/* Área de Selección de Parámetros */}
        <div className="flex-grow p-5 overflow-y-auto bg-gray-100 md:p-7 no-scrollbar dark:bg-coal-600">
          <div className="flex flex-col items-stretch justify-between gap-4 p-4 mb-6 bg-white border border-gray-300 shadow-sm xl:flex-row dark:bg-coal-300 rounded-xl dark:border-gray-dark-100">
            <div className="grid flex-grow grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-2">

              {/* Select Periodo */}
              <div className="flex items-center gap-3 px-2">
                <div className="flex flex-col w-full">
                  <label className="font-bold text-gray-500 uppercase text-3xs">Periodo Lectivo</label>
                  <select
                    value={selectedPeriodo}
                    onChange={(e) => setSelectedPeriodo(e.target.value)}
                    className={`text-gray-800 ${selectDarkClass}`}
                  >
                    <option value="" className="dark:bg-coal-500">SELECCIONE...</option>
                    {recursos?.periodos.map(p => (
                      <option key={p.id} value={p.id} className="dark:bg-coal-500 dark:text-white">
                        {selectedPeriodo == p.id ? p.nombre : `${p.nombre} (${p.fechaInicial} a ${p.fechaFinal})`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Select Jornada */}
              <div className="flex items-center gap-3 px-2 border-gray-200 sm:border-l dark:border-gray-dark-300">
                <div className="flex flex-col w-full">
                  <label className="font-bold text-gray-500 uppercase text-3xs">Jornada</label>
                  <select
                    value={selectedJornada}
                    onChange={(e) => setSelectedJornada(e.target.value)}
                    className={`text-gray-800 ${selectDarkClass}`}
                  >
                    <option value="" className="dark:bg-gray-500">SELECCIONE...</option>
                    {recursos?.jornadas_disponibles.map(j => (
                      <option key={j.id} value={j.id} className="dark:bg-coal-500 dark:text-white">
                        {selectedJornada == j.id ? j.nombre : `${j.nombre} - ${j.diaSemana} (${j.horaInicial} a ${j.horaFinal})`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Select Tipo de Grado */}
              <div className="flex items-center gap-3 px-2 border-gray-200 sm:border-l dark:border-gray-dark-300">
                <div className="flex flex-col w-full">
                  <label className="font-bold text-gray-500 uppercase text-3xs">Grado</label>
                  <select
                    value={selectedTipoGrado}
                    onChange={(e) => setSelectedTipoGrado(e.target.value)}
                    disabled={isGradoDisabled}
                    className={`${selectDarkClass} uppercase ${isGradoDisabled ? 'text-gray-400 cursor-not-allowed opacity-70' : 'text-primary'}`}
                  >
                    <option value="" className="dark:bg-coal-500">SELECCIONE...</option>
                    {recursos?.tipos_grado.map(t => (
                      <option key={t.id} value={t.id} className="dark:bg-coal-500 dark:text-white">{t.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Acciones para grados */}
            <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-200 xl:pt-0 xl:border-t-0 xl:pl-4 xl:border-l dark:border-gray-dark-300">
              <button onClick={quitarNivel} className="flex items-center justify-center w-10 h-10 transition-all border border-gray-300 rounded-lg text-danger hover:bg-danger hover:text-white">
                <i className="text-xl ki-outline ki-minus"></i>
              </button>
              <button onClick={agregarNivelAMalla} className="flex items-center justify-center w-10 h-10 text-white transition-all rounded-lg shadow-lg bg-primary hover:bg-primary-active active:scale-90">
                <i className="text-xl ki-outline ki-plus"></i>
              </button>
            </div>
          </div>

          {/* Grid de Tarjetas (Malla) */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {niveles.map((nivel) => (
              <div key={nivel.id} className="p-5 transition-colors bg-white border border-gray-400 shadow-sm dark:bg-coal-300 rounded-xl animate-fade-in-up hover:border-primary">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl italic font-black text-primary opacity-30">{nivel.id}</span>
                  <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded uppercase">
                    {nivel.jornadaId ? recursos?.jornadas_disponibles.find(j => j.id == nivel.jornadaId)?.nombre : ''}
                  </span>
                </div>
                <h4 className="mb-4 text-xs font-black text-gray-800 uppercase dark:text-white">
                  {nivel.nombre}
                </h4>

                <div className="p-3 mb-4 border border-gray-300 border-dashed rounded-lg bg-gray-50 dark:bg-coal-400">
                  <p className="italic font-medium text-center text-gray-600 text-2xs dark:text-gray-500">Sin materias asignadas</p>
                </div>

                <button
                  onClick={() => handleOpenMateria(nivel.id)}
                  className="w-full py-2.5 font-bold text-gray-500 uppercase border border-gray-400 border-dashed rounded-lg hover:border-primary hover:text-white hover:bg-primary transition-all text-4xs"
                >
                  <i className="mr-1.5 ki-outline ki-plus"></i> Asignar Materia
                </button>
              </div>
            ))}

            {niveles.length === 0 && (
              <div className="py-20 text-center col-span-full opacity-30">
                <i className="mb-3 text-5xl ki-outline ki-book-open"></i>
                <p className="text-xs font-black tracking-widest uppercase">Seleccione parámetros y pulse "+" para crear la malla</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 px-6 bg-white border-t border-gray-300 dark:bg-coal-400">
          <p className="italic font-bold text-gray-500 uppercase text-3xs">Se guardarán {niveles.length} niveles configurados.</p>
          <button onClick={onClose} className="px-10 py-2.5 bg-primary text-white rounded-lg text-3xs font-black uppercase shadow-lg hover:bg-primary-active active:scale-95 transition-all">
            Guardar Configuración
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