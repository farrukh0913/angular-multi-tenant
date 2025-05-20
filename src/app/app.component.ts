import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'frontend';

  constructor(private readonly router: Router) {}

  ngOnInit() {
    console.log(this.isLoginRoute);
    console.log("test");
  }

  get isLoginRoute(): boolean {
    return this.router.url === '/login'; // change '/login' as needed
  }
}
