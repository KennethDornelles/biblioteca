import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SearchComponent } from './pages/search/search.component';
import { MaterialsComponent } from './pages/materials/materials.component';
import { MaterialDetailComponent } from './pages/material-detail/material-detail.component';
import { MaterialsCategoryComponent } from './pages/materials-category/materials-category.component';
import { MaterialsTypeComponent } from './pages/materials-type/materials-type.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

  // Páginas de busca e catálogo
  { path: 'search', component: SearchComponent },
  { path: 'materials', component: MaterialsComponent },
  { path: 'material/:id', component: MaterialDetailComponent },
  { path: 'materials/category/:category', component: MaterialsCategoryComponent },
  { path: 'materials/type/:type', component: MaterialsTypeComponent },

  { path: '**', redirectTo: '' }
];
