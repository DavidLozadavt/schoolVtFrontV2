import { useAuthContext } from '@/auth';
import { Container } from '@/components';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import ModalCorte from './ModalCorte';
import { useConfirm } from '@/hooks';
import { KeenIcon } from '@/components/keenicons';

const ConfiguracionEmpresaPage = () => {
  const authContext = useAuthContext();
  const { empresa } = authContext;

  const [formData, setFormData] = useState({
    razonSocial: empresa?.razonSocial || '',
    nit: empresa?.nit || '',
    digitoVerificacion: empresa?.digitoVerificacion || '',
    email: empresa?.email || '',
    direccion: empresa?.direccion || '',
    telefono: empresa?.telefono || '',
    representanteLegal: empresa?.representanteLegal || '',
    devolucion: empresa?.devolucion || '',
    garantia: empresa?.garantia || '',
    valorIva: empresa?.valorIva || '',
    responsableIva: empresa?.responsableIva || 0,
    retenciones: empresa?.retenciones || 0,
    facturacionElectronica: 0,
    valorAfiliacion: empresa?.valorAfiliacion || '',
    valorAdministracion: empresa?.valorAdministracion || '',
    diasMoraInventario: empresa?.diasMoraInventario || 0,
    diasMoraAdministracion: empresa?.diasMoraAdministracion || 0,
    diasVencimientoFacturacion: empresa?.diasVencimientoFacturacion || 0,
    diaCorteAdministracion: empresa?.diaCorteAdministracion || 0,
    descuentoAsociado: empresa?.descuentoAsociado || '',
    descuentoEmpleado: empresa?.descuentoEmpleado || '',
    stockMinimo: empresa?.stockMinimo || ''
  });

  const [logoPreview, setLogoPreview] = useState(empresa?.rutaLogoUrl || '');
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setLogoFile(file);
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        dataToSend.append(key, value as string);
      });
      if (logoFile) {
        dataToSend.append('rutaLogoFile', logoFile);
      }

      await axios.post(`company_update`, dataToSend);
      enqueueSnackbar('Datos actualizados correctamente', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Error al actualizar la empresa', { variant: 'error' });
    }
  };

  if (!empresa) return <div>Cargando...</div>;

  const formatCOP = (value: any) => {
    if (!value) return '';
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleMoneyChange = (e: any) => {
    const raw = e.target.value.replace(/\./g, ''); // quitar puntos
    const numeric = parseInt(raw) || 0;

    setFormData({
      ...formData,
      [e.target.name]: numeric
    });
  };

  // === Sección: Configuración de Cortes (estado local de ejemplo) ===
  type Periodo = {
    id: number;
    nombrePeriodo: string;
    fechaInicial: string;
    fechaFinal: string;
  };

  interface Corte {
    id: number;
    detalle: string;
    porcentaje: string;
    fechaInicial: string;
    fechaFinal: string;
    periodo: {
      nombrePeriodo: string;
    };
  }

  const [periodos, setPeriodos] = useState<Periodo[]>([]);
  const [selectedPeriodo, setSelectedPeriodo] = useState<string>('');
  const [loadingPeriodos, setLoadingPeriodos] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { confirmAction } = useConfirm();

  const storageFilterId = 'proceso-filter';
  const [cortes, setCortes] = useState<Corte[]>([]);
  const [loadingCortes, setLoadingCortes] = useState(false);
  const [editingCorte, setEditingCorte] = useState<Corte | null>(null);
  const [selectedPeriodoObj, setSelectedPeriodoObj] = useState<Periodo | null>(null);

  const getCortesPorPeriodo = async (idPeriodo: string) => {
    if (!idPeriodo) {
      setCortes([]);
      return;
    }

    try {
      setLoadingCortes(true);

      const response = await axios.get(`/get_configuracion_cortes/${idPeriodo}`);

      // 👇 TU API DEVUELVE { data: [...] }
      setCortes(response.data.data);
    } catch (error) {
      console.error('Error trayendo cortes:', error);
      setCortes([]);
    } finally {
      setLoadingCortes(false);
    }
  };

  useEffect(() => {
    if (selectedPeriodo) {
      getCortesPorPeriodo(selectedPeriodo);
    } else {
      setCortes([]);
    }
  }, [selectedPeriodo]);

  const deleteCorte = (id: number) => {
    confirmAction('¿Eliminar este corte permanentemente?', async () => {
      try {
        await axios.delete(`/configuracioncortes/${id}`);
        setCortes((prev) => prev.filter((c) => c.id !== id));
        enqueueSnackbar('Corte eliminado correctamente', { variant: 'success' });
      } catch (error) {
        console.error('Error al eliminar corte', error);
        enqueueSnackbar('Error al eliminar corte', { variant: 'error' });
      }
    });
  };

  const [searchTerm, setSearchTerm] = useState(() => {
    return localStorage.getItem(storageFilterId) || '';
  });

  const getPeriodos = async () => {
    try {
      setLoadingPeriodos(true);

      const response = await axios.get('periodos');
      setPeriodos(response.data);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Error al cargar los periodos', { variant: 'error' });
    } finally {
      setLoadingPeriodos(false);
    }
  };

  useEffect(() => {
    getPeriodos();
  }, []);

  useEffect(() => {
    if (!selectedPeriodo) {
      setSelectedPeriodoObj(null);
      return;
    }

    const idNum = Number(selectedPeriodo);
    const found = periodos.find((p) => p.id === idNum);

    if (found) {
      setSelectedPeriodoObj(found);
      return;
    }

    // Si por alguna razón no está en la lista `periodos`, pedimos uno al backend
    const fetchPeriodo = async () => {
      try {
        const res = await axios.get(`periodos/${idNum}`);
        // Ajusta según la forma que tu API devuelva el recurso
        setSelectedPeriodoObj(res.data?.data ?? res.data ?? res.data?.periodo ?? res.data);
      } catch (err) {
        console.error('No se pudo obtener el periodo:', err);
        setSelectedPeriodoObj(null);
      }
    };

    fetchPeriodo();
  }, [selectedPeriodo, periodos]);

  // Calcular porcentaje restante del periodo (para mostrar en la fila del periodo
  // y para pasar como valor por defecto al modal de crear corte).
  const sumPorcentajes = cortes.reduce((acc, c) => {
    const val = Number((c as any).porcentaje);
    return acc + (isNaN(val) ? 0 : val);
  }, 0);
  const remainingPorcentaje = Math.max(0, 100 - sumPorcentajes);

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <div className="card pb-2.5">
          <div className="card-header">
            <h3 className="card-title">Configuración de Empresa</h3>
          </div>
          <div className="card-body space-y-10">
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Información de la Empresa
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label className="form-label">Razón Social</label>
                    <input
                      type="text"
                      name="razonSocial"
                      className="input"
                      value={formData.razonSocial}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="form-label">NIT</label>
                    <input
                      type="text"
                      name="nit"
                      className="input"
                      value={formData.nit}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="form-label">Dígito Verificación</label>
                    <input
                      type="number"
                      name="digitoVerificacion"
                      className="input"
                      value={formData.digitoVerificacion}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="form-label">Representante Legal</label>
                    <input
                      type="text"
                      name="representanteLegal"
                      className="input"
                      value={formData.representanteLegal}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="form-label">Correo</label>
                    <input
                      type="email"
                      name="email"
                      className="input"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="form-label">Dirección</label>
                    <input
                      type="text"
                      name="direccion"
                      className="input"
                      value={formData.direccion}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="form-label">Teléfono</label>
                    <input
                      type="text"
                      name="telefono"
                      className="input"
                      value={formData.telefono}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center border rounded p-2 mr-6">
                  <label className="form-label mb-2">Logo</label>

                  <input
                    type="file"
                    accept="image/*"
                    className="file-input mb-3"
                    onChange={handleFileChange}
                  />

                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="w-full h-48 object-contain" />
                  ) : (
                    <span className="text-gray-400">No hay logo seleccionado</span>
                  )}
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Configuración Tributaria
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="flex flex-col">
                  <label className="form-label">Responsable IVA</label>
                  <select
                    name="responsableIva"
                    className="select"
                    value={formData.responsableIva}
                    onChange={handleChange}
                  >
                    <option value={1}>Sí</option>
                    <option value={0}>No</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="form-label">Retenciones</label>
                  <select
                    name="retenciones"
                    className="select"
                    value={formData.retenciones}
                    onChange={handleChange}
                  >
                    <option value={1}>Sí</option>
                    <option value={0}>No</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="form-label">Facturación Electrónica</label>
                  <select
                    name="facturacionElectronica"
                    className="select"
                    value={formData.facturacionElectronica}
                    onChange={handleChange}
                  >
                    <option value={1}>Sí</option>
                    <option value={0}>No</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="form-label">Días devolución</label>
                  <input
                    type="number"
                    name="devolucion"
                    className="input"
                    value={formData.devolucion}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="form-label">Días garantía</label>
                  <input
                    type="number"
                    name="garantia"
                    className="input"
                    value={formData.garantia}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="form-label">IVA (%)</label>
                  <input
                    type="number"
                    name="valorIva"
                    className="input"
                    value={formData.valorIva}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="form-label">Días vencimiento facturación</label>
                  <input
                    type="number"
                    name="diasVencimientoFacturacion"
                    className="input"
                    value={formData.diasVencimientoFacturacion}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </section>

            {/* === SECCIÓN 3: Costos === */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Costos de la Empresa
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col">
                  <label className="form-label">Valor de Afiliación</label>
                  <input
                    type="text"
                    name="valorAfiliacion"
                    className="input"
                    value={formatCOP(formData.valorAfiliacion)}
                    onChange={handleMoneyChange}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="form-label">Valor de Administración</label>
                  <input
                    type="text"
                    name="valorAdministracion"
                    className="input"
                    value={formatCOP(formData.valorAdministracion)}
                    onChange={handleMoneyChange}
                  />
                </div>
              </div>
            </section>

            {/* === SECCIÓN: Configuración Inventario === */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Configuración Inventario
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="flex flex-col">
                  <label className="form-label">Descuento Asociado (%)</label>
                  <input
                    type="number"
                    name="descuentoAsociado"
                    className="input"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.descuentoAsociado}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="form-label">Descuento Empleado (%)</label>
                  <input
                    type="number"
                    name="descuentoEmpleado"
                    className="input"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.descuentoEmpleado}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="form-label">Stock Mínimo</label>
                  <input
                    type="number"
                    name="stockMinimo"
                    className="input"
                    min="0"
                    value={formData.stockMinimo}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Configuración de Cartera
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col">
                  <label className="form-label">Días mora inventario</label>
                  <input
                    type="number"
                    name="diasMoraInventario"
                    className="input"
                    value={formData.diasMoraInventario}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="form-label">Días mora Administración</label>
                  <input
                    type="number"
                    name="diasMoraAdministracion"
                    className="input"
                    value={formData.diasMoraAdministracion}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="form-label">Día corte Administración</label>
                  <input
                    type="number"
                    name="diaCorteAdministracion"
                    className="input"
                    value={formData.diaCorteAdministracion}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </section>

            {/* === SECCIÓN: Configuración de Cortes === */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Configuración de Cortes
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-6 items-end">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Periodo</h4>
                  <select
                    name="periodo"
                    className="select"
                    value={selectedPeriodo}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedPeriodo(value);
                      // La carga de cortes la hace el useEffect que observa selectedPeriodo
                    }}
                  >
                    <option value="">Seleccione periodo</option>

                    {loadingPeriodos && <option disabled>Cargando periodos...</option>}

                    {periodos.map((periodo) => (
                      <option key={periodo.id} value={periodo.id}>
                        {periodo.nombrePeriodo}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2 justify-end">
                  <input
                    type="text"
                    placeholder="Buscar Periodo"
                    className="input input-sm pl-8"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="text-sm text-gray-700">
                      <th className="px-4 py-2">Código</th>
                      <th className="px-4 py-2">Periodo</th>
                      <th className="px-4 py-2">Detalle</th>
                      <th className="px-4 py-2">Fecha Inicial</th>
                      <th className="px-4 py-2">Fecha Final</th>
                      <th className="px-4 py-2">Porcentaje</th>
                      <th className="px-4 py-2">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingCortes && <tr></tr>}

                    {/* Si no hay cortes y no hay periodo seleccionado */}
                    {!loadingCortes && !selectedPeriodoObj && cortes.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-3 text-center">
                          No hay cortes para este periodo
                        </td>
                      </tr>
                    )}

                    {/* Fila destacada del periodo seleccionado (si existe) */}
                    {selectedPeriodoObj && (
                      <tr
                        key={`periodo-${selectedPeriodoObj.id}`}
                        className="bg-gray-100 text-gray-800 font-semibold"
                      >
                        <td className="px-4 py-3">{selectedPeriodoObj.id}</td>
                        <td className="px-4 py-3">{selectedPeriodoObj.nombrePeriodo}</td>
                        <td className="px-4 py-3">corte</td>
                        <td className="px-4 py-3">{selectedPeriodoObj.fechaInicial}</td>
                        <td className="px-4 py-3">{selectedPeriodoObj.fechaFinal}</td>
                        <td className="px-4 py-3">{remainingPorcentaje}</td>
                        <td className="px-4 py-3"></td>
                      </tr>
                    )}

                    {/* Si hay periodo pero no hay cortes, mostramos nota bajo la fila del periodo */}
                    {!loadingCortes && selectedPeriodoObj && cortes.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-3 text-center text-sm text-gray-600">
                          No hay cortes creados para este periodo aún
                        </td>
                      </tr>
                    )}

                    {/* Filas normales de cortes */}
                    {!loadingCortes &&
                      cortes.map((c, idx) => (
                        <tr key={`corte-${c.id ?? idx}`} className="bg-white even:bg-gray-50">
                          <td className="px-4 py-3">{c.id}</td>
                          <td className="px-4 py-3">{c.periodo?.nombrePeriodo}</td>
                          <td className="px-4 py-3">{c.detalle}</td>
                          <td className="px-4 py-3">{c.fechaInicial}</td>
                          <td className="px-4 py-3">{c.fechaFinal}</td>
                          <td className="px-4 py-3">{c.porcentaje}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                type="button"
                                className="btn btn-sm btn-icon btn-clear btn-light"
                                onClick={() => {
                                  setEditingCorte(c);
                                  setModalOpen(true);
                                }}
                              >
                                <KeenIcon icon="notepad-edit" />
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-icon btn-clear btn-light"
                                onClick={() => deleteCorte(c.id)}
                              >
                                <KeenIcon icon="trash" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  className={`btn btn-primary ${!selectedPeriodo ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => {
                    if (!selectedPeriodo) {
                      enqueueSnackbar('Seleccione un periodo antes de añadir', {
                        variant: 'warning'
                      });
                      return;
                    }
                    setModalOpen(true);
                  }}
                  disabled={!selectedPeriodo}
                >
                  + AÑADIR
                </button>
              </div>
            </section>

            <div className="flex justify-end pt-4">
              <button type="submit" className="btn btn-primary px-8">
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      </form>

      <ModalCorte
        open={modalOpen}
        periodoId={selectedPeriodo}
        defaultPorcentaje={remainingPorcentaje}
        corte={editingCorte ?? undefined}
        onClose={() => {
          setModalOpen(false);
          setEditingCorte(null);
        }}
        onSave={() => {
          if (selectedPeriodo) getCortesPorPeriodo(selectedPeriodo);
          setEditingCorte(null);
        }}
      />
    </Container>
  );
};

export { ConfiguracionEmpresaPage };
