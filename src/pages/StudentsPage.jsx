import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Button,
  IconButton,
  TablePagination,
  TextField,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Avatar,
  Chip
} from '@mui/material';
import { 
  Add as AddIcon, 
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';

// Datos de ejemplo para estudiantes
const mockStudents = [
  { 
    id: 1, 
    name: 'Juan Pérez', 
    email: 'juan@example.com', 
    status: 'Activo',
    avatar: '/avatars/1.jpg',
    lastAccess: '2023-06-01T10:30:00',
    course: 'Matemáticas Básicas'
  },
  { 
    id: 2, 
    name: 'María García', 
    email: 'maria@example.com', 
    status: 'Activo',
    avatar: '/avatars/2.jpg',
    lastAccess: '2023-06-02T14:45:00',
    course: 'Programación I'
  },
  { 
    id: 3, 
    name: 'Carlos López', 
    email: 'carlos@example.com', 
    status: 'Inactivo',
    avatar: '/avatars/3.jpg',
    lastAccess: '2023-05-28T09:15:00',
    course: 'Base de Datos'
  },
  { 
    id: 4, 
    name: 'Ana Martínez', 
    email: 'ana@example.com', 
    status: 'Activo',
    avatar: '/avatars/4.jpg',
    lastAccess: '2023-06-03T16:20:00',
    course: 'Inteligencia Artificial'
  },
  { 
    id: 5, 
    name: 'Pedro Sánchez', 
    email: 'pedro@example.com', 
    status: 'Inactivo',
    avatar: '/avatars/5.jpg',
    lastAccess: '2023-05-25T11:10:00',
    course: 'Matemáticas Básicas'
  },
];

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // Simulamos una llamada a la API
    const fetchStudents = () => {
      try {
        // Usamos los datos de ejemplo
        setStudents(mockStudents);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar estudiantes:', error);
        setError('No se pudieron cargar los estudiantes. Por favor, intente más tarde.');
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleOpenDialog = (student = null) => {
    setSelectedStudent(student);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStudent(null);
  };

  // Filtrar estudiantes según el término de búsqueda
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Obtener estudiantes para la página actual
  const paginatedStudents = filteredStudents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }


  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }


  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'center' },
        mb: 3,
        gap: 2
      }}>
        <Typography variant="h4" component="h1" gutterBottom={!isMobile}>
          Estudiantes
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' },
          width: { xs: '100%', sm: 'auto' }
        }}>
          <TextField
            size="small"
            placeholder="Buscar estudiantes..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ 
              minWidth: { xs: '100%', sm: 300 },
              '& .MuiInputBase-root': {
                bgcolor: 'background.paper',
              }
            }}
          />
          
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ 
              whiteSpace: 'nowrap',
              width: { xs: '100%', sm: 'auto' },
              height: '40px'
            }}
          >
            Nuevo Estudiante
          </Button>
          
          {!isMobile && (
            <IconButton 
              aria-label="filtros" 
              sx={{ 
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1
              }}
            >
              <FilterListIcon />
            </IconButton>
          )}
        </Box>
      </Box>


      <Paper 
        elevation={2} 
        sx={{ 
          borderRadius: 2, 
          overflow: 'hidden',
          mb: 3
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Estudiante</TableCell>
                {!isMobile && <TableCell>Email</TableCell>}
                <TableCell>Curso</TableCell>
                <TableCell align="right">Último acceso</TableCell>
                <TableCell align="center">Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map((student) => (
                  <TableRow key={student.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar 
                          src={student.avatar} 
                          alt={student.name}
                          sx={{ width: 40, height: 40 }}
                        >
                          <PersonIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {student.name}
                          </Typography>
                          {isMobile && (
                            <Typography variant="body2" color="text.secondary">
                              {student.email}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    {!isMobile && <TableCell>{student.email}</TableCell>}
                    <TableCell>{student.course}</TableCell>
                    <TableCell align="right">
                      {new Date(student.lastAccess).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={student.status}
                        color={student.status === 'Activo' ? 'success' : 'default'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenDialog(student)}
                          color="primary"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={isMobile ? 5 : 6} align="center" sx={{ py: 4 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                      <PersonIcon color="disabled" sx={{ fontSize: 48 }} />
                      <Typography variant="body1" color="text.secondary">
                        No se encontraron estudiantes
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Intenta con otro término de búsqueda
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredStudents.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          sx={{
            borderTop: `1px solid ${theme.palette.divider}`,
            '& .MuiTablePagination-toolbar': {
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
              gap: 1,
              p: 2
            },
            '& .MuiTablePagination-spacer': {
              flex: '0 1 0%'
            }
          }}
        />
      </Paper>

      {/* Diálogo para agregar/editar estudiante */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedStudent ? 'Editar Estudiante' : 'Nuevo Estudiante'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedStudent 
              ? 'Modifica la información del estudiante.'
              : 'Completa el formulario para agregar un nuevo estudiante.'}
          </DialogContentText>
          {/* Aquí iría el formulario para agregar/editar estudiante */}
          <Box sx={{ mt: 2 }}>
            {/* Formulario iría aquí */}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button variant="contained" onClick={handleCloseDialog}>
            {selectedStudent ? 'Guardar Cambios' : 'Agregar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentsPage;
