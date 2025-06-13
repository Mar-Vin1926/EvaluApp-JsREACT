import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress
} from '@mui/material';
import { 
  Assignment as AssignmentIcon,
  Description as DescriptionIcon,
  PlayArrow as PlayArrowIcon
} from '@mui/icons-material';
import { useNavigate as _useNavigate } from 'react-router-dom';
import TakeExam from '../components/exams/TakeExam';

const StudentExamsPage = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState(null);
  const [openExamDialog, setOpenExamDialog] = useState(false);
  const [examResult, setExamResult] = useState(null);
  
  // Theme and navigate are kept for future use
  // const theme = useTheme();
  // const navigate = useNavigate();

  const handleStartExam = (examId) => {
    setSelectedExam(examId);
    setOpenExamDialog(true);
  };

  const handleCloseExam = () => {
    setOpenExamDialog(false);
    setSelectedExam(null);
    setExamResult(null);
  };

  const handleExamComplete = (score) => {
    setExamResult(score);
    // Update the exam status in the list
    setExams(prevExams => 
      prevExams.map(exam => 
        exam.id === selectedExam 
          ? { ...exam, status: 'Completado', score: `${score}%` } 
          : exam
      )
    );
  };

  useEffect(() => {
    // Simular carga de datos de exámenes
    setTimeout(() => {
      const mockExams = [
        {
          id: 1,
          title: 'Examen de React',
          description: 'Examen sobre frameworks de frontend',
          date: '2025-06-15',
          status: 'Pendiente'
        },
        {
          id: 2,
          title: 'MySQL',
          description: 'Examen sobre diseño y consultas SQL',
          date: '2025-06-20',
          status: 'Pendiente'
        },
        {
          id: 3,
          title: 'Examen de Java',
          description: 'Examen sobre fundamentos de programación',
          date: '2025-06-25',
          status: 'Pendiente'
        }
      ];
      setExams(mockExams);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Cargando exámenes...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Mis Exámenes
      </Typography>
      
      <Paper elevation={3} sx={{ mt: 3, p: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Examen</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <AssignmentIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body1">{exam.title}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{exam.description}</TableCell>
                  <TableCell>{exam.date}</TableCell>
                  <TableCell>
                    <Box 
                      sx={{
                        display: 'inline-block',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: exam.status === 'Pendiente' ? 'warning.light' : 'success.light',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 'medium'
                      }}
                    >
                      {exam.status}
                    </Box>
                    {exam.score && (
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                        Puntuación: {exam.score}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {exam.status === 'Pendiente' ? (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<PlayArrowIcon />}
                        onClick={() => handleStartExam(exam.id)}
                      >
                        Realizar
                      </Button>
                    ) : (
                      <IconButton color="primary" onClick={() => {}}>
                        <DescriptionIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Exam Dialog */}
      <Dialog
        open={openExamDialog}
        onClose={handleCloseExam}
        fullWidth
        maxWidth="md"
        fullScreen={window.innerWidth < 900}
      >
        <DialogTitle>
          {selectedExam && `Examen: ${
            exams.find(e => e.id === selectedExam)?.title || ''
          }`}
        </DialogTitle>
        <DialogContent dividers>
          {selectedExam && (
            <TakeExam 
              examId={selectedExam} 
              onComplete={handleExamComplete}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseExam} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Result Snackbar */}
      {examResult !== null && (
        <Alert 
          severity={examResult >= 70 ? 'success' : 'error'}
          sx={{ position: 'fixed', bottom: 20, right: 20, minWidth: 300 }}
          onClose={() => setExamResult(null)}
        >
          {examResult >= 70 
            ? `¡Felicidades! Has obtenido ${examResult}%` 
            : `Has obtenido ${examResult}%. Inténtalo de nuevo.`}
        </Alert>
      )}
    </Box>
  );
};

export default StudentExamsPage;
