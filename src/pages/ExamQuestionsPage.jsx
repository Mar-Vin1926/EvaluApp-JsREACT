import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  IconButton, 
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Divider,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { examService, questionService } from '../services/api';
import QuestionForm from '../components/exams/QuestionForm';

const QuestionItem = ({ 
  question, 
  index, 
  total, 
  onEdit, 
  onDelete, 
  onMoveUp, 
  onMoveDown 
}) => (
  <Paper 
    elevation={2} 
    sx={{ 
      p: 2, 
      mb: 2,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      '&:hover': {
        backgroundColor: 'action.hover',
      },
    }}
  >
    <Box sx={{ flex: 1 }}>
      <Typography variant="subtitle1">
        {index + 1}. {question.textoPregunta}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {question.tipoPregunta.replace('_', ' ')} • {question.puntaje} punto{question.puntaje !== 1 ? 's' : ''}
      </Typography>
    </Box>
    
    <Box>
      <Tooltip title="Mover arriba">
        <span>
          <IconButton 
            onClick={onMoveUp} 
            disabled={index === 0}
            size="small"
          >
            <ArrowUpwardIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      
      <Tooltip title="Mover abajo">
        <span>
          <IconButton 
            onClick={onMoveDown} 
            disabled={index === total - 1}
            size="small"
          >
            <ArrowDownwardIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      
      <Tooltip title="Editar">
        <IconButton onClick={() => onEdit(question)} size="small">
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Eliminar">
        <IconButton 
          onClick={() => onDelete(question.id)} 
          size="small" 
          color="error"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  </Paper>
);

const ExamQuestionsPage = () => {
  const { id: examenId } = useParams();
  // La navegación se agregará cuando sea necesario
  
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const loadExam = useCallback(async () => {
    try {
      setLoading(true);
      const response = await examService.getExamById(examenId);
      setExam(response.data);
      
      const questionsResponse = await questionService.getQuestionsByExam(examenId);
      setQuestions(questionsResponse.data);
      setError(null);
    } catch (error) {
      console.error('Error al cargar el examen:', error);
      setError('Error al cargar el examen');
      showSnackbar('Error al cargar el examen', 'error');
    } finally {
      setLoading(false);
    }
  }, [examenId, showSnackbar]);

  useEffect(() => {
    if (examenId) {
      loadExam();
    }
  }, [examenId, loadExam]);

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setShowForm(true);
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setShowForm(true);
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta pregunta? Esta acción no se puede deshacer.')) {
      try {
        await questionService.deleteQuestion(questionId);
        setQuestions(prev => prev.filter(q => q.id !== questionId));
        showSnackbar('Pregunta eliminada correctamente', 'success');
      } catch (error) {
        console.error('Error al eliminar la pregunta:', error);
        showSnackbar('Error al eliminar la pregunta', 'error');
      }
    }
  };

  const handleMoveQuestion = async (currentIndex, direction) => {
    if ((currentIndex === 0 && direction === -1) || 
        (currentIndex === questions.length - 1 && direction === 1)) {
      return;
    }

    const newIndex = currentIndex + direction;
    const newQuestions = [...questions];
    const [movedQuestion] = newQuestions.splice(currentIndex, 1);
    newQuestions.splice(newIndex, 0, movedQuestion);
    
    try {
      setQuestions(newQuestions);
      await questionService.updateQuestionOrder(
        examenId, 
        newQuestions.map((q, idx) => ({ id: q.id, orden: idx + 1 }))
      );
    } catch (error) {
      console.error('Error al reordenar preguntas:', error);
      showSnackbar('Error al reordenar las preguntas', 'error');
      // Revertir cambios en caso de error
      loadExam();
    }
  };

  const handleSaveQuestion = async () => {
    await loadExam(); // Recargar preguntas después de guardar
    setShowForm(false);
  };

  const showSnackbar = useCallback((message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  if (loading && !exam) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!exam) {
    return <Typography>Examen no encontrado</Typography>;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {exam.titulo}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Administrar preguntas
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddQuestion}
        >
          Nueva Pregunta
        </Button>
      </Box>

      <Divider sx={{ my: 3 }} />

      {questions.length === 0 ? (
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          minHeight="200px"
          textAlign="center"
          p={3}
        >
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No hay preguntas en este examen
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            Comienza agregando tu primera pregunta para crear este examen.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddQuestion}
            sx={{ mt: 2 }}
          >
            Agregar Primera Pregunta
          </Button>
        </Box>
      ) : (
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            {questions.length} pregunta{questions.length !== 1 ? 's' : ''} en total • 
            {questions.reduce((sum, q) => sum + (parseFloat(q.puntaje) || 0), 0)} puntos totales
          </Typography>
          
          {questions.map((question, index) => (
            <QuestionItem
              key={question.id}
              question={question}
              index={index}
              total={questions.length}
              onEdit={handleEditQuestion}
              onDelete={handleDeleteQuestion}
              onMoveUp={() => handleMoveQuestion(index, -1)}
              onMoveDown={() => handleMoveQuestion(index, 1)}
            />
          ))}
        </Box>
      )}

      {/* Diálogo del formulario */}
      <Dialog 
        open={showForm} 
        onClose={() => setShowForm(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingQuestion ? 'Editar Pregunta' : 'Nueva Pregunta'}
        </DialogTitle>
        <DialogContent dividers>
          <QuestionForm
            questionId={editingQuestion?.id}
            onSave={handleSaveQuestion}
            onCancel={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ExamQuestionsPage;
