import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },

  // Páginas de busca e catálogo com lazy loading
  {
    path: 'search',
    loadComponent: () => import('./pages/search/search.component').then(m => m.SearchComponent)
  },
  {
    path: 'materials',
    loadComponent: () => import('./pages/materials/materials.component').then(m => m.MaterialsComponent)
  },
  {
    path: 'material/:id',
    loadComponent: () => import('./pages/material-detail/material-detail.component').then(m => m.MaterialDetailComponent)
  },
  {
    path: 'materials/category/:category',
    loadComponent: () => import('./pages/materials-category/materials-category.component').then(m => m.MaterialsCategoryComponent)
  },
  {
    path: 'materials/type/:type',
    loadComponent: () => import('./pages/materials-type/materials-type.component').then(m => m.MaterialsTypeComponent)
  },

  // Páginas de empréstimos
  {
    path: 'loans',
    loadComponent: () => import('./pages/loans/loans.component').then(m => m.LoansComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'loans/new',
    loadComponent: () => import('./pages/loan-form/loan-form.component').then(m => m.LoanFormComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'loans/:id',
    loadComponent: () => import('./pages/loan-detail/loan-detail.component').then(m => m.LoanDetailComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'loans/:id/edit',
    loadComponent: () => import('./pages/loan-form/loan-form.component').then(m => m.LoanFormComponent),
    canActivate: [AuthGuard]
  },

  { path: '**', redirectTo: '' }
];
