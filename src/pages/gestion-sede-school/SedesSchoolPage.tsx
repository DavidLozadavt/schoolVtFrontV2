import { useState, useEffect } from 'react';
import axios from 'axios';
import clsx from 'clsx';
import Swal from 'sweetalert2';

import { Container, KeenIcon } from '@/components';
import { Toolbar, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';

import ModalCrearSedeSchool from './modales/ModalCrearSedeSchool';
import ModalActualizarSedeSchool from './modales/ActualizarSedeSchool';
import InfraestructurasSede from './InfraestructurasPage';

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

  // 👉 NUEVO: control de vista
  const [vistaInfraestructura, setVistaInfraestructura] = useState(false);
  const [idSedeInfraestructura, setIdSedeInfraestructura] = useState<number | null>(null);

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

  // 🔍 búsqueda
  const filteredSedes = sedes.filter((s) =>
    s.nombreSede.toLowerCase().includes(searchText.toLowerCase())
  );

  // 📄 paginación
  const indexOfLast = currentPage * ITEMS_PER_PAGE;
  const indexOfFirst = indexOfLast - ITEMS_PER_PAGE;
  const currentSedes = filteredSedes.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredSedes.length / ITEMS_PER_PAGE);

  // 🗑️ eliminar
  const handleEliminar = async (s: SedeSchool) => {
    const theme = JSON.parse(localStorage.getItem('settings-configs') || '{}')?.themeMode;
    const isDarkMode = theme === 'dark';
    const background = isDarkMode ? '#1B1C22' : '#F9F9F9';
    const color = isDarkMode ? 'white' : '#4B5675';
    const iconColor = isDarkMode ? 'white' : '#4B5675';
    const result = await Swal.fire({
      title: 'Eliminar sede',
      text: `¿Deseas eliminar la sede "${s.nombreSede}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'btn btn-sm btn-danger',
        cancelButton: 'btn btn-sm btn-light'
      },
      background,
      color,
      iconColor
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

  // ✏️ editar
  const handleEditar = (s: SedeSchool) => {
    setSedeSeleccionada(s.id);
    setModalActualizarOpen(true);
  };

  // 🏗️ ver infraestructuras
  const handleVerInfraestructura = (idSede: number) => {
    setIdSedeInfraestructura(idSede);
    setVistaInfraestructura(true);
  };

  // 🔙 volver a sedes
  const handleVolverSedes = () => {
    setVistaInfraestructura(false);
    setIdSedeInfraestructura(null);
    fetchSedes();
  };

  // 👉 VISTA INFRAESTRUCTURAS
  if (vistaInfraestructura && idSedeInfraestructura) {
    return (
      <Container>
        <div className="mb-4">
          <button className="btn btn-light flex items-center gap-2" onClick={handleVolverSedes}>
            <KeenIcon icon="arrow-left" />
            Volver a sedes
          </button>
        </div>

        <InfraestructurasSede idSede={idSedeInfraestructura} />
      </Container>
    );
  }

  // 👉 VISTA SEDES
  return (
    <Container>
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle />
          <ToolbarDescription>Gestión de sedes registradas</ToolbarDescription>
        </ToolbarHeading>

        <button className="btn btn-primary" onClick={() => setModalCrearOpen(true)}>
          Crear sede
        </button>
      </Toolbar>

      {/* Buscador */}
      <div className="mt-4 max-w-md">
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

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {loading && <p className="col-span-full text-center">Cargando sedes...</p>}
        {error && <p className="col-span-full text-center text-red-500">{error}</p>}

        {currentSedes.map((s) => (
          <div key={s.id} className="rounded-xl overflow-hidden border card flex flex-col">
            <img src={s.rutaImagenUrl} alt={s.nombreSede} className="w-full h-40 object-cover" />

            <div className="p-4 flex flex-col gap-2 flex-1">
              <h3 className="font-semibold truncate">{s.nombreSede}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {s.descripcion || 'Sin descripción'}
              </p>

              <div className="text-xs text-gray-500">{s.direccion}</div>
              {s.ciudad && <div className="text-xs text-gray-500">{s.ciudad.descripcion}</div>}

              {/* Acciones */}
              <div className="flex gap-2 mt-auto pt-3 justify-end">
                <button
                  onClick={() => handleVerInfraestructura(s.id)}
                  className="btn btn-sm btn-info"
                  title="Ver infraestructuras"
                >
                  <KeenIcon icon="category" />
                </button>

                <button onClick={() => handleEditar(s)} className="btn btn-sm btn-light">
                  <KeenIcon icon="pencil" />
                </button>

                <button onClick={() => handleEliminar(s)} className="btn btn-sm btn-light">
                  <KeenIcon icon="trash" />
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
          onClose={() => setModalActualizarOpen(false)}
          onSave={() => {
            fetchSedes();
            setModalActualizarOpen(false);
          }}
        />
      )}
    </Container>
  );
};

export default SedesSchoolPage;
