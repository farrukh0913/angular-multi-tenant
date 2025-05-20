import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
})
export class CompaniesComponent {
  companies: any[] = [];

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getCompanies();
  }

  getCompanies() {
    this.apiService.getCompanies().subscribe(
      (response) => {
        this.companies = response;
        this.messageService.add({
          key: 'tst',
          severity: 'success',
          summary: 'Success',
          detail: 'Companies fetched successfully',
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

  delete(id: number) {
    this.apiService.deleteCompany(id).subscribe(
      (response) => {
        this.messageService.add({
          key: 'tst',
          severity: 'success',
          summary: 'Success',
          detail: 'Company deleted successfully',
        });
        this.getCompanies();
      },
      (error) => {
        this.messageService.add({
          key: 'tst',
          severity: 'warn',
          summary: 'Warning',
          detail: 'Error deleting companyy',
        });
      }
    );
  }

  navigateToCompany(id?: number, name?: string) {
    id
      ? this.router.navigate(['/company', id, name])
      : this.router.navigate(['/add-company']);
  }
}
