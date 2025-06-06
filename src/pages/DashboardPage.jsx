import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  Box, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  Typography, 
  Divider,
  Avatar,
  CardHeader,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  useTheme,
  Container
} from '@mui/material';
import {
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  School as SchoolIcon,
  AccessTime as AccessTimeIcon,
  Notifications as NotificationsIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user } = useAuth();
  const theme = useTheme();
  
  // Datos de ejemplo para las estadísticas
  const stats = [
    { 
      title: 'Total Estudiantes', 
      value: '1,245', 
      icon: <PeopleIcon color="primary" fontSize="large" />,
      color: theme.palette.primary.main 
    },
    { 
      title: 'Exámenes Activos', 
      value: '12', 
      icon: <AssignmentIcon color="secondary" fontSize="large" />,
      color: theme.palette.secondary.main 
    },
    { 
      title: 'Cursos', 
      value: '8', 
      icon: <SchoolIcon style={{ color: '#4caf50' }} fontSize="large" />,
      color: '#4caf50'
    },
    { 
      title: 'Promedio General', 
      value: '8.7/10', 
      icon: <AccessTimeIcon style={{ color: '#ff9800' }} fontSize="large" />,
      color: '#ff9800'
    },
  ];

  // Actividades recientes
  const activities = [
    { id: 1, user: 'Juan Pérez', action: 'completó el examen de Matemáticas', time: 'Hace 5 minutos', icon: <CheckCircleIcon color="success" /> },
    { id: 2, user: 'María García', action: 'envió una tarea de Ciencias', time: 'Hace 1 hora', icon: <AssignmentIcon color="primary" /> },
    { id: 3, user: 'Carlos López', action: 'preguntó sobre el próximo examen', time: 'Hace 3 horas', icon: <InfoIcon color="info" /> },
  ];

  // Notificaciones
  const notifications = [
    { id: 1, title: 'Nuevo mensaje', description: 'Tienes un nuevo mensaje del profesor', time: 'Hace 10 min', icon: <NotificationsIcon color="primary" /> },
    { id: 2, title: 'Tarea pendiente', description: 'La tarea de Historia está por vencer', time: 'Hace 1 día', icon: <WarningIcon color="warning" /> },
    { id: 3, title: 'Examen calificado', description: 'Tu examen de Matemáticas ha sido calificado', time: 'Hace 2 días', icon: <CheckCircleIcon color="success" /> },
  ];

  return (
    <div className="dashboard-container">
      {/* Encabezado */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Panel de Control</h1>
        <p className="dashboard-subtitle">
          Bienvenido al panel de administración de EvaluApp. Aquí puedes ver un resumen de la actividad reciente y las estadísticas principales.
        </p>
      </div>

      {/* Estadísticas */}
      <div className="stats-grid">
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card className="stat-card" style={{ borderLeft: `4px solid ${stat.color}` }}>
                <CardContent>
                  <div className="stat-label">
                    {stat.icon}
                    <span>{stat.title}</span>
                  </div>
                  <div className="stat-value">{stat.value}</div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>

      {/* Sección de actividades y notificaciones */}
      <Grid container spacing={4}>
        {/* Actividades recientes */}
        <Grid item xs={12} md={8}>
          <div className="dashboard-section">
            <h2 className="section-title">
              <AccessTimeIcon /> Actividad Reciente
            </h2>
            <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <Card>
                <CardContent>
                  <List>
                    {activities.map((activity) => (
                      <div key={activity.id} className="activity-item">
                        <Avatar className="activity-avatar">
                          {activity.icon}
                        </Avatar>
                        <div className="activity-content">
                          <p className="activity-text">
                            <strong>{activity.user}</strong> {activity.action}
                          </p>
                          <span className="activity-time">{activity.time}</span>
                        </div>
                      </div>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Paper>
          </div>
        </Grid>

        {/* Notificaciones */}
        <Grid item xs={12} md={4}>
          <div className="dashboard-section">
            <h2 className="section-title">
              <NotificationsIcon /> Notificaciones
            </h2>
            <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <Card>
                <CardContent>
                  <List>
                    {notifications.map((notification) => (
                      <div key={notification.id} className="activity-item">
                        <Avatar className="activity-avatar">
                          {notification.icon}
                        </Avatar>
                        <div className="activity-content">
                          <p className="activity-text">
                            <strong>{notification.title}</strong>
                            <span className="activity-time">{notification.time}</span>
                          </p>
                          <p className="activity-text">{notification.description}</p>
                        </div>
                      </div>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Paper>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default DashboardPage;
