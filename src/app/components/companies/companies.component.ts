import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Company } from 'src/app/constant/shared.interface';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
})
export class CompaniesComponent {
  companies: any[] = [];
  isVisible: boolean = false;
  companyForm!: FormGroup;
  company: Company = { name: '' };
  companyId!: number;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private messageService: MessageService,
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

  delete(id: number) {
    this.apiService.deleteCompany(id).subscribe({
      next: () => {
        this.messageService.add({
          key: 'tst',
          severity: 'success',
          summary: 'Success',
          detail: 'Company deleted successfully',
        });
        this.getCompanies();
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

  showDialog(id?: number, companyName?: string) {
    this.isVisible = true;
    if (id)
      this.companyId = id;
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
          this.messageService.add({
            key: 'tst',
            severity: 'success',
            summary: 'Success',
            detail: 'Company updated successfully',
          });
          this.getCompanies();
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
      this.apiService.addCompany(payload).subscribe({
        next: () => {
          this.messageService.add({
            key: 'tst',
            severity: 'success',
            summary: 'Success',
            detail: 'Company added successfully',
          });
          this.getCompanies();
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

  hideDialog() {
    this.isVisible = false;
  }

  navigateTo(id: number) {
    this.router.navigate([`users/${id}`]);
  }
}
