# FIMEX CAPITAL — Panel Administrativo

Sistema interno de gestión para **Fimex Capital SOFOM E.N.R.**

## Módulos

| Módulo | Descripción |
|--------|-------------|
| **Dashboard** | Métricas generales, actividad reciente, accesos rápidos |
| **Simulador** | Tabla de amortización (sistema francés), configurable con comisiones e IVA |
| **Clientes** | CRUD de acreditados (PF, PFAE, PM) con búsqueda y filtros |
| **Documentos** | Generador de PDF con tablas de amortización profesionales |

## Stack Tecnológico

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** (paleta institucional Fimex Capital)
- **JWT** para autenticación
- **jsPDF + jspdf-autotable** para generación de documentos
- **Vercel** para deployment

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU-USUARIO/fimex-admin.git
cd fimex-admin

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Edita .env.local con tus credenciales

# 4. Iniciar en desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) para ver el panel.

## Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `JWT_SECRET` | Secret para firmar tokens JWT | (obligatorio en producción) |
| `ADMIN_USER` | Usuario de login | `admin` |
| `ADMIN_PASSWORD` | Contraseña de login | `FimexCapital2026!` |

## Deploy en Vercel

1. Sube el repo a GitHub
2. Importa el proyecto en [vercel.com](https://vercel.com)
3. Configura las variables de entorno en Vercel → Settings → Environment Variables
4. Deploy automático en cada push

## Credenciales por defecto

```
Usuario: admin
Contraseña: FimexCapital2026!
```

> ⚠️ Cambia estas credenciales inmediatamente en producción vía variables de entorno.

## Estructura del Proyecto

```
src/
├── app/
│   ├── api/auth/         # API de autenticación (JWT)
│   ├── dashboard/        # Dashboard con métricas
│   ├── simulador/        # Simulador de amortización
│   ├── clientes/         # Gestión de clientes
│   ├── documentos/       # Generador de PDF
│   ├── login/            # Pantalla de login
│   └── layout.tsx        # Root layout
├── components/
│   ├── layout/           # Sidebar, AdminLayout
│   └── ui/               # FimexLogo, componentes reutilizables
├── lib/
│   ├── auth.ts           # Utilidades JWT
│   └── amortizacion.ts   # Motor de cálculo financiero
└── types/
    └── index.ts          # Tipos TypeScript
```

---

**FIMEX CAPITAL** — SOFOM E.N.R.
