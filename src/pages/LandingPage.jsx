import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  useTheme,
  useMediaQuery,
  alpha,
  Divider,
  Stack,
  IconButton
} from '@mui/material';
import {
  School as SchoolIcon,
  Assessment as AssessmentIcon,
  Group as GroupIcon,
  ArrowForward as ArrowForwardIcon,
  GitHub as GitHubIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  Code as CodeIcon
} from '@mui/icons-material';

// Custom styled components
const SectionBox = ({ children, bgcolor = 'background.default', py = 8 }) => (
  <Box sx={{ py, bgcolor, width: '100%' }}>
    <Container maxWidth="lg">
      {children}
    </Container>
  </Box>
);

const SectionTitle = ({ children, align = 'center' }) => (
  <Typography 
    variant="h3" 
    component="h2" 
    align={align}
    sx={{
      fontWeight: 700,
      mb: 2,
      position: 'relative',
      display: 'inline-block',
      '&:after': {
        content: '""',
        position: 'absolute',
        width: '60px',
        height: '4px',
        bottom: '-12px',
        left: align === 'center' ? '50%' : '0',
        transform: align === 'center' ? 'translateX(-50%)' : 'none',
        bgcolor: 'primary.main',
        borderRadius: '2px'
      }
    }}
  >
    {children}
  </Typography>
);

const FeatureCard = ({ icon, title, description }) => (
  <Card 
    elevation={0}
    sx={{
      height: '100%',
      p: 3,
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'divider',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        borderColor: 'transparent'
      }
    }}
  >
    <Box 
      sx={{ 
        width: 60, 
        height: 60, 
        borderRadius: 2,
        bgcolor: 'primary.light',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 3,
        color: 'primary.contrastText'
      }}
    >
      {React.cloneElement(icon, { sx: { fontSize: 30 } })}
    </Box>
    <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
      {title}
    </Typography>
    <Typography variant="body1" color="text.secondary">
      {description}
    </Typography>
  </Card>
);

const TeamMember = ({ name, role, avatar }) => (
  <Box sx={{ textAlign: 'center' }}>
    <Avatar 
      {...avatar}
      sx={{ 
        width: 160, 
        height: 160, 
        mx: 'auto',
        mb: 2,
        boxShadow: 3
      }} 
    />
    <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 0.5 }}>
      {name}
    </Typography>
    <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
      {role}
    </Typography>
  </Box>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <SchoolIcon />,
      title: 'Gestión de Exámenes',
      description: 'Crea y gestiona exámenes de manera sencilla y eficiente con nuestra plataforma intuitiva.'
    },
    {
      icon: <AssessmentIcon />,
      title: 'Evaluaciones en Línea',
      description: 'Realiza evaluaciones en línea con seguimiento en tiempo real y resultados instantáneos.'
    },
    {
      icon: <GroupIcon />,
      title: 'Seguimiento de Estudiantes',
      description: 'Monitorea el progreso de tus estudiantes con herramientas analíticas avanzadas.'
    }
  ];

  const teamMembers = [
    {
      name: 'Marvin Garcia',
      role: 'Desarrollador Frontend',
      avatar: { 
        src: '/public/Marvin.jpg',
        alt: 'Marvin Garcia',
        sx: { bgcolor: 'primary.light' }
      }
    },
    {
      name: 'Kevin Olivella',
      role: 'Diseñador UI/UX',
      avatar: { 
        src: '/public/Kevin.jpg',
        alt: 'Kevin Olivella',
        sx: { bgcolor: 'secondary.light' }
      }
    },
    {
      name: 'Paola Murillo',
      role: 'Diseñadora Creativa',
      avatar: { 
        src: '/public/Paola.jpg',
        alt: 'Paola Murillo',
        sx: { bgcolor: 'success.light' }
      }
    }
  ];
  
  const socialLinks = [
    { icon: <GitHubIcon />, url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    { icon: <TwitterIcon />, url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    { icon: <LinkedInIcon />, url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    { icon: <EmailIcon />, url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
  ];

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(90deg, #1a237e, #3949ab, #5c6bc0, #3949ab, #1a237e)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            zIndex: 1
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: 12 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant={isMobile ? 'h3' : 'h2'} 
                component="h1" 
                sx={{ 
                  fontWeight: 800,
                  color: 'white',
                  mb: 3,
                  lineHeight: 1.2
                }}
              >
                Transforma la forma de evaluar
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 4, 
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: 400,
                  lineHeight: 1.7
                }}
              >
                Simplifica la creación, distribución y análisis de evaluaciones educativas con nuestra plataforma intuitiva y poderosa.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/login')}
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    fontSize: '1rem',
                    textTransform: 'none',
                    borderRadius: 2,
                    boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 15px 25px rgba(0,0,0,0.2)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Comenzar Ahora
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="large"
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    fontSize: '1rem',
                    textTransform: 'none',
                    borderRadius: 2,
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                  onClick={() => {
                    const featuresSection = document.getElementById('features');
                    featuresSection.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Saber más
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box 
                sx={{
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    background: `radial-gradient(circle at center, ${theme.palette.primary.light} 0%, transparent 70%)`,
                    filter: 'blur(60px)',
                    zIndex: -1,
                    opacity: 0.6
                  }
                }}
              >
                <Box
                  component="img"
                  src="/DashBoard.jpg"
                  alt="Vista previa del Dashboard de EvaluApp"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 4,
                    boxShadow: theme.shadows[10],
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: theme.shadows[15]
                    }
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <SectionBox id="features" bgcolor="background.paper">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="overline" 
            color="primary" 
            sx={{ 
              letterSpacing: 3, 
              mb: 2, 
              display: 'block',
              fontWeight: 600,
              fontSize: '0.8rem'
            }}
          >
            CARACTERÍSTICAS
          </Typography>
          <SectionTitle>Todo lo que necesitas en una plataforma</SectionTitle>
          <Typography 
            variant="body1" 
            sx={{ 
              maxWidth: 700, 
              mx: 'auto', 
              color: 'text.secondary',
              fontSize: '1.1rem',
              lineHeight: 1.7
            }}
          >
            Diseñada para simplificar el proceso de evaluación y facilitar el aprendizaje.
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} lg={4} key={index}>
              <FeatureCard {...feature} />
            </Grid>
          ))}
        </Grid>
      </SectionBox>

      {/* Team Section */}
      <SectionBox bgcolor="background.default">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="overline" 
            color="primary" 
            sx={{ 
              letterSpacing: 3, 
              mb: 2, 
              display: 'block',
              fontWeight: 600,
              fontSize: '0.8rem'
            }}
          >
            NUESTRO EQUIPO
          </Typography>
          <SectionTitle>Conoce al equipo</SectionTitle>
          <Typography 
            variant="body1" 
            sx={{ 
              maxWidth: 700, 
              mx: 'auto', 
              color: 'text.secondary',
              fontSize: '1.1rem',
              lineHeight: 1.7
            }}
          >
            Un equipo apasionado por la educación y la tecnología trabajando juntos para mejorar la experiencia de aprendizaje.
          </Typography>
        </Box>
        
        <Grid container spacing={6} justifyContent="center">
          {teamMembers.map((member, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <TeamMember {...member} />
            </Grid>
          ))}
        </Grid>
      </SectionBox>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(90deg, #1a237e, #3949ab, #5c6bc0, #3949ab, #1a237e)',
          color: 'white',
          py: 12,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            zIndex: 1
          }
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 700, 
              mb: 3,
              color: 'white'
            }}
          >
            ¿Listo para transformar tu experiencia de evaluación?
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 6, 
              opacity: 0.9,
              fontWeight: 400,
              maxWidth: 700,
              mx: 'auto'
            }}
          >
            Únete a cientos de educadores que ya están utilizando EvaluApp para simplificar su flujo de trabajo y mejorar los resultados de aprendizaje.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/login')}
            sx={{ 
              px: 4, 
              py: 1.5,
              fontSize: '1rem',
              textTransform: 'none',
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'grey.100',
                transform: 'translateY(-2px)',
                boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
              },
              borderRadius: 2,
              boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease'
            }}
          >
            Comenzar Ahora
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', py: 6, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CodeIcon sx={{ mr: 1, color: 'primary.main', fontSize: 32 }} />
                <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  EvaluApp
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 300 }}>
                La plataforma educativa que simplifica la creación y gestión de evaluaciones en línea.
              </Typography>
              <Stack direction="row" spacing={1}>
                {socialLinks.map((link, index) => (
                  <IconButton 
                    key={index} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    sx={{
                      color: 'text.secondary',
                      '&:hover': {
                        color: 'primary.main',
                        bgcolor: alpha(theme.palette.primary.main, 0.1)
                      }
                    }}
                  >
                    {link.icon}
                  </IconButton>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={4}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                    Producto
                  </Typography>
                  <Stack spacing={1}>
                    <Button href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer" color="inherit" sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}>Características</Button>
                    <Button href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer" color="inherit" sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}>Precios</Button>
                    <Button href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer" color="inherit" sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}>Documentación</Button>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                    Compañía
                  </Typography>
                  <Stack spacing={1}>
                    <Button href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer" color="inherit" sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}>Sobre Nosotros</Button>
                    <Button href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer" color="inherit" sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}>Blog</Button>
                    <Button href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer" color="inherit" sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}>Carreras</Button>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                    Soporte
                  </Typography>
                  <Stack spacing={1}>
                    <Button href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer" color="inherit" sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}>Centro de Ayuda</Button>
                    <Button href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer" color="inherit" sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}>Contacto</Button>
                    <Button href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer" color="inherit" sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}>Estado</Button>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                    Legal
                  </Typography>
                  <Stack spacing={1}>
                    <Button href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer" color="inherit" sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}>Privacidad</Button>
                    <Button href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer" color="inherit" sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}>Términos</Button>
                    <Button href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer" color="inherit" sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}>Cookies</Button>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4 }} />
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} EvaluApp. Todos los derechos reservados.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: { xs: 2, sm: 0 } }}>
              <Button href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer" color="inherit" size="small" sx={{ color: 'text.secondary' }}>Privacidad</Button>
              <Button href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer" color="inherit" size="small" sx={{ color: 'text.secondary' }}>Términos</Button>
              <Button href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer" color="inherit" size="small" sx={{ color: 'text.secondary' }}>Cookies</Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
