# Arista Trinkets — Jewellery E-Commerce Platform

A production-ready e-commerce web application for **Arista Trinkets Jewellery**.

## Technology Stack

- **Runtime**: Node.js 24 LTS (`v24.13.1`)
- **Package Manager**: npm 11.x (`11.8.0`)
- **Backend API**: Node.js + Express + TypeScript (`backend/`)
- **Database**: MySQL 8.0+ (`arista_trinkets_db`)
- **Frontend Customer & Admin**: Angular 22 (`frontend/`)
- **Design Tokens & System**: Client Brand Board Palette (`frontend/styles/tokens.css`)

## Project Structure

```
arista trinkets/
├── .nvmrc                   # Node.js 24 LTS runtime specifier
├── README.md                # Project documentation
├── backend/                 # Node.js Express TypeScript REST API
│   ├── src/
│   │   ├── config/          # MySQL pool configuration
│   │   ├── middlewares/     # JWT Auth, Validation, Global Error Handler
│   │   ├── utils/           # ApiResponse & Logger
│   │   ├── routes/          # Express REST API routes
│   │   ├── app.ts           # Express application
│   │   └── server.ts        # Server entry point
│   ├── package.json         # Node 24 dependencies
│   └── tsconfig.json        # ES2024 compiler options
├── frontend/                # Angular 22 frontend applications
│   └── styles/              # tokens.css (Client Brand Board colors & typography)
└── documentation/           # System & Technical Documentation
    ├── ARCHITECTURE.md      # System architecture & stack specification
    ├── DATABASE_SCHEMA.sql  # MySQL 8.0 DDL script & seed data
    ├── DATABASE_SCHEMA.md   # Data dictionary & ER diagram spec
    ├── API_SPECIFICATION.md # REST API endpoint documentation
    ├── WEBSITE_AUDIT.md     # Reference website audit report
    └── CHANGELOG.md         # Master project history
```

## Getting Started

### Backend Setup
```bash
cd backend
npm install
npm run build
npm start
```

Health check endpoint: `http://localhost:5000/api/v1/health`
