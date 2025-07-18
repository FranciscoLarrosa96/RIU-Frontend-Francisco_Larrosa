# 🦸‍♂️ Hero Management SPA

Aplicación de mantenimiento de superhéroes desarrollada como prueba técnica para Mindata.

## 🛠️ Tech Stack

- **Angular 20** + **Standalone Components** + **Zone-less**
- **Signals API** para manejo de estado reactivo
- **Tailwind CSS** para estilos modernos y responsivos
- **Angular Material** para UI components
- **RxJS** con `signals`, `computed`, `effect` y `tap`
- **Docker** + **Nginx** para distribución en producción

---

## 🔍 Funcionalidades

- **CRUD completo** de superhéroes
- Filtros por nombre, alias y universo
- **Visualización responsive** adaptada a desktop y mobile
- **Formulario de edición con validaciones**
- Componentes desacoplados y reutilizables
- **Tests unitarios** con alta cobertura
- **Interceptor HTTP** para simular delays en servicios
- **Directiva personalizada** `appUppercase`
- **Skeleton Loaders** al guardar cambios

---

## 🚀 Cómo levantar el proyecto

### 📦 Instalación local

```bash
npm install
npm start
```

--- 
### 🐳 Docker 
```
docker build -t heroes-app .
docker run -d -p 4200:80 heroes-app
```
---
### 🧪 Tests

```
ng test --code-coverage
```
### 📁 Estructura principal

```
📦 src/
├── app/
│   ├── core/               # Servicios
│   ├── shared/             # Componentes reutilizables, interfaces y directivas
│   ├── pages/              # Vistas: listado, detalles
│   ├── components/         # Componentes standalone (confirm-dialog, heroe-dialog)
│   └── app.config.ts       # App configuration
```
---
### 📌 Notas

```
El backend fue simulado con archivo local (assets/heroes.json)

Se utiliza MatDialog para formularios de alta/edición

Estilos definidos por Tailwind con una paleta custom (main, secondary, etc.)
```

