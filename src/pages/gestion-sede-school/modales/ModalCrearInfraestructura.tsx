import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';

import { Modal, ModalContent, ModalBody, ModalHeader, ModalTitle } from '@/components/modal';
import { KeenIcon } from '@/components';

interface Props {
  open: boolean;
  idSede: number;
  onClose: () => void;
  onSave?: () => void;
}

interface Tipo {
  id: number;
  nombre: string;
}

const ModalCrearInfraestructura: React.FC<Props> = ({ open, idSede, onClose, onSave }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [tipos, setTipos] = useState<Tipo[]>([]);

  const [form, setForm] = useState({
    nombreInfraestructura: '',
    capacidad: '',
    idTipoInfraestructura: ''
  });

  /* =========================
     LOAD TIPOS
  ========================== */
  useEffect(() => {
    if (open) {
      axios.get('/infraestructuras/tipos').then((res) => {
        setTipos(res.data.data);
      });

      setForm({
        nombreInfraestructura: '',
        capacidad: '',
        idTipoInfraestructura: ''
      });
    }
  }, [open]);

  /* =========================
     HANDLERS
  ========================== */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* =========================
     SUBMIT
  ========================== */
  const handleSubmit = async () => {
    if (!form.nombreInfraestructura || !form.capacidad || !form.idTipoInfraestructura) {
      enqueueSnackbar('Complete todos los campos', { variant: 'warning' });
      return;
    }

    try {
      setLoading(true);

      await axios.post('/infraestructuras', {
        nombreInfraestructura: form.nombreInfraestructura,
        capacidad: Number(form.capacidad),
        idTipoInfraestructura: Number(form.idTipoInfraestructura),
        idSede
      });

      enqueueSnackbar('Infraestructura creada', { variant: 'success' });
      onSave?.();
      onClose();
    } catch (error: any) {
      enqueueSnackbar(error?.response?.data?.message || 'Error al crear infraestructura', {
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
      <ModalContent className="max-w-[480px] top-[18%] p-4">
        <div onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle className="flex items-center gap-2">
              <KeenIcon icon="school" />
              Crear infraestructura
            </ModalTitle>

            <button className="btn btn-sm btn-icon btn-light" onClick={onClose}>
              <KeenIcon icon="cross" />
            </button>
          </ModalHeader>

          <ModalBody className="grid gap-3 px-0 py-4">
            <input
              name="nombreInfraestructura"
              value={form.nombreInfraestructura}
              onChange={handleChange}
              placeholder="Nombre *"
              className="input h-10"
            />

            <input
              name="capacidad"
              type="number"
              value={form.capacidad}
              onChange={handleChange}
              placeholder="Capacidad *"
              className="input h-10"
            />

            <select
              name="idTipoInfraestructura"
              value={form.idTipoInfraestructura}
              onChange={handleChange}
              className="input h-10"
            >
              <option value="">Seleccione tipo *</option>
              {tipos.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button onClick={onClose} className="btn btn-secondary h-9 px-5">
                Cancelar
              </button>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn btn-primary h-9 px-5"
              >
                {loading ? 'Guardando…' : 'Guardar'}
              </button>
            </div>
          </ModalBody>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default ModalCrearInfraestructura;
