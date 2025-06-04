import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button } from '@mui/material';
import { Visibility as VisibilityIcon, BarChart as BarChartIcon } from '@mui/icons-material';
import { resultService } from '../services/api';

const ResultsPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentId] = useState(1); // En una aplicación real, esto vendría del usuario autenticado

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await resultService.getResultsByStudent(studentId);
        setResults(response.data);
        setLoading(false);
      } catch {
        setError('Error al cargar los resultados');
        setLoading(false);
      }
    };

    fetchResults();
  }, [studentId]);

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
                  <TableCell>Examen</TableCell>
                  <TableCell>Puntuación</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell align="right">Acciones</TableCell>
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
