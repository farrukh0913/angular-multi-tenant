import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ToastService } from 'src/app/services/toast.service';
import { ICompany, IUser } from 'src/app/constant/shared.interface';
import { PERMISSION_LIST } from 'src/app/constant/permission';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  userForm!: FormGroup;
  users: IUser[] = [];
  showForm: boolean = false;
  title: string = '';
  userId!: number | undefined;
  user: IUser = {} as IUser;
  isSuperAdmin: boolean = false;
  companies: ICompany[] = [];
  companyId!: string;
  isVisible: boolean = false;
  selectedCompany!: string;
  company_id!: string | null;
  companyName: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private router: Router,
    private sharedService: SharedService
  ) {
    this.isSuperAdmin = Boolean(localStorage.getItem('isSuperAdmin'));
  }

  async ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      roleId: [0, [Validators.required]],
      companyId: [0, [Validators.required]],
      companies: [[], Validators.required],
    });

    // getting company id from params
    this.company_id = this.route.snapshot.paramMap.get('id');
    if (this.company_id) {
      this.selectedCompany = this.company_id;
      this.getCompanyUsers(this.selectedCompany);
    }

    if (this.isSuperAdmin) {
      await this.apiService.get('companies').subscribe({
        next: (response) => {
          this.companies = [...response];
          this.companies.forEach((company) => {
            if (Number(company.id) === Number(this.company_id)) {
              this.companyName = company.name;
            }
          });
        },
        error: (err) => {
          this.toastService.showError('Error', err.error.error.message);
        },
      });
      if (!this.company_id) this.getUsers();
    }
  }

  getUsers() {
    this.apiService.get('users').subscribe({
      next: (response) => {
        this.users = response.filter((res: IUser) => !(res.id == 1));
      },
      error: (err) => {
        this.toastService.showError(err.error.error.message);
      },
    });
  }

  getCompanyUsers(Id?: string) {
    if (Id) this.companyId = Id;
    const companyId = this.isSuperAdmin ? this.companyId : this.user.companyId;

    this.apiService.get(`companyUsers/${companyId}`).subscribe({
      next: (response) => {
        this.users = response;
        this.userForm.patchValue({
          companyId: Number(companyId),
        });
      },
      error: (err) => {
        this.toastService.showError(err.error.error.message);
      },
    });
  }

  getPermissionNames(ids: number[]): string[] {
    return ids?.map(
      (id) => PERMISSION_LIST.find((p) => p.id === id)?.name || ''
    );
  }

  onSubmit() {
    if (this.companyName) {
      const companiesControl = this.userForm.get('companies');
      if (companiesControl) {
        const companies = companiesControl.value || [];
        if (!companies.includes(Number(this.company_id))) {
          companies.push(Number(this.company_id));
          companiesControl.setValue(companies);
        }
        companiesControl.clearValidators();
        companiesControl.updateValueAndValidity();
      }
    }

    if (this.title === 'Edit') {
      ['password', 'companyId', 'companies'].forEach((field) => {
        const control = this.userForm.get(field);
        control?.clearValidators();
        control?.updateValueAndValidity();
      });

      const nameControl = this.userForm.get('name');
      const emailControl = this.userForm.get('email');
      const roleIdControl = this.userForm.get('roleId');

      const controls = [nameControl, emailControl, roleIdControl];
      let hasError = false;

      controls.forEach((control) => {
        if (control?.invalid) {
          control.markAsTouched();
          hasError = true;
        }
      });

      if (hasError) {
        return;
      }
    } else {
      if (this.userForm.invalid) {
        this.userForm.markAllAsTouched();
        return;
      }
    }
    let payload: any;

    if (this.title === 'Edit') {
      payload = {
        name: this.userForm.get('name')?.value,
        email: this.userForm.get('email')?.value,
        roleId: Number(this.userForm.get('roleId')?.value),
      };
      this.apiService.patch('users', payload, { id: this.userId }).subscribe({
        next: () => {
          this.toastService.showSuccess('Company user updated successfully');
          this.title = '';
          this.userForm.reset();
          this.companyName ? this.getCompanyUsers() : this.getUsers();
          this.isVisible = false;
        },
        error: (err) => {
          this.toastService.showError('Error', err.error.error.message);
        },
      });
    } else {
      payload = { ...this.userForm.value };
      payload.roleId = Number(payload.roleId);
      const id = this.isSuperAdmin ? this.companyId : this.user.companyId;
      payload.companyId = Number(id);

      this.apiService.post('company-users', payload).subscribe({
        next: () => {
          this.toastService.showSuccess('Company user added successfully');
          this.userForm.reset();
          this.companyName ? this.getCompanyUsers() : this.getUsers();
          this.isVisible = false;
        },
        error: (err) => {
          this.toastService.showError('Error', err.error.error.message);
        },
      });
    }
  }

  async delete(id: number | undefined) {
    /** Confirmation */
    const resolved = await this.sharedService.deleteConfirm('user');
    if (resolved) {
      this.apiService.delete(`users/${id}`).subscribe({
        next: () => {
          this.toastService.showSuccess('User deleted successfully');
          this.companyName ? this.getCompanyUsers() : this.getUsers();
        },
        error: (err) => {
          this.toastService.showError('Error', err.error.error.message);
        },
      });
    }
  }

  updatePassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.toastService.showError('Passwords do not match');
      return;
    }

    const payload = {
      email: this.userForm.get('email')?.value,
      newPassword: this.newPassword,
    };

    this.apiService.patch('/users/password', payload).subscribe({
      next: () => {
        this.toastService.showSuccess('Password updated successfully');
        this.isVisible = false;
        this.userForm.reset();
        this.title = '';
      },
      error: (err) => {
        this.toastService.showError(err.error.error.message);
      },
    });
  }

  showDialog(title?: string, user?: any) {
    this.isVisible = true;
    this.userForm.patchValue({
      companyId: this.companyId,
    });
    this.userForm.get('companyId')?.disable();
    if (title) {
      this.title = title;
      this.showForm = true;
      this.userForm.patchValue({
        name: user.name,
        email: user.email,
        roleId: user.roleId,
        companyId: this.companyId,
      });
      this.userId = user.id;
    }
  }

  hideDialog() {
    this.isVisible = false;
    this.userForm.reset();
    this.title = '';
  }

  navigateTo(id: number | undefined) {
    const companyId = this.isSuperAdmin ? this.companyId : this.user.companyId;
    this.companyName
      ? this.router.navigate([`companies/${companyId}/user/${id}`])
      : this.router.navigate([`userInfo/${id}`]);
  }
}
