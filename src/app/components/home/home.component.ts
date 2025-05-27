import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICompany, IUser } from 'src/app/constant/shared.interface';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  isSuperAdmin: boolean = false;
  user: IUser = {} as IUser;
  companies: ICompany[] = [];

  constructor(private router: Router, private sharedService: SharedService) {
    this.isSuperAdmin = Boolean(localStorage.getItem('isSuperAdmin'));
    if (!this.isSuperAdmin) {
      this.sharedService.hideLi();
    }
    this.user = this.sharedService.getUser();
    if (!this.isSuperAdmin) {
      this.getRelatedCompanies();
    }
  }

  ngOnInit() {}

  getRelatedCompanies() {
    if (this.user.email) {
      this.sharedService.getRelatedCompanies(this.user.email).subscribe({
        next: (response) => {
          this.companies = response;
        },
      });
    }
  }

  navigateTo(id: number | undefined) {
    this.router.navigate([`companies/${id}/user/${this.user.id}`]);
    this.sharedService.showLi();
  }
}
