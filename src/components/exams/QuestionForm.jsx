import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Divider,
  IconButton,
  FormControlLabel,
  Checkbox,
  Paper,
  Grid,
  FormHelperText
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Save as SaveIcon, Close as CloseIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { questionService, optionService } from '../../services/api';

const TIPOS_PREGUNTA = [
  { value: 'SELECCION_MULTIPLE', label: 'Selección Múltiple' },
  { value: 'VERDADERO_FALSO', label: 'Verdadero/Falso' },
  { value: 'RESPUESTA_CORTA', label: 'Respuesta Corta' }
];

const QuestionForm = ({ questionId, onSave, onCancel }) => {
  const { id: examenId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    textoPregunta: '',
    tipoPregunta: 'SELECCION_MULTIPLE',
    puntaje: 1,
    opciones: [
      { textoOpcion: '', esCorrecta: false },
      { textoOpcion: '', esCorrecta: false }
    ]
  });

  // Cargar datos de la pregunta si es edición
  useEffect(() => {
    const cargarPregunta = async () => {
      if (questionId) {
        try {
          setLoading(true);
          const response = await questionService.getQuestionById(questionId);
          const pregunta = response.data;
          
          // Cargar opciones si es necesario
          if (pregunta.tipoPregunta === 'SELECCION_MULTIPLE' || pregunta.tipoPregunta === 'VERDADERO_FALSO') {
            const opcionesResponse = await optionService.getOptionsByQuestion(questionId);
            setFormData(prev => ({
              ...pregunta,
              opciones: opcionesResponse.data.length > 0 
                ? opcionesResponse.data 
                : [...prev.opciones]
            }));
          } else {
            setFormData(prev => ({
              ...pregunta,
              opciones: []
            }));
          }
        } catch (error) {
          console.error('Error al cargar la pregunta:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    cargarPregunta();
  }, [questionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOpcionChange = (index, field, value) => {
    const nuevasOpciones = [...formData.opciones];
    
    if (field === 'esCorrecta' && value) {
      // Si es una pregunta de selección múltiple, solo una opción puede ser correcta
      if (formData.tipoPregunta === 'SELECCION_MULTIPLE') {
        nuevasOpciones.forEach((op, i) => {
          if (i !== index) op.esCorrecta = false;
        });
      }
    }
    
    nuevasOpciones[index] = {
      ...nuevasOpciones[index],
      [field]: field === 'esCorrecta' ? value : value
    };
    
    setFormData(prev => ({
      ...prev,
      opciones: nuevasOpciones
    }));
  };

  const agregarOpcion = () => {
    setFormData(prev => ({
      ...prev,
      opciones: [...prev.opciones, { textoOpcion: '', esCorrecta: false }]
    }));
  };

  const eliminarOpcion = (index) => {
    if (formData.opciones.length <= 2) return;
    
    setFormData(prev => ({
      ...prev,
      opciones: prev.opciones.filter((_, i) => i !== index)
    }));
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    
    if (!formData.textoPregunta.trim()) {
      nuevosErrores.textoPregunta = 'El texto de la pregunta es requerido';
    }
    
    if (formData.puntaje <= 0) {
      nuevosErrores.puntaje = 'El puntaje debe ser mayor a 0';
    }
    
    // Validar opciones para preguntas de selección múltiple y verdadero/falso
    if (formData.tipoPregunta !== 'RESPUESTA_CORTA') {
      formData.opciones.forEach((opcion, index) => {
        if (!opcion.textoOpcion.trim()) {
          nuevosErrores[`opcion-${index}`] = 'El texto de la opción es requerido';
        }
      });
      
      // Verificar que al menos una opción sea correcta
      if (!formData.opciones.some(op => op.esCorrecta)) {
        nuevosErrores.opciones = 'Debe haber al menos una opción correcta';
      }
    }
    
    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;
    
    try {
      setLoading(true);
      let preguntaGuardada;
      
      // Crear o actualizar la pregunta
      if (questionId) {
        const { opciones, ...preguntaData } = formData;
        preguntaGuardada = await questionService.updateQuestion(questionId, preguntaData);
      } else {
        const { opciones, ...preguntaData } = formData;
        preguntaGuardada = await questionService.createQuestion({
          ...preguntaData,
          examenId: parseInt(examenId)
        });
      }
      
      // Manejar opciones para preguntas que las requieren
      if (formData.tipoPregunta !== 'RESPUESTA_CORTA') {
        const preguntaId = preguntaGuardada.data.id;
        
        // Eliminar opciones existentes si es una actualización
        if (questionId) {
          await optionService.deleteAllOptionsFromQuestion(preguntaId);
        }
        
        // Crear nuevas opciones
        await Promise.all(
          formData.opciones.map(opcion => 
            optionService.createOption({
              ...opcion,
              preguntaId
            })
          )
        );
      }
      
      if (onSave) {
        onSave();
      } else {
        navigate(`/examenes/${examenId}`);
      }
      
    } catch (error) {
      console.error('Error al guardar la pregunta:', error);
      // Mostrar mensaje de error
    } finally {
      setLoading(false);
    }
  };

  if (loading && questionId) {
    return <Typography>Cargando pregunta...</Typography>;
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Pregunta"
              name="textoPregunta"
              value={formData.textoPregunta}
              onChange={handleChange}
              error={!!errors.textoPregunta}
              helperText={errors.textoPregunta}
              required
              multiline
              rows={2}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.tipoPregunta}>
              <InputLabel>Tipo de Pregunta</InputLabel>
              <Select
                name="tipoPregunta"
                value={formData.tipoPregunta}
                onChange={handleChange}
                label="Tipo de Pregunta"
              >
                {TIPOS_PREGUNTA.map(tipo => (
                  <MenuItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.tipoPregunta && (
                <FormHelperText>{errors.tipoPregunta}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Puntaje"
              name="puntaje"
              value={formData.puntaje}
              onChange={handleChange}
              error={!!errors.puntaje}
              helperText={errors.puntaje}
              inputProps={{ min: 0.5, step: 0.5 }}
              required
            />
          </Grid>
          
          {/* Opciones de respuesta */}
          {(formData.tipoPregunta === 'SELECCION_MULTIPLE' || 
            formData.tipoPregunta === 'VERDADERO_FALSO') && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Opciones de respuesta:
              </Typography>
              
              {errors.opciones && (
                <FormHelperText error sx={{ mb: 2 }}>
                  {errors.opciones}
                </FormHelperText>
              )}
              
              {formData.opciones.map((opcion, index) => (
                <Box key={index} display="flex" alignItems="center" mb={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={opcion.esCorrecta}
                        onChange={(e) => handleOpcionChange(index, 'esCorrecta', e.target.checked)}
                        color="primary"
                        disabled={formData.tipoPregunta === 'VERDADERO_FALSO' && index >= 2}
                      />
                    }
                    label="Correcta"
                    sx={{ mr: 2, minWidth: 100 }}
                  />
                  
                  <TextField
                    fullWidth
                    value={opcion.textoOpcion}
                    onChange={(e) => handleOpcionChange(index, 'textoOpcion', e.target.value)}
                    placeholder={`Opción ${index + 1}`}
                    error={!!errors[`opcion-${index}`]}
                    helperText={errors[`opcion-${index}`]}
                    disabled={formData.tipoPregunta === 'VERDADERO_FALSO' && index >= 2}
                  />
                  
                  {formData.opciones.length > 2 && (
                    <IconButton 
                      onClick={() => eliminarOpcion(index)}
                      disabled={formData.tipoPregunta === 'VERDADERO_FALSO' && index < 2}
                      sx={{ ml: 1 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
              
              <Button
                startIcon={<AddIcon />}
                onClick={agregarOpcion}
                disabled={
                  formData.tipoPregunta === 'VERDADERO_FALSO' || 
                  formData.opciones.length >= 5
                }
                sx={{ mt: 1 }}
              >
                Agregar Opción
              </Button>
              
              <FormHelperText>
                {formData.tipoPregunta === 'VERDADERO_FALSO' 
                  ? 'Las preguntas Verdadero/Falso solo pueden tener 2 opciones'
                  : 'Máximo 5 opciones por pregunta'}
              </FormHelperText>
            </Grid>
          )}
          
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button
                variant="outlined"
                onClick={onCancel || (() => navigate(`/examenes/${examenId}`))}
                disabled={loading}
                startIcon={<CloseIcon />}
              >
                Cancelar
              </Button>
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={<SaveIcon />}
              >
                {loading ? 'Guardando...' : 'Guardar Pregunta'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default QuestionForm;
