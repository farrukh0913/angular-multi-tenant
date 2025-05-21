import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { UsersComponent } from './components/users/users.component';
import { CompaniesComponent } from './components/companies/companies.component';
import { HomeComponent } from './components/home/home.component';
import { LayoutComponent } from './components/layout/layout.component';
import { MainInformationComponent } from './components/main-information/main-information.component';
import { DepartmentsComponent } from './components/departments/departments.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
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
      { path: 'departments', component: DepartmentsComponent },
      { path: 'companies/:id/users', component: UsersComponent },
      {
        path: 'companies/:companyId/user/:id',
        component: MainInformationComponent,
      },
      { path: '**', redirectTo: 'home' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
