import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { UsersComponent } from './components/users/users.component';
import { CompaniesComponent } from './components/companies/companies.component';
import { HomeComponent } from './components/home/home.component';
import { LayoutComponent } from './components/layout/layout.component';
import { CompanyModalComponent } from './modals/company-modal/company-modal.component';
import { UserModalComponent } from './modals/user-modal/user-modal.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  // Protected routes inside layout
  {
    path: '',
    component: LayoutComponent, // use LayoutComponent instead of AppComponent
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'companies', component: CompaniesComponent },
      { path: 'users', component: UsersComponent },
      { path: 'company/:id/:name', component: CompanyModalComponent },
      { path: 'add-company', component: CompanyModalComponent },
      { path: 'user/:id', component: UserModalComponent },
      { path: 'add-user', component: UserModalComponent },
      { path: '**', redirectTo: 'home' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
