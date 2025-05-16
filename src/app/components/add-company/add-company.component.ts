import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss'],
})
export class AddCompanyComponent {
  customerForm!: FormGroup;
  companies: any[] = [];
  showForm: boolean = false;
  title: string = '';
  companyId!: number;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      // email: ['', [Validators.required, Validators.email]],
      // phone: ['', [Validators.required, Validators.pattern(/^\d{9,15}$/)]],
      // rate: [0, [Validators.required, Validators.min(0)]],
      // ssn: [
      //   '',
      //   [Validators.required, Validators.pattern(/^\d{3}-\d{2}-\d{4}$/)],
      // ],
      // rate_type: ['', Validators.required],
      // type: ['', Validators.required],
    });

    this.getCompanies();
  }

  onSubmit() {
    if (this.customerForm.invalid) {
      return;
    }
    const payload = { ...this.customerForm.value };
    if (this.title === 'Edit') {
      this.apiService.updateCompany(this.companyId, payload).subscribe(
        (response) => {
          this.messageService.add({
            key: 'tst',
            severity: 'success',
            summary: 'Success',
            detail: 'Company updated successfully',
          });
          this.customerForm.reset();
          this.showForm = false;
        },
        (error) => {
          this.messageService.add({
            key: 'tst',
            severity: 'warn',
            summary: 'Warning',
            detail: 'Error updating company',
          });
        }
      );
    } else {
      this.apiService.addCompany(payload).subscribe(
        (response) => {
          this.messageService.add({
            key: 'tst',
            severity: 'success',
            summary: 'Success',
            detail: 'Company added successfully',
          });
          this.customerForm.reset();
          this.showForm = false;
        },
        (error) => {
          this.messageService.add({
            key: 'tst',
            severity: 'warn',
            summary: 'Warning',
            detail: 'Error adding company',
          });
        }
      );
    }
    setTimeout(() => {
      this.getCompanies();
    }, 3000);
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

  edit(title: string, company: any) {
    this.title = title;
    this.showForm = true;
    this.customerForm.patchValue({
      name: company.name,
    });
    this.companyId = company.id;
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

  // Function to handle the form toggle
  toggleForm() {
    this.showForm = !this.showForm;
  }
}
