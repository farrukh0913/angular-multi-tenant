import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Company } from 'src/app/constant/shared.interface';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-company-modal',
  templateUrl: './company-modal.component.html',
  styleUrls: ['./company-modal.component.scss'],
})
export class CompanyModalComponent {
  companyDialog: boolean = false;
  companyForm!: FormGroup;
  company: Company = { name: '' };
  companyId!: number;
  companyName!: string | null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.companyDialog = true;
  }

  ngOnInit() {
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
    });
    this.companyId = Number(this.route.snapshot.paramMap.get('id'));
    this.companyName = this.route.snapshot.paramMap.get('name');
    this.companyForm.get('name')?.setValue(this.companyName);
  }

  onSubmit() {
    if (this.companyForm.invalid) {
      return;
    }
    const payload = { ...this.companyForm.value };
    if (this.companyId) {
      this.apiService.updateCompany(this.companyId, payload).subscribe(
        (response) => {
          this.messageService.add({
            key: 'tst',
            severity: 'success',
            summary: 'Success',
            detail: 'Company updated successfully',
          });
          this.companyDialog = false;
          this.router.navigate(['/companies']);
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
          this.companyDialog = false;
          this.router.navigate(['/companies']);
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
  }

  hideDialog() {
    this.companyDialog = false;
    this.router.navigate(['/companies']);
  }
}
