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
  useTheme
} from '@mui/material';
import { 
  Assignment as AssignmentIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';

const StudentExamsPage = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    // Simular carga de datos de exámenes
    setTimeout(() => {
      const mockExams = [
        {
          id: 1,
          title: 'Frameworks Frontend',
          description: 'Examen sobre frameworks de frontend',
          date: '2025-06-15',
          status: 'Pendiente'
        },
        {
          id: 2,
          title: 'Base de Datos',
          description: 'Examen sobre diseño y consultas SQL',
          date: '2025-06-20',
          status: 'Pendiente'
        },
        {
          id: 3,
          title: 'Programación I',
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
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Mis Exámenes
      </Typography>
      
      <Paper sx={{ p: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Título</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Descripción</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell>{exam.title}</TableCell>
                  <TableCell>{exam.description}</TableCell>
                  <TableCell>{exam.date}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      color={exam.status === 'Pendiente' ? 'primary' : 'success'}
                    >
                      {exam.status}
                    </Button>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton>
                      <AssignmentIcon />
                    </IconButton>
                    <IconButton>
                      <DescriptionIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default StudentExamsPage;
