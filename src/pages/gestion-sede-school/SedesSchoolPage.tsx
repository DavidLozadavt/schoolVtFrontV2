import { useState, useEffect } from 'react';
import axios from 'axios';
import clsx from 'clsx';
import Swal from 'sweetalert2';

import { Container } from '@/components';
import { Toolbar, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { KeenIcon } from '@/components';

import ModalCrearSedeSchool from './modales/ModalCrearSedeSchool';
import ModalActualizarSedeSchool from './modales/ActualizarSedeSchool';

interface SedeSchool {
  id: number;
  nombreSede: string;
  direccion: string;
  telefono?: string;
  descripcion?: string;
  rutaImagenUrl?: string;
  ciudad?: {
    id: number;
    descripcion: string;
  };
}

const ITEMS_PER_PAGE = 6;

const SedesSchoolPage: React.FC = () => {
  const [sedes, setSedes] = useState<SedeSchool[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [modalActualizarOpen, setModalActualizarOpen] = useState(false);
  const [sedeSeleccionada, setSedeSeleccionada] = useState<number | null>(null);

  // 📥 Obtener sedes
  const fetchSedes = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('sedes-school');
      setSedes(res.data.data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al obtener las sedes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSedes();
  }, []);

  // 🔍 Filtrado por búsqueda
  const filteredSedes = sedes.filter((s) =>
    s.nombreSede.toLowerCase().includes(searchText.toLowerCase())
  );

  // 📄 Paginación
  const indexOfLast = currentPage * ITEMS_PER_PAGE;
  const indexOfFirst = indexOfLast - ITEMS_PER_PAGE;
  const currentSedes = filteredSedes.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredSedes.length / ITEMS_PER_PAGE);

  // 🗑️ Eliminar sede
  const handleEliminar = async (s: SedeSchool) => {
    const result = await Swal.fire({
      title: 'Eliminar sede',
      text: `¿Deseas eliminar la sede "${s.nombreSede}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`sedes-school/${s.id}`);
      fetchSedes();
      Swal.fire('Eliminada', 'La sede fue eliminada correctamente', 'success');
    } catch (err: any) {
      Swal.fire('Error', err?.response?.data?.message || 'Error al eliminar la sede', 'error');
    }
  };

  // ✏️ Editar sede
  const handleEditar = (s: SedeSchool) => {
    setSedeSeleccionada(s.id);
    setModalActualizarOpen(true);
  };

  // 🔒 Cerrar modal de actualización y resetear selección
  const handleCerrarModalActualizar = () => {
    setModalActualizarOpen(false);
    setSedeSeleccionada(null);
  };

  return (
    <Container>
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle></ToolbarPageTitle>
          <ToolbarDescription>Gestión de sedes registradas</ToolbarDescription>
        </ToolbarHeading>

        <button className="btn btn-primary" onClick={() => setModalCrearOpen(true)}>
          Crear sede
        </button>
      </Toolbar>

      {/* Buscador */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Buscar sede por nombre"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setCurrentPage(1);
          }}
          className="input w-full"
        />
      </div>

      {/* Contenido */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {loading && <p className="col-span-full text-center text-gray-500">Cargando sedes...</p>}
        {error && <p className="col-span-full text-center text-red-500">{error}</p>}
        {!loading && !error && currentSedes.length === 0 && (
          <p className="col-span-full text-center text-gray-500">No hay sedes registradas</p>
        )}

        {currentSedes.map((s) => (
          <div key={s.id} className="rounded-xl overflow-hidden border card flex flex-col">
            {/* Imagen */}
            <img src={s.rutaImagenUrl} alt={s.nombreSede} className="w-full h-full object-cover" />

            {/* Info */}
            <div className="p-4 flex flex-col gap-2 flex-1">
              <h3 className="font-semibold text-base truncate">{s.nombreSede}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {s.descripcion || 'Sin descripción'}
              </p>
              <div className="text-xs text-gray-500">{s.direccion}</div>
              {s.ciudad && <div className="text-xs text-gray-500">{s.ciudad.descripcion}</div>}

              {/* Acciones */}
              <div className="flex gap-2 mt-auto pt-3 justify-end">
                <button
                  onClick={() => handleEditar(s)}
                  className="px-2 py-2 rounded-full transition relative group flex items-center justify-center shadow-sm hover:shadow-md"
                >
                  <KeenIcon icon="pencil" className="text-gray-800 dark:text-neutral-400 w-3 h-3" />
                  <span className="absolute -top-5 right-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition text-[10px] bg-black text-white px-1.5 py-0.5 rounded-md whitespace-nowrap">
                    Editar
                  </span>
                </button>

                <button
                  onClick={() => handleEliminar(s)}
                  className="px-2 py-2 rounded-full transition relative group flex items-center justify-center shadow-sm hover:shadow-md"
                >
                  <KeenIcon icon="trash" className="text-gray-800 dark:text-neutral-400 w-3 h-3" />
                  <span className="absolute -top-5 right-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition text-[10px] bg-black text-white px-1.5 py-0.5 rounded-md whitespace-nowrap">
                    Eliminar
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={clsx(
                'px-3 py-1 rounded text-sm',
                currentPage === p ? 'bg-primary text-white' : 'bg-gray-200'
              )}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Modales */}
      <ModalCrearSedeSchool
        open={modalCrearOpen}
        onClose={() => setModalCrearOpen(false)}
        onSave={() => {
          fetchSedes();
          setModalCrearOpen(false);
        }}
      />

      {modalActualizarOpen && sedeSeleccionada && (
        <ModalActualizarSedeSchool
          open={modalActualizarOpen}
          sedeId={sedeSeleccionada.toString()}
          onClose={handleCerrarModalActualizar}
          onSave={() => {
            fetchSedes();
            handleCerrarModalActualizar();
          }}
        />
      )}
    </Container>
  );
};

export default SedesSchoolPage;
