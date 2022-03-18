import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private _loading = new BehaviorSubject<boolean>(false);

  public readonly loading$ = this._loading.asObservable();

  constructor() {}

  show() {
    console.log('show=>');
    this._loading.next(true);
  }

  hide() {
    console.log('hide=>');
    this._loading.next(false);
  }

  // setIsDisplay(isDisplay: boolean) {
  //   console.log('setIsDisplay=>', isDisplay);

  //   this.isDisplaySubject.next(isDisplay);

  // }
  // getIsDisplay() {
  //   return this.isDisplaySubject;
  // }
}
