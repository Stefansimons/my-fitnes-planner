import { IToast } from './../components/toast/toast.component';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private _toastSource = new Subject<IToast>();
  toastData: IToast;
  constructor() {}

  get toastSourceSubject$() {
    return this._toastSource.asObservable();
  }
  show(title: string, message: string) {
    const toast: IToast = {
      title: title,
      message: message,
    };

    this._toastSource.next(toast);
  }
  // hide(toast:IToast) {
  //   this._toastSource.next(false);
  // }
}
