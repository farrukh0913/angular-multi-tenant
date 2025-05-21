import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser } from 'src/app/constant/shared.interface';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  isSuperAdmin: boolean = false;

  constructor(private apiService: ApiService, private route: ActivatedRoute) {
    this.isSuperAdmin = Boolean(localStorage.getItem('isSuperAdmin'));
  }

  ngOnInit() {}
}
