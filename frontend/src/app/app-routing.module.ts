import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DashboardHomeComponent } from './pages/dashboard-home/dashboard-home.component';
import { TasksPageComponent } from './pages/tasks-page/tasks-page.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ApiDocsComponent } from './pages/api-docs/api-docs.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';

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
  { 
    path: 'reset-password', 
    component: ResetPasswordComponent,
    canActivate: [NoAuthGuard]
  },
  { 
    path: 'test-route', 
    component: ResetPasswordComponent 
  },
  
  // Protected routes with shared layout
  { 
    path: '', 
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardHomeComponent
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
      },
      {
        path: 'api-docs',
        component: ApiDocsComponent
      }
    ]
  },
  
  // Catch-all route
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      { enableTracing: false } // <-- Set enableTracing to false to disable router console logs
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }