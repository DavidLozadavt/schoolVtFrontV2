import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';

import { Modal, ModalContent, ModalBody, ModalHeader, ModalTitle } from '@/components/modal';
import { KeenIcon } from '@/components';

interface ModalCrearSedeSchoolProps {
  open: boolean;
  onClose: () => void;
  onSave?: () => void;
}

const ModalCrearSedeSchool: React.FC<ModalCrearSedeSchoolProps> = ({ open, onClose, onSave }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const [departamentos, setDepartamentos] = useState<any[]>([]);
  const [ciudades, setCiudades] = useState<any[]>([]);
  const [idDepartamento, setIdDepartamento] = useState('');

  const [form, setForm] = useState({
    nombreSede: '',
    direccion: '',
    telefono: '',
    descripcion: '',
    idCiudad: '',
    imagen: null as File | null,
    imagenPreview: null as string | null
  });

  /* =========================
     LOAD DATA
  ========================== */
  useEffect(() => {
    if (open) {
      fetchDepartamentos();
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setForm({
      nombreSede: '',
      direccion: '',
      telefono: '',
      descripcion: '',
      idCiudad: '',
      imagen: null,
      imagenPreview: null
    });
    setIdDepartamento('');
    setCiudades([]);
  };

  const fetchDepartamentos = async () => {
    try {
      const { data } = await axios.get('/departamentos');
      setDepartamentos(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCiudadesByDepartamento = async (id: string) => {
    try {
      const { data } = await axios.get(`/ciudades/departamento/${id}`);
      setCiudades(data);
    } catch (error) {
      console.error(error);
    }
  };

  /* =========================
     HANDLERS
  ========================== */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as any;

    if (name === 'imagen' && files?.length) {
      const file = files[0];
      setForm((prev) => ({ ...prev, imagen: file }));

      const reader = new FileReader();
      reader.onload = () =>
        setForm((prev) => ({ ...prev, imagenPreview: reader.result as string }));
      reader.readAsDataURL(file);
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDepartamentoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setIdDepartamento(id);
    setForm((prev) => ({ ...prev, idCiudad: '' }));
    setCiudades([]);
    if (id) fetchCiudadesByDepartamento(id);
  };

  /* =========================
     SUBMIT
  ========================== */
  const handleSubmit = async () => {
    // Validación detallada
    if (!form.nombreSede) {
      enqueueSnackbar('Ingrese el nombre de la sede', { variant: 'warning' });
      return;
    }
    if (!form.direccion) {
      enqueueSnackbar('Ingrese la dirección', { variant: 'warning' });
      return;
    }
    if (!form.telefono) {
      enqueueSnackbar('Ingrese el teléfono', { variant: 'warning' });
      return;
    }
    if (!idDepartamento) {
      enqueueSnackbar('Seleccione un departamento', { variant: 'warning' });
      return;
    }
    if (!form.idCiudad) {
      enqueueSnackbar('Seleccione una ciudad', { variant: 'warning' });
      return;
    }
    if (!form.descripcion) {
      enqueueSnackbar('Ingrese la descripción', { variant: 'warning' });
      return;
    }
    if (!form.imagen) {
      enqueueSnackbar('Seleccione una imagen', { variant: 'warning' });
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append('nombreSede', form.nombreSede);
      data.append('direccion', form.direccion);
      data.append('telefono', form.telefono);
      data.append('descripcion', form.descripcion);
      data.append('idCiudad', form.idCiudad);
      data.append('imagen', form.imagen);

      await axios.post('/sedes-school', data);

      enqueueSnackbar('Sede creada correctamente', { variant: 'success' });
      onSave?.();
      onClose();
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'Error al crear la sede', {
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
      <ModalContent className="max-w-[680px] top-[10%] p-4">
        <div onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle className="flex items-center gap-2">
              <KeenIcon icon="office-bag" />
              Crear sede escolar
            </ModalTitle>

            <button className="btn btn-sm btn-icon btn-light btn-clear" onClick={onClose}>
              <KeenIcon icon="cross" />
            </button>
          </ModalHeader>

          <ModalBody className="grid gap-4 px-0 py-5">
            {/* Datos básicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                name="nombreSede"
                value={form.nombreSede}
                onChange={handleChange}
                placeholder="Nombre de la sede *"
                className="input h-11"
              />

              <input
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                placeholder="Teléfono *"
                className="input h-11"
              />
            </div>

            {/* Dirección */}
            <input
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              placeholder="Dirección *"
              className="input h-11"
            />

            {/* Ubicación */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <select
                value={idDepartamento}
                onChange={handleDepartamentoChange}
                className="input h-11"
              >
                <option value="">Seleccione departamento *</option>
                {departamentos.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.descripcion}
                  </option>
                ))}
              </select>

              <select
                name="idCiudad"
                value={form.idCiudad}
                onChange={handleChange}
                className="input h-11"
                disabled={!idDepartamento}
              >
                <option value="">
                  {idDepartamento ? 'Seleccione ciudad *' : 'Seleccione primero un departamento'}
                </option>
                {ciudades.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.descripcion}
                  </option>
                ))}
              </select>
            </div>

            {/* Descripción */}
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Descripción de la sede *"
              rows={3}
              className="textarea resize-none"
            />

            {/* Imagen */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => document.getElementById('imagen-sede')?.click()}
                className="btn btn-light h-11 px-4 flex items-center gap-2"
              >
                <KeenIcon icon="picture" />
                Seleccionar imagen *
              </button>

              {form.imagenPreview ? (
                <img
                  src={form.imagenPreview}
                  className="h-20 w-20 rounded-lg object-cover border"
                />
              ) : (
                <div className="h-20 w-20 rounded-lg border flex items-center justify-center text-xs text-gray-400">
                  Sin imagen
                </div>
              )}
            </div>

            <input
              id="imagen-sede"
              type="file"
              accept="image/*"
              name="imagen"
              className="hidden"
              onChange={handleChange}
            />

            {/* Acciones */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button onClick={onClose} className="btn btn-secondary h-10 px-6">
                Cancelar
              </button>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn btn-primary h-10 px-6"
              >
                {loading ? 'Guardando...' : 'Guardar sede'}
              </button>
            </div>
          </ModalBody>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default ModalCrearSedeSchool;
