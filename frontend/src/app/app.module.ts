import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Angular Material
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';

import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TasksPageComponent } from './pages/tasks-page/tasks-page.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SettingsComponent } from './pages/settings/settings.component';

import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';
import { AuthInterceptor } from './interceptors/auth.interceptor';

// Task-related components
import { TaskListComponent } from './components/task-list/task-list.component';

// Services
import { AuthService } from './services/auth.service';
import { TaskService } from './services/task.service';

const routes: Routes = [
  // Default route - redirect to dashboard if authenticated, otherwise login
  { 
    path: '', 
    redirectTo: '/dashboard', 
    pathMatch: 'full'
  },
  
  // Public routes (only accessible when NOT logged in)
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [NoAuthGuard]
  },
  { 
    path: 'register', 
    component: RegisterComponent,
    canActivate: [NoAuthGuard]
  },
  
  // Protected routes with shared layout
  { 
    path: '', 
    component: DashboardComponent, // This is the shell with the menu
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: TaskListComponent
      },
      {
        path: 'tasks',
        component: TasksPageComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'settings',
        component: SettingsComponent
      }
    ]
  },
  
  // Catch-all route - redirect to dashboard (which will enforce login if needed)
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    TaskListComponent,
    TasksPageComponent,
    ProfileComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    // Material Modules
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatDividerModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    AuthService,
    TaskService,
    AuthGuard,
    NoAuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }