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

  constructor(private apiService: ApiService, private route: ActivatedRoute) {
    const userId = this.route.snapshot.paramMap.get('id');
    const companyId = this.route.snapshot.paramMap.get('companyId');
    if (userId && companyId) {
      this.apiService
        .get('company-users', { id: userId, company_id: Number(companyId) })
        .subscribe((data: IUser) => {
          this.user = [data];
          this.permissions = this.user[0].privileges;
        });
    }
  }

  ngOnInit() {}
}
