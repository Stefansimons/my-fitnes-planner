import { SpinnerComponent } from './components/spinner/spinner.component';
import { MaterialModule } from './../../material/material.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastComponent } from './components/toast/toast.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    SpinnerComponent,
    ToastComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    OverlayModule,
    NgbModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SpinnerComponent,
    NgbModule,
    ToastComponent,
  ],
  entryComponents: [SpinnerComponent],
})
export class SharedModule {}
