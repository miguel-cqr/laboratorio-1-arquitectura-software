# Laboratorio N.º 1 — Introducción a Spring Boot

Aplicación web desarrollada para el Laboratorio N.º 1 de Arquitectura de Software. El proyecto permite gestionar información de clientes y realizar operaciones bancarias mediante la integración de un backend desarrollado con Spring Boot y un frontend desarrollado con React.

## Funcionalidades

La aplicación permite:

* Consultar los clientes registrados.
* Consultar la información de las cuentas.
* Realizar transferencias de dinero entre cuentas.
* Consultar el histórico de transacciones por cliente.
* Visualizar un panel principal con información general del sistema.

## Tecnologías utilizadas

### Backend

* Java
* Spring Boot
* Spring Data JPA
* Maven
* API REST

### Frontend

* React
* TypeScript
* Vite
* Axios
* Tailwind CSS

## Estructura del proyecto

```text
laboratorio-1-arquitectura/
├── backend/
│   └── Aplicación Spring Boot
│
├── frontend/
│   └── Aplicación React
│
├── .gitignore
└── README.md
```

## Ejecución del backend

Ingresar a la carpeta del backend:

```bash
cd backend
```

Ejecutar la aplicación mediante Maven:

```bash
./mvnw spring-boot:run
```

En Windows también puede utilizarse:

```bash
mvnw.cmd spring-boot:run
```

El backend se ejecuta en:

```text
http://localhost:8088
```

## Ejecución del frontend

Ingresar a la carpeta del frontend:

```bash
cd frontend
```

Instalar las dependencias:

```bash
npm install
```

Ejecutar la aplicación:

```bash
npm run dev
```

El frontend se ejecuta en:

```text
http://localhost:3000
```

## Comunicación entre frontend y backend

El frontend consume los servicios REST proporcionados por el backend mediante Axios.

La URL base utilizada por el frontend es:

```text
http://localhost:8088
```

Las principales rutas utilizadas son:

```text
GET  /api/customers
GET  /api/customers/{id}
POST /api/customers

POST /api/transactions
GET  /api/transactions/{accountNumber}
```

## Integración

La aplicación está organizada siguiendo una arquitectura cliente-servidor. El frontend se encarga de la interfaz y la interacción con el usuario, mientras que el backend gestiona las operaciones relacionadas con clientes, cuentas y transacciones.

La comunicación entre ambos componentes se realiza mediante solicitudes HTTP utilizando una API REST.

## Proyecto académico

Proyecto desarrollado como parte del Laboratorio N.º 1 de Arquitectura de Software.
