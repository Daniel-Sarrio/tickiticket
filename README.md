# 🎟️ TickiTicket v7

**TickiTicket v7** es una aplicación web orientada a la **visualización, búsqueda y compra de entradas para eventos deportivos**, principalmente partidos de fútbol.

El proyecto permite navegar por eventos destacados, consultar partidos, filtrar resultados, ver información detallada de cada evento y localizar estadios mediante mapas interactivos.

---

## 🧰 Stack tecnológico

| Área | Tecnología |
|---|---|
| Backend | PHP |
| Arquitectura | MVC por módulos |
| Base de datos | MySQL |
| Conexión DB | PDO |
| Frontend dinámico | JavaScript y jQuery |
| Estilos | Tailwind CDN y CSS propio |
| Carruseles | Swiper |
| Mapas | Leaflet y OpenStreetMap |
| Iconos | Material Symbols y Font Awesome |
| Entorno local | XAMPP |

---

## 🚀 Tecnologías utilizadas

- **Backend:** PHP
- **Arquitectura:** MVC por módulos
- **Base de datos:** MySQL
- **Gestión de BD:** phpMyAdmin
- **Conexión a BD:** PDO
- **Frontend:** HTML5, CSS3, JavaScript y jQuery
- **Estilos:** Tailwind CDN y CSS propio
- **Carruseles:** Swiper
- **Mapas:** Leaflet + OpenStreetMap
- **Iconos:** Material Symbols y Font Awesome
- **Servidor local:** XAMPP `(Apache + MySQL)`

---

## 🖥️ Funcionalidades principales

TickiTicket incluye diferentes funcionalidades pensadas para mejorar la experiencia del usuario a la hora de buscar y consultar eventos deportivos.

- Página principal con eventos destacados.
- Carruseles dinámicos.
- Listado general de eventos.
- Filtros de búsqueda.
- Ordenación de resultados.
- Paginación.
- Detalle completo de cada evento.
- Eventos relacionados.
- Mapas interactivos con Leaflet.
- Diseño moderno con temática deportiva.

---

## 📁 Estructura modular del proyecto

El sistema está organizado por módulos funcionales dentro de la carpeta `module/`, manteniendo una separación clara entre **controlador**, **modelo** y **vista**.

```text
module/
├── home/
│   ├── controller/
│   │   └── controller_home.php
│   ├── model/
│   │   ├── DAOHome.php
│   │   └── controller_home.js
│   └── view/
│       └── home.html
│
├── shop/
│   ├── controller/
│   │   └── controller_shop.php
│   ├── model/
│   │   ├── DAOShop.php
│   │   └── controller_shop.js
│   └── view/
│       ├── shop.html
│       └── shop.php
