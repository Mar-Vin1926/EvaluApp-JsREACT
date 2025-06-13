import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, Grid, Card, CardContent, Chip } from '@mui/material';
import { Add as AddIcon, School as SchoolIcon, People as PeopleIcon } from '@mui/icons-material';
import './CoursesPage.css';

// Datos de ejemplo - En una aplicación real, esto vendría de la API
const sampleCourses = [
  { 
    id: 1, 
    name: 'Frameworks', 
    code: 'MATH-101', 
    students: 25,
    description: 'Curso introductorio a Frameworks de Frontend y Backend.'
  },
  { 
    id: 2, 
    name: 'Programación I', 
    code: 'PROG-101', 
    students: 30,
    description: 'Introducción a la programación con Python.'
  },
  { 
    id: 3, 
    name: 'Base de Datos', 
    code: 'DB-201', 
    students: 20,
    description: 'Fundamentos de diseño y consulta de bases de datos relacionales.'
  },
  { 
    id: 4, 
    name: 'Inteligencia Artificial', 
    code: 'AI-301', 
    students: 15,
    description: 'Conceptos básicos de inteligencia artificial y machine learning.'
  },
  // Agregando más cursos para probar el layout
  { 
    id: 5, 
    name: 'Desarrollo Web', 
    code: 'WEB-201', 
    students: 28,
    description: 'Desarrollo de aplicaciones web modernas con React y Node.js.'
  },
  { 
    id: 6, 
    name: 'Seguridad Informática', 
    code: 'SEC-301', 
    students: 18,
    description: 'Principios de seguridad en sistemas informáticos y redes.'
  },
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

  if (loading) return <Box className="courses-container"><Typography>Cargando cursos...</Typography></Box>;

  return (
    <Container maxWidth={false} className="courses-container">
      <Box>
        <Box className="courses-header">
          <Typography variant="h1" className="courses-title">
            Cursos
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            className="new-course-btn"
          >
            Nuevo Curso
          </Button>
        </Box>

        <Grid container spacing={3} className="courses-grid" justifyContent="flex-end">
          {courses.map((course) => (
            <Grid item key={course.id} xs={12} sm={6} md={4} lg={3}>
              <article className="course-card">
                <CardContent className="course-card-content">
                  <Box className="course-header">
                    <Box className="course-icon">
                      <SchoolIcon fontSize="medium" />
                    </Box>
                    <Typography variant="h2" className="course-title">
                      {course.name}
                    </Typography>
                  </Box>
                  
                  <Chip 
                    label={course.code} 
                    size="small" 
                    className="course-code"
                    variant="outlined"
                  />
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
                    {course.description}
                  </Typography>
                  
                  <Box className="course-meta">
                    <Box className="course-students">
                      <PeopleIcon fontSize="small" />
                      <span>{course.students} estudiantes</span>
                    </Box>
                  </Box>
                </CardContent>
                
                <Box className="course-actions">
                  <Button size="small" color="primary" variant="outlined">
                    Ver detalles
                  </Button>
                  
                </Box>
              </article>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default CoursesPage;
