import React, { useState, useRef } from 'react';

// Interfaces para tipado fuerte
interface Program {
  id: number;
  name: string;
  status: string;
  imageUrl: string;
}

const GestionProgramas: React.FC = () => {
  // Datos de ejemplo basados en tus imágenes
  const [programs] = useState<Program[]>([
    { id: 1, name: 'ANALISIS Y DISEÑO DE SOFTWARE', status: 'APROBADO', imageUrl: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=500' },
    { id: 2, name: 'EXPLORADORES', status: 'APROBADO', imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=500' },
    { id: 3, name: 'PRIMARIA', status: 'APROBADO', imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=500' },
    { id: 4, name: 'SISTEMAS AVANZADOS', status: 'APROBADO', imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=500' },
  ]);

  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      carouselRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen p-6 lg:p-7.5 bg-gray-light-100 dark:bg-coal-500 font-sans">
      
      {/* Botón Añadir - Estilos basados en tu configuración 'info' y animación personalizada */}
      <div className="flex justify-start mb-10">
        <button className="flex items-center gap-2 px-5 py-2.5 bg-info text-info-inverse rounded-md hover:bg-info-active transition-all shadow-info animate-smooth-bounce">
          <i className="ki-filled ki-plus text-1.5xl"></i>
          <span className="font-semibold uppercase text-md">Añadir</span>
        </button>
      </div>

      {/* Contenedor del Carrusel */}
      <div className="relative group">
        
        {/* Flecha Izquierda - Ajustada sin left-0 para evitar conflicto */}
        <button 
          onClick={() => scroll('left')}
          className="absolute z-10 p-2 transition-all -translate-y-1/2 rounded-full opacity-0 -left-4 top-1/2 bg-white/80 dark:bg-coal-200 shadow-default group-hover:opacity-100 hover:bg-white dark:hover:bg-coal-100"
        >
          <i className="text-2xl text-gray-700 ki-outline ki-left dark:text-gray-400"></i>
        </button>

        {/* Track del Carrusel */}
        <div 
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none' }}
        >
          {programs.map((program) => (
            <div 
              key={program.id}
              className="relative flex-shrink-0 snap-center w-[280px] md:w-[320px] h-[420px] rounded-xl overflow-hidden shadow-card group/card"
            >
              {/* Imagen de Fondo con Zoom Effect */}
              <div 
                className="absolute inset-0 transition-transform duration-500 bg-center bg-cover group-hover/card:scale-110"
                style={{ backgroundImage: `url(${program.imageUrl})` }}
              >
                {/* Overlay Gradiente para legibilidad */}
                <div className="absolute inset-0 bg-gradient-to-t from-coal-black via-transparent to-transparent opacity-80" />
              </div>

              {/* Contenido de la Tarjeta */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                {/* Etiqueta 'Programa' con color Brand */}
                <div className="mb-3">
                  <span className="px-3 py-1 font-bold tracking-wider text-white uppercase rounded-full text-3xs bg-brand">
                    Programa
                  </span>
                </div>

                <h3 className="mb-2 font-bold leading-tight text-white text-1.5xl">
                  {program.name}
                </h3>

                <p className="font-medium tracking-widest uppercase text-white/80 text-2xs">
                  {program.status}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Flecha Derecha - Ajustada sin right-0 para evitar conflicto */}
        <button 
          onClick={() => scroll('right')}
          className="absolute z-10 p-2 transition-all -translate-y-1/2 rounded-full opacity-0 -right-4 top-1/2 bg-white/80 dark:bg-coal-200 shadow-default group-hover:opacity-100 hover:bg-white dark:hover:bg-coal-100"
        >
          <i className="text-2xl text-gray-700 ki-outline ki-right dark:text-gray-400"></i>
        </button>
      </div>

      {/* Indicadores (Dots) */}
      <div className="flex justify-center gap-2 mt-8">
        {programs.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-1.5 rounded-full transition-all ${idx === 0 ? 'w-8 bg-brand' : 'w-2 bg-gray-400 dark:bg-gray-700'}`} 
          />
        ))}
      </div>
    </div>
  );
};

export default GestionProgramas;