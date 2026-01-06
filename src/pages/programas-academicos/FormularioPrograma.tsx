import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface FormularioProgramaProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProgram: (newProgram: any) => void;
}

const FormularioPrograma: React.FC<FormularioProgramaProps> = ({ isOpen, onClose, onAddProgram }) => {
  const [catalogos, setCatalogos] = useState({
    niveles: [] as any[],
    tipos: [] as any[],
    estados: [] as any[]
  });

  const [formData, setFormData] = useState({
    name: '',
    codigo: '',
    formacion: '', 
    nivel: '',     
    status: '',    
    description: ''
  });

  // 2. Carga de datos al abrir el modal
  useEffect(() => {
    if (isOpen) {
      cargarRecursos();
    }
  }, [isOpen]);

  const cargarRecursos = async () => {
    try {
      const response = await axios.get('/programas/recursos-crear');
      if (response.data.status === 'success') {
        setCatalogos({
          niveles: response.data.data.niveles_educativos,
          tipos: response.data.data.tipos_formacion,
          estados: response.data.data.estados_programa
        });
      }
    } catch (error) {
      console.error("Error cargando catálogos:", error);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!formData.name || !formData.codigo || !formData.nivel || !formData.formacion || !formData.status) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    const payload = {
      nombrePrograma: formData.name.toUpperCase(),
      codigoPrograma: formData.codigo.toUpperCase(),
      idNivelEducativo: formData.nivel,
      idTipoFormacion: formData.formacion,
      idEstadoPrograma: formData.status,
      descripcionPrograma: formData.description
    };

   try {
      // 3. Envío al Backend
      const response = await axios.post('/programas/guardar', payload); 
      
      if (response.data.status === 'success') {
        alert("¡Programa creado satisfactoriamente!");
        
        // 4. Actualizar la tabla en el componente padre con los datos que devolvió Laravel
        onAddProgram(response.data.data);
        
        // 5. Limpiar formulario y cerrar
        setFormData({ name: '', codigo: '', formacion: '', nivel: '', status: '', description: '' });
        onClose();
      }
    } catch (error: any) {
      console.error("Error al guardar:", error.response?.data || error.message);
      alert("Error al procesar la solicitud: " + (error.response?.data?.message || "Servidor no disponible"));
    }
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
          {/* Nombre y Código  */}
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

          {/* Selectores Dinámicos */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="font-bold text-gray-700 uppercase text-2xs dark:text-gray-dark-700">Tipo Formación</label>
              <select 
                value={formData.formacion} 
                onChange={(e) => setFormData({...formData, formacion: e.target.value})} 
                className="w-full border-gray-300 select bg-gray-light-100 dark:bg-coal-300 dark:border-coal-100 text-2sm"
              >
                <option value="">Seleccionar Tipo</option>
                {catalogos.tipos.map((t) => (
                  <option key={t.id} value={t.id}>{t.nombre}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold text-gray-700 uppercase text-2xs dark:text-gray-dark-700">Nivel Educativo</label>
              <select 
                value={formData.nivel} 
                onChange={(e) => setFormData({...formData, nivel: e.target.value})} 
                className="w-full border-gray-300 select bg-gray-light-100 dark:bg-coal-300 dark:border-coal-100 text-2sm"
              >
                <option value="">Seleccionar Nivel</option>
                {catalogos.niveles.map((n) => (
                  <option key={n.id} value={n.id}>{n.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-gray-700 uppercase text-2xs dark:text-gray-dark-700">Estado Programa</label>
            <select 
              value={formData.status} 
              onChange={(e) => setFormData({...formData, status: e.target.value})} 
              className="w-full border-gray-300 select bg-gray-light-100 dark:bg-coal-300 dark:border-coal-100 text-2sm"
            >
              <option value="">Seleccionar Estado</option>
              {catalogos.estados.map((e) => (
                <option key={e.id} value={e.id}>{e.nombre}</option>
              ))}
            </select>
          </div>

          {/* Descripción */}
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