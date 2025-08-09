import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CarSearchComponent } from './components/car-search/car-search.component';
import { CarDetailsComponent } from './components/car-details/car-details.component';
import { BookingComponent } from './components/booking/booking.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ManagerDashboardComponent } from './components/manager-dashboard/manager-dashboard.component';
import { FavoritesPageComponent } from './components/favorites-page/favorites-page.component';
import { EmailTestComponent } from './components/email-test/email-test.component';
import { BookingConfirmationComponent } from './components/booking-confirmation/booking-confirmation.component';
import { CarComparisonComponent } from './components/car-comparison/car-comparison.component';
import { MaintenanceComponent } from './components/maintenance/maintenance.component';
import { FinancialComponent } from './components/financial/financial.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { ManagerGuard } from './guards/manager.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'cars', component: CarSearchComponent },
  { path: 'cars/:id', component: CarDetailsComponent },
  { path: 'compare', component: CarComparisonComponent },
  { path: 'maintenance', component: MaintenanceComponent, canActivate: [AuthGuard] },
  { path: 'financial', component: FinancialComponent, canActivate: [AuthGuard] },
  { path: 'favorites', component: FavoritesPageComponent, canActivate: [AuthGuard] },
  { path: 'bookings', component: BookingComponent, canActivate: [AuthGuard] },
  { path: 'settings', loadComponent: () => import('./components/settings/settings.component').then(m => m.SettingsComponent), canActivate: [AuthGuard] },
  { path: 'profile', loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent), canActivate: [AuthGuard] },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'admin/email-test', component: EmailTestComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'admin/booking-confirmation', component: BookingConfirmationComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'manager/booking-confirmation', component: BookingConfirmationComponent, canActivate: [AuthGuard, ManagerGuard] },
  { path: 'manager/dashboard/:branchId', component: ManagerDashboardComponent, canActivate: [AuthGuard, ManagerGuard] },
  { path: '**', redirectTo: '/home' }
];

