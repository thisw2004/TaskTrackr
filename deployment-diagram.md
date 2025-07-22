# TaskTrackr Deployment Diagram - Basis

## Drie Hoofd Componenten

### 1. Server (Express.js/Node.js)
**Web Server**
- Express.js server draait op poort 3000
- Node.js runtime environment
- Hosting: Cloud server (Heroku, Railway) of lokaal
- Functies: REST API, authenticatie, middleware

### 2. Applicatie (Frontend)
**Angular Client**
- Poort: 4200 (development) / 80/443 (productie)
- Technologie: Angular 15+ met TypeScript
- Draait in browser (client-side)
- Communiceert met Express server via HTTP

### 3. Database Layer (MongoDB + Mongoose)
**Data Storage & Object Document Mapping**
- MongoDB Server: Poort 27017
- Mongoose ODM: Schema definitie, validatie, middleware
- Collections: Users, Tasks
- Data modeling: Mongoose schemas met TypeScript interfaces


## Deployment Structuur

```
SERVER (Express.js)
├── REST API Routes
├── Controllers
├── Middleware
├── Authentication (JWT)
└── Mongoose ODM Layer

APPLICATIE (Angular)
├── Components
├── Services  
├── Guards
└── HTTP Client

DATABASE LAYER
├── Mongoose Schemas (Task, User)
├── Data Validation & Middleware
└── MongoDB Collections
```

## Communicatie

**Angular ←→ Express Server**
- HTTP/HTTPS requests (poort 4200 → poort 3000)
- REST API calls
- JSON data uitwisseling

**Express Server ←→ MongoDB**
- MongoDB connection (poort 3000 → poort 27017)
- Mongoose ODM: Schema-based data modeling
- Data validation en type casting
- CRUD operaties via Mongoose models


