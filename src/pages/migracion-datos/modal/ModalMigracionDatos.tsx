import React, { useState } from 'react';
import { Modal, ModalContent, ModalBody, ModalHeader, ModalTitle } from '@/components/modal';
import { KeenIcon } from '@/components';
import { useSnackbar } from 'notistack';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: (file: File | null, entity?: string) => void;
  entity?: 'trabajadores' | 'estudiantes' | string;
}

const ModalMigracionDatos = ({ open, onClose, onSave, entity = 'trabajadores' }: ModalProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const [file, setFile] = useState<File | null>(null);

  const label = entity === 'estudiantes' ? 'Estudiantes' : 'Trabajadores';

  const handleSave = () => {
    if (!file) {
      enqueueSnackbar('Debes seleccionar un archivo', { variant: 'warning' });
      return;
    }

    // Llamada al callback del padre (si existe)
    onSave?.(file, entity);

    // Feedback y cierre
    enqueueSnackbar(`Archivo cargado para ${label}`, { variant: 'success' });
    onClose();
  };

  return (
    <Modal open={open}>
      <ModalContent className="border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 max-w-[700px] top-[15%] p-0 rounded-xl">
        <ModalHeader className="relative justify-center border-none pt-8">
          <ModalTitle>
            <h2 className="text-2xl font-semibold text-gray-800 text-center">
              Carga masiva de {label}.
            </h2>
          </ModalTitle>

          <button
            className="absolute top-4 right-4 btn btn-sm btn-icon btn-light btn-clear"
            onClick={onClose}
          >
            <KeenIcon icon="cross" />
          </button>
        </ModalHeader>

        <ModalBody>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Archivo</label>

            <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-4 py-2">
              <input
                type="file"
                className="hidden"
                id="fileUpload"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />

              <label
                htmlFor="fileUpload"
                className="cursor-pointer bg-white border px-4 py-2 rounded-md text-sm shadow"
              >
                Seleccionar archivo
              </label>

              <span className="text-sm text-gray-500 truncate">
                {file ? file.name : 'Sin archivos seleccionados'}
              </span>
            </div>
          </div>

          <hr className="my-6" />

          <div className="flex justify-end gap-3 mt-4">
            <button className="btn btn-sm btn-secondary" onClick={onClose}>
              CANCELAR
            </button>

            <button type="button" className="btn btn-sm btn-primary" onClick={handleSave}>
              ACEPTAR
            </button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export { ModalMigracionDatos };
