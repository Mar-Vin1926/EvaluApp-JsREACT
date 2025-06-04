import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Container, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Button 
} from '@mui/material';

// Datos de ejemplo para estudiantes
const mockStudents = [
  { id: 1, name: 'Juan Pérez', email: 'juan@example.com', status: 'Activo' },
  { id: 2, name: 'María García', email: 'maria@example.com', status: 'Activo' },
  { id: 3, name: 'Carlos López', email: 'carlos@example.com', status: 'Inactivo' },
];

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulamos una llamada a la API
    const fetchStudents = () => {
      try {
        // Usamos los datos de ejemplo
        setStudents(mockStudents);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar estudiantes:', error);
        setError('No se pudieron cargar los estudiantes. Por favor, intente más tarde.');
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) return <Typography>Cargando estudiantes...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Estudiantes
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => alert('Función de agregar estudiante')}
          >
            Agregar Estudiante
          </Button>
        </Box>

        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Correo Electrónico</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>
                      <Box 
                        component="span" 
                        sx={{
                          display: 'inline-block',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor: student.status === 'Activo' ? 'success.light' : 'error.light',
                          color: 'white',
                          fontSize: '0.75rem',
                          fontWeight: 'medium'
                        }}
                      >
                        {student.status}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Button 
                        variant="outlined" 
                        size="small" 
                        sx={{ mr: 1 }}
                        onClick={() => alert(`Ver estudiante: ${student.name}`)}
                      >
                        Ver
                      </Button>
                      <Button 
                        variant="outlined" 
                        color="secondary" 
                        size="small"
                        onClick={() => alert(`Editar estudiante: ${student.name}`)}
                      >
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Container>
  );
};

export default StudentsPage;
