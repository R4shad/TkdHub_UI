import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthService } from '../core/services/auth.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  declarations: [HeaderComponent, NavbarComponent],
  imports: [CommonModule, NgbModule],
  exports: [HeaderComponent, NavbarComponent],
  providers: [AuthService],
})
export class SharedModule {}
