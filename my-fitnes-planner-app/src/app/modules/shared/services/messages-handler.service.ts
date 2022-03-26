import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessagesHandlerService {
  constructor(private ts: ToastService) {}

  showMessages() {}
}
