import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IUser } from 'src/app/constant/shared.interface';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-main-information',
  templateUrl: './main-information.component.html',
  styleUrls: ['./main-information.component.scss'],
})
export class MainInformationComponent {
  user: IUser[] = [];
  permissions: number[] = [];
  companyName: string = '';
  isSuperAdmin: boolean = false;
  companyId!: string | null;

  constructor(private apiService: ApiService, private route: ActivatedRoute) {
    const userId = this.route.snapshot.paramMap.get('id');
    this.companyId = this.route.snapshot.paramMap.get('companyId');
    this.isSuperAdmin = Boolean(localStorage.getItem('isSuperAdmin'));

    if (userId && this.companyId) {
      this.apiService
        .get('company-users', {
          id: userId,
          company_id: Number(this.companyId),
        })
        .subscribe((data: IUser) => {
          this.user = [data];
          this.permissions = this.user[0].privileges;
        });

      this.apiService.get('companies').subscribe({
        next: (companies) => {
          const companyIdNum = this.companyId ? +this.companyId : null;
          const company =
            companies?.find(
              (c: { id: any }) => companyIdNum !== null && c.id === companyIdNum
            ) ?? null;
          this.companyName = company?.name;
        },
      });
    } else if (!this.isSuperAdmin) {
      const user: IUser = JSON.parse(localStorage.getItem('user') || '{}');
      const companyUserId = user.id;
      const companyId = user.companyId;
      this.companyId = String(user.companyId);
      this.apiService
        .get('company-users', {
          id: companyUserId,
          company_id: user.companyId,
        })
        .subscribe((data: IUser) => {
          this.user = [data];
          this.permissions = this.user[0].privileges;
        });

      this.apiService.get('companies').subscribe({
        next: (companies) => {
          const company =
            companies?.find((c: { id: any }) => c.id === +companyId) ?? null;
          this.companyName = company?.name;
        },
      });
    }
  }

  ngOnInit() {}
}
