import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
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
  private destroy$ = new Subject<void>();

  constructor(private router: Router, private sharedService: SharedService) {
    this.isSuperAdmin = Boolean(localStorage.getItem('isSuperAdmin'));
    this.sharedService.getUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => this.user = user);

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
          if (this.companies.length === 1) this.navigateTo(this.companies[0].id);
        },
      });
    }
  }

  navigateTo(id: number | undefined) {
    this.router.navigate([`companies/${id}/user/${this.user.id}`]);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
