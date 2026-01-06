import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, ModalContent, ModalBody, ModalHeader, ModalTitle } from '@/components/modal';
import { KeenIcon } from '@/components/keenicons';

export type PeriodoInterface = {
  id?: string | number;
  nombre?: string;
  fechaInicio?: string;
  fechaFin?: string;
};

interface ModalProps {
  open: boolean;
  periodo?: PeriodoInterface;
  onClose: () => void;
  onSave?: (saved?: PeriodoInterface) => void;
}

const ModalPeriodo = ({ open, periodo, onClose, onSave }: ModalProps) => {
  const [nombre, setNombre] = useState(periodo?.nombre || '');
  const [fechaInicio, setFechaInicio] = useState(periodo?.fechaInicio || '');
  const [fechaFin, setFechaFin] = useState(periodo?.fechaFin || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (periodo) {
      setNombre(periodo.nombre || '');
      setFechaInicio(periodo.fechaInicio || '');
      setFechaFin(periodo.fechaFin || '');
    } else {
      setNombre('');
      setFechaInicio('');
      setFechaFin('');
    }
  }, [periodo, open]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const saved: PeriodoInterface = {
        id: periodo?.id ?? Date.now().toString(),
        nombre,
        fechaInicio,
        fechaFin
      };
      if (onSave) onSave(saved);
      // limpiar campos localmente
      setNombre('');
      setFechaInicio('');
      setFechaFin('');
    } catch (error) {
      console.error('Error guardando periodo (local):', error);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setNombre('');
    setFechaInicio('');
    setFechaFin('');
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalContent className="max-w-[640px] top-[5%] p-4">
        <ModalHeader>
          <ModalTitle>{periodo?.id ? 'Editar periodo' : 'Crear periodo'}</ModalTitle>
          <button
            className="btn btn-sm btn-icon btn-light btn-clear shrink-0"
            onClick={handleClose}
          >
            <KeenIcon icon="cross" />
          </button>
        </ModalHeader>

        <ModalBody className="grid gap-5 px-0 py-5">
          <div className="w-[calc(100%-2rem)] mx-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre periodo</label>
            <input
              className="input p-2 border border-gray-300 rounded-md w-full"
              placeholder="Ingrese Nombre periodo"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 w-[calc(100%-2rem)] mx-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Inicio</label>
              <input
                className="input p-2 border border-gray-300 rounded-md w-full"
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fin</label>
              <input
                className="input p-2 border border-gray-300 rounded-md w-full"
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4 px-4">
            <button className="btn btn-secondary btn-sm" onClick={handleClose} disabled={saving}>
              CANCELAR
            </button>
            <button onClick={handleSave} className="btn btn-primary btn-sm" disabled={saving}>
              {saving ? 'Guardando...' : 'ACEPTAR'}
            </button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalPeriodo;
