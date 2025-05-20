import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { ToastService } from 'src/services/toast.service';

@Component({
  selector: 'app-company-modal',
  templateUrl: './company-modal.component.html',
  styleUrls: ['./company-modal.component.scss'],
})
export class CompanyModalComponent {
  companyDialog: boolean = false;
  companyForm!: FormGroup;
  companyId!: number;
  companyName!: string | null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private toastService: ToastService,
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
          this.toastService.showSuccess('Company updated successfully');
          this.companyDialog = false;
          this.router.navigate(['/companies']);
        },
        (error) => {
          this.toastService.showError('Error', error);
        }
      );
    } else {
      this.apiService.addCompany(payload).subscribe(
        (response) => {
          this.toastService.showSuccess('Company added successfully');
          this.companyDialog = false;
          this.router.navigate(['/companies']);
        },
        (error) => {
          this.toastService.showError('Error', error);
        }
      );
    }
  }

  hideDialog() {
    this.companyDialog = false;
    this.router.navigate(['/companies']);
  }
}
