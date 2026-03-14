
# 🐾 PetRadar API

PetRadar es una API REST desarrollada con **NestJS** que permite registrar **mascotas perdidas** y **mascotas encontradas**.
Cuando se registra una mascota encontrada, el sistema busca automáticamente mascotas perdidas dentro de un radio de **500 metros** usando **PostGIS** y envía una notificación por correo electrónico.

---

# 🚀 Tecnologías utilizadas

- 🧠 NestJS
- 🔷 TypeScript
- 🐘 PostgreSQL
- 🌍 PostGIS
- 🗂 TypeORM
- ✉️ Nodemailer
- 🐳 Docker
- 🗺 Mapbox Static API

---

# ⚙️ Funcionalidad principal

El sistema permite:

1️⃣ Registrar una mascota perdida  
2️⃣ Registrar una mascota encontrada  
3️⃣ Buscar coincidencias geográficas en un radio de **500 metros**  
4️⃣ Enviar una notificación por correo cuando se detecta una posible coincidencia  

La búsqueda espacial se realiza usando **PostGIS**:

```
ST_DWithin(location::geography, point::geography, 500)
```

Esto permite calcular la distancia **en metros** entre dos coordenadas.

---

# 🗄 Estructura de la base de datos

## 🐶 Tabla: lost_pets

Mascotas reportadas como perdidas.

Campos principales:

- name
- species
- breed
- color
- size
- description
- photo_url
- owner_name
- owner_email
- owner_phone
- location (geometry Point)
- address
- lost_date
- is_active

---

## 🐕 Tabla: found_pets

Mascotas reportadas como encontradas.

Campos principales:

- species
- breed
- color
- size
- description
- photo_url
- finder_name
- finder_email
- finder_phone
- location (geometry Point)
- address
- found_date

---

# 🔌 Endpoints

## 🐾 Registrar mascota perdida

```
POST /lost-pets
```

Ejemplo:

```json
{
  "name": "Max",
  "species": "perro",
  "breed": "labrador",
  "color": "negro",
  "size": "grande",
  "description": "Trae collar rojo",
  "photo_url": "https://images.unsplash.com/photo-1601758228041-f3b2795255f1",
  "owner_name": "Juan",
  "owner_email": "juan@example.com",
  "owner_phone": "4771234567",
  "lat": 21.1214,
  "lng": -101.6823,
  "address": "León, Guanajuato",
  "lost_date": "2026-03-13T12:00:00.000Z"
}
```

---

## 🔎 Registrar mascota encontrada

```
POST /found-pets
```

Ejemplo:

```json
{
  "species": "perro",
  "breed": "labrador",
  "color": "negro",
  "size": "grande",
  "description": "Muy tranquilo, trae collar rojo",
  "photo_url": "https://images.unsplash.com/photo-1601758228041-f3b2795255f1",
  "finder_name": "Carlos",
  "finder_email": "carlos@example.com",
  "finder_phone": "4778889999",
  "lat": 21.1215,
  "lng": -101.6824,
  "address": "León, Guanajuato",
  "found_date": "2026-03-13T16:00:00.000Z"
}
```

---

# 🔄 Flujo del sistema

```
Registrar mascota encontrada
        ↓
Guardar registro en found_pets
        ↓
Buscar mascotas perdidas activas con ST_DWithin
        ↓
Calcular distancia con ST_Distance
        ↓
Enviar correo con posible coincidencia
```

📧 El correo incluye:

- Datos de la mascota encontrada
- Datos de contacto de quien la encontró
- Distancia aproximada
- Mapa generado con Mapbox mostrando ambas ubicaciones

---

# 🔑 Variables de entorno

Crear un archivo `.env` en la raíz del proyecto.

Ejemplo:

```
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=petradar

MAILER_EMAIL=your_email@gmail.com
MAILER_PASSWORD=your_app_password
MAILER_SERVICE=gmail

MAIL_TO=notifications@example.com

MAPBOX_TOKEN=your_mapbox_token
```

---

# 🛠 Instalación

Clonar repositorio

```
git clone https://github.com/tuusuario/petradar.git
cd petradar
```

Instalar dependencias

```
npm install
```

---

# 🐳 Base de datos

Levantar contenedor de PostgreSQL + PostGIS

```
docker compose up -d
```

Ejecutar migraciones

```
npm run migration:run
```

---

# ▶️ Ejecutar API

Modo desarrollo

```
npm run start:dev
```

La API correrá en:

```
http://localhost:3000
```

---

# 👨‍💻 Autor
Christian Axel Moreno Flores
Proyecto desarrollado como práctica académica utilizando NestJS, PostgreSQL/PostGIS y Mapbox.