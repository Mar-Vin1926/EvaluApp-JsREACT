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
import Swal from 'sweetalert2/dist/sweetalert2.all.min.js';
import './ExamsPage.css';

const ExamsPage = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastErrorTime, setLastErrorTime] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
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
      const examsData = await examService.getAllExams();
      console.log(`[ExamsPage] Se obtuvieron ${examsData.length} exámenes`, examsData);
      
      const formattedExams = examsData.map(exam => ({
        ...exam,
        fechaInicio: exam.fechaInicio ? new Date(exam.fechaInicio) : null,
        fechaFin: exam.fechaFin ? new Date(exam.fechaFin) : null
      }));
      
      setExams(formattedExams);
      setRetryCount(0);
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
      
      if (isServerError && retryCount < 3) {
        const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
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
    
    const timeSinceLastError = lastErrorTime ? (new Date() - lastErrorTime) / 1000 : null;
    if (!lastErrorTime || timeSinceLastError > 30 || retryCount > 0) {
      fetchExams();
    }
    
    return () => {
      console.log('[ExamsPage] Desmontando componente');
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



  const handleDeleteClick = async (exam) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el examen "${exam.titulo}"? Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await examService.deleteExam(exam.id);
        
        setSnackbar({
          open: true,
          message: 'Examen eliminado correctamente',
          severity: 'success'
        });
        
        await fetchExams();
      } catch (error) {
        console.error('Error al eliminar el examen:', error);
        
        setSnackbar({
          open: true,
          message: `Error al eliminar el examen: ${error.response?.data?.message || error.message}`,
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  return (
    <div className="exams-container">
      <div className="exams-header">
        <h1 className="exams-title">Exámenes</h1>
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

      <div className="table-responsive">
        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : (
          <Table className="exams-table">
            <TableHead>
              <TableRow>
                <TableCell className="table-header-cell">Título</TableCell>
                <TableCell className="table-header-cell">Descripción</TableCell>
                <TableCell className="table-header-cell">Fecha Inicio</TableCell>
                <TableCell className="table-header-cell">Fecha Fin</TableCell>
                <TableCell className="table-header-cell">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exams.length > 0 ? (
                exams.map((exam) => (
                  <TableRow key={exam.id} hover>
                    <TableCell className="table-cell">{exam.titulo}</TableCell>
                    <TableCell className="table-cell">{exam.descripcion}</TableCell>
                    <TableCell className="table-cell">
                      {exam.fechaInicio ? new Date(exam.fechaInicio).toLocaleDateString() : 'No definida'}
                    </TableCell>
                    <TableCell className="table-cell">
                      {exam.fechaFin ? new Date(exam.fechaFin).toLocaleDateString() : 'No definida'}
                    </TableCell>
                    <TableCell>
                      <div className="action-buttons">
                        <Tooltip title="Editar">
                          <IconButton 
                            color="primary" 
                            onClick={() => handleEdit(exam)}
                            className="action-btn"
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton 
                            color="error"
                            onClick={() => handleDeleteClick(exam)}
                            className="action-btn"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="no-exams">
                    No hay exámenes disponibles
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* El diálogo de confirmación fue reemplazado por SweetAlert2 */}

      {/* Formulario de creación/edición */}
      <ExamForm
        open={openDialog}
        handleClose={handleCloseForm}
        exam={currentExam}
        onSuccess={fetchExams}
      />

      {/* Notificación */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        action={snackbar.action}
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