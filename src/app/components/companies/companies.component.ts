import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ICompany } from 'src/app/constant/shared.interface';
import { ApiService } from 'src/app/services/api.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
})
export class CompaniesComponent {
  companies: ICompany[] = [];
  isVisible: boolean = false;
  companyForm!: FormGroup;
  companyId!: number;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getCompanies();
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  getCompanies() {
    this.apiService.getCompanies().subscribe({
      next: (response) => {
        this.companies = response;
      },
      error: (err) => {
        this.toastService.showError('Error', err);
      },
    });
  }

  delete(id: number | undefined) {
    if (id) {
      this.apiService.deleteCompany(id).subscribe({
        next: () => {
          this.toastService.showSuccess('Company deleted successfully');
          this.getCompanies();
        },
        error: (err) => {
          this.toastService.showError('Error', err);
        },
      });
    }
  }

  showDialog(id?: number, companyName?: string) {
    this.isVisible = true;
    if (id) this.companyId = id;
    this.companyForm.get('name')?.setValue(companyName);
  }

  onSubmit() {
    if (this.companyForm.invalid) {
      return;
    }
    const payload = { ...this.companyForm.value };
    if (this.companyId) {
      this.apiService.updateCompany(this.companyId, payload).subscribe({
        next: () => {
          this.toastService.showSuccess('Company updated successfully');
          this.getCompanies();
          this.isVisible = false;
          this.companyId = 0;
        },
        error: (err) => {
          this.toastService.showError('Error', err);
        },
      });
    } else {
      this.apiService.addCompany(payload).subscribe({
        next: () => {
          this.toastService.showSuccess('Company added successfully');
          this.getCompanies();
          this.isVisible = false;
          this.companyId = 0;
        },
        error: (err) => {
          this.toastService.showError('Error', err);
        },
      });
    }
  }

  hideDialog() {
    this.isVisible = false;
    this.companyId = 0;
  }

  navigateTo(id: number | undefined) {
    this.router.navigate([`companies/${id}/users`]);
  }
}
