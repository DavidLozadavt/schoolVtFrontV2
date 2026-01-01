import React, { useState, useRef } from 'react';

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

  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // El ancho real de desplazamiento: tarjeta(300px) + gap(32px) = 332px
  const scrollAmount = 332;

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const currentScroll = carouselRef.current.scrollLeft;
      const targetScroll = direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount;
      
      carouselRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });
    }
  };

  const handleScroll = () => {
    if (carouselRef.current) {
      const index = Math.round(carouselRef.current.scrollLeft / scrollAmount);
      if (index !== activeIndex) setActiveIndex(index);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen p-6 lg:p-7.5 bg-[#f3f4f7] dark:bg-coal-500 font-sans">
      
      <style>{`
        .container-3d { perspective: 1200px; }
        .card-inner { 
          position: relative; width: 100%; height: 100%; 
          transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1); 
          transform-style: preserve-3d; 
        }
        .group:hover .card-inner { transform: rotateY(180deg); }
        .face { 
          position: absolute; width: 100%; height: 100%; 
          -webkit-backface-visibility: hidden; backface-visibility: hidden; 
          border-radius: 2rem; overflow: hidden;
        }
        .face-back { 
          transform: rotateY(180deg); 
          background: #f0f0f3;
          box-shadow: inset 5px 5px 10px #d1d1d6, inset -5px -5px 10px #ffffff;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Botón Añadir Neomórfico - Mejorado */}
      <div className="flex justify-start mb-8">
        <button className="flex items-center gap-3 px-8 py-4 bg-[#f0f0f3] text-[#6366f1] rounded-2xl font-bold uppercase tracking-widest shadow-[6px_6px_12px_#ced1d9,-6px_-6px_12px_#ffffff] hover:shadow-[inset_4px_4px_8px_#ced1d9,inset_-4px_-4px_8px_#ffffff] transition-all active:scale-95">
          <div className="flex items-center justify-center w-6 h-6 bg-[#6366f1] text-white rounded-full">
            <i className="text-sm ki-filled ki-plus"></i>
          </div>
          <span>Añadir Programa</span>
        </button>
      </div>

      {/* Área del Carrusel */}
      <div className="relative w-full max-w-[1200px] mx-auto">
        
        {/* Flechas de Navegación - Z-Index alto para asegurar clic */}
        <button 
          onClick={() => scroll('left')}
          className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-50 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-lg border border-gray-100 hover:scale-110 active:bg-gray-50 transition-all"
        >
          <i className="text-2xl text-gray-700 ki-outline ki-left"></i>
        </button>

        <button 
          onClick={() => scroll('right')}
          className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-50 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-lg border border-gray-100 hover:scale-110 active:bg-gray-50 transition-all"
        >
          <i className="text-2xl text-gray-700 ki-outline ki-right"></i>
        </button>

        {/* Track del Carrusel */}
        <div 
          ref={carouselRef}
          onScroll={handleScroll}
          className="flex gap-8 px-4 py-12 overflow-x-auto no-scrollbar snap-x snap-mandatory"
        >
          {programs.map((program, idx) => {
            const isCenter = idx === activeIndex;
            return (
              <div 
                key={program.id}
                className={`container-3d flex-shrink-0 snap-center w-[300px] h-[420px] group transition-transform duration-500
                  ${isCenter ? 'scale-105' : 'scale-100'}
                `}
              >
                <div className="shadow-xl card-inner">
                  
                  {/* FRENTE: Imagen Sólida (Sin transparencia) */}
                  <div className="relative face face-front">
                    <img 
                      src={program.imageUrl} 
                      alt={program.name} 
                      className="absolute inset-0 object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    
                    <div className="absolute inset-0 flex flex-col justify-end p-8">
                      <div className="mb-4">
                        <span className="px-5 py-2 font-bold text-white uppercase rounded-2xl text-[10px] bg-[#6366f1]">
                          Programa
                        </span>
                      </div>
                      <h3 className="mb-1 text-2xl font-black tracking-tight text-white uppercase">
                        {program.name}
                      </h3>
                      <p className="font-bold tracking-widest uppercase text-white/70 text-[10px]">
                        {program.status}
                      </p>
                    </div>
                  </div>

                  {/* REVERSO: Gestión e Información (Estilo Imagen 10) */}
                  <div className="flex flex-col p-8 face face-back dark:bg-coal-400">
                    {/* Header icons */}
                    <div className="flex justify-between mb-8 text-gray-400">
                      <i className="text-xl ki-outline ki-exit-right"></i>
                      <i className="text-xl ki-outline ki-book"></i>
                      <i className="text-xl ki-outline ki-setting-2"></i>
                      <i className="text-xl ki-outline ki-files"></i>
                    </div>

                    {/* Content */}
                    <div className="flex-grow space-y-5">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Código:</span>
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{program.codigo}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nivel:</span>
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{program.nivel}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Formación:</span>
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{program.formacion}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Estado:</span>
                        <span className="text-sm font-bold text-success">{program.status}</span>
                      </div>
                    </div>

                    {/* Acciones Neomórficas */}
                    <div className="flex justify-between gap-3 pt-6 border-t border-gray-200">
                      <button className="flex-1 py-3 bg-[#f0f0f3] rounded-xl shadow-[4px_4px_8px_#d1d1d6,-4px_-4px_8px_#ffffff] hover:shadow-inner text-gray-600 transition-all">
                        <i className="ki-outline ki-arrows-loop"></i>
                      </button>
                      <button className="flex-1 py-3 bg-[#f0f0f3] rounded-xl shadow-[4px_4px_8px_#d1d1d6,-4px_-4px_8px_#ffffff] hover:shadow-inner text-danger transition-all">
                        <i className="ki-outline ki-trash"></i>
                      </button>
                      <button className="flex-1 py-3 bg-[#f0f0f3] rounded-xl shadow-[4px_4px_8px_#d1d1d6,-4px_-4px_8px_#ffffff] hover:shadow-inner text-[#6366f1] transition-all">
                        <i className="ki-outline ki-eye"></i>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Indicadores (Dots) */}
      <div className="flex justify-center gap-3 mt-4">
        {programs.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === activeIndex ? 'w-10 bg-[#6366f1]' : 'w-2 bg-gray-300'
            }`} 
          />
        ))}
      </div>
    </div>
  );
};

export default GestionProgramas;