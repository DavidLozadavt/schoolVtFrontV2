import { Container } from '@/components';
import { useEffect, useMemo, useState, useRef } from 'react';
import { KeenIcon } from '@/components';
import { ModalMigracionDatos } from './modal/ModalMigracionDatos';

const MigracionDatosContent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Container>
      <div className="card-header mb-6">
        <h3 className="card-title">Migración de Datos</h3>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-sm border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 rounded-2xl shadow-lg overflow-hidden">
          
          {/* Imagen */}
          <div className="h-52 w-full">
            <img
              src="/images/trabajadores.jpg"
              alt="Trabajadores"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Contenido */}
          <div className="p-6 text-center">
            <h4 className="text-xl font-semibold text-blue-700 mb-2">
              Trabajadores
            </h4>

            <div className="w-12 h-1 bg-blue-700 mx-auto mb-4 rounded"></div>

            <p className="text-gray-600 mb-6">
              Carga masiva de trabajadores
            </p>

            <button
              className="border-2 border-black px-8 py-2 rounded-lg font-semibold 
                        tracking-wide hover:bg-black hover:text-white transition"
              title='Cargar'
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              CARGAR
            </button>
          </div>
        </div>
      </div>

      <ModalMigracionDatos
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      />

      <style>
        {`
          .scroll-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scroll-hide::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </Container>
  );
};

export default MigracionDatosContent;
