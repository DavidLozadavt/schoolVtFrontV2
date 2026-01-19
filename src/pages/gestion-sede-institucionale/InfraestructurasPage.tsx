import { useState, useEffect } from 'react';
import axios from 'axios';
import clsx from 'clsx';
import Swal from 'sweetalert2';
import { Container, KeenIcon } from '@/components';

import ModalCrearInfraestructura from './modales/ModalCrearInfraestructura';
import ModalActualizarInfraestructura from './modales/ModalActualizarInfraestructura';

interface TipoInfraestructura {
  id: number;
  nombre: string;
}

interface Infraestructura {
  id: number;
  nombreInfraestructura: string;
  capacidad: number;
  idTipoInfraestructura: number;
  tipo_infraestructura?: TipoInfraestructura;
}

interface Props {
  idSede: number;
}

const ITEMS_PER_PAGE = 6;

const InfraestructurasSede: React.FC<Props> = ({ idSede }) => {
  const [infraestructuras, setInfraestructuras] = useState<Infraestructura[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [modalActualizarOpen, setModalActualizarOpen] = useState(false);
  const [infraSeleccionada, setInfraSeleccionada] = useState<number | null>(null);

  const [searchText, setSearchText] = useState('');

  const fetchInfraestructuras = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`/sedes/${idSede}/infraestructuras`);
      setInfraestructuras(res.data.data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al obtener infraestructuras');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfraestructuras();
  }, [idSede]);

  // Filtrado + paginación
  const filteredInfra = infraestructuras.filter((i) =>
    i.nombreInfraestructura.toLowerCase().includes(searchText.toLowerCase())
  );

  const indexOfLast = currentPage * ITEMS_PER_PAGE;
  const indexOfFirst = indexOfLast - ITEMS_PER_PAGE;
  const currentInfra = filteredInfra.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredInfra.length / ITEMS_PER_PAGE);

  // Imagenes por tipo
  const getImagen = (tipo?: string) => {
    switch (tipo) {
      case 'Aula':
        return '/public/media/images/infraestructuras/aula.jpg';
      case 'Aula especializada':
        return '/public/media/images/infraestructuras/aula-especializada.jpg';
      case 'Salón':
        return '/public/media/images/infraestructuras/salon.jpg';
      case 'Laboratorio':
        return '/public/media/images/infraestructuras/laboratorio.jpg';
      case 'Sala de informática':
        return '/public/media/images/infraestructuras/sala-informatica.jpg';
      case 'Sala de idiomas':
        return '/public/media/images/infraestructuras/sala-idiomas.jpg';
      case 'Biblioteca':
        return '/public/media/images/infraestructuras/biblioteca.jpg';
      case 'Auditorio':
        return '/public/media/images/infraestructuras/auditorio.jpg';
      case 'Oficina administrativa':
        return '/public/media/images/infraestructuras/oficina.jpg';
      case 'Sala de profesores':
        return '/public/media/images/infraestructuras/sala-profesores.jpg';
      case 'Baños':
        return '/public/media/images/infraestructuras/banos.jpg';
      case 'Cafetería':
        return '/public/media/images/infraestructuras/cafeteria.jpg';
      case 'Cancha deportiva':
        return '/public/media/images/infraestructuras/cancha.jpg';
      case 'Gimnasio':
        return '/public/media/images/infraestructuras/gimnasio.jpg';
      case 'Patio':
        return '/public/media/images/infraestructuras/patio.jpg';
      case 'Bodega':
        return '/public/media/images/infraestructuras/bodega.jpg';
      case 'Parqueadero':
        return '/public/media/images/infraestructuras/parqueadero.jpg';
      default:
        return '/public/media/images/infraestructuras/otros.jpg';
    }
  };

  const handleEditar = (i: Infraestructura) => {
    setInfraSeleccionada(i.id);
    setModalActualizarOpen(true);
  };

  const handleEliminar = async (i: Infraestructura) => {
    const result = await Swal.fire({
      title: 'Eliminar infraestructura',
      text: `¿Deseas eliminar "${i.nombreInfraestructura}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`/infraestructuras/${i.id}`);
      fetchInfraestructuras();
      Swal.fire('Eliminada', 'Infraestructura eliminada correctamente', 'success');
    } catch (err: any) {
      Swal.fire('Error', err?.response?.data?.message || 'Error al eliminar', 'error');
    }
  };

  return (
    <Container>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Buscar infraestructura..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="input w-1/3"
        />
        <button className="btn btn-primary" onClick={() => setModalCrearOpen(true)}>
          <KeenIcon icon="plus" /> Crear infraestructura
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {currentInfra.map((i) => (
          <div
            key={i.id}
            className="relative rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-transform transform hover:-translate-y-1 flex flex-col"
          >
            <div className="h-40 w-full relative overflow-hidden">
              <img
                src={getImagen(i.tipo_infraestructura?.nombre)}
                alt={i.nombreInfraestructura}
                className="object-cover w-full h-full brightness-90 hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                {i.tipo_infraestructura?.nombre || 'Otros'}
              </span>
            </div>
            <div className="p-4 flex flex-col gap-2 bg-white/90 dark:bg-neutral-900/60 backdrop-blur-md flex-1">
              <h3 className="font-bold text-lg truncate">{i.nombreInfraestructura}</h3>
              <p className="text-sm text-gray-600">Capacidad: {i.capacidad}</p>
              <div className="mt-auto flex justify-end gap-2">
                <button onClick={() => handleEditar(i)} className="btn btn-xs btn-light">
                  <KeenIcon icon="pencil" />
                </button>
                <button onClick={() => handleEliminar(i)} className="btn btn-xs btn-light">
                  <KeenIcon icon="trash" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {!loading && currentInfra.length === 0 && (
          <p className="col-span-full text-center text-gray-500">No hay infraestructuras</p>
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={clsx(
                'px-3 py-1 rounded-full transition-colors',
                currentPage === p ? 'bg-blue-600 text-white' : 'bg-gray-300 dark:bg-gray-600'
              )}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <ModalCrearInfraestructura
        open={modalCrearOpen}
        idSede={idSede}
        onClose={() => setModalCrearOpen(false)}
        onSave={fetchInfraestructuras}
      />

      {modalActualizarOpen && infraSeleccionada && (
        <ModalActualizarInfraestructura
          open={modalActualizarOpen}
          infraestructuraId={infraSeleccionada}
          onClose={() => setModalActualizarOpen(false)}
          onSave={fetchInfraestructuras}
        />
      )}
    </Container>
  );
};

export default InfraestructurasSede;
