import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
      this.apiService.get('companies').subscribe({
        next: (response) => {
          this.companies = [{ name: 'Select Company', value: '' }, ...response];
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
    }
    // getting company id from params
    this.company_id = this.route.snapshot.paramMap.get('id');
    if (this.company_id) {
      this.selectedCompany = this.company_id;
      this.getCompanyUsers(this.selectedCompany);
    }
  }

  getCompanyUsers(Id?: string) {
    if (Id) this.companyId = Id;
    const id = this.isSuperAdmin ? this.companyId : this.user.companyId;

    this.apiService.get('company-users', { id: Number(id) }).subscribe({
      next: (response) => {
        this.users = response;
        this.userForm.patchValue({
          companyId: Number(id),
        });
      },
      error: (err) => {
        this.toastService.showError('Error', err.error.error.message);
      },
    });
  }

  getPermissionNames(ids: number[]): string[] {
    return ids.map(
      (id) => PERMISSION_LIST.find((p) => p.id === id)?.name || ''
    );
  }

  onSubmit() {
    if (this.userForm.invalid) {
      return;
    }
    const payload = { ...this.userForm.value };
    payload.roleId = Number(payload.roleId);
    const id = this.isSuperAdmin ? this.companyId : this.user.companyId;
    const companyId = Number(id);
    this.userForm.value.companyId = Number(companyId);
    if (this.title === 'Edit') {
      payload.id = this.userId;
      this.apiService.patch(`company-users/${companyId}`, payload).subscribe({
        next: () => {
          this.toastService.showSuccess('Company user updated successfully');
          this.title = '';
          this.userForm.reset();
          this.getCompanyUsers();
          this.isVisible = false;
        },
        error: (err) => {
          this.toastService.showError('Error', err.error.error.message);
        },
      });
    } else {
      this.apiService
        .post('company-users', payload, { company_id: companyId })
        .subscribe({
          next: () => {
            this.toastService.showSuccess('Company user added successfully');
            this.userForm.reset();
            this.getCompanyUsers();
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
      const companyId = this.isSuperAdmin
        ? this.companyId
        : this.user.companyId;
      this.apiService
        .delete('company-users', { id: id, company_id: Number(companyId) })
        .subscribe({
          next: () => {
            this.toastService.showSuccess('Company user deleted successfully');
            this.getCompanyUsers();
          },
          error: (err) => {
            this.toastService.showError('Error', err.error.error.message);
          },
        });
    }
  }

  showDialog(title?: string, user?: any) {
    if (this.isSuperAdmin && !this.companyId) {
      this.toastService.showError('Please select a company');
      return;
    }
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
        password: user.password,
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
    this.router.navigate([`companies/${companyId}/user/${id}`]);
  }
}
