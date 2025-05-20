import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ToastService } from 'src/app/services/toast.service';
import { ICompany, IUser } from 'src/app/constant/shared.interface';

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

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private toastService: ToastService
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
        next: (response) => {
          this.companies = [{ name: 'Select Company', value: '' }, ...response];
        },
        error: (err) => {
          this.toastService.showError('Error', err);
        },
      });
    }
    // getting company id from params
    const company_id = this.route.snapshot.paramMap.get('id');
    if (company_id) {
      this.selectedCompany = company_id;
      this.getCompanyUsers(this.selectedCompany);
    }
  }

  getCompanyUsers(Id?: string) {
    if (Id) this.companyId = Id;
    const id = this.isSuperAdmin ? this.companyId : this.user.companyId;

    this.apiService.getCompanyUsers(Number(id)).subscribe({
      next: (response) => {
        this.users = response;
        this.userForm.patchValue({
          companyId: Number(id),
        });
      },
      error: (err) => {
        this.toastService.showError('Error', err);
      },
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
          this.toastService.showSuccess('Company user updated successfully');
          this.title = '';
          this.userForm.reset();
          this.getCompanyUsers();
          this.isVisible = false;
        },
        error: (err) => {
          this.toastService.showError('Error', err);
        },
      });
    } else {
      this.apiService.addCompanyUser(payload).subscribe({
        next: () => {
          this.toastService.showSuccess('Company user added successfully');
          this.userForm.reset();
          this.getCompanyUsers();
          this.isVisible = false;
        },
        error: (err) => {
          this.toastService.showError('Error', err);
        },
      });
    }
  }

  delete(id: number | undefined) {
    const companyId = this.isSuperAdmin ? this.companyId : this.user.companyId;
    this.apiService.deleteCompanyUser(id, Number(companyId)).subscribe({
      next: () => {
        this.toastService.showSuccess('Company user deleted successfully');
        this.getCompanyUsers();
      },
      error: (err) => {
        this.toastService.showError('Error', err);
      },
    });
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
        companyId: user.companyId,
      });
      this.userId = user.id;
    }
  }

  hideDialog() {
    this.isVisible = false;
    this.userForm.reset();
    this.title = '';
  }
}
