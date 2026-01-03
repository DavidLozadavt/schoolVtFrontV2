import React from 'react';

interface FormularioProgramaProps {
  isOpen: boolean;
  onClose: () => void;
}

const FormularioPrograma: React.FC<FormularioProgramaProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-coal-black/40 backdrop-blur-sm p-4">
      {/* Contenedor Principal siguiendo borderRadius.modal y custom backgrounds */}
      <div className="w-full max-w-lg overflow-hidden bg-white border border-gray-200 dark:bg-coal-600 rounded-xl shadow-modal dark:border-coal-100 animate-fade-in">
        
        {/* Header del Formulario */}
        <div className="flex items-center justify-between px-7.5 py-4 border-b border-gray-200 dark:border-coal-100 bg-gray-light-100 dark:bg-coal-200">
          <h2 className="font-semibold tracking-wider text-gray-900 uppercase text-md dark:text-gray-dark-900">
            Crear Programa
          </h2>
          <button 
            onClick={onClose}
            className="transition-colors btn btn-sm btn-icon btn-light btn-clear hover:text-danger"
          >
            <i className="text-lg ki-outline ki-cross"></i>
          </button>
        </div>

        {/* Cuerpo del Formulario */}
        <form className="p-7.5 space-y-5">
          
          {/* Nombre del Programa */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-gray-700 uppercase text-2xs dark:text-gray-dark-700">
              Nombre del Programa
            </label>
            <textarea 
              rows={2}
              className="w-full border-gray-300 textarea bg-gray-light-100 dark:bg-coal-300 dark:border-coal-100 focus:border-primary text-2sm"
              placeholder="Ingrese el nombre completo"
            />
          </div>

          {/* Código */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-gray-700 uppercase text-2xs dark:text-gray-dark-700">
              Código
            </label>
            <input 
              type="text" 
              className="w-full border-gray-300 input bg-gray-light-100 dark:bg-coal-300 dark:border-coal-100 focus:border-primary text-2sm"
              placeholder="Ingrese Código"
            />
          </div>

          {/* Fila: Tipo Formación y Nivel Educativo */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="font-bold text-gray-700 uppercase text-2xs dark:text-gray-dark-700">
                Tipo Formación
              </label>
              <select className="w-full border-gray-300 select bg-gray-light-100 dark:bg-coal-300 dark:border-coal-100 text-2sm">
                <option value="">Seleccionar</option>
                <option value="presencial">Presencial</option>
                <option value="virtual">Virtual</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold text-gray-700 uppercase text-2xs dark:text-gray-dark-700">
                Nivel Educativo
              </label>
              <select className="w-full border-gray-300 select bg-gray-light-100 dark:bg-coal-300 dark:border-coal-100 text-2sm">
                <option value="">Seleccionar</option>
                <option value="preescolar">Preescolar</option>
                <option value="primaria">Básica Primaria</option>
              </select>
            </div>
          </div>

          {/* Estado Programa */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-gray-700 uppercase text-2xs dark:text-gray-dark-700">
              Estado Programa
            </label>
            <select className="w-full border-gray-300 select bg-gray-light-100 dark:bg-coal-300 dark:border-coal-100 text-2sm">
              <option value="">Seleccionar</option>
              <option value="aprobado">Aprobado</option>
              <option value="pendiente">Pendiente</option>
            </select>
          </div>

          {/* Descripción */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-gray-700 uppercase text-2xs dark:text-gray-dark-700">
              Descripción
            </label>
            <textarea 
              rows={3}
              className="w-full border-gray-300 textarea bg-gray-light-100 dark:bg-coal-300 dark:border-coal-100 focus:border-primary text-2sm"
              placeholder="Descripción breve del programa"
            />
          </div>

          {/* Footer de Botones */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <button 
              type="button"
              className="px-10 font-bold tracking-widest uppercase btn btn-primary shadow-primary text-2xs"
            >
              <i className="ki-filled ki-plus"></i>
              Aceptar
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="px-10 font-bold tracking-widest uppercase btn btn-danger shadow-danger text-2xs"
            >
              <i className="ki-filled ki-cross-circle"></i>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioPrograma;