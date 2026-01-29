import { User, Pencil, Trash2, Calendar, FolderPlus } from "lucide-react";

export const CardRap = () => {
  return (
    <div className="flex gap-4 p-4 bg-white border border-gray-300 rounded-xl">
      {/* Contenido principal */}
      <div className="flex-1 space-y-4">
        {/* Título del RAP */}
        <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">
          Identificar las técnicas de indagación en la solución de problemas según el
          contexto productivo
        </h3>
        <div>
           <p className="text-sm text-gray-500">Progreso</p>
           <p className="text-lg font-semibold text-center text-blue-500">10%</p>
        </div>
        </div>

        {/* Info */}
        <div className="grid grid-cols-1 gap-4 p-4 text-center rounded-lg md:grid-cols-2 lg:grid-cols-4 bg-gray-50">
          {/* Instructor */}
          <div className="flex items-center justify-center gap-3 text-left">
            <div className="flex items-center justify-center w-12 h-12 overflow-hidden bg-gray-100 rounded-full">
              {true ? (
                <img
                  src="https://www.dzoom.org.es/wp-content/uploads/2020/02/portada-foto-perfil-redes-sociales-consejos.jpg"
                  alt="María González Pérez"
                  className="object-cover w-full h-full"
                />
              ) : (
                <User className="text-gray-600" size={22} />
              )}
            </div>
            <div>
              <p className="text-xs text-gray-500">Instructor</p>
              <p className="text-sm font-medium text-gray-800">
                {"María González Pérez"}
              </p>
            </div>
          </div>

          {/* Horas */}
          <div>
            <p className="text-xs text-gray-500">Total de horas</p>
            <p className="text-lg font-semibold">880h</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Horas acumuladas</p>
            <p className="text-lg font-semibold text-green-600">520h</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Horas restantes</p>
            <p className="text-lg font-semibold text-orange-500">360h</p>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex flex-col items-center justify-between py-2">
        <button
          className="p-2 text-gray-500 transition rounded-md hover:bg-gray-100 hover:text-blue-600"
          title="Editar"
        >
          <Pencil size={18} />
        </button>

        <button
          className="p-2 text-gray-500 transition rounded-md hover:bg-gray-100 hover:text-yellow-600"
          title="Agregar RAP"
        >
          <FolderPlus size={18} />
        </button>

        <button
          className="p-2 text-gray-500 transition rounded-md hover:bg-gray-100 hover:text-green-600"
          title="Calendario"
        >
          <Calendar size={18} />
        </button>

        <button
          className="p-2 text-gray-500 transition rounded-md hover:bg-gray-100 hover:text-red-600"
          title="Eliminar"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};