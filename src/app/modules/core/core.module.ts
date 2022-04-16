import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Interceptor } from './auth/interceptor';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  exports: [HomeComponent],
  declarations: [HomeComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true,
    },
  ],
})
export class CoreModule {}
