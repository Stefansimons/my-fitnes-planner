import { ToastService } from './../../services/toast.service';
import { Observable } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';

export interface IToast {
  title: string;
  message: string;
}
@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
})
export class ToastComponent implements OnInit, OnDestroy {
  toast: IToast;
  isShowToast: boolean = false;
  private _subsink = new SubSink();
  constructor(private ts: ToastService) {}

  ngOnInit(): void {
    const toastSub = this.ts.toastSourceSubject$.subscribe((data) => {
      this.isShowToast = true;
      this.toast = data;

      // Close toast after 5 sec
      setTimeout(() => {
        this.isShowToast = false;
      }, 5000);
    });

    this._subsink.add(toastSub);
  }
  /**
   *
   */
  close() {
    this.isShowToast = false;
  }

  ngOnDestroy(): void {
    this._subsink.unsubscribe();
  }
}
