import axios from 'axios';

// Configuración de la URL base dependiendo del entorno
const isDevelopment = import.meta.env.DEV;
const API_BASE_URL = 'https://evaluapp.onrender.com'; // Usar siempre la URL de la nube
console.log(`[API] Modo: ${isDevelopment ? 'Desarrollo' : 'Producción'}`);
console.log(`[API] URL Base: ${API_BASE_URL}`);

// Configuración de la instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0'
  },
  withCredentials: false, // No enviar credenciales por defecto
  timeout: 30000, // Aumentar timeout a 30 segundos
  validateStatus: function (status) {
    // Considerar códigos de estado menores a 500 como exitosos
    return status < 500;
  },
  // Configuración adicional para evitar el almacenamiento en caché
  params: {
    _t: new Date().getTime() // Añadir timestamp para evitar caché
  }
});

// Interceptor para log de peticiones
api.interceptors.request.use(config => {
  const fullUrl = `${config.baseURL}${config.url}`.replace('//', '/');
  console.log(`[API] ${config.method?.toUpperCase()} ${fullUrl}`, {
    params: config.params,
    data: config.data,
    headers: config.headers
  });
  
  // Añadir timestamp a los parámetros para evitar caché en peticiones GET
  if (config.method === 'get') {
    config.params = {
      ...config.params,
      _t: new Date().getTime()
    };
  }
  
  // Asegurarse de que la URL sea absoluta en producción
  if (!isDevelopment && !config.url.startsWith('http')) {
    config.url = `${API_BASE_URL}${config.url}`.replace(/([^:]\/)\/+/g, '$1');
  }
  
  return config;
}, error => {
  console.error('[API] Error en la petición:', error);
  return Promise.reject(error);
});

// Interceptor para log de peticiones
api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
      data: config.data,
      params: config.params,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('[API] Error en la petición:', error);
    return Promise.reject(error);
  }
);

// Configuración de reintentos
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 segundo

// Función para reintentar peticiones fallidas
const retryRequest = (error) => {
  const config = error.config;
  
  // Si no hay configuración o ya se intentó el máximo de veces, rechazar
  if (!config || !config.retries) {
    return Promise.reject(error);
  }
  
  // Reducir el contador de reintentos
  config.retries -= 1;
  
  // Crear una nueva promesa que se resuelva después del retraso
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(`[API] Reintentando petición a ${config.url}...`);
      resolve(api(config));
    }, RETRY_DELAY);
  });
};

// Interceptor para log de respuestas
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`[API] Respuesta de ${response.config.url}:`, {
        status: response.status,
        data: response.data
      });
    }
    return response;
  },
  (error) => {
    const errorDetails = {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      config: {
        baseURL: error.config?.baseURL,
        headers: error.config?.headers,
        timeout: error.config?.timeout,
        withCredentials: error.config?.withCredentials
      }
    };
    
    console.error('[API] Error en la respuesta:', JSON.stringify(errorDetails, null, 2));
    
    // Manejo de errores específicos
    if (error.response) {
      // El servidor respondió con un estado de error
      const status = error.response.status;
      const errorMessage = error.response.data?.message || error.response.statusText;
      
      if (status === 401) {
        console.error('[API] Error 401 - No autorizado:', errorMessage || 'Verifica tus credenciales');
      } else if (status === 403) {
        console.error('[API] Error 403 - Acceso denegado:', errorMessage || 'No tienes permiso para acceder a este recurso');
      } else if (status === 404) {
        console.error(`[API] Error 404 - Recurso no encontrado: ${error.config?.url}`);
      } else if (status === 409) {
        console.error('[API] Error 409 - Conflicto:', errorMessage || 'El recurso ya existe o hay un conflicto con el estado actual');
      } else if (status >= 500) {
        console.error(`[API] Error ${status} - Error del servidor:`, errorMessage || 'Por favor, inténtalo más tarde');
      } else {
        console.error(`[API] Error ${status}:`, errorMessage || 'Error en la petición');
      }
      
      // Configurar reintentos para errores de red o servidor
      if (!error.config.retries) {
        error.config.retries = MAX_RETRIES;
      }
      
      // Reintentar solo para errores específicos
      if (error.code === 'ECONNABORTED' || // Timeout
          error.code === 'ERR_NETWORK' ||  // Problemas de red
          (error.response && error.response.status >= 500)) { // Errores del servidor
        return retryRequest(error);
      }
      
      // Agregar detalles adicionales para depuración
      if (import.meta.env.DEV) {  // Usar import.meta.env en lugar de process.env para Vite
        console.debug('[API] Detalles del error:', {
          url: error.config?.url,
          method: error.config?.method,
          requestData: error.config?.data,
          responseData: error.response.data
        });
      }
    } else if (error.request) {
      // La petición fue hecha pero no hubo respuesta
      console.error('[API] No se recibió respuesta del servidor. Verifica tu conexión a internet.');
      console.debug('[API] Detalles de la petición:', {
        url: error.config?.url,
        method: error.config?.method,
        timeout: error.config?.timeout
      });
    } else {
      // Error al configurar la petición
      console.error('[API] Error al configurar la petición:', error.message);
      console.debug('[API] Configuración de la petición:', error.config);
    }
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  // Agregar más métodos según sea necesario
};

// Servicios de administración de usuarios
export const userService = {
  // Usuarios
  getAllUsers: () => api.get('/admin/users'),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  registerUser: (userData) => api.post('/admin/users/register', userData),
  updateUser: (id, userData) => api.patch(`/admin/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getUsersByRole: (role) => api.get(`/admin/users/role/${role}`),
  getUserByEmail: (email) => api.get(`/admin/users/email/${email}`),
  resetPassword: (id, newPassword) => 
    api.patch(`/admin/users/${id}/reset-password?newPassword=${encodeURIComponent(newPassword)}`),
  changePassword: (id, oldPassword, newPassword) => 
    api.patch(`/admin/users/${id}/password?oldPassword=${encodeURIComponent(oldPassword)}&newPassword=${encodeURIComponent(newPassword)}`),
};

// Servicios de exámenes
export const examService = {
  // Métodos para gestionar exámenes
  getAllExams: () =>
    api.get('/api/examenes')
      .then(res => {
        console.log('[ExamService] Respuesta de getAllExams:', res.data);
        if (Array.isArray(res.data)) return res.data;
        return [];
      })
      .catch(err => {
        console.error('[ExamService] Error al obtener exámenes:', err);
        return [];
      }),
  getExamById: (id) => api.get(`/api/examenes/${id}`).then(res => res.data),
  createExam: (examData) => api.post('/api/examenes', examData).then(res => res.data),
  updateExam: (id, examData) => api.put(`/api/examenes/${id}`, examData).then(res => res.data),
  deleteExam: (id) => api.delete(`/api/examenes/${id}`).then(res => res.data),
  getExamQuestions: (examId) => api.get(`/api/examenes/${examId}/preguntas`).then(res => res.data),
  addQuestionToExam: (examId, questionData) => api.post(`/api/examenes/${examId}/preguntas`, questionData).then(res => res.data),
  removeQuestionFromExam: (examId, questionId) => api.delete(`/api/examenes/${examId}/preguntas/${questionId}`).then(res => res.data)
};

// Servicios de preguntas
export const questionService = {
  // Preguntas
  createQuestion: (questionData) => api.post('/preguntas', questionData),
  getAllQuestions: () => api.get('/preguntas'),
  getQuestionById: (id) => api.get(`/preguntas/${id}`),
  updateQuestion: (id, questionData) => api.put(`/preguntas/${id}`, questionData),
  deleteQuestion: (id) => api.delete(`/preguntas/${id}`),
  getQuestionsByExam: (examId) => api.get(`/preguntas/examen/${examId}`),
  updateQuestionOrder: (examId, questionsOrder) => 
    api.put(`/preguntas/orden/${examId}`, { orden: questionsOrder }),
};

// Servicios de opciones
export const optionService = {
  // Opciones
  createOption: (optionData) => api.post('/opciones', optionData),
  getOptionsByQuestion: (questionId) => api.get(`/opciones/pregunta/${questionId}`),
  updateOption: (id, optionData) => api.put(`/opciones/${id}`, optionData),
  deleteOption: (id) => api.delete(`/opciones/${id}`),
  deleteAllOptionsFromQuestion: (questionId) => 
    api.delete(`/opciones/pregunta/${questionId}/todas`),
  updateOptionsOrder: (questionId, optionsOrder) =>
    api.put(`/opciones/orden/${questionId}`, { orden: optionsOrder }),
};

// Servicios de resultados
export const resultService = {
  // Resultados
  createResult: (resultData) => api.post('/resultados', resultData),
  getAllResults: () => api.get('/resultados'),
  getResultById: (id) => api.get(`/resultados/${id}`),
  getResultsByStudent: (studentId) => api.get(`/resultados/estudiante/${studentId}`),
};

// Servicios de perfil
export const profileService = {
  // Perfiles
  // Docente
  getAllTeacherProfiles: () => api.get('/teacher/profile'),
  getTeacherProfile: (userId) => api.get(`/teacher/profile/${userId}`),
  updateTeacherProfile: (userId, profileData) => api.put(`/teacher/profile/${userId}`, profileData),
  
  // Estudiante
  getStudentProfile: (userId) => api.get(`/student/profile/${userId}`),
  updateStudentProfile: (userId, profileData) => api.put(`/student/profile/${userId}`, profileData),
};

// Exportar la instancia de axios por si se necesita usar directamente
export default api;
