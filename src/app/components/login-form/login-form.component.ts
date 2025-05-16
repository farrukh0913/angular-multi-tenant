import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {
  loginForm!: FormGroup;
  showCompany: boolean = false;
  showUser: boolean = false;
  write_permission: boolean = true;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private route: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
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
          localStorage.setItem(
            'token',
            '7xOzv7gZOC7cWE89FdD9wQOEwtHjYZiMyJZeEaMMThdWTJSBsKKbQU5FJ0emdrlp'
          );
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
