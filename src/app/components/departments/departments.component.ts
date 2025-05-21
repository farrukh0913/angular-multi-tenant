import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ToastService } from 'src/app/services/toast.service';
import { IUser } from 'src/app/constant/shared.interface';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss'],
})
export class DepartmentsComponent {
  isSuperAdmin: boolean = false;
  companyName: string = '';
  department: string = '';
  user!: IUser;

  constructor(
    private route: ActivatedRoute,
    private toastService: ToastService,
    private router: Router,
    private apiService: ApiService
  ) {
    this.isSuperAdmin = Boolean(localStorage.getItem('isSuperAdmin'));
    this.route.queryParams.subscribe((params: any) => {
      this.department = params?.department || '';
    });
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!this.isSuperAdmin) {
      this.apiService.get('companies').subscribe({
        next: (response) => {
          const companies = response || [];
          companies.forEach((company: any) => {
            if (Number(company.id) === Number(this.user.companyId)) {
              this.companyName = company.name;
            }
          });
        },
        error: (err) => {
          this.toastService.showError('Error', err);
        },
      });
    }
  }
}
