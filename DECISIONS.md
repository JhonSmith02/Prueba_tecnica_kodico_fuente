# Arquitectura y Decisiones Técnicas - Kódigo Ofertas

Este documento detalla las decisiones arquitectónicas, patrones de diseño y herramientas seleccionadas para el desarrollo del módulo de separatas (ofertas), asegurando escalabilidad, rendimiento y una excelente experiencia tanto para el usuario final como para el equipo de desarrollo.

## 1. Arquitectura y Patrones de Diseño

El requerimiento más crítico de la prueba exigía que el sistema estuviera preparado para añadir nuevos tipos de promociones (como "2x1" o "Precio por Volumen") sin modificar la lógica central del proceso de venta.

* **Patrón Strategy (Motor de Promociones):** Se implementó el patrón *Strategy* mediante una interfaz `DiscountStrategy` y una fábrica `DiscountFactory`. Los controladores y servicios de productos desconocen la lógica matemática de los descuentos; simplemente delegan el cálculo a la fábrica. 
* **Diseño Orientado al Futuro (Future-Proofing):** La interfaz base se diseñó para recibir no solo el precio base y el valor del descuento, sino también la cantidad (`quantity`). Aunque los descuentos actuales (Directo y Porcentaje) asumen cantidad 1 al listar el catálogo, esta firma ya está preparada para procesar promociones complejas como "Lleve 3, pague 2" en un futuro módulo de carrito de compras, garantizando el cumplimiento del **Principio Open/Closed (SOLID)**.

## 2. Backend & Base de Datos (Node.js + Express + PostgreSQL)

* **TypeScript y ESM:** Se configuró el backend utilizando *ECMAScript Modules* nativos (`type: "module"`) junto con TypeScript para garantizar tipado estricto y el uso de los estándares más modernos de JavaScript.
* **Prisma ORM:** Se eligió Prisma por encima de TypeORM o Sequelize debido a su inmejorable integración con TypeScript y su capacidad de generar un cliente fuertemente tipado. Esto reduce drásticamente los errores en tiempo de ejecución.
* **PostgreSQL:** Dado que estamos manejando transacciones, cruce de fechas y un modelo relacional estricto entre Productos y Ofertas (relación muchos a muchos), PostgreSQL es la opción más robusta y confiable a nivel empresarial.
* **Validación de Negocio (Traslapes):** La lógica de validación para evitar que un producto tenga dos ofertas activas simultáneas se manejó a nivel de capa de servicio interceptando las fechas y consultando directamente la base de datos antes de permitir la inserción.

## 3. Frontend (React + Vite + Tailwind CSS v4)

* **Vite & React:** Se descartó Create React App en favor de Vite para mejorar significativamente los tiempos de compilación (HMR) y reducir el peso del bundle final.
* **Tailwind CSS v4:** Se utilizó la versión más reciente de Tailwind integrada directamente como plugin en Vite. Esto elimina la necesidad de archivos de configuración pesados, optimizando la DX (Developer Experience).
* **Diseño Orientado a Dominio (POS):** Sabiendo que el producto core está enfocado en software de puntos de venta (POS) para minimercados, la interfaz no se diseñó como un e-commerce tradicional, sino como un **Panel Administrativo (Back-office)** con una UI limpia, funcional y orientada a la productividad del administrador.

## 4. DevOps, CI/CD y Despliegue

La infraestructura se diseñó para ser fácilmente replicable en cualquier entorno.

* **Docker Compose y Healthchecks:** Se orquestaron 3 servicios (Base de Datos, Backend, Frontend). Para evitar condiciones de carrera (Race Conditions) donde el backend intenta conectarse a una BD que aún está arrancando, se implementó un `healthcheck` estricto en PostgreSQL.
* **Database Seeding:** Para mejorar la experiencia de revisión de la prueba, se configuró un sembrado automático (`npx prisma db seed`). Al levantar los contenedores, el sistema inyecta un catálogo de hardware POS base, permitiendo al evaluador probar la creación de ofertas inmediatamente sin tener que ingresar datos manualmente.
* **Frontend Multi-stage Build (Nginx):** El contenedor del Frontend no ejecuta el servidor de desarrollo de Vite. En su lugar, utiliza un *Multi-stage build* que compila el proyecto y sirve los estáticos a través de Nginx, siguiendo las mejores prácticas para entornos de producción.
* **GitHub Actions:** Se configuró un pipeline de Integración y Entrega Continua (CI/CD) que automatiza:
  1. Ejecución del Linter (`eslint`).
  2. Ejecución de Tests Unitarios (`jest`) sobre el Patrón Strategy.
  3. Construcción de imágenes Docker y publicación en el GitHub Container Registry (GHCR).