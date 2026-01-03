import React, { useState, useRef, useMemo } from 'react';

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
  const [programs] = useState<Program[]>([
    { id: 1, name: 'TRANSICIÓN', status: 'APROBADO', imageUrl: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=500', codigo: 'TRANS01', nivel: 'PREESCOLAR', formacion: 'PRESENCIAL' },
    { id: 2, name: 'JARDÍN', status: 'APROBADO', imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=500', codigo: 'JARDIN1234', nivel: 'PREESCOLAR', formacion: 'PRESENCIAL' },
    { id: 3, name: 'MATERNO', status: 'APROBADO', imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=500', codigo: 'MATER02', nivel: 'PREESCOLAR', formacion: 'PRESENCIAL' },
    { id: 4, name: 'PREJARDÍN', status: 'APROBADO', imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=500', codigo: 'PREJAR03', nivel: 'PREESCOLAR', formacion: 'PRESENCIAL' },
    { id: 5, name: 'PRIMARIA', status: 'APROBADO', imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=500', codigo: 'PRIM04', nivel: 'BÁSICA', formacion: 'PRESENCIAL' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Filtro de búsqueda interactivo
  const filteredPrograms = useMemo(() => {
    return programs.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, programs]);

  const scrollAmount = 260; // Ajustado al nuevo tamaño (220px + gap)

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { scrollLeft } = carouselRef.current;
      const target = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      carouselRef.current.scrollTo({ left: target, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (carouselRef.current) {
      const index = Math.round(carouselRef.current.scrollLeft / scrollAmount);
      if (index !== activeIndex) setActiveIndex(index);
    }
  };

  return (
    <div className="flex flex-col w-full h-screen max-h-screen p-4 lg:p-6 bg-[#f3f4f7] dark:bg-coal-500 font-sans overflow-hidden">
      
      <style>{`
        .container-3d { perspective: 1000px; }
        .card-inner { 
          position: relative; width: 100%; height: 100%; 
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); 
          transform-style: preserve-3d; 
        }
        .group:hover .card-inner { transform: rotateY(180deg); }
        .face { 
          position: absolute; width: 100%; height: 100%; 
          backface-visibility: hidden; border-radius: 1.25rem; overflow: hidden;
        }
        .face-back { transform: rotateY(180deg); background: #f8f9fa; }
        .dark .face-back { background: #1e1e20; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        
        .btn-manage { transition: all 0.2s ease; border: 1px solid transparent; }
        .btn-manage:hover { border-color: #6366f1; background: white; transform: scale(1.05); }
        .dark .btn-manage:hover { box-shadow: 0 0 10px rgba(99, 102, 241, 0.4); background: #2a2a2d; }
      `}</style>

      {/* Header: Añadir + Buscador */}
      <div className="flex flex-col justify-between gap-4 mb-6 md:flex-row md:items-center">
        <button className="flex items-center gap-3 px-5 py-2.5 rounded-xl font-bold uppercase transition-all active:scale-95 bg-[#6366f1] text-white shadow-lg hover:bg-[#4f46e5] w-fit">
          <i className="text-sm ki-filled ki-plus"></i>
          <span className="text-[10px] tracking-widest">Añadir Programa</span>
        </button>

        {/* Barra de Búsqueda Interactiva */}
        <div className="relative w-full md:w-80">
          <i className="absolute text-gray-400 -translate-y-1/2 ki-outline ki-magnifier left-4 top-1/2"></i>
          <input 
            type="text"
            placeholder="Buscar programa o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white dark:bg-coal-300 border border-gray-200 dark:border-transparent focus:ring-2 focus:ring-[#6366f1] outline-none text-sm transition-all shadow-sm dark:text-white"
          />
        </div>
      </div>

      <div className="relative w-full max-w-[1000px] mx-auto flex-grow flex items-center">
        {/* Navegación */}
        <button onClick={() => scroll('left')} className="absolute left-[-10px] z-50 w-9 h-9 flex items-center justify-center bg-white dark:bg-coal-300 rounded-full shadow-md hover:scale-110"><i className="ki-outline ki-left"></i></button>
        <button onClick={() => scroll('right')} className="absolute right-[-10px] z-50 w-9 h-9 flex items-center justify-center bg-white dark:bg-coal-300 rounded-full shadow-md hover:scale-110"><i className="ki-outline ki-right"></i></button>

        <div ref={carouselRef} onScroll={handleScroll} className="flex w-full gap-10 px-4 py-8 overflow-x-auto no-scrollbar snap-x snap-mandatory">
          {filteredPrograms.length > 0 ? (
            filteredPrograms.map((program, idx) => (
              <div key={program.id} className={`container-3d flex-shrink-0 snap-center w-[220px] h-[320px] group transition-transform duration-500 ${idx === activeIndex ? 'scale-105' : 'scale-95'}`}>
                <div className="shadow-xl card-inner">
                  
                  {/* FRENTE (Más pequeña) */}
                  <div className="relative border face face-front border-gray-200/50 dark:border-transparent">
                    <img src={program.imageUrl} alt={program.name} className="absolute inset-0 object-cover w-full h-full" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-end p-5">
                      <span className="w-fit px-2 py-0.5 mb-1.5 font-bold text-white uppercase rounded-md text-[8px] bg-[#6366f1]">Programa</span>
                      <h3 className="text-sm font-black leading-tight tracking-wide text-white uppercase">{program.name}</h3>
                      <p className="font-bold text-white/50 text-[8px] uppercase">{program.status}</p>
                    </div>
                  </div>

                  {/* REVERSO (Más pequeña) */}
                  <div className="flex flex-col p-5 border border-white shadow-inner face face-back dark:border-coal-300">
                    <div className="flex justify-between mb-4">
                      <button title="Periodos" className="flex items-center justify-center w-8 h-8 text-gray-500 rounded-lg btn-manage bg-gray-200/40 dark:bg-coal-400">
                        <i className="text-lg ki-outline ki-entrance-left"></i>
                      </button>
                      <button title="Malla" className="flex items-center justify-center w-8 h-8 text-gray-500 rounded-lg btn-manage bg-gray-200/40 dark:bg-coal-400">
                        <i className="text-lg ki-outline ki-book-open"></i>
                      </button>
                      <button title="Pagos" className="flex items-center justify-center w-8 h-8 text-gray-500 rounded-lg btn-manage bg-gray-200/40 dark:bg-coal-400">
                        <i className="text-lg ki-outline ki-setting-2"></i>
                      </button>
                      <button title="Documentos" className="flex items-center justify-center w-8 h-8 text-gray-500 rounded-lg btn-manage bg-gray-200/40 dark:bg-coal-400">
                        <i className="text-lg ki-outline ki-files"></i>
                      </button>
                    </div>

                    <div className="flex-grow space-y-2.5">
                      <div className="flex flex-col"><span className="text-[7px] font-bold text-gray-400 uppercase">Cod.</span><span className="text-[11px] font-bold text-gray-700 dark:text-gray-200">{program.codigo}</span></div>
                      <div className="flex flex-col"><span className="text-[7px] font-bold text-gray-400 uppercase">Nivel</span><span className="text-[11px] font-bold text-gray-700 dark:text-gray-200">{program.nivel}</span></div>
                      <div className="flex flex-col"><span className="text-[7px] font-bold text-gray-400 uppercase">Estado</span><span className="text-[11px] font-bold text-success uppercase">{program.status}</span></div>
                    </div>

                    <div className="flex justify-between gap-2 pt-3 border-t border-gray-100 dark:border-coal-300">
                      <button title="Actualizar" className="flex-1 py-1.5 bg-gray-100 dark:bg-coal-400 rounded-lg text-gray-400 btn-manage"><i className="ki-outline ki-arrows-loop"></i></button>
                      <button title="Eliminar" className="flex-1 py-1.5 bg-gray-100 dark:bg-coal-400 rounded-lg text-danger/70 btn-manage"><i className="ki-outline ki-trash"></i></button>
                      <button title="Ver" className="flex-1 py-1.5 bg-gray-100 dark:bg-coal-400 rounded-lg text-[#6366f1] btn-manage"><i className="ki-outline ki-eye"></i></button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full py-10 italic text-center text-gray-400">No se encontraron programas...</div>
          )}
        </div>
      </div>

      {/* Indicadores */}
      <div className="flex justify-center gap-1.5 mt-2">
        {filteredPrograms.map((_, idx) => (
          <div key={idx} className={`h-1 rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-6 bg-[#6366f1]' : 'w-1 bg-gray-300 dark:bg-gray-600'}`} />
        ))}
      </div>
    </div>
  );
};

export default GestionProgramas;