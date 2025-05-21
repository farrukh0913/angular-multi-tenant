import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ToastService } from 'src/app/services/toast.service';
import { ICompany } from 'src/app/constant/shared.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm!: FormGroup;
  showCompany: boolean = false;
  showUser: boolean = false;
  write_permission: boolean = true;
  companies: ICompany[] = [];
  isAdmin: boolean = false;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private route: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      companyId: [0, [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  relatedCompanies() {
    if (this.loginForm?.value?.email) {
      this.apiService.post("relatedCompanies", {email: this.loginForm.value.email}).subscribe({
        next: response => {
          this.companies = response;
        },
        error: err => {
          this.toastService.showError(err.error.error.message);
          this.companies = [];
        }
      });
    }
  }

  onSubmit() {
    if (this.loginForm.value.email === 'sadmin') {
      delete this.loginForm.value.companyId;
      this.apiService.post("user/login", this.loginForm.value).subscribe({
        next: response => {
          this.toastService.showSuccess('Login Successfull');
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response));
          localStorage.setItem('isSuperAdmin', 'true');
          this.route.navigate(['/home']);
        },
        error: err => {
          this.toastService.showError(err.error.error.message);
        }
      });
    } else {
      if (this.loginForm.value.companyId === 0) {
        this.toastService.showError('Please select a company');
        return;
      }
      if (this.loginForm.valid) {
        const payload = { ...this.loginForm.value };
        this.apiService.post("company-users/login", payload).subscribe({
          next: response => {
            this.toastService.showSuccess('Login Successfull');
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response));
            this.route.navigate(['/home']);
          },
          error: err => {
            this.toastService.showError(err.error.error.message);
          }
        });
      } else {
        console.log('Form is invalid');
      }
    }
  }

  inputValue(event: any) {
    event.target.value === 'sadmin'
      ? (this.isAdmin = true)
      : (this.isAdmin = false);
  }
}
