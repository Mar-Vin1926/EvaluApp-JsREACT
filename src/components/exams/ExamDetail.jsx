import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  Chip, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  Card, 
  CardContent,
  CardHeader,
  IconButton,
  Collapse,
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { examService, questionService, optionService } from '../../services/api';

const CheckIconSvg = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="#ffffff"
    style={{
      width: '100%',
      height: '100%',
      display: 'block'
    }}
  >
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
  </svg>
);

const QuestionItem = ({ question, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadOptions = async () => {
    try {
      setLoading(true);
      const response = await optionService.getOptionsByQuestion(question.id);
      setOptions(response.data);
    } catch (error) {
      console.error('Error al cargar opciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExpand = () => {
    if (!expanded && options.length === 0) {
      loadOptions();
    }
    setExpanded(!expanded);
  };

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardHeader
        title={
          <Box display="flex" alignItems="center">
            <Typography variant="subtitle1" sx={{ flex: 1 }}>
              {question.textoPregunta}
            </Typography>
            <Chip 
              label={question.tipoPregunta.replace('_', ' ')} 
              size="small" 
              sx={{ ml: 1 }}
            />
          </Box>
        }
        action={
          <Box>
            <Tooltip title="Editar pregunta">
              <IconButton onClick={() => onEdit(question)} size="small">
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar pregunta">
              <IconButton onClick={() => onDelete(question.id)} size="small" color="error">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <IconButton
              size="small"
              onClick={handleExpand}
              aria-expanded={expanded}
              aria-label="mostrar opciones"
            >
              <ExpandMoreIcon
                sx={{
                  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }}
              />
            </IconButton>
          </Box>
        }
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {loading ? (
            <Typography>Cargando opciones...</Typography>
          ) : options.length > 0 ? (
            <List dense>
              {options.map((option) => (
                <ListItem 
                  key={option.id} 
                  sx={{ 
                    pl: 4,
                    color: option.esCorrecta ? 'success.main' : 'text.primary'
                  }}
                >
                  <ListItemText 
                    primary={
                      <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box 
                          component="span" 
                          sx={{
                            display: 'inline-block',
                            width: 24,
                            height: 24,
                            border: '1px solid',
                            borderColor: option.esCorrecta ? 'success.main' : 'divider',
                            borderRadius: '4px',
                            mr: 1,
                            bgcolor: option.esCorrecta ? 'success.light' : 'transparent',
                            position: 'relative',
                            flexShrink: 0
                          }}
                        >
                          {option.esCorrecta && (
                            <CheckIcon 
                              sx={{ 
                                color: 'success.contrastText',
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                fontSize: '1rem'
                              }} 
                            />
                          )}
                        </Box>
                        {option.textoOpcion}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No hay opciones para esta pregunta.
            </Typography>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
};

const ExamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const fetchExam = useCallback(async () => {
    try {
      const [examResponse, questionsResponse] = await Promise.all([
        examService.getExamById(id),
        examService.getExamQuestions(id)
      ]);
      
      setExam(examResponse.data);
      setQuestions(questionsResponse.data);
      setError(null);
    } catch (error) {
      console.error('Error al cargar el examen:', error);
      setError('Error al cargar el examen');
      showSnackbar('Error al cargar el examen', 'error');
    } finally {
      setLoading(false);
    }
  }, [id, showSnackbar]);

  useEffect(() => {
    if (id) {
      fetchExam();
    }
  }, [id, fetchExam]);

  const handleEditExam = () => {
    navigate(`/exams/edit/${id}`);
  };

  const handleAddQuestion = () => {
    navigate(`/exams/${id}/preguntas`);
  };

  const handleEditQuestion = (question) => {
    navigate(`/exams/${id}/preguntas`, { state: { editQuestion: question } });
  };

  const handleDeleteQuestion = useCallback(async (questionId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta pregunta?')) {
      try {
        await questionService.deleteQuestion(questionId);
        setQuestions(prevQuestions => prevQuestions.filter(q => q.id !== questionId));
        showSnackbar('Pregunta eliminada correctamente', 'success');
      } catch (error) {
        console.error('Error al eliminar la pregunta:', error);
        showSnackbar('Error al eliminar la pregunta', 'error');
      }
    }
  }, [showSnackbar]);

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

  if (loading) {
    return <Typography>Cargando examen...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!exam) {
    return <Typography>Examen no encontrado</Typography>;
  }


  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">
            {exam.titulo}
          </Typography>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEditExam}
          >
            Editar Examen
          </Button>
        </Box>
        
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="body1" paragraph>
            {exam.descripcion}
          </Typography>
          
          <Box display="flex" flexWrap="wrap" gap={3} mt={2}>
            <Chip 
              icon={<CheckIcon />} 
              label={`${questions.length} Preguntas`} 
              variant="outlined"
            />
            <Chip 
              icon={<CheckIcon />} 
              label={`Duración: ${exam.duracion} minutos`} 
              variant="outlined"
            />
            <Chip 
              icon={<CheckIcon />} 
              label={`Inicia: ${new Date(exam.fechaInicio).toLocaleDateString()}`} 
              variant="outlined"
            />
            <Chip 
              icon={<CheckIcon />} 
              label={`Finaliza: ${new Date(exam.fechaFin).toLocaleDateString()}`} 
              variant="outlined"
            />
          </Box>
        </Paper>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" component="h2">
            Preguntas
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddQuestion}
          >
            Agregar Pregunta
          </Button>
        </Box>

        {questions.length > 0 ? (
          <Box>
            {questions.map((question) => (
              <QuestionItem
                key={question.id}
                question={question}
                onEdit={handleEditQuestion}
                onDelete={handleDeleteQuestion}
              />
            ))}
          </Box>
        ) : (
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="textSecondary">
              Este examen no tiene preguntas. Agrega una para comenzar.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddQuestion}
              sx={{ mt: 2 }}
            >
              Agregar Primera Pregunta
            </Button>
          </Paper>
        )}
      </Box>

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

export default ExamDetail;
