// Estructura principal del Programa para el Carrusel y UI
export interface Program {
  id: number;
  name: string;
  status: string;
  imageUrl: string;
  codigo: string;
  nivel: string;
  formacion: string;
}

// Props para el componente principal GestionProgramas
export interface GestionProgramasProps {
  onActionComplete?: () => void;
}

// Props para el componente Formulario
export interface FormularioProgramaProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProgram: (newProgram: any) => void;
}

// Props para el componente Toast
export interface ToastProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

// Tipos auxiliares para los catálogos del Formulario
export interface CatalogoItem {
  id: number;
  nombre: string;
}

export interface CatalogosData {
  niveles: CatalogoItem[];
  tipos: CatalogoItem[];
  estados: CatalogoItem[];
}