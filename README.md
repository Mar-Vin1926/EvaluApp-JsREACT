EvaluApp es una aplicación web desarrollada con React y Vite que permite gestionar exámenes, estudiantes y resultados de manera eficiente. Este proyecto está diseñado para ser modular, rápido y fácil de usar.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

- [Node.js](https://nodejs.org/) (versión 16 o superior). Si no lo tienes instalado, descárgalo e instálalo desde el enlace proporcionado.
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/). npm viene incluido con Node.js, pero si prefieres usar yarn, puedes instalarlo ejecutando:
  ```bash
  npm install -g yarn
  ```

## Instalación

1. Clona este repositorio en tu máquina local:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   ```

2. Navega al directorio del proyecto:
   ```bash
   cd EvaluApp-JsREACT
   ```

3. Instala las dependencias:
   ```bash
   npm install
   ```

## Ejecución en Desarrollo

Para iniciar el servidor de desarrollo, ejecuta:
```bash
npm run dev
```
Esto abrirá la aplicación en tu navegador en `http://localhost:5173`.


## Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

```
EvaluApp-JsREACT/
├── public/               # Recursos estáticos
├── src/                  # Código fuente
│   ├── assets/           # Recursos como imágenes y SVG
│   ├── components/       # Componentes reutilizables
│   │   ├── auth/         # Componentes relacionados con autenticación
│   │   ├── exams/        # Componentes relacionados con exámenes
│   │   ├── forms/        # Formularios
│   │   └── layout/       # Componentes de diseño
│   ├── context/          # Manejo de estado global con Context API
│   ├── pages/            # Páginas principales de la aplicación
│   └── services/         # Lógica de API
├── package.json          # Dependencias y scripts
├── vite.config.js        # Configuración de Vite
└── README.md             # Documentación del proyecto
```




