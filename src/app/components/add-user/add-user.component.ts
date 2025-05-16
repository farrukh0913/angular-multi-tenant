import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent {
  userForm!: FormGroup;
  users: any[] = [];
  showForm: boolean = false;
  title: string = '';
  userId!: number;
  user: any;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      roleId: [0, [Validators.required]],
      companyId: [0, [Validators.required]],
    });
    this.getUsers();
  }

  getUsers() {
    this.apiService.getUsers().subscribe(
      (response) => {
        this.users = response;
        this.userForm.patchValue({
          companyId: this.user.companyId,
        });
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

  onSubmit() {
    if (this.userForm.invalid) {
      return;
    }
    const payload = { ...this.userForm.value };
    console.log(payload);
    console.log(payload.companyId);
    payload.roleId = Number(payload.roleId);
    payload.companyId = Number(this.user.companyId);
    if (this.title === 'Edit') {
      payload.id = this.userId;
      this.apiService.updateCompanyUser(payload).subscribe(
        (response) => {
          this.messageService.add({
            key: 'tst',
            severity: 'success',
            summary: 'Success',
            detail: 'Company user updated successfully',
          });
          this.title = '';
          this.userForm.reset();
          this.showForm = false;
        },
        (error) => {
          this.messageService.add({
            key: 'tst',
            severity: 'warn',
            summary: 'Warning',
            detail: 'Error updating company user',
          });
        }
      );
    } else {
      this.apiService.addCompanyUser(payload).subscribe(
        (response) => {
          this.messageService.add({
            key: 'tst',
            severity: 'success',
            summary: 'Success',
            detail: 'Company user added successfully',
          });
          this.userForm.reset();
          this.showForm = false;
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
    }
    setTimeout(() => {
      this.getUsers();
    }, 3000);
  }

  edit(title: string, user: any) {
    this.title = title;
    this.showForm = true;
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      password: user.password,
      roleId: user.roleId,
      companyId: user.companyId,
    });
    this.userId = user.id;
  }

  delete(id: number) {
    this.apiService.deleteCompanyUser(id).subscribe(
      (response) => {
        this.messageService.add({
          key: 'tst',
          severity: 'success',
          summary: 'Success',
          detail: 'Company user deleted successfully',
        });
        this.getUsers();
      },
      (error) => {
        this.messageService.add({
          key: 'tst',
          severity: 'warn',
          summary: 'Warning',
          detail: 'Error deleting company user',
        });
      }
    );
  }

  toggleForm() {
    this.showForm = !this.showForm;
    this.userForm.get('companyId')?.disable();
  }
}
