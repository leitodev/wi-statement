import { Component } from '@angular/core';
import {InputTextComponent} from "../components/input-text/input-text.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    InputTextComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  protected readonly console = console;
}
