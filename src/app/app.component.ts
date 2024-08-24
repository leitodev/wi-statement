import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {CommonModule} from "@angular/common";
import {ModalService} from "./components/modal/modal.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [ModalService]
})
export class AppComponent {
  constructor() {}
  title = 'wi-statement';
}
