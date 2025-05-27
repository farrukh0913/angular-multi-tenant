import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICompany, IUser } from 'src/app/constant/shared.interface';
import { SharedService } from 'src/app/services/shared.service';

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
    private sharedService: SharedService
  ) {
    this.isSuperAdmin = Boolean(localStorage.getItem('isSuperAdmin'));
    this.route.queryParams.subscribe((params: any) => {
      this.department = params?.department || '';
    });
  }

  ngOnInit() {
    this.user = this.sharedService.getUser();
    if (!this.isSuperAdmin) {
      this.sharedService.getCompanies().subscribe({
        next: (response) => {
          const companies = response || [];
          companies.forEach((company: ICompany) => {
            if (Number(company.id) === Number(this.user.companyId)) {
              this.companyName = company.name;
            }
          });
        },
      });
    }
  }
}
