import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MainContentComponent } from './components/main-content/main-content.component';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, MainContentComponent],
  imports: [CommonModule, RouterModule],
  exports: [HeaderComponent, FooterComponent, MainContentComponent],
})
export class SharedModule {}
