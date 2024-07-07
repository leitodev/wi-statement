import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-ui-kit',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],
  templateUrl: './ui-kit.component.html',
  styleUrl: './ui-kit.component.scss'
})
export class UiKitComponent {

}
