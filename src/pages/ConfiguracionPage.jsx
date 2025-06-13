import React, { useState } from 'react';
import {
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  MenuItem,
  Select,
  Alert
} from '@mui/material';

const ConfiguracionPage = () => {
  const [config, setConfig] = useState({
    tema: 'light',
    idioma: 'es',
    notificaciones: true,
    email: '',
    nombreEscuela: '',
    logoEscuela: '',
    mostrarCreditos: true,
    mostrarAyuda: true
  });

  const [error, setError] = useState('');

  const handleChange = (prop) => (event) => {
    setConfig({ ...config, [prop]: event.target.value });
  };

  const handleSwitchChange = (prop) => (event) => {
    setConfig({ ...config, [prop]: event.target.checked });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aquí iría la lógica para guardar las configuraciones
    // Por ahora mostramos un mensaje de éxito
    setError('');
    setTimeout(() => {
      setError('Configuraciones guardadas exitosamente');
    }, 100);
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Configuración de la Aplicación
      </Typography>

      {error && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Tema */}
            <Grid item xs={12} sm={6}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Tema</FormLabel>
                <RadioGroup
                  row
                  value={config.tema}
                  onChange={handleChange('tema')}
                >
                  <FormControlLabel
                    value="light"
                    control={<Radio />}
                    label="Claro"
                  />
                  <FormControlLabel
                    value="dark"
                    control={<Radio />}
                    label="Oscuro"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Idioma */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel>Idioma</FormLabel>
                <Select
                  value={config.idioma}
                  onChange={handleChange('idioma')}
                >
                  <MenuItem value="es">Español</MenuItem>
                  <MenuItem value="en">Inglés</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Notificaciones */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.notificaciones}
                    onChange={handleSwitchChange('notificaciones')}
                  />
                }
                label="Habilitar notificaciones"
              />
            </Grid>

            {/* Información de la Escuela */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Información de la Escuela
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre de la Escuela"
                value={config.nombreEscuela}
                onChange={handleChange('nombreEscuela')}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email de Contacto"
                type="email"
                value={config.email}
                onChange={handleChange('email')}
              />
            </Grid>

            {/* Opciones */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Opciones
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.mostrarCreditos}
                    onChange={handleSwitchChange('mostrarCreditos')}
                  />
                }
                label="Mostrar créditos"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.mostrarAyuda}
                    onChange={handleSwitchChange('mostrarAyuda')}
                  />
                }
                label="Mostrar ayuda"
              />
            </Grid>

            {/* Botón de guardar */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                sx={{ mt: 3 }}
              >
                Guardar Configuraciones
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default ConfiguracionPage;
