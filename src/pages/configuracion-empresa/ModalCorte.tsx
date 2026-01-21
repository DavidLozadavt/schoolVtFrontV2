import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, ModalContent, ModalBody, ModalHeader, ModalTitle } from '@/components/modal';
import { KeenIcon } from '@/components/keenicons';
import { useSnackbar } from 'notistack';

interface ModalCorteProps {
  open: boolean;
  periodoId?: string; // id del periodo al cual se va a asociar el corte
  corte?: {
    id?: string | number;
    detalle?: string;
    fechaInicial?: string;
    fechaFinal?: string;
    porcentaje?: number | string;
  };
  defaultPorcentaje?: number; // <-- por defecto para nuevos cortes (restante del periodo)
  onClose: () => void;
  onSave?: () => void; // llamado después de crear/editar
}

const ModalCorte = ({
  open,
  periodoId,
  corte,
  defaultPorcentaje,
  onClose,
  onSave
}: ModalCorteProps) => {
  const { enqueueSnackbar } = useSnackbar();

  const [detalle, setDetalle] = useState('');
  const [fechaInicial, setFechaInicial] = useState('');
  const [fechaFinal, setFechaFinal] = useState('');
  const [porcentaje, setPorcentaje] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ detalle?: string; porcentaje?: string }>({});

  useEffect(() => {
    const fetchLastCorte = async () => {
      try {
        if (!periodoId) return;
        const res = await axios.get(`/get_configuracion_cortes/${periodoId}`);
        const items = res.data?.data ?? res.data;
        if (!Array.isArray(items) || items.length === 0) return;

        // Ordenar por fechaFinal descendente y tomar el primero
        const sorted = [...items].sort((a, b) => {
          const fa = a.fechaFinal ? new Date(a.fechaFinal).getTime() : 0;
          const fb = b.fechaFinal ? new Date(b.fechaFinal).getTime() : 0;
          return fb - fa;
        });
        const last = sorted[0];
        if (last?.fechaFinal) {
          setFechaInicial(last.fechaFinal);
        }
      } catch (err) {
        console.error('Error trayendo último corte:', err);
      }
    };

    if (corte) {
      setDetalle(corte.detalle ?? '');
      setFechaInicial(corte.fechaInicial ?? '');
      setFechaFinal(corte.fechaFinal ?? '');
      setPorcentaje(corte.porcentaje !== undefined ? String(corte.porcentaje) : '');
    } else {
      setDetalle('');
      // cuando creamos, por defecto dejamos vacíos los campos,
      // pero intentamos traer la fechaFinal del último corte para
      // usarla como fecha inicial del nuevo corte.
      setFechaInicial('');
      setFechaFinal('');
      setPorcentaje('');

      if (open && periodoId) {
        fetchLastCorte();
      }
    }
    setErrors({});
  }, [corte, open, defaultPorcentaje, periodoId]);

  const validate = () => {
    const newErrors: { detalle?: string; porcentaje?: string } = {};
    if (!detalle.trim()) newErrors.detalle = 'Ingrese detalle';
    if (porcentaje !== '' && isNaN(Number(porcentaje)))
      newErrors.porcentaje = 'Porcentaje inválido';
    if (!periodoId) {
      enqueueSnackbar('Seleccione un periodo antes de crear el corte', { variant: 'warning' });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && !!periodoId;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      // Normalizar porcentaje:
      // - Si está vacío -> usar defaultPorcentaje (si existe) o 100.
      // - Si se ingresó valor -> convertir a número, redondear, y limitar entre 0 y 100.
      let porcentajeNumero: number | null;
      if (porcentaje === '' || porcentaje === null) {
        porcentajeNumero = defaultPorcentaje !== undefined ? Number(defaultPorcentaje) : 100;
      } else {
        const parsed = Number(porcentaje);
        porcentajeNumero = isNaN(parsed) ? null : Math.round(parsed);
        if (porcentajeNumero !== null) {
          if (porcentajeNumero > 100) porcentajeNumero = 100;
          if (porcentajeNumero < 0) porcentajeNumero = 0;
        }
      }

      const payload = {
        detalle: detalle.trim() || 'corte',
        fechaInicial: fechaInicial || null,
        fechaFinal: fechaFinal || null,
        porcentaje: porcentajeNumero,
        idPeriodo: periodoId ? Number(periodoId) : null
      };

      if (corte?.id) {
        await axios.put(`configuracioncortes/${corte.id}`, payload);
        enqueueSnackbar('Corte actualizado correctamente.', { variant: 'success' });
      } else {
        await axios.post('configuracioncortes', payload);
        enqueueSnackbar('Corte creado correctamente.', { variant: 'success' });
      }

      if (onSave) onSave();
      onClose();
    } catch (error: any) {
      console.error(error);
      const msg = error?.response?.data?.message || 'Error al guardar configuración';
      enqueueSnackbar(msg, { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalContent className="max-w-[640px] top-[5%] p-4">
        <ModalHeader>
          <ModalTitle>
            {corte?.id ? 'Editar configuración de corte' : 'Configuración cortes'}
          </ModalTitle>
          <button className="btn btn-sm btn-icon btn-light btn-clear" onClick={handleClose}>
            <KeenIcon icon="cross" />
          </button>
        </ModalHeader>

        <ModalBody className="grid gap-5 px-0 py-5">
          <div className="w-[calc(100%-2rem)] mx-auto">
            <label className="block text-sm font-medium mb-1">Detalle</label>
            <input
              className={`input p-2 w-full ${errors.detalle ? 'border-red-500' : 'border-gray-300'}`}
              value={detalle}
              onChange={(e) => setDetalle(e.target.value)}
              placeholder="Ingrese Detalle"
            />
            {errors.detalle && <p className="text-sm text-red-500 mt-1">{errors.detalle}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4 w-[calc(100%-2rem)] mx-auto">
            <div>
              <label className="block text-sm font-medium mb-1">Fecha inicial</label>
              <input
                type="date"
                className="input p-2 w-full"
                value={fechaInicial}
                onChange={(e) => setFechaInicial(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fecha final</label>
              <input
                type="date"
                className="input p-2 w-full"
                value={fechaFinal}
                onChange={(e) => setFechaFinal(e.target.value)}
              />
            </div>
          </div>

          <div className="w-[calc(100%-2rem)] mx-auto">
            <label className="block text-sm font-medium mb-1">Porcentaje</label>
            <input
              className={`input p-2 w-full ${errors.porcentaje ? 'border-red-500' : 'border-gray-300'}`}
              value={porcentaje}
              onChange={(e) => setPorcentaje(e.target.value)}
              placeholder="Ingrese Porcentaje"
            />
            {errors.porcentaje && <p className="text-sm text-red-500 mt-1">{errors.porcentaje}</p>}
          </div>

          <div className="flex justify-end gap-3 mt-4 px-4">
            <button className="btn btn-secondary btn-sm" onClick={handleClose} disabled={saving}>
              CANCELAR
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
              {saving ? 'Guardando...' : 'ACEPTAR'}
            </button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalCorte;
