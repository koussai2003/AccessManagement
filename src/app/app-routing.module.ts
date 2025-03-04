import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent }, // The 'login' route must be mapped to the LoginComponent
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default redirect to 'login' page
  { path: '**', redirectTo: '/login' } // Handle unknown paths and redirect to 'login'
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
