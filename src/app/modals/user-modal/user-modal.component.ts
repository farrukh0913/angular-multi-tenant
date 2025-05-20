import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Company } from 'src/app/constant/shared.interface';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss'],
})
export class UserModalComponent {
  userDialog: boolean = false;
  userForm!: FormGroup;
  companies: any[] = [];
  companyName!: string | null;
  isSuperAdmin: boolean = false;
  user: any;
  users: any[] = [];
  companyId!: string;
  userId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.userDialog = true;
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
      this.apiService.getCompanies().subscribe(
        (response) => {
          console.log(response);
          this.companies = [{ name: 'Select Company', value: '' }, ...response];
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

  getCompanyUsers(event?: Event) {
    if (event) {
      this.companyId = (event.target as HTMLSelectElement)?.value;
    }

    const id = this.isSuperAdmin ? this.companyId : this.user.companyId;

    this.apiService.getCompanyUsers(Number(id)).subscribe(
      (response) => {
        this.users = response;
        this.userForm.patchValue({
          companyId: Number(id),
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
    payload.roleId = Number(payload.roleId);
    const id = this.isSuperAdmin ? this.companyId : this.user.companyId;
    payload.companyId = Number(id);
    if (true) {
      payload.id = this.userId;
      this.apiService.updateCompanyUser(payload).subscribe(
        (response) => {
          this.messageService.add({
            key: 'tst',
            severity: 'success',
            summary: 'Success',
            detail: 'Company user updated successfully',
          });
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
  }

  hideDialog() {
    this.userDialog = false;
    this.router.navigate(['/companies']);
  }
}
