import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UtilitiesService {
  private showLiSubject = new BehaviorSubject<boolean>(false);
  showLi$ = this.showLiSubject.asObservable();

  constructor() {}

  showLi() {
    this.showLiSubject.next(true);
  }

  hideLi() {
    this.showLiSubject.next(false);
  }
}
