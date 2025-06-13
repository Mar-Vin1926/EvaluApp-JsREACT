import React from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Swal from 'sweetalert2';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Avatar,
  useTheme,
  useMediaQuery,
  Container,
  CssBaseline
} from '@mui/material';
import {
  School as SchoolIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';

// Importar la imagen de fondo
import fondoLogin from '../../assets/imagenFondo.jpg';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleRoleSelect = (role) => {
    let timerInterval;
    
    Swal.fire({
      title: `Iniciando sesión como ${role === 'TEACHER' ? 'Profesor' : role === 'STUDENT' ? 'Estudiante' : 'Administrador'}`,
      html: 'Redirigiendo en <b></b> milisegundos.',
      timer: 2000,
      timerProgressBar: true,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        const timer = Swal.getPopup().querySelector('b');
        timerInterval = setInterval(() => {
          timer.textContent = Swal.getTimerLeft();
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        const success = login(role);
        if (success) {
          navigate('/dashboard');
        }
      }
    });
  };

  const roles = [
    {
      id: 'TEACHER',
      title: 'Profesor',
      description: 'Accede para crear y gestionar exámenes',
      icon: <SchoolIcon sx={{ fontSize: { xs: 40, sm: 50, md: 60 } }} />,
      color: 'primary.main'
    },
    {
      id: 'STUDENT',
      title: 'Estudiante',
      description: 'Accede para realizar exámenes y ver tus resultados',
      icon: <PersonIcon sx={{ fontSize: { xs: 40, sm: 50, md: 60 } }} />,
      color: 'secondary.main'
    },
    {
      id: 'ADMIN',
      title: 'Administrador',
      description: 'Accede para gestionar usuarios y configuraciones',
      icon: <AdminIcon sx={{ fontSize: { xs: 40, sm: 50, md: 60 } }} />,
      color: 'success.main'
    }
  ];

  return (
    <Box 
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${fondoLogin})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        overflowY: 'auto',
        zIndex: 0,
        '&::before': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: -1,
        }
      }}
    >
      <CssBaseline />
      
      {/* Contenido principal */}
      <Container 
        component="main" 
        maxWidth={false} 
        sx={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          py: { xs: 4, sm: 6, md: 8 },
          px: { xs: 2, sm: 3, md: 4 },
          width: '100%',
          maxWidth: '100% !important',
          m: 0,
        }}
      >
        <Box 
          sx={{
            maxWidth: 1200,
            mx: 'auto',
            width: '100%'
          }}
        >
          <Box 
            textAlign="center" 
            mb={{ xs: 4, sm: 6, md: 8 }}
            sx={{ width: '100%' }}
          >
         <Typography
  className="welcome-title"
  variant={isMobile ? 'h4' : 'h3'}
  sx={{
    width: '100%',
    px: { xs: 1, sm: 2 }
  }}
>
  Bienvenido a EvaluApp
</Typography>
<Typography 
  className="welcome-subtitle"
  variant={isMobile ? 'subtitle1' : 'h6'} 
  sx={{
    maxWidth: 800,
      mt: 2,  /* Añade espacio arriba del subtítulo */
      width: '100%',
      px: { xs: 1, sm: 2 }
  }}
>
  Por favor, selecciona tu rol para continuar
</Typography>
          </Box>

          <Grid 
            container 
            spacing={{ xs: 2, sm: 3, md: 4 }}
            justifyContent="center"
            sx={{
              maxWidth: 1400,
              mx: 'auto',
              width: '100%',
              mb: { xs: 2, sm: 4 },
              px: { xs: 1, sm: 2 }
            }}
          >
            {roles.map((role) => (
              <Grid 
                item 
                xs={12} 
                sm={6} 
                lg={4} 
                key={role.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  maxWidth: 400,
                  width: '100%',
                  mx: 'auto'
                }}
              >
                <Card
                  sx={{
                    width: '100%',
                    maxWidth: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.shadows[8]
                    },
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    overflow: 'hidden',
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
                      p: { xs: 2, sm: 3 },
                      textAlign: 'center',
                      '&:hover': {
                        '& .MuiAvatar-root': {
                          transform: 'scale(1.1)',
                          boxShadow: theme.shadows[4]
                        }
                      }
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: `${role.color}20`,
                        color: role.color,
                        width: { xs: 80, sm: 100, md: 120 },
                        height: { xs: 80, sm: 100, md: 120 },
                        mb: { xs: 2, sm: 3 },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {role.icon}
                    </Avatar>
                    <CardContent sx={{ flexGrow: 1, p: 0, width: '100%' }}>
                      <Typography 
                        variant="h5" 
                        component="h2" 
                        gutterBottom
                        sx={{ 
                          fontWeight: 600,
                          color: 'text.primary',
                          mb: 1.5
                        }}
                      >
                        {role.title}
                      </Typography>
                      <Typography 
                        variant="body1" 
                        color="text.secondary"
                        sx={{ 
                          mb: 3,
                          minHeight: 60,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {role.description}
                      </Typography>
                      <Button 
                        variant="contained" 
                        color="primary"
                        size="large"
                        fullWidth
                        onClick={() => handleRoleSelect(role.id)}
                        sx={{
                          mt: 'auto',
                          py: 1.5,
                          borderRadius: 1,
                          fontWeight: 500,
                          textTransform: 'none',
                          fontSize: '1rem',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: theme.shadows[4]
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Ingresar como {role.title.toLowerCase()}
                      </Button>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* Footer */}
      <Box 
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: '#ffffff',
          textAlign: 'center',
          width: '100%',
          position: 'relative',
          zIndex: 1
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            {new Date().getFullYear()} EvaluApp - Todos los derechos reservados
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Login;