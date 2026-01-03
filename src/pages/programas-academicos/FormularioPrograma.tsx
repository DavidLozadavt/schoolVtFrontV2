import React, { useState } from 'react';

interface FormularioProgramaProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProgram: (newProgram: any) => void;
}

const FormularioPrograma: React.FC<FormularioProgramaProps> = ({ isOpen, onClose, onAddProgram }) => {
  const [formData, setFormData] = useState({
    name: '',
    codigo: '',
    formacion: '',
    nivel: '',
    status: '',
    description: '' // Aseguramos que esté en el estado
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!formData.name || !formData.codigo) {
      alert("Por favor completa Nombre y Código");
      return;
    }

    // LISTA SEGURA DE IMÁGENES EDUCATIVAS (Unsplash IDs comprobados)
    const studyImages = [
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1',
      'https://images.unsplash.com/photo-1546410531-bb4caa6b424d',
      'https://images.unsplash.com/photo-1516979187457-637abb4f9353',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7'
    ];

    const randomIndex = Math.floor(Math.random() * studyImages.length);
    const finalImageUrl = `${studyImages[randomIndex]}?q=80&w=500&auto=format&fit=crop`;

    const newEntry = {
      id: Date.now(), 
      name: formData.name.toUpperCase(),
      status: formData.status.toUpperCase() || 'PENDIENTE',
      imageUrl: finalImageUrl, 
      codigo: formData.codigo.toUpperCase(),
      nivel: formData.nivel.toUpperCase(),
      formacion: formData.formacion.toUpperCase(),
      description: formData.description // Se envía al padre
    };

    onAddProgram(newEntry); 
    setFormData({ name: '', codigo: '', formacion: '', nivel: '', status: '', description: '' }); 
    onClose(); 
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-coal-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg overflow-hidden bg-white border border-gray-200 dark:bg-coal-600 rounded-xl shadow-modal dark:border-coal-100 animate-fade-in">
        
        {/* Header */}
        <div className="flex items-center justify-between px-7.5 py-4 border-b border-gray-200 dark:border-coal-100 bg-gray-light-100 dark:bg-coal-200">
          <h2 className="font-semibold tracking-wider text-gray-900 uppercase text-md dark:text-gray-dark-900">Crear Programa</h2>
          <button onClick={onClose} className="transition-colors btn btn-sm btn-icon btn-light btn-clear hover:text-danger">
            <i className="text-lg ki-outline ki-cross"></i>
          </button>
        </div>

        <form className="p-7.5 space-y-5">
          {/* Nombre */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-gray-700 uppercase text-2xs dark:text-gray-dark-700">Nombre del Programa</label>
            <textarea 
              rows={2} 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              className="w-full border-gray-300 textarea bg-gray-light-100 dark:bg-coal-300 dark:border-coal-100 focus:border-primary text-2sm" 
              placeholder="Ingrese el nombre completo" 
            />
          </div>

          {/* Código */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-gray-700 uppercase text-2xs dark:text-gray-dark-700">Código</label>
            <input 
              type="text" 
              value={formData.codigo} 
              onChange={(e) => setFormData({...formData, codigo: e.target.value})} 
              className="w-full border-gray-300 input bg-gray-light-100 dark:bg-coal-300 dark:border-coal-100 focus:border-primary text-2sm" 
              placeholder="Ingrese Código" 
            />
          </div>

          {/* Formación y Nivel */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="font-bold text-gray-700 uppercase text-2xs dark:text-gray-dark-700">Tipo Formación</label>
              <select value={formData.formacion} onChange={(e) => setFormData({...formData, formacion: e.target.value})} className="w-full border-gray-300 select bg-gray-light-100 dark:bg-coal-300 dark:border-coal-100 text-2sm">
                <option value="">Seleccionar</option>
                <option value="presencial">Presencial</option>
                <option value="virtual">Virtual</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-gray-700 uppercase text-2xs dark:text-gray-dark-700">Nivel Educativo</label>
              <select value={formData.nivel} onChange={(e) => setFormData({...formData, nivel: e.target.value})} className="w-full border-gray-300 select bg-gray-light-100 dark:bg-coal-300 dark:border-coal-100 text-2sm">
                <option value="">Seleccionar</option>
                <option value="preescolar">Preescolar</option>
                <option value="primaria">Básica Primaria</option>
              </select>
            </div>
          </div>

          {/* Estado */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-gray-700 uppercase text-2xs dark:text-gray-dark-700">Estado Programa</label>
            <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full border-gray-300 select bg-gray-light-100 dark:bg-coal-300 dark:border-coal-100 text-2sm">
              <option value="">Seleccionar</option>
              <option value="aprobado">Aprobado</option>
              <option value="pendiente">Pendiente</option>
            </select>
          </div>

          {/* Descripción (REINTEGRADO) */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-gray-700 uppercase text-2xs dark:text-gray-dark-700">Descripción</label>
            <textarea 
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full border-gray-300 textarea bg-gray-light-100 dark:bg-coal-300 dark:border-coal-100 focus:border-primary text-2sm"
              placeholder="Descripción breve del programa"
            />
          </div>

          {/* Botones */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <button type="button" onClick={handleSubmit} className="px-10 font-bold tracking-widest uppercase btn btn-primary shadow-primary text-2xs">
              <i className="ki-filled ki-plus"></i> Aceptar
            </button>
            <button type="button" onClick={onClose} className="px-10 font-bold tracking-widest uppercase btn btn-danger shadow-danger text-2xs">
              <i className="ki-filled ki-cross-circle"></i> Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioPrograma;