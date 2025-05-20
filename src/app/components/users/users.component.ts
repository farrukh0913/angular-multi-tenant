import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})

export class UsersComponent {
  userForm!: FormGroup;
  users: any[] = [];
  showForm: boolean = false;
  title: string = '';
  userId!: number;
  user: any;
  isSuperAdmin: boolean = false;
  companies: any[] = [];
  companyId!: string;
  isVisible: boolean = false;
  selectedCompany!: string;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {
    this.isSuperAdmin = Boolean(localStorage.getItem('isSuperAdmin'));
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      roleId: [0, [Validators.required]],
      companyId: [0, [Validators.required]],
    });
    if (!this.isSuperAdmin) this.getCompanyUsers();
    if (this.isSuperAdmin) {
      this.apiService.getCompanies().subscribe({
        next: response => {
          this.companies = [{ name: 'Select Company', value: '' }, ...response];
        },
        error: err => {
          this.messageService.add({
            key: 'tst',
            severity: 'error',
            summary: 'Error',
            detail: err,
          });
        }
      });
    }
    // getting company id from params
    const company_id = this.route.snapshot.paramMap.get("id");
    if (company_id) {
      this.selectedCompany = company_id;
      this.getCompanyUsers(this.selectedCompany);
    }
  }

  getCompanyUsers(Id?: string) {
    if (Id) this.companyId = Id;
    const id = this.isSuperAdmin ? this.companyId : this.user.companyId;
    console.log('id: ', id);

    this.apiService.getCompanyUsers(Number(id)).subscribe({
      next: response => {
        this.users = response;
        this.userForm.patchValue({
          companyId: Number(id),
        });
      },
      error: err => {
        this.messageService.add({
          key: 'tst',
          severity: 'error',
          summary: 'Error',
          detail: err,
        });
      }
    });
  }

  onSubmit() {
    if (this.userForm.invalid) {
      return;
    }
    const payload = { ...this.userForm.value };
    payload.roleId = Number(payload.roleId);
    const id = this.isSuperAdmin ? this.companyId : this.user.companyId;
    payload.companyId = Number(id);
    if (this.title === 'Edit') {
      payload.id = this.userId;
      this.apiService.updateCompanyUser(payload).subscribe({
        next: () => {
          this.messageService.add({
            key: 'tst',
            severity: 'success',
            summary: 'Success',
            detail: 'Company user updated successfully',
          });
          this.title = '';
          this.userForm.reset();
          this.getCompanyUsers();
          this.isVisible = false;
        },
        error: err => {
          this.messageService.add({
            key: 'tst',
            severity: 'error',
            summary: 'Error',
            detail: err,
          });
        }
      });
    } else {
      this.apiService.addCompanyUser(payload).subscribe({
        next: () => {
          this.messageService.add({
            key: 'tst',
            severity: 'success',
            summary: 'Success',
            detail: 'Company user added successfully',
          });
          this.userForm.reset();
          this.getCompanyUsers();
          this.isVisible = false;
        },
        error: err => {
          this.messageService.add({
            key: 'tst',
            severity: 'error',
            summary: 'Error',
            detail: err,
          });
        }
      });
    }
  }

  delete(id: number) {
    const companyId = this.isSuperAdmin ? this.companyId : this.user.companyId;
    this.apiService.deleteCompanyUser(id, Number(companyId)).subscribe({
      next: () => {
        this.messageService.add({
          key: 'tst',
          severity: 'success',
          summary: 'Success',
          detail: 'Company user deleted successfully',
        });
        this.getCompanyUsers();
      },
      error: err => {
        this.messageService.add({
          key: 'tst',
          severity: 'error',
          summary: 'Error',
          detail: err,
        });
      }
    });
  }

  showDialog(title?: string, user?: any) {
    if (this.isSuperAdmin && !this.companyId) {
      this.messageService.add({
        key: 'tst',
        severity: 'info',
        summary: 'Info',
        detail: 'Please select a company',
      });
      return;
    }
    this.isVisible = true;
    this.userForm.get('companyId')?.disable();
    if (title) {
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
  }

  hideDialog() {
    this.isVisible = false;
  }
}
