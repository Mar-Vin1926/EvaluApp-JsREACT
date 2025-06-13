import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import DashboardLayout from './components/layout/DashboardLayout';
import Login from './components/auth/Login';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ExamsPage from './pages/ExamsPage';
import ExamDetail from './components/exams/ExamDetail';
import ExamQuestionsPage from './pages/ExamQuestionsPage';
import StudentsPage from './pages/StudentsPage';
import ResultsPage from './pages/ResultsPage';
import CoursesPage from './pages/CoursesPage';
import StudentExamsPage from './pages/StudentExamsPage';
import ConfiguracionPage from './pages/ConfiguracionPage'

// Crear un tema personalizado con soporte responsive
let theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '16px',
          paddingRight: '16px',
          '@media (min-width: 600px)': {
            paddingLeft: '24px',
            paddingRight: '24px',
          },
        },
      },
    },
  },
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 500 },
    h2: { fontSize: '2rem', fontWeight: 500 },
    h3: { fontSize: '1.75rem', fontWeight: 500 },
    h4: { fontSize: '1.5rem', fontWeight: 500 },
    h5: { fontSize: '1.25rem', fontWeight: 500 },
    h6: { fontSize: '1rem', fontWeight: 500 },
  },
});

// Hacer que las fuentes sean responsive
theme = responsiveFontSizes(theme);

// Componente para rutas protegidas
const ProtectedRoute = ({ children, requiredRole = null, studentComponent = null, teacherComponent = null }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Mostrar un indicador de carga mientras se verifica la autenticación
  if (user === undefined) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Si no hay usuario, redirigir al login
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Si se requiere un rol específico y el usuario no lo tiene
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Manejar la lógica de renderizado condicional basado en el rol
  if (studentComponent && teacherComponent) {
    return user.role === 'STUDENT' ? studentComponent : teacherComponent;
  }

  // Usuario autenticado y con los permisos necesarios
  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route
                path="/exams"
                element={
                  <ProtectedRoute 
                    studentComponent={<StudentExamsPage />}
                    teacherComponent={<ExamsPage />}
                  />
                }
              />
              <Route path="/exams/:id" element={<ExamDetail />} />
              <Route path="/exams/:id/preguntas" element={<ExamQuestionsPage />} />
              <Route path="/students" element={<StudentsPage />} />
              <Route
                path="/results"
                element={
                  <ProtectedRoute 
                    studentComponent={<ResultsPage />} 
                    teacherComponent={<ResultsPage />}
                  />
                }
              />
              <Route path="/courses" element={<CoursesPage />} />
              <Route
                path="/configuration"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <ConfiguracionPage />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
