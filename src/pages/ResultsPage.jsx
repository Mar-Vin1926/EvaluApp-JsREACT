import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button } from '@mui/material';
import { Visibility as VisibilityIcon, BarChart as BarChartIcon } from '@mui/icons-material';
import { resultService } from '../services/api';

const ResultsPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      const mockResults = [
        {
          id: 1,
          estudiante: 'Kevin Olivella',
          examen: { titulo: 'Frameworks' },
          puntaje: 95,
          fechaFinalizacion: '2025-06-12T15:00:00'
        },
        {
          id: 2,
          estudiante: 'Marvin García',
          examen: { titulo: 'Base de Datos' },
          puntaje: 88,
          fechaFinalizacion: '2025-06-10T10:30:00'
        },
        {
          id: 3,
          estudiante: 'Paola Jiménez',
          examen: { titulo: 'Programación I' },
          puntaje: 92,
          fechaFinalizacion: '2025-06-08T14:45:00'
        }
      ];
      setResults(mockResults);
      setLoading(false);
      setResults(mockResults);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <Typography>Cargando resultados...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Resultados
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<BarChartIcon />}
            onClick={() => {/* Lógica para ver estadísticas */}}
          >
            Ver Estadísticas
          </Button>
        </Box>

        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Examen</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Puntuación</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>{result.examen?.titulo || 'Examen'}</TableCell>
                    <TableCell>{result.puntaje} pts</TableCell>
                    <TableCell>{new Date(result.fechaFinalizacion).toLocaleDateString()}</TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" aria-label="ver">
                        <VisibilityIcon />
                      </IconButton>
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

export default ResultsPage;
