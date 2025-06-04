import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { es } from 'date-fns/locale';
import { examService } from '../../services/api';
import { format, isBefore, addDays, parseISO } from 'date-fns';

const ExamForm = ({ open, handleClose, exam = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fechaInicio: null,
    fechaFin: null,
    duracionMinutos: 60, // en minutos
    intentosPermitidos: 1,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Resetear el formulario cuando se abre/cierra o cambia el examen
  useEffect(() => {
    if (open) {
      setSubmitError('');
      setErrors({});
      
      if (exam) {
        // Cargar datos del examen existente
        setFormData({
          titulo: exam.titulo || '',
          descripcion: exam.descripcion || '',
          fechaInicio: exam.fechaInicio ? new Date(exam.fechaInicio) : null,
          fechaFin: exam.fechaFin ? new Date(exam.fechaFin) : null,
          duracionMinutos: exam.duracionMinutos || 60,
          intentosPermitidos: exam.intentosPermitidos || 1,
        });
      } else {
        // Valores por defecto para nuevo examen
        const now = new Date();
        const defaultStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0);
        const defaultEnd = addDays(defaultStart, 7);
        
        setFormData({
          titulo: '',
          descripcion: '',
          fechaInicio: defaultStart,
          fechaFin: defaultEnd,
          duracionMinutos: 60,
          intentosPermitidos: 1,
        });
      }
    }
  }, [exam, open]);

  // Validar un campo específico
  const validateField = (name, value) => {
    let error = '';
    const now = new Date();
    
    switch (name) {
      case 'titulo':
        if (!value || !value.trim()) {
          error = 'El título es requerido';
        } else if (value.trim().length < 5) {
          error = 'El título debe tener al menos 5 caracteres';
        } else if (value.trim().length > 200) {
          error = 'El título no puede exceder los 200 caracteres';
        }
        break;
        
      case 'descripcion':
        if (!value || !value.trim()) {
          error = 'La descripción es requerida';
        } else if (value.trim().length > 1000) {
          error = 'La descripción no puede exceder los 1000 caracteres';
        }
        break;
        
      case 'fechaInicio':
        if (!value) {
          error = 'La fecha de inicio es requerida';
        } else if (isBefore(new Date(value), now) && !exam) {
          error = 'La fecha de inicio no puede ser en el pasado';
        } else if (formData.fechaFin && isBefore(new Date(formData.fechaFin), new Date(value))) {
          error = 'La fecha de inicio debe ser anterior a la fecha de fin';
        }
        break;
        
      case 'fechaFin':
        if (!value) {
          error = 'La fecha de fin es requerida';
        } else if (isBefore(new Date(value), new Date(formData.fechaInicio || now))) {
          error = 'La fecha de fin debe ser posterior a la fecha de inicio';
        }
        break;
        
      case 'duracionMinutos': {
        const duration = parseInt(value, 10);
        if (isNaN(duration) || duration <= 0) {
          error = 'La duración debe ser un número positivo';
        } else if (duration > 1440) {
          error = 'La duración no puede exceder 24 horas (1440 minutos)';
        }
        break;
      }
        
      case 'intentosPermitidos': {
        const attempts = parseInt(value, 10);
        if (isNaN(attempts) || attempts < 1) {
          error = 'Debe permitir al menos 1 intento';
        } else if (attempts > 100) {
          error = 'No puede permitir más de 100 intentos';
        }
        break;
      }
        
      default:
        break;
    }
    
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
    
    return !error;
  };

  // Validar todo el formulario
  const validateForm = () => {
    const newErrors = {};
    const now = new Date();
    
    // Validar título
    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es requerido';
    } else if (formData.titulo.trim().length < 5) {
      newErrors.titulo = 'El título debe tener al menos 5 caracteres';
    } else if (formData.titulo.trim().length > 200) {
      newErrors.titulo = 'El título no puede exceder los 200 caracteres';
    }
    
    // Validar descripción
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    } else if (formData.descripcion.trim().length > 1000) {
      newErrors.descripcion = 'La descripción no puede exceder los 1000 caracteres';
    }
    
    // Validar fechas
    if (!formData.fechaInicio) {
      newErrors.fechaInicio = 'La fecha de inicio es requerida';
    } else if (isBefore(new Date(formData.fechaInicio), now) && !exam) {
      // Solo validar para fechas pasadas si es un nuevo examen
      newErrors.fechaInicio = 'La fecha de inicio no puede ser en el pasado';
    }
    
    if (!formData.fechaFin) {
      newErrors.fechaFin = 'La fecha de fin es requerida';
    } else if (formData.fechaInicio) {
      if (isBefore(new Date(formData.fechaFin), new Date(formData.fechaInicio))) {
        newErrors.fechaFin = 'La fecha de fin debe ser posterior a la fecha de inicio';
      } else if (isBefore(new Date(formData.fechaFin), now) && !exam) {
        newErrors.fechaFin = 'La fecha de fin no puede ser en el pasado';
      }
    }
    
    // Validar duración
    if (!formData.duracionMinutos || formData.duracionMinutos <= 0) {
      newErrors.duracionMinutos = 'La duración debe ser mayor a 0';
    } else if (formData.duracionMinutos > 1440) { // 24 horas en minutos
      newErrors.duracionMinutos = 'La duración no puede exceder las 24 horas';
    }
    
    // Validar intentos permitidos
    if (!formData.intentosPermitidos || formData.intentosPermitidos <= 0) {
      newErrors.intentosPermitidos = 'Debe permitir al menos un intento';
    } else if (formData.intentosPermitidos > 100) {
      newErrors.intentosPermitidos = 'El número máximo de intentos es 100';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    // Validar el campo cuando pierde el foco
    validateField(name, value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (name) => (date) => {
    if (!date) return;
    
    // Convertir a objeto Date si es una cadena
    const dateValue = typeof date === 'string' ? parseISO(date) : date;
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: dateValue
      };
      
      // Validar fechas relacionadas
      if (name === 'fechaInicio' && formData.fechaFin) {
        validateField('fechaFin', formData.fechaFin);
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: 'Por favor, corrige los errores en el formulario',
        severity: 'error'
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Preparar los datos del examen
      const examData = {
        titulo: formData.titulo.trim(),
        descripcion: formData.descripcion.trim(),
        fechaInicio: format(new Date(formData.fechaInicio), 'yyyy-MM-dd'),
        fechaFin: format(new Date(formData.fechaFin), 'yyyy-MM-dd'),
        duracionMinutos: parseInt(formData.duracionMinutos, 10),
        intentosPermitidos: parseInt(formData.intentosPermitidos, 10),
      };
      
      console.log(`[ExamForm] ${exam ? 'Actualizando' : 'Creando'} examen:`, examData);
      
      if (exam) {
        // Actualizar examen existente
        await examService.updateExam(exam.id, examData);
        setSnackbar({
          open: true,
          message: 'Examen actualizado correctamente',
          severity: 'success'
        });
      } else {
        // Crear nuevo examen
        await examService.createExam(examData);
        setSnackbar({
          open: true,
          message: 'Examen creado correctamente',
          severity: 'success'
        });
      }
      
      // Llamar a onSuccess para actualizar la lista de exámenes
      if (typeof onSuccess === 'function') {
        await onSuccess();
      }
      
      // Cerrar el diálogo después de un breve retraso para mostrar el mensaje
      setTimeout(() => {
        handleClose();
      }, 1000);
      
    } catch (error) {
      console.error('[ExamForm] Error al guardar el examen:', {
        error,
        response: error.response?.data,
        status: error.response?.status
      });
      
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Error al guardar el examen. Por favor, inténtalo de nuevo.';
      
      setSubmitError(errorMessage);
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Dialog 
      open={open} 
      onClose={loading ? undefined : handleClose} 
      maxWidth="md" 
      fullWidth
      disableEscapeKeyDown={loading}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center">
          {loading && <CircularProgress size={24} sx={{ mr: 2 }} />}
          {exam ? 'Editar Examen' : 'Nuevo Examen'}
        </Box>
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
            <Grid item xs={12} sx={{ gridColumn: '1 / -1' }}>
              <TextField
                fullWidth
                label="Título del Examen"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.titulo}
                helperText={errors.titulo || ' '}
                margin="normal"
                required
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} sx={{ gridColumn: '1 / -1' }}>
              <TextField
                fullWidth
                label="Descripción"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.descripcion}
                helperText={errors.descripcion || ' '}
                margin="normal"
                multiline
                rows={3}
                required
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <TextField
                fullWidth
                label="Duración (minutos)"
                name="duracionMinutos"
                type="number"
                value={formData.duracionMinutos}
                onChange={handleChange}
                onBlur={(e) => validateField('duracionMinutos', e.target.value)}
                error={!!errors.duracionMinutos}
                helperText={errors.duracionMinutos || 'Máximo 1440 minutos (24 horas)'}
                margin="normal"
                required
                disabled={loading}
                inputProps={{ 
                  min: 1, 
                  max: 1440,
                  step: 1
                }}
              />
            </Grid>
            
            <Grid item xs={12} sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <TextField
                fullWidth
                label="Intentos permitidos"
                name="intentosPermitidos"
                type="number"
                value={formData.intentosPermitidos}
                onChange={handleChange}
                onBlur={(e) => validateField('intentosPermitidos', e.target.value)}
                error={!!errors.intentosPermitidos}
                helperText={errors.intentosPermitidos || 'Número de intentos permitidos (1-100)'}
                margin="normal"
                required
                disabled={loading}
                inputProps={{ 
                  min: 1, 
                  max: 100,
                  step: 1
                }}
              />
            </Grid>
            
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
              <Grid item xs={12} sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    label="Fecha de Inicio"
                    value={formData.fechaInicio ? new Date(formData.fechaInicio) : null}
                    onChange={handleDateChange('fechaInicio')}
                    onClose={() => validateField('fechaInicio', formData.fechaInicio)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        margin: 'normal',
                        error: !!errors.fechaInicio,
                        helperText: errors.fechaInicio || ' ',
                        required: true,
                        disabled: loading,
                        placeholder: 'Seleccione fecha de inicio',
                      }
                    }}
                    minDate={exam ? null : new Date()}
                    disablePast={!exam}
                    disabled={loading}
                    format="dd/MM/yyyy"
                  />
                </DemoContainer>
              </Grid>
              
              <Grid item xs={12} sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    label="Fecha de Finalización"
                    value={formData.fechaFin ? new Date(formData.fechaFin) : null}
                    onChange={handleDateChange('fechaFin')}
                    onClose={() => validateField('fechaFin', formData.fechaFin)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        margin: 'normal',
                        error: !!errors.fechaFin,
                        helperText: errors.fechaFin || ' ',
                        required: true,
                        disabled: !formData.fechaInicio || loading,
                        placeholder: 'Seleccione fecha de fin',
                      }
                    }}
                    minDate={formData.fechaInicio || new Date()}
                    disabled={!formData.fechaInicio || loading}
                    format="dd/MM/yyyy"
                  />
                </DemoContainer>
              </Grid>
            </LocalizationProvider>
          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button 
            onClick={handleClose} 
            disabled={loading}
            color="inherit"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
        
        {/* Mostrar errores del servidor */}
        {submitError && (
          <Alert severity="error" sx={{ m: 2, mt: 0 }}>
            {submitError}
          </Alert>
        )}
        
        {/* Snackbar para mensajes */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </form>
    </Dialog>
  );
};

export default ExamForm;
