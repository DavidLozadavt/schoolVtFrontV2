import { Container } from '@/components';
import { useState } from 'react';
import { ModalMigracionDatos } from './modal/ModalMigracionDatos';
import * as XLSX from 'xlsx';


const MigracionDatosContent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<'trabajadores' | 'estudiantes'>(
    'trabajadores'
  );

  const openModalFor = (entity: 'trabajadores' | 'estudiantes') => {
    setSelectedEntity(entity);
    setIsModalOpen(true);
  };

  const handleDownload = (entity: 'trabajadores' | 'estudiantes') => {
    const headers = [
      'nombre1',
      'nombre2',
      'apellido1',
      'apellido2',
      'tipo_identificacion',
      'identificacion',
      'correo',
      'celular',
      'fecha_nacimiento',
      'tipo_contratacion',
      'valor',
      'fecha_inicial',
      'fecha_final',
      'rol',
    ];

    // Fila vacía para los encabezados
    const data = [Object.fromEntries(headers.map(h => [h, '']))];

    const worksheet = XLSX.utils.json_to_sheet(data);

    // AJUSTAR COLUMNAS AL TEXTO
    worksheet['!cols'] = headers.map(h => ({
      wch: Math.max(h.length + 2, 15),
    }));

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      entity === 'trabajadores' ? 'Trabajadores' : 'Estudiantes'
    );

    XLSX.writeFile(
      workbook,
      `plantilla_${entity}.xlsx`
    );
  };

  return (
    <Container>
      <div className="card-header mb-6">
        <h3 className="card-title">Migración de Datos</h3>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-6">
        {/* Tarjeta Trabajadores */}
        <div className="group relative w-full max-w-sm border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 rounded-2xl shadow-lg overflow-hidden">
          <div className="h-52 w-full relative">
            <img
              src="/images/trabajadores.jpg"
              alt="Trabajadores"
              className="w-full h-full object-cover"
            />

            {/* Overlay que aparece en hover */}
            <div className="absolute inset-x-0 top-0 h-52 flex items-start justify-center pointer-events-none transition-all duration-300 transform -translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
              <div className="w-full h-52 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center">
                <button
                  onClick={() => handleDownload('trabajadores')}
                  className="pointer-events-auto bg-white/90 text-black border-2 border-white rounded-full px-8 py-3 font-semibold tracking-wide uppercase shadow-lg hover:bg-white"
                  title="Descargar plantilla Trabajadores"
                >
                  DESCARGAR
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 text-center">
            <h4 className="text-xl font-semibold text-blue-700 mb-2">Trabajadores</h4>

            <div className="w-12 h-1 bg-blue-700 mx-auto mb-4 rounded"></div>

            <p className="text-gray-600 mb-6">Carga masiva de trabajadores</p>

            <button
              className="border-2 border-black px-8 py-2 rounded-lg font-semibold tracking-wide hover:bg-black hover:text-white transition"
              title="Cargar Trabajadores"
              onClick={() => openModalFor('trabajadores')}
            >
              CARGAR
            </button>
          </div>
        </div>

        {/* Tarjeta Estudiantes */}
        <div className="group relative w-full max-w-sm border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 rounded-2xl shadow-lg overflow-hidden">
          <div className="h-52 w-full relative">
            <img
              src="/images/estudiantes.jpg"
              alt="Estudiantes"
              className="w-full h-full object-cover"
            />

            {/* Overlay que aparece en hover */}
            <div className="absolute inset-x-0 top-0 h-52 flex items-start justify-center pointer-events-none transition-all duration-300 transform -translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
              <div className="w-full h-52 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center">
                <button
                  onClick={() => handleDownload('estudiantes')}
                  className="pointer-events-auto bg-white/90 text-black border-2 border-white rounded-full px-8 py-3 font-semibold tracking-wide uppercase shadow-lg hover:bg-white"
                  title="Descargar plantilla Estudiantes"
                >
                  DESCARGAR
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 text-center">
            <h4 className="text-xl font-semibold text-green-700 mb-2">Estudiantes</h4>

            <div className="w-12 h-1 bg-green-700 mx-auto mb-4 rounded"></div>

            <p className="text-gray-600 mb-6">Carga masiva de estudiantes</p>

            <button
              className="border-2 border-black px-8 py-2 rounded-lg font-semibold tracking-wide hover:bg-black hover:text-white transition"
              title="Cargar Estudiantes"
              onClick={() => openModalFor('estudiantes')}
            >
              CARGAR
            </button>
          </div>
        </div>
      </div>

      <ModalMigracionDatos
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        entity={selectedEntity}
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
