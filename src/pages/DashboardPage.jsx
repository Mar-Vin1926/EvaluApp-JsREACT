import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider
} from '@mui/material';
import {
  School as SchoolIcon,
  Quiz as QuizIcon,
  BarChart as ChartIcon,
  People as PeopleIcon
} from '@mui/icons-material';

const DashboardPage = () => {
  const { user } = useAuth();

  // Datos de ejemplo para las tarjetas
  const stats = [
    { title: 'Exámenes', value: '12', icon: <QuizIcon fontSize="large" />, color: 'primary' },
    { title: 'Estudiantes', value: '85', icon: <PeopleIcon fontSize="large" />, color: 'secondary' },
    { title: 'Resultados', value: '245', icon: <ChartIcon fontSize="large" />, color: 'success' },
    { title: 'Cursos', value: '8', icon: <SchoolIcon fontSize="large" />, color: 'warning' },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Panel de Control
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Bienvenido/a, {user?.name || 'Usuario'}
      </Typography>

      {/* Tarjetas de estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid xs={12} sm={6} md={3} key={index}>
            <Paper elevation={3} sx={{ height: '100%' }}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <div>
                      <Typography color="textSecondary" gutterBottom>
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" component="div">
                        {stat.value}
                      </Typography>
                    </div>
                    <Box
                      sx={{
                        backgroundColor: `${stat.color}.light`,
                        color: `${stat.color}.contrastText`,
                        borderRadius: '50%',
                        width: 56,
                        height: 56,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {stat.icon}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Sección de actividades recientes */}
      <Grid container spacing={3}>
        <Grid xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <CardHeader 
              title="Actividad Reciente" 
              titleTypographyProps={{ variant: 'h6' }}
            />
            <Divider />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                No hay actividades recientes.
              </Typography>
            </CardContent>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <CardHeader 
              title="Notificaciones" 
              titleTypographyProps={{ variant: 'h6' }}
            />
            <Divider />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                No hay notificaciones nuevas.
              </Typography>
            </CardContent>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
