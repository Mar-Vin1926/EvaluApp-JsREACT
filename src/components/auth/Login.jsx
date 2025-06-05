import React from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Button,
  Avatar
} from '@mui/material';
import {
  School as SchoolIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    const success = login(role);
    if (success) {
      navigate('/dashboard');
    }
  };

  const roles = [
    {
      id: 'TEACHER',
      title: 'Profesor',
      description: 'Accede para crear y gestionar exámenes',
      icon: <SchoolIcon sx={{ fontSize: 60 }} />,
      color: 'primary.main'
    },
    {
      id: 'STUDENT',
      title: 'Estudiante',
      description: 'Accede para realizar exámenes y ver tus resultados',
      icon: <PersonIcon sx={{ fontSize: 60 }} />,
      color: 'secondary.main'
    },
    {
      id: 'ADMIN',
      title: 'Administrador',
      description: 'Accede para gestionar usuarios y configuraciones',
      icon: <AdminIcon sx={{ fontSize: 60 }} />,
      color: 'success.main'
    }
  ];

  return (
    <Container 
      className="container" 
      maxWidth="md" 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between', 
        minHeight: '30vh' // Ocupa toda la altura de la ventana
      }}
    >
      <Box className="welcome-text" textAlign="center" mb={6}>
        <Typography variant="h3" component="h1" gutterBottom>
          Bienvenido a EvaluApp
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Por favor, selecciona tu rol para continuar
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center" sx={{ flexGrow: 1 }}>
        {roles.map((role) => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={4} 
            key={role.id} 
            className={role.id === 'ADMIN' ? 'admin-card-Admin' : ''}
          >
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6
                }
              }}
              elevation={3}
            >
              <CardActionArea
                onClick={() => handleRoleSelect(role.id)}
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 3,
                  textAlign: 'center'
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: role.color,
                    width: 100,
                    height: 100,
                    mb: 3
                  }}
                >
                  {role.icon}
                </Avatar>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {role.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {role.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Button
                  size="large"
                  variant="contained"
                  onClick={() => handleRoleSelect(role.id)}
                  sx={{
                    bgcolor: role.color,
                    '&:hover': {
                      bgcolor: role.color,
                      opacity: 0.9
                    }
                  }}
                >
                  Ingresar como {role.title}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pie de página */}
      <Box className="footer" textAlign="center" mt={4} p={2} sx={{ bgcolor: '#f5f5f5' }}>
        <Typography variant="body2" color="text.secondary">
          © 2025 EvaluApp. Todos los derechos reservados.
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;