import { ToastService } from './../../services/toast.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(private ts: ToastService) {}

  ngOnInit(): void {}
  showMessage() {
    this.ts.show('warning', 'Feature will be implemented');
  }
}
