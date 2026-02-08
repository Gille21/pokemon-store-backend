<p align="center">
  <img src="./public/image.png" width="100" alt="Pixel Pokeball" />
</p>

<p align="center"><strong>Pokémon Virtual Store - Backend API</strong></p>
<p align="center">Motor de servicios desarrollado en NestJS para la gestión de usuarios, autenticación y persistencia de carrito de compras mediante archivos JSON.</p>

<p align="center">
<a href="https://nestjs.com/" target="_blank"><img src="https://img.shields.io/badge/framework-NestJS-E0234E?style=flat&logo=nestjs" alt="NestJS" /></a>
<a href="https://www.typescriptlang.org/" target="_blank"><img src="https://img.shields.io/badge/language-TypeScript-blue?style=flat&logo=typescript" alt="TypeScript" /></a>
<a href="https://jwt.io/" target="_blank"><img src="https://img.shields.io/badge/auth-JWT-black?style=flat&logo=json-web-tokens" alt="JWT" /></a>
</p>

---
## Descripción
Este proyecto es el backend principal de la tienda virtual Pokémon. Ha sido diseñado bajo los estándares de una **Prueba Técnica para Ingeniero de Implementación**, priorizando la modularidad, el tipado fuerte y la eficiencia en el manejo de persistencia local sin depender de bases de datos externas.

## Tecnologías y Herramientas
- **Framework:** NestJS con arquitectura de módulos, controladores y servicios.
- **Lenguaje:** TypeScript para asegurar la integridad de los datos.
- **Seguridad:** Passport.js con estrategia JWT (JSON Web Tokens).
- **Criptografía:** Bcrypt para el manejo seguro de contraseñas.
- **Persistencia:** Sistema de archivos (Node FS) con formato JSON.

## ⚙️ Configuración del Proyecto

```bash
$ npm install
```

## Ejecución

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Arquitectura del Sistema
La lógica de negocio está dividida en módulos independientes para facilitar la escalabilidad:
- Auth Module: Registro de entrenadores y generación de tokens de acceso.
- Cart Module: Gestión lógica del carrito de compras con persistencia por usuario.
- Users Module: Manejo de perfiles y validación de existencia de usuarios.
- Database Service: Servicio transversal que centraliza la lectura/escritura en el archivo JSON.
