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

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private route: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.apiService.post('user/login', this.loginForm.value).subscribe({
      next: (response) => {
        this.toastService.showSuccess('Login Successfull');
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response));
        if (response.id == 1 && response.email == 'sadmin')
          localStorage.setItem('isSuperAdmin', 'true');
        this.route.navigate(['/home']);
      },
      error: (err) => {
        this.toastService.showError('Error', err.error.error.message);
      },
    });
  }
}
