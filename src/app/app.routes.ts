import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AnnexComponent } from './annex/annex.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ApplicationPageComponent } from './application-page/application-page.component';
import { ManageApplicationsComponent } from './manage-applications/manage-applications.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { AuthGuard } from './auth.guard';
import { ViewRequestsComponent } from './view-requests/view-requests.component';
import { DemandesATraiterComponent } from './demandes-a-traiter/demandes-a-traiter.component';
import { RequestHistoryComponent } from './request-history/request-history.component';
import { ValidationHistoryComponent } from './validation-history/validation-history.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'annex', component: AnnexComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard], children: [
    { path: 'users', component: ManageUsersComponent }, // ✅ Loads Manage Users
    { path: 'applications', component: ManageApplicationsComponent } ,// ✅ Loads Manage Applications
    { path: 'Requests', component: ViewRequestsComponent}
  ]},
  { path: 'applications', component: ApplicationPageComponent },
  { path: 'demandes-a-traiter', component: DemandesATraiterComponent },
  { path: 'history', component: RequestHistoryComponent },
  { path: 'validationHistory', component: ValidationHistoryComponent  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
export class AppRoutingModule {}