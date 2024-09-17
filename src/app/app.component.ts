import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {CommonModule} from "@angular/common";
import {ModalService} from "./components/modal/modal.service";
import {AuthService} from "./services/auth.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [ModalService]
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService) {}
  title = 'wi-statement';

  ngOnInit() {
    this.authService.checkToken().subscribe(res => {
      this.authService.currentUser.set(res.data);
    });
  }
}
