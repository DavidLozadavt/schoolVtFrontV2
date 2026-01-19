import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';

import { Modal, ModalContent, ModalBody, ModalHeader, ModalTitle } from '@/components/modal';
import { KeenIcon } from '@/components';

interface TipoInfraestructura {
  id: number;
  nombre: string;
}

interface Props {
  open: boolean;
  infraestructuraId: number | null;
  onClose: () => void;
  onSave?: () => void;
}

const ModalActualizarInfraestructura: React.FC<Props> = ({
  open,
  infraestructuraId,
  onClose,
  onSave
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const [tipos, setTipos] = useState<TipoInfraestructura[]>([]);
  const [form, setForm] = useState({
    nombreInfraestructura: '',
    capacidad: 0,
    idTipoInfraestructura: 0
  });

  /* =========================
     RESET FORM
  ========================== */
  useEffect(() => {
    if (!open) {
      setForm({
        nombreInfraestructura: '',
        capacidad: 0,
        idTipoInfraestructura: 0
      });
    }
  }, [open]);

  /* =========================
     LOAD DATA
  ========================== */
  useEffect(() => {
    if (open) {
      fetchTipos();
      if (infraestructuraId !== null) fetchInfraestructura();
    }
  }, [open, infraestructuraId]);

  const fetchTipos = async () => {
    try {
      const res = await axios.get('/infraestructuras/tipos');
      setTipos(res.data.data || []);
    } catch {
      enqueueSnackbar('Error cargando tipos', { variant: 'error' });
    }
  };

  const fetchInfraestructura = async () => {
    try {
      const res = await axios.get(`/infraestructuras/${infraestructuraId}`);
      const data = res.data.data || res.data;

      setForm({
        nombreInfraestructura: data.nombreInfraestructura,
        capacidad: Number(data.capacidad),
        idTipoInfraestructura: data.idTipoInfraestructura || data.tipo_infraestructura?.id || 0
      });
    } catch {
      enqueueSnackbar('Error cargando infraestructura', { variant: 'error' });
      onClose();
    }
  };

  /* =========================
     HANDLERS
  ========================== */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.nombreInfraestructura) {
      enqueueSnackbar('Ingrese el nombre', { variant: 'warning' });
      return;
    }
    if (!form.capacidad || form.capacidad <= 0) {
      enqueueSnackbar('Capacidad inválida', { variant: 'warning' });
      return;
    }
    if (!form.idTipoInfraestructura) {
      enqueueSnackbar('Seleccione un tipo', { variant: 'warning' });
      return;
    }

    try {
      setLoading(true);
      await axios.put(`/infraestructuras/${infraestructuraId}`, {
        nombreInfraestructura: form.nombreInfraestructura,
        capacidad: Number(form.capacidad),
        idTipoInfraestructura: Number(form.idTipoInfraestructura)
      });
      enqueueSnackbar('Infraestructura actualizada correctamente', { variant: 'success' });
      onSave?.();
      onClose();
    } catch (error: any) {
      enqueueSnackbar(error?.response?.data?.message || 'Error al actualizar infraestructura', {
        variant: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UI
  ========================== */
  return (
    <Modal open={open} onClose={onClose}>
      <ModalContent className="max-w-[520px] top-[15%] p-4">
        <div onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle className="flex items-center gap-2">
              <KeenIcon icon="pencil" />
              Editar infraestructura
            </ModalTitle>

            <button className="btn btn-sm btn-icon btn-light btn-clear" onClick={onClose}>
              <KeenIcon icon="cross" />
            </button>
          </ModalHeader>

          <ModalBody className="grid gap-4 px-0 py-5">
            <input
              name="nombreInfraestructura"
              value={form.nombreInfraestructura}
              onChange={handleChange}
              className="input h-11"
              placeholder="Nombre"
            />

            <input
              name="capacidad"
              type="number"
              value={form.capacidad}
              onChange={handleChange}
              className="input h-11"
              placeholder="Capacidad"
            />

            <select
              name="idTipoInfraestructura"
              value={form.idTipoInfraestructura}
              onChange={handleChange}
              className="input h-11"
            >
              <option value={0}>Seleccione tipo</option>
              {tipos.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button onClick={onClose} className="btn btn-secondary h-10 px-6">
                Cancelar
              </button>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn btn-primary h-10 px-6"
              >
                {loading ? 'Guardando...' : 'Actualizar'}
              </button>
            </div>
          </ModalBody>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default ModalActualizarInfraestructura;
