import axios from 'axios';

// Configuración de la URL base dependiendo del entorno
const isDevelopment = import.meta.env.DEV;
const API_BASE_URL = isDevelopment 
  ? ''  // Usar ruta relativa en desarrollo (el proxy manejará /api)
  : 'https://evaluapp.onrender.com';  // URL base en producción

console.log(`[API] Modo: ${isDevelopment ? 'Desarrollo' : 'Producción'}`);
console.log(`[API] URL Base: ${API_BASE_URL || '/api (proxy)'}`);

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
  updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getUsersByRole: (role) => api.get(`/admin/users/role/${role}`),
  getUserByEmail: (email) => api.get(`/admin/users/email/${email}`),
  resetPassword: (id, newPassword) => 
    api.put(`/admin/users/${id}/reset-password?newPassword=${encodeURIComponent(newPassword)}`),
  changePassword: (id, oldPassword, newPassword) => 
    api.put(`/admin/users/${id}/password?oldPassword=${encodeURIComponent(oldPassword)}&newPassword=${encodeURIComponent(newPassword)}`),
};

// Servicios de exámenes
export const examService = {
  // Obtener todos los exámenes
  getAllExams: async () => {
    try {
      console.log('[examService] Solicitando todos los exámenes...');
      const response = await api.get('/api/examenes');
      console.log('[examService] Respuesta recibida:', response);
      return response;
    } catch (error) {
      console.error('[examService] Error al obtener exámenes:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },
  
  // Obtener un examen por ID
  getExamById: async (id) => {
    try {
      console.log(`[examService] Solicitando examen con ID: ${id}`);
      const response = await api.get(`/api/examenes/${id}`);
      return response;
    } catch (error) {
      console.error(`[examService] Error al obtener el examen ${id}:`, error.message);
      throw error;
    }
  },
  
  // Crear un nuevo examen
  createExam: async (examData) => {
    try {
      console.log('[examService] Creando nuevo examen con datos:', examData);
      // Limpiar el objeto de campos nulos, vacíos o no deseados
      const cleanExamData = Object.entries(examData).reduce((acc, [key, value]) => {
        // Excluir campos que no deben enviarse o están vacíos
        if (value !== null && value !== '' && value !== undefined) {
          // Si es un array, verificar que no esté vacío
          if (Array.isArray(value)) {
            if (value.length > 0) {
              acc[key] = value;
            }
          } else {
            acc[key] = value;
          }
        }
        return acc;
      }, {});
      
      console.log('[examService] Datos limpios para crear examen:', cleanExamData);
      const response = await api.post('/api/examenes', cleanExamData);
      console.log('[examService] Respuesta del servidor:', response);
      return response;
    } catch (error) {
      console.error('[examService] Error al crear examen:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },
  
  // Actualizar un examen existente
  updateExam: async (id, examData) => {
    try {
      console.log(`[examService] Actualizando examen ${id} con datos:`, examData);
      const response = await api.put(`/api/examenes/${id}`, examData);
      console.log(`[examService] Respuesta al actualizar examen ${id}:`, response);
      return response;
    } catch (error) {
      console.error(`[examService] Error al actualizar el examen ${id}:`, error.message, {
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },
  
  // Eliminar un examen
  deleteExam: async (id) => {
    try {
      console.log(`[examService] Eliminando examen con ID: ${id}`);
      const response = await api.delete(`/api/examenes/${id}`);
      console.log(`[examService] Respuesta al eliminar examen ${id}:`, response);
      return response;
    } catch (error) {
      console.error(`[examService] Error al eliminar el examen ${id}:`, error.message, {
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },
  
  // Obtener preguntas de un examen
  getExamQuestions: async (examId) => {
    try {
      console.log(`[examService] Solicitando preguntas para el examen: ${examId}`);
      const response = await api.get(`/api/examenes/${examId}/preguntas`);
      console.log(`[examService] Preguntas recibidas para el examen ${examId}:`, response);
      return response;
    } catch (error) {
      console.error(`[examService] Error al obtener preguntas del examen ${examId}:`, error.message, {
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },
  
  // Agregar pregunta a un examen
  addQuestionToExam: async (examId, questionData) => {
    try {
      console.log(`[examService] Agregando pregunta al examen ${examId}:`, questionData);
      const response = await api.post(`/api/examenes/${examId}/preguntas`, questionData);
      console.log(`[examService] Respuesta al agregar pregunta al examen ${examId}:`, response);
      return response;
    } catch (error) {
      console.error(`[examService] Error al agregar pregunta al examen ${examId}:`, error.message, {
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },
  
  // Eliminar pregunta de un examen
  removeQuestionFromExam: async (examId, questionId) => {
    try {
      console.log(`[examService] Eliminando pregunta ${questionId} del examen ${examId}`);
      const response = await api.delete(`/api/examenes/${examId}/preguntas/${questionId}`);
      console.log(`[examService] Respuesta al eliminar pregunta ${questionId} del examen ${examId}:`, response);
      return response;
    } catch (error) {
      console.error(
        `[examService] Error al eliminar la pregunta ${questionId} del examen ${examId}:`,
        error.message,
        {
          response: error.response?.data,
          status: error.response?.status
        }
      );
      throw error;
    }
  }
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
