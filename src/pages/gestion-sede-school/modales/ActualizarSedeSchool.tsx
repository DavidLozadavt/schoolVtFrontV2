import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';

import { Modal, ModalContent, ModalBody, ModalHeader, ModalTitle } from '@/components/modal';
import { KeenIcon } from '@/components';

interface ModalActualizarSedeSchoolProps {
  open: boolean;
  onClose: () => void;
  onSave?: () => void;
  sedeId: string;
}

const ModalActualizarSedeSchool: React.FC<ModalActualizarSedeSchoolProps> = ({
  open,
  onClose,
  onSave,
  sedeId
}) => {
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

  // Cargar datos al abrir
  useEffect(() => {
    if (open && sedeId) {
      fetchDepartamentos();
      fetchSede();
    } else {
      resetForm();
    }
  }, [open, sedeId]);

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

  const fetchSede = async () => {
    try {
      const res = await axios.get(`/sedes-school/${sedeId}`);
      const sede = res.data.data;

      setForm({
        nombreSede: sede.nombreSede || '',
        direccion: sede.direccion || '',
        telefono: sede.telefono || '',
        descripcion: sede.descripcion || '',
        idCiudad: sede.idCiudad ? String(sede.idCiudad) : '',
        imagen: null,
        imagenPreview: sede.rutaImagenUrl || null
      });

      // ⚡ Precargar departamento y ciudades si existe
      if (sede.ciudad?.idDepartamento) {
        const depId = String(sede.ciudad.idDepartamento);
        setIdDepartamento(depId);
        await fetchCiudadesByDepartamento(depId);
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Error al cargar datos de la sede', { variant: 'error' });
    }
  };

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

  const handleSubmit = async () => {
    // ⚡ Validación rápida en frontend
    if (
      !form.nombreSede.trim() ||
      !form.direccion.trim() ||
      !form.telefono.trim() ||
      !form.descripcion.trim() ||
      !form.idCiudad
    ) {
      enqueueSnackbar('Complete todos los campos obligatorios', { variant: 'warning' });
      return;
    }

    try {
      setLoading(true);

      // 🔹 Crear FormData
      const data = new FormData();
      data.append('_method', 'PUT'); // Laravel requiere esto para PUT con FormData
      data.append('nombreSede', form.nombreSede.trim());
      data.append('direccion', form.direccion.trim());
      data.append('telefono', form.telefono.trim());
      data.append('descripcion', form.descripcion.trim());
      data.append('idCiudad', String(form.idCiudad));

      if (form.imagen) {
        data.append('imagen', form.imagen);
      }

      // 🔹 Enviar solicitud
      const res = await axios.post(`/sedes-school/${sedeId}`, data); // POST + _method=PUT

      enqueueSnackbar(res.data.message || 'Sede actualizada correctamente', { variant: 'success' });
      onSave?.();
      onClose();
    } catch (error: unknown) {
      // 🔹 TypeScript seguro
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data as any;

        if (error.response?.status === 422 && responseData.errors) {
          // Validación Laravel
        } else {
          enqueueSnackbar(responseData?.message || 'Error al actualizar la sede', {
            variant: 'error'
          });
        }
      } else {
        // Errores inesperados
        enqueueSnackbar('Ocurrió un error inesperado', { variant: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalContent className="max-w-[680px] top-[10%] p-4">
        <div onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle className="flex items-center gap-2">
              <KeenIcon icon="office-bag" />
              Actualizar sede escolar
            </ModalTitle>
            <button className="btn btn-sm btn-icon btn-light btn-clear" onClick={onClose}>
              <KeenIcon icon="cross" />
            </button>
          </ModalHeader>

          <ModalBody className="grid gap-4 px-0 py-5">
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

            <input
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              placeholder="Dirección *"
              className="input h-11"
            />

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

            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Descripción de la sede *"
              rows={3}
              className="textarea resize-none"
            />

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => document.getElementById('imagen-sede')?.click()}
                className="btn btn-light h-11 px-4 flex items-center gap-2"
              >
                <KeenIcon icon="picture" /> Seleccionar imagen
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

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button onClick={onClose} className="btn btn-secondary h-10 px-6">
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn btn-primary h-10 px-6"
              >
                {loading ? 'Guardando...' : 'Actualizar sede'}
              </button>
            </div>
          </ModalBody>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default ModalActualizarSedeSchool;
