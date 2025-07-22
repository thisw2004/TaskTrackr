# TaskTrackr - Package Diagram (Textueel)

## **ROOT PACKAGE**
- TaskTrackr Application (hoofdapplicatie)

## **HOOFDPACKAGES**

### **1. FRONTEND PACKAGE (Angular Client)**
**Technologies:** Angular 15, Angular Material, TypeScript, RxJS, Service Worker (PWA), Web Push

#### **Sub-packages Frontend:**
- **PAGES**
  - login
  - dashboard
  - tasks
  - profile
  - settings
  - api-docs

- **COMPONENTS**
  - sidebar
  - task-dialog
  - task-list
  - reset-password

- **SERVICES**
  - auth
  - notification
  - special-day
  - deadline

- **MODELS**
  - User
  - Task

- **GUARDS & UTILS**
  - auth guard
  - no-auth guard

- **INTERCEPTORS**
  - auth interceptor

- **STYLES**
  - theme
  - scss
  - css

### **2. BACKEND PACKAGE (Node.js/Express)**
**Technologies:** Express.js, MongoDB/Mongoose, JWT Authentication, bcryptjs, node-cron, Swagger (API Docs)

#### **Sub-packages Backend:**
- **ROUTES**
  - auth
  - api
  - tasks

- **CONTROLLERS**
  - auth
  - task
  - notification

- **MIDDLEWARE**
  - auth

- **SERVICES**
  - holiday
  - reminder

- **CONFIG**
  - db.js
  - config

### **3. SHARED/CONFIG PACKAGE**
- package.json
- tsconfig.json
- README.md
- deployment-diagram.md

## **EXTERNAL DEPENDENCIES**

### **Frontend Dependencies:**
- @angular/core, @angular/material, @angular/cdk
- @angular/service-worker (PWA)
- rxjs, zone.js, tslib
- web-push, crypto

### **Backend Dependencies:**
- express, mongoose, cors, dotenv
- jsonwebtoken, bcryptjs
- node-cron, nodemailer, node-fetch
- swagger-jsdoc, swagger-ui-express

### **Dev Dependencies:**
- nodemon, ajv

## **DATA FLOW**
- Frontend (Angular) ←→ HTTP/API ←→ Backend (Express) ←→ Database (MongoDB)
- [User Interface] → [Services] → [HTTP Interceptor] → [API Routes]
- [Guards] → [Components] → [Models] → [Controllers] → [Database Models]

## **KEY FEATURES**
- Task Management (CRUD operations)
- User Authentication & Authorization (JWT)
- Push Notifications & Reminders
- Holiday Service Integration
- Progressive Web App (PWA) capabilities
- API Documentation (Swagger)
- Responsive Material Design UI
- Real-time deadline tracking
- Email notifications
---

## **ARCHITECTUUR OVERZICHT**

### **Frontend Package (Angular)**
- **Pages**: Login, Dashboard, Tasks, Profile, Settings, API Documentation
- **Components**: Sidebar, Task dialogs, Task lists, Form components
- **Services**: Authentication, Notifications, Special days, Deadlines
- **Guards**: Route protection (auth.guard, no-auth.guard)
- **Interceptors**: HTTP request/response handling
- **Models**: TypeScript interfaces voor User en Task

### **Backend Package (Node.js/Express)**
- **Controllers**: Business logic voor auth, tasks, notifications
- **Routes**: API endpoints definitie
- **Models**: Database schemas (Mongoose)
- **Middleware**: Authentication middleware
- **Services**: Holiday service, Reminder service
- **Config**: Database en applicatie configuratie

### **Shared/Configuration**
- **Root level configuratie**: package.json, tsconfig.json
- **Documentatie**: README.md, deployment diagram
- **Scripts**: Build en start scripts

Dit diagram toont de modulaire opbouw van je TaskTrackr applicatie met duidelijke scheiding van verantwoordelijkheden tussen frontend en backend componenten.

---

# TaskTrackr - Klasse Diagram (Textueel)

## **DOMAIN MODELS**

### **User (Backend Model)**
**Attributes:**
- _id: ObjectId
- name: String (required, max: 50)
- email: String (required, unique, lowercase)
- password: String (required, min: 8, select: false)
- isVerified: Boolean (default: false)
- preferences: Object
  - darkMode: Boolean (default: false)
  - emailNotifications: Boolean (default: true)
- resetPasswordToken: String
- resetPasswordExpire: Date
- verificationToken: String
- resetToken: String
- resetTokenExpiry: Date
- createdAt: Date (default: Date.now)
- updatedAt: Date

**Methods:**
- matchPassword(password): Boolean
- getSignedJwtToken(): String
- getResetPasswordToken(): String
- save(): Promise<User>
- findOne(query): Promise<User>
- create(userData): Promise<User>

### **Task (Backend Model)**
**Attributes:**
- _id: ObjectId
- user: ObjectId (ref: 'User', required)
- title: String (required, max: 100)
- description: String (max: 1000)
- deadline: Date (required)
- isCompleted: Boolean (default: false)
- priority: String (enum: low/medium/high)
- category: String (default: 'general')
- tags: Array[String]
- reminderSent: Boolean (default: false)
- createdAt: Date (default: Date.now)
- completedAt: Date

**Methods:**
- save(): Promise<Task>
- find(query): Promise<Task[]>
- findById(id): Promise<Task>
- findByIdAndUpdate(id, data): Promise<Task>
- findByIdAndDelete(id): Promise<Task>
- create(taskData): Promise<Task>

## **FRONTEND INTERFACES**

### **User (Frontend Interface)**
**Properties:**
- _id: string
- name: string
- email: string
- token: string
- createdAt: string

### **Task (Frontend Interface)**
**Properties:**
- id?: string
- title: string
- description?: string
- priority: 'low' | 'medium' | 'high'
- completed: boolean
- dueDate?: Date | null
- createdAt?: Date
- userId?: string

### **AuthResponse (Frontend Interface)**
**Properties:**
- success: boolean
- token: string
- user: User
- message?: string

### **Holiday (Frontend Interface)**
**Properties:**
- date: Date
- name: string
- country: string
- type: string

## **FRONTEND COMPONENT CLASSES**

### **TaskListComponent**
**Properties:**
- tasks: Task[]
- loading: boolean
- selectedTask: Task | null

**Methods:**
- ngOnInit(): void
- loadTasks(): void
- onTaskSelect(task: Task): void
- onTaskDelete(taskId: string): void
- onTaskComplete(taskId: string): void

### **TaskDialogComponent**
**Properties:**
- task: Task
- isEditMode: boolean
- dialogRef: MatDialogRef

**Methods:**
- ngOnInit(): void
- onSave(): void
- onCancel(): void
- validateForm(): boolean

### **SidebarComponent**
**Properties:**
- currentUser: User | null
- isMenuOpen: boolean

**Methods:**
- ngOnInit(): void
- toggleMenu(): void
- logout(): void
- navigateTo(route: string): void

## **CONTROLLER CLASSES**

### **AuthController**
**Methods:**
- register(req, res): Promise<Response>
- login(req, res): Promise<Response>
- logout(req, res): Promise<Response>
- getMe(req, res): Promise<Response>
- updateDetails(req, res): Promise<Response>
- updatePassword(req, res): Promise<Response>
- forgotPassword(req, res): Promise<Response>
- resetPassword(req, res): Promise<Response>
- verifyEmail(req, res): Promise<Response>

### **TaskController**
**Methods:**
- createTask(req, res): Promise<Response>
- getTasks(req, res): Promise<Response>
- getTask(req, res): Promise<Response>
- updateTask(req, res): Promise<Response>
- deleteTask(req, res): Promise<Response>
- getTaskStats(req, res): Promise<Response>
- getTasksByDate(req, res): Promise<Response>
- markComplete(req, res): Promise<Response>
- bulkDelete(req, res): Promise<Response>

## **SERVICE CLASSES**

### **AuthService (Frontend)**
**Properties:**
- currentUser$: BehaviorSubject<User | null>
- isAuthenticated$: Observable<boolean>

**Methods:**
- login(credentials): Observable<AuthResponse>
- register(userData): Observable<AuthResponse>
- logout(): void
- getCurrentUser(): User | null
- isAuthenticated(): boolean
- getToken(): string | null
- refreshToken(): Observable<AuthResponse>

### **DeadlineService (Frontend)**
**Properties:**
- upcomingDeadlines$: Observable<Task[]>

**Methods:**
- getUpcomingDeadlines(): Observable<Task[]>
- checkOverdueTasks(): Observable<Task[]>
- calculateDaysUntilDeadline(task: Task): number
- isTaskOverdue(task: Task): boolean

### **TaskService (Frontend)**
**Properties:**
- tasks$: BehaviorSubject<Task[]>
- selectedTask$: BehaviorSubject<Task | null>

**Methods:**
- getAllTasks(): Observable<Task[]>
- getTaskById(id: string): Observable<Task>
- createTask(task: Task): Observable<Task>
- updateTask(id: string, task: Partial<Task>): Observable<Task>
- deleteTask(id: string): Observable<void>
- markTaskComplete(id: string): Observable<Task>
- getTasksByPriority(priority: string): Observable<Task[]>
- searchTasks(query: string): Observable<Task[]>

### **NotificationService (Frontend)**
**Methods:**
- requestPermission(): Promise<boolean>
- scheduleNotification(task): void
- showNotification(title, options): void
- cancelNotification(taskId): void

### **SpecialDayService (Frontend)**
**Methods:**
- getSpecialDays(): Observable<Holiday[]>
- isSpecialDay(date: Date): boolean
- getUpcomingSpecialDays(): Observable<Holiday[]>
- formatSpecialDay(holiday: Holiday): string

### **HolidayService (Backend)**
**Methods:**
- getHolidays(year, country): Promise<Holiday[]>
- isHoliday(date, country): Promise<boolean>
- getUpcomingHolidays(): Promise<Holiday[]>

## **MIDDLEWARE CLASSES**

### **AuthMiddleware (Backend)**
**Methods:**
- protect(req, res, next): Promise<void>
- authorize(...roles): Function
- verifyToken(token: string): Promise<User>
- extractTokenFromHeader(req): string | null

## **GUARD CLASSES**

### **AuthGuard (Frontend)**
**Methods:**
- canActivate(route, state): Observable<boolean>
- canActivateChild(route, state): Observable<boolean>
- checkAuthentication(): boolean
- redirectToLogin(): void

### **NoAuthGuard (Frontend)**
**Methods:**
- canActivate(route, state): Observable<boolean>
- checkAuthentication(): boolean
- redirectToDashboard(): void

## **RELATIONSHIPS**

### **Domain Model Relationships:**
- **User → Task**: 1:n (Een gebruiker heeft vele taken)
- **User → Notification**: 1:n (Een gebruiker ontvangt vele notificaties)
- **Task → Reminder**: 1:1 (Een taak heeft één reminder)
- **Task → Category**: n:1 (Vele taken behoren tot één categorie)
- **Task → Tag**: n:n (Een taak kan vele tags hebben, een tag kan bij vele taken horen)
- **User → Preferences**: 1:1 (Een gebruiker heeft één voorkeuren object)

### **Controller-Model Relationships:**
- **AuthController → User**: 1:n (Controller beheert vele gebruikers)
- **TaskController → Task**: 1:n (Controller beheert vele taken)
- **TaskController → User**: n:1 (Controller authenticeert tegen één gebruiker per request)

### **Service Relationships:**
- **AuthService → AuthController**: 1:1 (Service communiceert met één controller)
- **NotificationService → Task**: 1:n (Service monitort vele taken)
- **ReminderService → Task**: 1:n (Service volgt vele taken)
- **HolidayService → Task**: n:n (Service controleert deadlines van vele taken tegen vele feestdagen)

### **Frontend-Backend Relationships:**
- **Frontend User Interface → Backend API**: n:1 (Vele UI componenten gebruiken één API)
- **Angular Components → Angular Services**: n:n (Componenten kunnen vele services gebruiken)
- **Guards → Routes**: 1:n (Een guard kan vele routes beschermen)
- **Interceptor → HTTP Requests**: 1:n (Één interceptor verwerkt alle HTTP requests)

## **AUTHENTICATION FLOW**
1. User → AuthService.login() → AuthController.login()
2. AuthController → User.findOne() → Database
3. User.matchPassword() → Boolean
4. User.getSignedJwtToken() → JWT Token
5. AuthController → AuthService → User Interface
6. AuthInterceptor → Adds JWT to HTTP Headers

## **TASK MANAGEMENT FLOW**
1. User → TaskService.createTask() → TaskController.createTask()
2. TaskController → Task.create() → Database
3. ReminderService.scheduleReminder() → Background Job
4. NotificationService.scheduleNotification() → Browser API
5. TaskController → TaskService → Task Interface
