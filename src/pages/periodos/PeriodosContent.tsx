import React, { useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataGrid } from '@/components';
import { KeenIcon } from '@/components/keenicons';
import ModalPeriodo, { PeriodoInterface } from './ModalPeriodo';

type Periodo = {
  id: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
};

const initialPeriodos: Periodo[] = [
  { id: '1', nombre: '2024-II', fechaInicio: '2024-07-02', fechaFin: '2025-07-01' },
  { id: '2', nombre: '2023-II', fechaInicio: '2023-07-02', fechaFin: '2024-07-01' },
  { id: '3', nombre: '2022-II', fechaInicio: '2022-07-02', fechaFin: '2023-07-01' }
];

const PeriodosPage: React.FC = () => {
  const [periodos, setPeriodos] = useState<Periodo[]>(initialPeriodos);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPeriodo, setSelectedPeriodo] = useState<PeriodoInterface | undefined>(undefined);

  const openNew = () => {
    setSelectedPeriodo(undefined);
    setIsModalOpen(true);
  };

  const openEdit = (p: Periodo) => {
    setSelectedPeriodo({
      id: p.id,
      nombre: p.nombre,
      fechaInicio: p.fechaInicio,
      fechaFin: p.fechaFin
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPeriodo(undefined);
  };

  const handleAfterSave = (saved?: PeriodoInterface) => {
    if (!saved) {
      setIsModalOpen(false);
      return;
    }
    // si viene con id existente actualizamos, si no lo agregamos
    const id = saved.id?.toString() || Date.now().toString();
    const nuevo: Periodo = {
      id,
      nombre: saved.nombre || '',
      fechaInicio: saved.fechaInicio || '',
      fechaFin: saved.fechaFin || ''
    };
    setPeriodos((prev) => {
      const exists = prev.some((x) => x.id.toString() === id);
      if (exists) {
        return prev.map((x) => (x.id.toString() === id ? nuevo : x));
      } else {
        return [nuevo, ...prev];
      }
    });
    setIsModalOpen(false);
    setSelectedPeriodo(undefined);
  };

  const columns = useMemo<ColumnDef<Periodo>[]>(
    () => [
      {
        accessorFn: (row) => row.id,
        id: 'id',
        header: () => 'Código',
        enableSorting: true,
        cell: (info) => <span className="text-gray-700">{info.row.original.id}</span>,
        meta: { className: 'w-[100px]', cellClassName: 'text-gray-700 font-normal' }
      },
      {
        accessorFn: (row) => row.nombre,
        id: 'nombre',
        header: () => 'Nombre periodo',
        enableSorting: true,
        cell: (info) => (
          <span className="leading-none font-medium text-sm text-gray-900">
            {info.row.original.nombre}
          </span>
        ),
        meta: {
          className: 'min-w-[250px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.fechaInicio,
        id: 'fechaInicio',
        header: () => 'Fecha Inicial',
        enableSorting: true,
        cell: (info) => (
          <span className="leading-none font-medium text-sm text-gray-900">
            {info.row.original.fechaInicio}
          </span>
        ),
        meta: {
          className: 'min-w-[160px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        accessorFn: (row) => row.fechaFin,
        id: 'fechaFin',
        header: () => 'Fecha Final',
        enableSorting: true,
        cell: (info) => (
          <span className="leading-none font-medium text-sm text-gray-900">
            {info.row.original.fechaFin}
          </span>
        ),
        meta: {
          className: 'min-w-[160px]',
          cellClassName: 'text-gray-700 font-normal'
        }
      },
      {
        id: 'edit',
        header: () => '',
        enableSorting: false,
        cell: ({ row }) => (
          <button
            className="btn btn-sm btn-icon btn-clear btn-light"
            onClick={() => openEdit(row.original)}
          >
            <KeenIcon icon="notepad-edit" />
          </button>
        ),
        meta: { className: 'w-[60px]' }
      },
      {
        id: 'delete',
        header: () => '',
        enableSorting: false,
        cell: ({ row }) => (
          <button
            className="btn btn-sm btn-icon btn-clear btn-light"
            onClick={() => {
              if (window.confirm(`¿Eliminar periodo ${row.original.nombre}?`)) {
                setPeriodos((prev) => prev.filter((p) => p.id !== row.original.id));
              }
            }}
          >
            <KeenIcon icon="trash" />
          </button>
        ),
        meta: { className: 'w-[60px]' }
      }
    ],
    []
  );

  const filteredData = useMemo(() => {
    if (!searchTerm) return periodos;
    const lower = searchTerm.toLowerCase();
    return periodos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(lower) ||
        p.fechaInicio.toLowerCase().includes(lower) ||
        p.fechaFin.toLowerCase().includes(lower) ||
        p.id.toLowerCase().includes(lower)
    );
  }, [searchTerm, periodos]);

  return (
    <div className="card card-grid min-w-full">
      <div className="card-header flex-wrap py-5">
        <h3 className="card-title">Periodos</h3>
        <div className="flex gap-6 items-center">
          <div className="relative">
            <KeenIcon
              icon="magnifier"
              className="leading-none text-md text-gray-500 absolute top-1/2 left-0 -translate-y-1/2 ml-3"
            />
            <input
              type="text"
              placeholder="Buscar Periodos"
              className="input input-sm pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>

          </div>
        </div>
      </div>

      <div className="card-body">
        <DataGrid
          key={JSON.stringify(filteredData)}
          columns={columns}
          data={filteredData}
          pagination={{ size: 10 }}
        />
      </div>

      <ModalPeriodo
        open={isModalOpen}
        periodo={selectedPeriodo}
        onClose={handleModalClose}
        onSave={handleAfterSave}
      />
    </div>
  );
};

export default PeriodosPage;
