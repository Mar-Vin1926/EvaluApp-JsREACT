import React, { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Container,
  Typography
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { examService } from '../services/api';
import ExamForm from '../components/forms/ExamForm';
import './ExamsPage.css';

const ExamsPage = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastErrorTime, setLastErrorTime] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    exam: null
  });
  const [currentExam, setCurrentExam] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const fetchExams = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('[ExamsPage] Solicitando exámenes...');
      const response = await examService.getAllExams();
      
      // Verificar si la respuesta es un array
      const examsData = Array.isArray(response.data) ? response.data : [];
      console.log(`[ExamsPage] Se obtuvieron ${examsData.length} exámenes`, examsData);
      
      // Transformar fechas a objetos Date
      const formattedExams = examsData.map(exam => ({
        ...exam,
        fechaInicio: exam.fechaInicio ? new Date(exam.fechaInicio) : null,
        fechaFin: exam.fechaFin ? new Date(exam.fechaFin) : null
      }));
      
      setExams(formattedExams);
      setRetryCount(0); // Reset retry count on success
    } catch (error) {
      console.error('[ExamsPage] Error al cargar los exámenes:', {
        name: error.name,
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      setExams([]);
      const errorMessage = error.response?.data?.message || error.message;
      const isServerError = error.response?.status >= 500;
      const errorText = isServerError 
        ? 'Error en el servidor. Por favor, inténtalo de nuevo más tarde.'
        : `No se pudieron cargar los exámenes. ${errorMessage || 'Error desconocido'}`;
      
      setError(errorText);
      setLastErrorTime(new Date());
      
      // Mostrar notificación de error
      setSnackbar({
        open: true,
        message: isServerError 
          ? 'Error en el servidor. Por favor, inténtalo de nuevo en unos momentos.'
          : `Error al cargar los exámenes: ${errorMessage || 'Por favor, inténtalo de nuevo'}`,
        severity: 'error',
        action: isServerError && retryCount < 3 ? (
          <Button 
            color="inherit" 
            size="small" 
            onClick={() => {
              setRetryCount(prev => prev + 1);
              fetchExams();
            }}
          >
            Reintentar
          </Button>
        ) : null
      });
      
      // Auto-retry for server errors (max 3 retries)
      if (isServerError && retryCount < 3) {
        const delay = Math.min(1000 * Math.pow(2, retryCount), 10000); // Exponential backoff, max 10s
        console.log(`[ExamsPage] Reintentando en ${delay}ms... (${retryCount + 1}/3)`);
        const timer = setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchExams();
        }, delay);
        
        return () => clearTimeout(timer);
      }
    } finally {
      setLoading(false);
    }
  }, [retryCount]);

  useEffect(() => {
    console.log('[ExamsPage] Montando componente, cargando exámenes...');
    
    // Solo intentar cargar si no estamos en un estado de error reciente
    const timeSinceLastError = lastErrorTime ? (new Date() - lastErrorTime) / 1000 : null;
    if (!lastErrorTime || timeSinceLastError > 30 || retryCount > 0) {
      fetchExams();
    }
    
    return () => {
      console.log('[ExamsPage] Desmontando componente');
      // No limpiar el estado para mantener el último estado en caso de recarga
    };
  }, [fetchExams, retryCount, lastErrorTime]);

  const handleEdit = (exam) => {
    setCurrentExam(exam);
    setOpenDialog(true);
  };

  const handleAddNew = () => {
    setCurrentExam(null);
    setOpenDialog(true);
  };

  const handleCloseForm = () => {
    setOpenDialog(false);
    setCurrentExam(null);
  };

  const handleSubmit = async (examData) => {
    try {
      setLoading(true);
      
      if (currentExam) {
        // Actualizar examen existente
        console.log('[ExamsPage] Actualizando examen:', { id: currentExam.id, data: examData });
        await examService.updateExam(currentExam.id, examData);
        setSnackbar({
          open: true,
          message: 'Examen actualizado correctamente',
          severity: 'success'
        });
      } else {
        // Crear nuevo examen
        console.log('[ExamsPage] Creando nuevo examen:', examData);
        await examService.createExam(examData);
        setSnackbar({
          open: true,
          message: 'Examen creado correctamente',
          severity: 'success'
        });
      }
      
      setOpenDialog(false);
      setCurrentExam(null);
      await fetchExams(); // Recargar la lista
    } catch (error) {
      console.error('Error al guardar el examen:', {
        error,
        response: error.response?.data,
        status: error.response?.status
      });
      
      const errorMessage = error.response?.data?.message || error.message;
      setSnackbar({
        open: true,
        message: `Error al ${currentExam ? 'actualizar' : 'crear'} el examen: ${errorMessage || 'Error desconocido'}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (exam) => {
    setDeleteDialog({
      open: true,
      exam: exam
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.exam) return;
    
    try {
      setLoading(true);
      console.log(`[ExamsPage] Eliminando examen ID: ${deleteDialog.exam.id}`);
      
      await examService.deleteExam(deleteDialog.exam.id);
      
      setSnackbar({
        open: true,
        message: 'Examen eliminado correctamente',
        severity: 'success'
      });
      
      setDeleteDialog({ open: false, exam: null });
      await fetchExams(); // Recargar la lista
    } catch (error) {
      console.error('Error al eliminar el examen:', {
        error,
        response: error.response?.data,
        status: error.response?.status
      });
      
      const errorMessage = error.response?.data?.message || error.message;
      setSnackbar({
        open: true,
        message: `Error al eliminar el examen: ${errorMessage || 'Error desconocido'}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialog({ open: false, exam: null });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  return (
    <div className="exams-container">
      {/* Encabezado con título y botón */}
      <div className="exams-header">
        <Typography 
          variant="h3" 
          component="h1" 
          className="exams-title"
        >
          Exámenes
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddNew}
          className="new-exam-btn"
        >
          Nuevo Examen
        </Button>
      </div>

      {/* Contenedor de la tabla */}
      <div className="exams-table-container">
        {/* Estado de carga */}
        {loading && (
          <div className="loading-container">
            <CircularProgress />
          </div>
        )}
        
        {/* Mensaje de error */}
        {error && (
          <Alert 
            severity="error"
            className="error-container"
            action={
              retryCount < 3 && (
                <Button 
                  color="inherit" 
                  size="small" 
                  onClick={() => {
                    setRetryCount(prev => prev + 1);
                    fetchExams();
                  }}
                >
                  Reintentar
                </Button>
              )
            }
          >
            {error}
            {retryCount > 0 && ` (Intento ${retryCount}/3)`}
          </Alert>
        )}
        
        {/* Tabla de exámenes */}
        <TableContainer>
          <Table className="exams-table">
            <TableHead>
              <TableRow>
                <TableCell className="table-header-cell"><strong>Título</strong></TableCell>
                <TableCell className="table-header-cell"><strong>Descripción</strong></TableCell>
                <TableCell className="table-header-cell"><strong>Fecha Inicio</strong></TableCell>
                <TableCell className="table-header-cell"><strong>Fecha Fin</strong></TableCell>
                <TableCell className="table-header-cell"><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exams.length > 0 ? (
                exams.map((exam) => (
                  <TableRow key={exam.id} hover>
                    <TableCell className="table-cell">{exam.titulo}</TableCell>
                    <TableCell className="table-cell">{exam.descripcion}</TableCell>
                    <TableCell className="table-cell">{new Date(exam.fechaInicio).toLocaleDateString()}</TableCell>
                    <TableCell className="table-cell">{new Date(exam.fechaFin).toLocaleDateString()}</TableCell>
                    <TableCell className="table-cell">
                      <Tooltip title="Editar">
                        <IconButton 
                          color="primary" 
                          onClick={() => handleEdit(exam)}
                          className="action-btn"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton 
                          color="error"
                          onClick={() => handleDeleteClick(exam)}
                          className="action-btn"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="table-cell" style={{ textAlign: 'center', padding: '1rem' }}>
                    No hay exámenes disponibles
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      
      {/* Diálogo de confirmación de eliminación */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleCancelDelete}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar el examen "{deleteDialog.exam?.titulo}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo de formulario */}
      <ExamForm
        open={openDialog}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        exam={currentExam}
      />
      
      {/* Notificación */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ExamsPage;
