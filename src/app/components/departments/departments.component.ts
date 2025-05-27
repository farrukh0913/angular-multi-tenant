import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
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
  private destroy$ = new Subject<void>();

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
    this.sharedService.getUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => this.user = user);

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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
