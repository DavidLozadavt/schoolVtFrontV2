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
    <div className="flex flex-col w-full h-screen min-h-screen p-4 md:p-8 bg-[#f3f4f7] dark:bg-coal-500 font-sans overflow-hidden">
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-6xl gap-2 mx-auto mb-8">
        <button className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2.5 rounded-xl font-bold uppercase transition-all active:scale-95 bg-blue-600 text-white shadow-lg hover:bg-blue-700 flex-shrink-0">
          <i className="text-xs md:text-sm ki-filled ki-plus"></i>
          <span className="text-[9px] md:text-[10px] tracking-widest whitespace-nowrap">Añadir Programa</span>
        </button>

        <div className="group flex items-center bg-white dark:bg-coal-300 border border-gray-200 dark:border-transparent rounded-full p-1 transition-all duration-500 ease-in-out w-[42px] hover:w-[200px] md:hover:w-[300px] focus-within:w-[200px] md:focus-within:w-[300px] shadow-sm flex-shrink-0 overflow-hidden">
          <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-gray-600 transition-colors group-hover:text-blue-500">
            <i className="text-lg ki-outline ki-magnifier"></i>
          </div>
          <input 
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-2 text-sm transition-opacity duration-300 bg-transparent border-none outline-none opacity-0 group-hover:opacity-100 focus:opacity-100 dark:text-white"
          />
        </div>
      </div>

      <div className="relative w-full max-w-[1250px] mx-auto flex-grow flex items-center px-4 md:px-12 overflow-hidden">
        
        <button onClick={() => scroll('left')} className="absolute z-50 items-center justify-center hidden w-10 h-10 text-gray-600 transition-all bg-white border border-transparent rounded-full shadow-xl left-2 md:left-4 sm:flex dark:bg-coal-300 hover:scale-110 active:scale-95 dark:text-gray-300 dark:border-coal-200">
          <i className="text-xl ki-outline ki-left"></i>
        </button>

        <div 
          ref={carouselRef} 
          onScroll={handleScroll} 
          className="flex items-center w-full gap-10 py-10 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth"
        >
          {filteredPrograms.map((program) => (
            <div 
              key={program.id} 
              className="flex-shrink-0 snap-center w-[220px] h-[320px] group [perspective:1000px] transition-all duration-500 scale-100"
            >
              <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] shadow-2xl rounded-[1.25rem]">
                
                {/* FRENTE */}
                <div className="absolute inset-0 [backface-visibility:hidden] rounded-[1.25rem] overflow-hidden border border-gray-200/50 dark:border-transparent">
                  <img src={program.imageUrl} alt={program.name} className="absolute inset-0 object-cover w-full h-full" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
                    <span className="w-fit px-2 py-0.5 mb-1.5 font-bold uppercase rounded-md text-[8px] bg-blue-600">Programa</span>
                    <h3 className="text-sm font-black leading-tight tracking-wide uppercase">{program.name}</h3>
                    <p className="font-bold text-white/80 text-[8px] uppercase">{program.status}</p>
                  </div>
                </div>

                {/* REVERSO */}
                <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-[#f8f9fa] dark:bg-coal-400 rounded-[1.25rem] p-5 flex flex-col border border-white dark:border-coal-300 shadow-inner">
                  
                  {/* Botones Superiores - Cambiados a Azul */}
                  <div className="flex justify-between mb-4">
                    {['entrance-left', 'book-open', 'setting-2', 'files'].map((icon) => (
                      <button key={icon} className="flex items-center justify-center w-8 h-8 text-gray-600 transition-all border border-transparent rounded-lg dark:text-blue-300 bg-blue-100/30 dark:bg-blue-500/10 hover:border-blue-500 hover:scale-105 active:scale-95">
                        <i className={`text-lg ki-outline ki-${icon}`}></i>
                      </button>
                    ))}
                  </div>

                  <div className="flex-grow space-y-2.5">
                    <div className="flex flex-col"><span className="text-[7px] font-bold text-gray-400 dark:text-gray-300 uppercase">Cod.</span><span className="text-[11px] font-bold text-gray-700 dark:text-white">{program.codigo}</span></div>
                    <div className="flex flex-col"><span className="text-[7px] font-bold text-gray-400 dark:text-gray-300 uppercase">Nivel</span><span className="text-[11px] font-bold text-gray-700 dark:text-white">{program.nivel}</span></div>
                    <div className="flex flex-col"><span className="text-[7px] font-bold text-gray-400 dark:text-gray-300 uppercase">Estado</span><span className="text-[11px] font-bold text-emerald-500 dark:text-emerald-400 uppercase">{program.status}</span></div>
                  </div>

                  {/* Botones Inferiores - Todos en tonos Azules/Rojo */}
                  <div className="flex justify-between gap-2 pt-3 mt-auto border-t border-gray-100 dark:border-coal-200">
                    <button title="Actualizar" className="flex-1 py-1.5 flex items-center justify-center bg-blue-50/50 dark:bg-blue-500/10 rounded-lg text-blue-500 dark:text-blue-400 border border-transparent hover:border-blue-500 transition-all">
                      <i className="ki-outline ki-arrows-loop"></i>
                    </button>
                    <button title="Eliminar" className="flex-1 py-1.5 flex items-center justify-center bg-red-50/50 dark:bg-red-500/10 rounded-lg text-red-500 dark:text-red-400 border border-transparent hover:border-red-500 transition-all">
                      <i className="ki-outline ki-trash"></i>
                    </button>
                    <button title="Ver" className="flex-1 py-1.5 flex items-center justify-center bg-blue-50/50 dark:bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-300 border border-transparent hover:border-blue-600 transition-all">
                      <i className="ki-outline ki-eye"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => scroll('right')} className="absolute z-50 items-center justify-center hidden w-10 h-10 text-gray-600 transition-all bg-white border border-transparent rounded-full shadow-xl right-2 md:right-4 sm:flex dark:bg-coal-300 hover:scale-110 active:scale-95 dark:text-gray-300 dark:border-coal-200">
          <i className="text-xl ki-outline ki-right"></i>
        </button>
      </div>

      {/* Indicadores - Cambiados a Azul */}
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
  );
};

export default GestionProgramas;