# Yape Challenge Backend

Este proyecto es una implementación del backend para el Yape Challenge utilizando NestJS y una arquitectura de microservicios.

## 🏗️ Estructura del Proyecto

El proyecto está organizado en dos microservicios principales:

- **transactions**: Servicio para manejar las transacciones
- **antifrauds**: Servicio para la detección de fraudes

## 🚀 Tecnologías Principales

- NestJS
- Prisma (ORM)
- Kafka (Mensajería)
- PostgreSQL (Base de datos)
- Docker

## 📋 Pre-requisitos

- Node.js (versión recomendada: 18.x o superior)
- Docker y Docker Compose
- NPM o Yarn

## 🛠️ Instalación

1. Clonar el repositorio:

```bash
git clone [url-del-repositorio]
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar las variables de entorno:

```bash
cp .env.example .env
```

4. Iniciar los servicios con Docker:

```bash
docker-compose up -d
```

## 🏃‍♂️ Ejecución

Para ejecutar el proyecto en modo desarrollo:

```bash
# Ejecutar el servicio de transacciones
npx nx serve transactions

# Ejecutar el servicio antifraude
npx nx serve antifrauds
```

## 🏗️ Construcción

Para crear una versión de producción:

```bash
npx nx build transactions
npx nx build antifrauds
```

## 📝 Scripts Disponibles

- `npx nx serve [app]`: Inicia el servidor de desarrollo
- `npx nx build [app]`: Construye la aplicación para producción
- `npx nx test [app]`: Ejecuta las pruebas
- `npx nx lint [app]`: Ejecuta el linter

## 📚 Documentación

La documentación de la API está disponible en:

- Swagger UI: `http://localhost:3000/api` (cuando el servidor está en ejecución)
