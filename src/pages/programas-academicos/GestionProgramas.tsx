import React, { useState, useRef, useMemo, useEffect } from 'react';
import axios from 'axios';
import FormularioPrograma from './FormularioPrograma';
import Toast from './Toast';

interface Program {
  id: number;
  name: string;
  status: string;
  imageUrl: string;
  codigo: string;
  nivel: string;
  formacion: string;
}

const GestionProgramas: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgramas();
  }, []);

  const fetchProgramas = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/programas');


      if (response.data.status === 'success') {
        const mappedData: Program[] = response.data.data.map((p: any) => ({
          id: p.id,
          name: p.nombrePrograma,
          codigo: p.codigoPrograma,
          status: p.estado?.nombre || 'ACTIVO',
          nivel: p.nivel?.nombreNivel || 'N/A',
          
          formacion: p.tipo_formacion?.nombreTipoFormacion || 'N/A',
          
          imageUrl:
            p.imageUrl ||
            'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=500',
        }));

        setPrograms(mappedData);
      }
    } catch (error) {
      console.error('Error al cargar programas:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleAddProgram = (newProgram: Program) => {

    setPrograms((prev) => [...prev, newProgram]);
    setShowToast(true);

    setTimeout(() => {
      if (carouselRef.current) {
        carouselRef.current.scrollTo({
          left: carouselRef.current.scrollWidth,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const filteredPrograms = useMemo(() => {
    return programs.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, programs]);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const cardWidth = 260;
      const { scrollLeft } = carouselRef.current;
      const target = direction === 'left' ? scrollLeft - cardWidth : scrollLeft + cardWidth;
      carouselRef.current.scrollTo({ left: target, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (carouselRef.current) {
      const cardWidth = 260;
      const index = Math.round(carouselRef.current.scrollLeft / cardWidth);
      if (index !== activeIndex) setActiveIndex(index);
    }
  };

  return (
    <div className="relative flex flex-col w-full h-screen min-h-screen p-4 md:p-8 bg-[#f3f4f7] dark:bg-coal-500 font-sans overflow-hidden">

      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-20">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#a1a1aa 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }}></div>

        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full -mr-64 -mt-64"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full -ml-64 -mb-64"></div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* CONTENIDO PRINCIPAL (Encima del fondo) */}
      <div className="relative z-10 flex flex-col w-full h-full">

        {/* Título Principal */}
        <div className="w-full max-w-6xl mx-auto mb-6 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-800 uppercase dark:text-white">
            Gestión de Programas
          </h1>
          <p className="mt-1 text-xs font-medium tracking-widest text-gray-500 uppercase">Configuración Académica</p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between w-full max-w-5xl gap-4 px-2 mx-auto mb-8">
          <div className="group flex items-center bg-white/80 backdrop-blur-md dark:bg-coal-300/80 border border-gray-200 dark:border-transparent rounded-full p-1.5 transition-all duration-500 ease-in-out w-[46px] hover:w-[280px] md:hover:w-[350px] focus-within:w-[280px] md:focus-within:w-[350px] shadow-sm overflow-hidden">
            <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-gray-500 transition-colors group-hover:text-blue-600 group-focus-within:text-blue-600">
              <i className="text-xl ki-outline ki-magnifier"></i>
            </div>
            <input
              type="text"
              placeholder="Buscar programa o código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 text-sm font-medium transition-opacity duration-300 bg-transparent border-none outline-none opacity-0 group-hover:opacity-100 focus:opacity-100 dark:text-white"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="group relative flex items-center justify-start h-[46px] w-[46px] hover:w-[180px] bg-blue-600 text-white rounded-full transition-all duration-500 ease-in-out overflow-hidden shadow-lg active:scale-95 flex-shrink-0"
          >
            <div className="flex items-center justify-center flex-shrink-0 w-[46px] h-[46px]">
              <i className="text-lg ki-filled ki-plus"></i>
            </div>
            <span className="absolute left-[46px] text-[10px] font-bold uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pr-6">
              Añadir Programa
            </span>
          </button>
        </div>

        {/* Carrusel */}
        <div className="relative w-full max-w-[1200px] mx-auto flex-grow flex items-center px-4 md:px-10 overflow-hidden">
          <button onClick={() => scroll('left')} className="absolute z-50 items-center justify-center hidden w-10 h-10 text-gray-600 transition-all border border-transparent rounded-full shadow-xl bg-white/90 backdrop-blur-sm left-2 md:left-4 sm:flex dark:bg-coal-300 hover:scale-110 active:scale-95 dark:text-gray-300">
            <i className="text-xl ki-outline ki-left"></i>
          </button>

          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="flex items-center w-full gap-8 py-8 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth"
          >
            {filteredPrograms.map((program) => (
              <div key={program.id} className="flex-shrink-0 snap-center w-[220px] h-[310px] group [perspective:1000px] transition-all duration-500">
                <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] shadow-xl rounded-[1.25rem]">

                  {/* FRENTE */}
                  <div className="absolute inset-0 [backface-visibility:hidden] rounded-[1.25rem] overflow-hidden border border-gray-200/50 dark:border-transparent">
                    <img src={program.imageUrl} alt={program.name} className="absolute inset-0 object-cover w-full h-full" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
                      <span className="w-fit px-3 py-1 mb-1.5 font-extrabold uppercase rounded-md text-[11px] bg-blue-600 tracking-wider shadow-sm">
                        Programa
                      </span>
                      <h3 className="text-sm font-bold leading-tight tracking-wide uppercase">{program.name}</h3>
                      <p className="font-semibold text-white/70 text-[9px] uppercase tracking-widest">{program.status}</p>
                    </div>
                  </div>

                  {/* REVERSO */}
                  <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-[#f8f9fa] dark:bg-coal-400 rounded-[1.25rem] p-5 flex flex-col border border-white dark:border-coal-300 shadow-inner">
                    <div className="flex justify-between mb-4">
                      <button title="Periodos abiertos" className="flex items-center justify-center w-8 h-8 text-gray-600 transition-all border border-transparent rounded-lg dark:text-blue-300 bg-blue-100/30 dark:bg-blue-500/10 hover:border-blue-500 hover:scale-105 active:scale-95">
                        <i className="text-lg ki-outline ki-entrance-right"></i>
                      </button>
                      <button title="Malla curricular" className="flex items-center justify-center w-8 h-8 text-gray-600 transition-all border border-transparent rounded-lg dark:text-blue-300 bg-blue-100/30 dark:bg-blue-500/10 hover:border-blue-500 hover:scale-105 active:scale-95">
                        <i className="text-lg ki-outline ki-book-open"></i>
                      </button>
                      <button title="Configurar pagos" className="flex items-center justify-center w-8 h-8 text-gray-600 transition-all border border-transparent rounded-lg dark:text-blue-300 bg-blue-100/30 dark:bg-blue-500/10 hover:border-blue-500 hover:scale-105 active:scale-95">
                        <i className="text-lg ki-outline ki-setting-2"></i>
                      </button>
                      <button title="Configurar documentos" className="flex items-center justify-center w-8 h-8 text-gray-600 transition-all border border-transparent rounded-lg dark:text-blue-300 bg-blue-100/30 dark:bg-blue-500/10 hover:border-blue-500 hover:scale-105 active:scale-95">
                        <i className="text-lg ki-outline ki-files"></i>
                      </button>
                    </div>

                    <div className="flex-grow space-y-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-300 uppercase tracking-tighter">Cod.</span>
                        <span className="text-[11px] font-bold text-gray-700 dark:text-white leading-none">{program.codigo}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-300 uppercase tracking-tighter">Nivel</span>
                        <span className="text-[11px] font-bold text-gray-700 dark:text-white leading-none">{program.nivel}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-300 uppercase tracking-tighter">
                          Formación
                        </span>
                        <span className="text-[11px] font-bold text-gray-700 dark:text-white leading-none">
                          {program.formacion}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-300 uppercase tracking-tighter">Estado</span>
                        <span className="text-[11px] font-bold text-emerald-500 dark:text-emerald-400 uppercase tracking-wide">{program.status}</span>
                      </div>
                    </div>

                    <div className="flex justify-between gap-2 pt-3 mt-auto border-t border-gray-100 dark:border-coal-200">
                      <button title="Actualizar" className="flex items-center justify-center flex-1 py-1.5 text-blue-500 transition-all border border-transparent bg-blue-50/50 dark:bg-blue-500/10 rounded-lg hover:border-blue-500"><i className="ki-outline ki-arrows-loop"></i></button>
                      <button title="Eliminar" className="flex items-center justify-center flex-1 py-1.5 text-red-500 transition-all border border-transparent bg-red-50/50 dark:bg-red-500/10 rounded-lg hover:border-red-500"><i className="ki-outline ki-trash"></i></button>
                      <button title="Información" className="flex items-center justify-center flex-1 py-1.5 text-blue-600 transition-all border border-transparent bg-blue-50/50 dark:bg-blue-500/10 rounded-lg hover:border-blue-600"><i className="ki-outline ki-eye"></i></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => scroll('right')} className="absolute z-50 items-center justify-center hidden w-10 h-10 text-gray-600 transition-all border border-transparent rounded-full shadow-xl bg-white/90 backdrop-blur-sm right-2 md:right-4 sm:flex dark:bg-coal-300 hover:scale-110 active:scale-95 dark:text-gray-300">
            <i className="text-xl ki-outline ki-right"></i>
          </button>
        </div>

        {/* Indicadores */}
        <div className="flex justify-center gap-2 pb-6 mt-4">
          {filteredPrograms.map((_, idx) => (
            <button
              key={idx}
              onClick={() => carouselRef.current?.scrollTo({ left: idx * 260, behavior: 'smooth' })}
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-10 bg-blue-600' : 'w-2 bg-gray-300 dark:bg-gray-600'}`}
            />
          ))}
        </div>
      </div>

      <FormularioPrograma
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddProgram={handleAddProgram}
      />

      <Toast
        message="El programa ha sido creado correctamente."
        isOpen={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default GestionProgramas;