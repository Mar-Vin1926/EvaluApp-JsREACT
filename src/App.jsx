import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import ConfiguracionPage from './pages/ConfiguracionPage';
import StudentExamsPage from './pages/StudentExamsPage';

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
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<LandingPage />} />
            <Route path="/forgot-password" element={<LandingPage />} />
            <Route path="/reset-password/:token" element={<LandingPage />} />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route
                path="exams"
                element={
                  <ProtectedRoute>
                    {({ user }) =>
                      user?.role === 'STUDENT' ? (
                        <StudentExamsPage />
                      ) : (
                        <ExamsPage />
                      )
                    }
                  </ProtectedRoute>
                }
              />
              <Route path="exams/:id" element={<ExamDetail />} />
              <Route path="exams/:id/preguntas" element={<ExamQuestionsPage />} />
              <Route path="students" element={<StudentsPage />} />
              <Route path="results" element={<ResultsPage />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="configuracion" element={<ConfiguracionPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
