import React, { useState } from 'react';
import { Modal, ModalContent, ModalBody, ModalHeader, ModalTitle } from '@/components/modal';
import { KeenIcon } from '@/components';
import { useSnackbar } from 'notistack';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: (file: File | null) => void;
}

const ModalMigracionDatos = ({ open, onClose, onSave }: ModalProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const [file, setFile] = useState<File | null>(null);

  const handleSave = () => {
    if (!file) {
      enqueueSnackbar('Debes seleccionar un archivo', { variant: 'warning' });
      return;
    }
    onSave?.(file);
  };

  return (
    <Modal open={open}>
      <ModalContent className="border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 max-w-[700px] top-[15%] p-0 rounded-xl">
        
        {/* Header */}
        <ModalHeader className="relative justify-center border-none pt-8">
          <ModalTitle>
            <h2 className="text-2xl font-semibold text-gray-800 text-center">
              Carga masiva de trabajadores.
            </h2>
          </ModalTitle>

          <button
            className="absolute top-4 right-4 btn btn-sm btn-icon btn-light btn-clear"
            onClick={onClose}
          >
            <KeenIcon icon="cross" />
          </button>
        </ModalHeader>

        {/* Body */}
        <ModalBody >
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Documento
            </label>

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

          {/* Botones */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              className="btn btn-sm btn-secondary"
              onClick={onClose}
            >
              CANCELAR
            </button>

            <button type="button"
              className="btn btn-sm btn-primary"
              onClick={handleSave}
            >
              ACEPTAR
            </button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export { ModalMigracionDatos };
