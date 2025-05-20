import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { MessageService } from 'primeng/api';

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
  companies: any[] = [];
  isAdmin: boolean = false;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private route: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      companyId: [0, [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  relatedCompanies() {
    console.log('relatedCompanies');
    
    if (this.loginForm?.value?.email) {
      this.apiService.getRelatedCompanies(this.loginForm.value.email).subscribe(
        (response) => {
          this.companies = response;
        },
        (error) => {
          this.messageService.add({
            key: 'tst',
            severity: 'warn',
            summary: 'Warning',
            detail: 'Error fetching companies',
          });
        }
      );
    }
  }

  onSubmit() {
    if (this.loginForm.value.email === 'sadmin') {
      delete this.loginForm.value.companyId;
      this.apiService.userLogin(this.loginForm.value).subscribe((response) => {
        this.messageService.add({
          key: 'tst',
          severity: 'success',
          summary: 'Success',
          detail: 'Login Successfull',
        });
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response));
        localStorage.setItem('isSuperAdmin', 'true');
        this.route.navigate(['/home']);
      });
    } else {
      if (this.loginForm.valid) {
        const payload = { ...this.loginForm.value };
        this.apiService.login(payload).subscribe(
          (response) => {
            this.messageService.add({
              key: 'tst',
              severity: 'success',
              summary: 'Success',
              detail: 'Login Successfull',
            });
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response));
            this.route.navigate(['/home']);
          },
          (error) => {
            this.messageService.add({
              key: 'tst',
              severity: 'warn',
              summary: 'Warning',
              detail: error.error.error.message,
            });
          }
        );
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
