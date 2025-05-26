import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IUser } from 'src/app/constant/shared.interface';
import { ApiService } from 'src/app/services/api.service';
import { SharedService } from 'src/app/services/shared.service';

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

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private sharedService: SharedService
  ) {
    const userId = this.route.snapshot.paramMap.get('id');
    this.companyId = this.route.snapshot.paramMap.get('companyId');
    this.isSuperAdmin = Boolean(localStorage.getItem('isSuperAdmin'));

    if (userId && this.companyId) {
      this.apiService.get(`users/${userId}`).subscribe((res: any) => {
        this.user = [res];
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
    } else if (userId && !this.companyId) {
      this.apiService.get(`users/${userId}`).subscribe((res: any) => {
        this.user = [res];
        this.permissions = this.user[0].privileges;
      });
    }
  }

  ngOnInit() {
    this.sharedService.showLi();
  }
}
