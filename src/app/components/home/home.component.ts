import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICompany, IUser } from 'src/app/constant/shared.interface';
import { ApiService } from 'src/app/services/api.service';
import { SharedService } from 'src/app/services/shared.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  isSuperAdmin: boolean = false;
  user: IUser = {} as IUser;
  companies: ICompany[] = [];

  constructor(
    private apiService: ApiService,
    private toastService: ToastService,
    private router: Router,
    private sharedService: SharedService
  ) {
    this.isSuperAdmin = Boolean(localStorage.getItem('isSuperAdmin'));
    if (!this.isSuperAdmin) {
      this.sharedService.hideLi();
    }
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!this.isSuperAdmin) {
      this.relatedCompanies();
    }
  }

  ngOnInit() {}

  relatedCompanies() {
    if (this.user.email) {
      this.apiService
        .post('relatedCompanies', { email: this.user.email })
        .subscribe({
          next: (response) => {
            this.companies = response;
          },
          error: (err) => {
            this.toastService.showError(err.error.error.message);
          },
        });
    }
  }

  navigateTo(id: number | undefined) {
    this.router.navigate([`companies/${id}/user/${this.user.id}`]);
    this.sharedService.showLi();
  }
}
