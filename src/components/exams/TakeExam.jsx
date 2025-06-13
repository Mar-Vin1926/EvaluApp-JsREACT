import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
  Container,
  Alert,
  LinearProgress
} from '@mui/material';

const TakeExam = ({ examId, onComplete }) => {
  const [exam, setExam] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds

  const handleSubmit = useCallback(() => {
    if (submitted || !exam) return;
    
    let correctAnswers = 0;
    exam.questions.forEach(question => {
      const selectedOption = question.options.find(opt => opt.id === answers[question.id]);
      if (selectedOption?.isCorrect) {
        correctAnswers++;
      }
    });
    
    const finalScore = Math.round((correctAnswers / exam.questions.length) * 100);
    setScore(finalScore);
    setSubmitted(true);
    
    if (onComplete) {
      onComplete(finalScore);
    }
  }, [answers, exam, onComplete, submitted]);

  // Mock exam data will be defined inside the useEffect to avoid recreation on every render
  useEffect(() => {
    // Mock exam data - defined inside useEffect to avoid recreation on every render
    const mockExams = {
      1: {
        id: 1,
        title: 'Frameworks Frontend',
        description: 'Examen sobre frameworks de frontend',
        duration: 1800, // 30 minutes
        questions: [
          {
            id: 1,
            text: '¿Cuál de los siguientes NO es un framework de JavaScript?',
            options: [
              { id: 1, text: 'React' },
              { id: 2, text: 'Angular' },
              { id: 3, text: 'Django', isCorrect: true },
              { id: 4, text: 'Vue' }
            ]
          },
          {
            id: 2,
            text: '¿Qué es JSX?',
            options: [
              { id: 1, text: 'Una extensión de sintaxis para JavaScript', isCorrect: true },
              { id: 2, text: 'Un nuevo lenguaje de programación' },
              { id: 3, text: 'Un framework de CSS' },
              { id: 4, text: 'Un preprocesador de JavaScript' }
            ]
          },
          {
            id: 3,
            text: '¿Cuál es el hook de React que se usa para efectos secundarios?',
            options: [
              { id: 1, text: 'useState' },
              { id: 2, text: 'useEffect', isCorrect: true },
              { id: 3, text: 'useContext' },
              { id: 4, text: 'useReducer' }
            ]
          }
        ]
      },
      2: {
        id: 2,
        title: 'Base de Datos',
        description: 'Examen sobre diseño y consultas SQL',
        duration: 1800, // 30 minutes
        questions: [
          {
            id: 1,
            text: '¿Cuál de los siguientes NO es un sistema de gestión de bases de datos?',
            options: [
              { id: 1, text: 'MySQL' },
              { id: 2, text: 'MongoDB' },
              { id: 3, text: 'PostgreSQL' },
              { id: 4, text: 'Node.js', isCorrect: true }
            ]
          },
          {
            id: 2,
            text: '¿Qué significa SQL?',
            options: [
              { id: 1, text: 'Structured Query Language', isCorrect: true },
              { id: 2, text: 'Simple Query Language' },
              { id: 3, text: 'Standard Query Logic' },
              { id: 4, text: 'System Query Language' }
            ]
          },
          {
            id: 3,
            text: '¿Cuál de estas es una base de datos NoSQL?',
            options: [
              { id: 1, text: 'MySQL' },
              { id: 2, text: 'MongoDB', isCorrect: true },
              { id: 3, text: 'PostgreSQL' },
              { id: 4, text: 'SQL Server' }
            ]
          }
        ]
      },
      3: {
        id: 3,
        title: 'Programación I',
        description: 'Examen sobre fundamentos de programación',
        duration: 1800, // 30 minutes
        questions: [
          {
            id: 1,
            text: '¿Qué es una variable?',
            options: [
              { id: 1, text: 'Un valor fijo que no puede cambiar' },
              { id: 2, text: 'Un contenedor para almacenar datos', isCorrect: true },
              { id: 3, text: 'Un tipo de bucle' },
              { id: 4, text: 'Una función' }
            ]
          },
          {
            id: 2,
            text: '¿Qué tipo de bucle se ejecuta al menos una vez?',
            options: [
              { id: 1, text: 'for' },
              { id: 2, text: 'while' },
              { id: 3, text: 'do-while', isCorrect: true },
              { id: 4, text: 'for-each' }
            ]
          },
          {
            id: 3,
            text: '¿Cuál de estos NO es un tipo de dato primitivo en JavaScript?',
            options: [
              { id: 1, text: 'string' },
              { id: 2, text: 'number' },
              { id: 3, text: 'boolean' },
              { id: 4, text: 'object', isCorrect: true }
            ]
          }
        ]
      }
    };

    // Simulate API call to get exam
    const timer = setTimeout(() => {
      const selectedExam = mockExams[examId];
      if (selectedExam) {
        setExam(selectedExam);
        setTimeLeft(selectedExam.duration);
      }
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [examId]);

  useEffect(() => {
    if (!exam) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [exam, handleSubmit]);

  const handleAnswerSelect = (questionId, answerId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleNext = () => {
    if (currentQuestion < exam.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!exam) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">No se pudo cargar el examen. Por favor, inténtalo de nuevo más tarde.</Alert>
      </Container>
    );
  }

  if (submitted) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Examen Completado
            </Typography>
            <Typography variant="h6" color={score >= 70 ? 'success.main' : 'error.main'}>
              Puntuación: {score}%
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              {score >= 70 
                ? '¡Felicidades! Has aprobado el examen.'
                : 'Lo siento, no has alcanzado la puntuación mínima para aprobar.'
              }
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => onComplete(score)}
              sx={{ mt: 2 }}
            >
              Volver a la lista de exámenes
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  const currentQ = exam.questions[currentQuestion];
  const hasAnswered = answers[currentQ.id] !== undefined;
  const isLastQuestion = currentQuestion === exam.questions.length - 1;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h1">
          {exam.title}
        </Typography>
        <Typography variant="h6" color={timeLeft < 300 ? 'error.main' : 'text.primary'}>
          Tiempo restante: {formatTime(timeLeft)}
        </Typography>
      </Box>

      <LinearProgress 
        variant="determinate" 
        value={((currentQuestion + 1) / exam.questions.length) * 100} 
        sx={{ mb: 3 }}
      />

      <Card>
        <CardContent>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Pregunta {currentQuestion + 1} de {exam.questions.length}
          </Typography>
          
          <Typography variant="h6" component="div" gutterBottom>
            {currentQ.text}
          </Typography>

          <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }}>
            <FormLabel component="legend">Selecciona una respuesta:</FormLabel>
            <RadioGroup
              value={answers[currentQ.id] || ''}
              onChange={(e) => handleAnswerSelect(currentQ.id, parseInt(e.target.value))}
            >
              {currentQ.options.map((option) => (
                <FormControlLabel
                  key={option.id}
                  value={option.id}
                  control={<Radio />}
                  label={option.text}
                  disabled={submitted}
                  sx={{
                    mt: 1,
                    p: 1,
                    borderRadius: 1,
                    bgcolor: submitted 
                      ? option.isCorrect 
                        ? 'success.light' 
                        : answers[currentQ.id] === option.id 
                          ? 'error.light' 
                          : 'background.paper'
                      : 'background.paper',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>

          <Box display="flex" justifyContent="space-between" mt={4}>
            <Button
              variant="outlined"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Anterior
            </Button>
            
            {isLastQuestion ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={!hasAnswered}
              >
                Finalizar Examen
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                disabled={!hasAnswered}
              >
                Siguiente
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default TakeExam;
