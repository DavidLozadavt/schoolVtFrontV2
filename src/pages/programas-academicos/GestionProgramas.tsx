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

  const scrollAmount = 292;

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const currentScroll = carouselRef.current.scrollLeft;
      const targetScroll = direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount;
      carouselRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
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
          border-radius: 1.5rem; overflow: hidden;
        }
        .face-back { 
          transform: rotateY(180deg); 
          background: #f0f0f3;
        }
        .dark .face-back { background: #1e1e20; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        
        .btn-manage {
          transition: all 0.3s ease;
          border: 1px solid transparent;
        }
        .btn-manage:hover {
          border-color: #6366f1;
          background: #ffffff;
          transform: translateY(-2px);
        }
        .dark .btn-manage:hover {
          box-shadow: 0 0 12px rgba(99, 102, 241, 0.5);
          border-color: rgba(99, 102, 241, 0.6);
          background: #2a2a2d;
        }
      `}</style>

      {/* Botón Añadir */}
      <div className="flex justify-start mb-4">
        <button className="flex items-center gap-3 px-6 py-3 rounded-xl font-bold uppercase tracking-widest transition-all active:scale-95 bg-[#6366f1] text-white shadow-lg hover:bg-[#4f46e5] dark:bg-coal-400 dark:text-[#6366f1]">
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20">
            <i className="text-xs ki-filled ki-plus"></i>
          </div>
          <span className="text-xs">Añadir Programa</span>
        </button>
      </div>

      <div className="relative w-full max-w-[1100px] mx-auto flex-grow flex items-center">
        <button onClick={() => scroll('left')} className="absolute left-[-15px] z-50 w-10 h-10 flex items-center justify-center bg-white dark:bg-coal-300 rounded-full shadow-md hover:scale-110 active:shadow-inner transition-all"><i className="text-xl ki-outline ki-left"></i></button>
        <button onClick={() => scroll('right')} className="absolute right-[-15px] z-50 w-10 h-10 flex items-center justify-center bg-white dark:bg-coal-300 rounded-full shadow-md hover:scale-110 active:shadow-inner transition-all"><i className="text-xl ki-outline ki-right"></i></button>

        <div ref={carouselRef} onScroll={handleScroll} className="flex w-full gap-8 px-2 py-6 overflow-x-auto no-scrollbar snap-x snap-mandatory">
          {programs.map((program, idx) => (
            <div key={program.id} className={`container-3d flex-shrink-0 snap-center w-[260px] h-[360px] group transition-transform duration-500 ${idx === activeIndex ? 'scale-105' : 'scale-100'}`}>
              <div className="shadow-lg card-inner">
                
                {/* FRENTE con borde sutil */}
                <div className="relative border face face-front border-gray-200/50 dark:border-transparent">
                  <img src={program.imageUrl} alt={program.name} className="absolute inset-0 object-cover w-full h-full" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <span className="w-fit px-3 py-1 mb-2 font-bold text-white uppercase rounded-lg text-[9px] bg-[#6366f1]">Programa</span>
                    <h3 className="text-lg font-black leading-tight text-white uppercase">{program.name}</h3>
                    <p className="font-bold text-white/60 text-[9px] uppercase tracking-widest">{program.status}</p>
                  </div>
                </div>

                {/* REVERSO */}
                <div className="flex flex-col p-6 border border-white shadow-inner face face-back dark:border-coal-300">
                  {/* Botones Superiores Mejorados */}
                  <div className="flex justify-between mb-4">
                    <button title="Periodos abiertos" className="flex items-center justify-center text-gray-600 rounded-lg w-9 h-9 btn-manage bg-gray-200/50 dark:bg-coal-300 dark:text-gray-300">
                      <i className="text-xl ki-outline ki-entrance-left"></i>
                    </button>
                    <button title="Malla curricular" className="flex items-center justify-center text-gray-600 rounded-lg w-9 h-9 btn-manage bg-gray-200/50 dark:bg-coal-300 dark:text-gray-300">
                      <i className="text-xl ki-outline ki-book-open"></i>
                    </button>
                    <button title="Configurar pagos" className="flex items-center justify-center text-gray-600 rounded-lg w-9 h-9 btn-manage bg-gray-200/50 dark:bg-coal-300 dark:text-gray-300">
                      <i className="text-xl ki-outline ki-setting-2"></i>
                    </button>
                    <button title="Configurar documentos" className="flex items-center justify-center text-gray-600 rounded-lg w-9 h-9 btn-manage bg-gray-200/50 dark:bg-coal-300 dark:text-gray-300">
                      <i className="text-xl ki-outline ki-files"></i>
                    </button>
                  </div>

                  <div className="flex-grow space-y-3">
                    <div className="flex flex-col"><span className="text-[8px] font-bold text-gray-400 uppercase">Código</span><span className="text-xs font-bold text-gray-700 dark:text-gray-200">{program.codigo}</span></div>
                    <div className="flex flex-col"><span className="text-[8px] font-bold text-gray-400 uppercase">Nivel</span><span className="text-xs font-bold text-gray-700 dark:text-gray-200">{program.nivel}</span></div>
                    <div className="flex flex-col"><span className="text-[8px] font-bold text-gray-400 uppercase">Metodología</span><span className="text-xs font-bold text-gray-700 dark:text-gray-200">{program.formacion}</span></div>
                    <div className="flex flex-col"><span className="text-[8px] font-bold text-gray-400 uppercase">Estado</span><span className="text-xs font-bold uppercase text-success">{program.status}</span></div>
                  </div>

                  {/* Botones Inferiores */}
                  <div className="flex justify-between gap-2 pt-4 border-t border-gray-200 dark:border-coal-300">
                    <button title="Actualizar" className="flex-1 py-2 bg-[#f0f0f3] dark:bg-coal-400 rounded-lg text-gray-500 btn-manage shadow-sm">
                      <i className="ki-outline ki-arrows-loop"></i>
                    </button>
                    <button title="Eliminar" className="flex-1 py-2 bg-[#f0f0f3] dark:bg-coal-400 rounded-lg text-danger btn-manage shadow-sm">
                      <i className="ki-outline ki-trash"></i>
                    </button>
                    <button title="Información" className="flex-1 py-2 bg-[#f0f0f3] dark:bg-coal-400 rounded-lg text-[#6366f1] btn-manage shadow-sm">
                      <i className="ki-outline ki-eye"></i>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-2 mb-4">
        {programs.map((_, idx) => (
          <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-8 bg-[#6366f1]' : 'w-1.5 bg-gray-300 dark:bg-gray-600'}`} />
        ))}
      </div>
    </div>
  );
};

export default GestionProgramas;