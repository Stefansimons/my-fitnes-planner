import { ToastService } from './../../services/toast.service';
import { Observable } from 'rxjs';
import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
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
  @Output() closeToastEvent = new EventEmitter<boolean>();
  @Input() toast: IToast;
  constructor(private ts: ToastService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  /**
   * Close toast
   */
  close() {
    this.closeToastEvent.emit(false);
  }
}
