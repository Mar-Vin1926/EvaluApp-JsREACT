import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, Paper, Grid, Card, CardContent, CardActions, Chip } from '@mui/material';
import { Add as AddIcon, School as SchoolIcon, People as PeopleIcon } from '@mui/icons-material';

// Datos de ejemplo - En una aplicación real, esto vendría de la API
const sampleCourses = [
  { id: 1, name: 'Matemáticas Básicas', code: 'MATH-101', students: 25 },
  { id: 2, name: 'Programación I', code: 'PROG-101', students: 30 },
  { id: 3, name: 'Base de Datos', code: 'DB-201', students: 20 },
  { id: 4, name: 'Inteligencia Artificial', code: 'AI-301', students: 15 },
];

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    const fetchCourses = async () => {
      try {
        // En una aplicación real, haríamos una llamada a la API aquí
        // const response = await courseService.getAllCourses();
        // setCourses(response.data);
        
        // Usando datos de ejemplo por ahora
        setCourses(sampleCourses);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar los cursos:', error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <Typography>Cargando cursos...</Typography>;

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Cursos
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />}>
            Nuevo Curso
          </Button>
        </Box>

        <Grid container spacing={3}>
          {courses.map((course) => (
            <Grid key={course.id} xs={12} sm={6} md={4}>
              <Paper elevation={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <SchoolIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6" component="div">
                        {course.name}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Código: {course.code}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                      <PeopleIcon color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        {course.students} estudiantes
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button size="small">Ver detalles</Button>
                    <Button size="small" color="primary">
                      Editar
                    </Button>
                  </CardActions>
                </Card>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default CoursesPage;
