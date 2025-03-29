import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {environment} from "../../environments/environment";
import {ReleaseNotesComponent} from "../release-notes/release-notes.component";

@Component({
  selector: 'app-home',
  standalone: true,
    imports: [RouterLink, RouterLinkActive, ReleaseNotesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: []
})
export class HomeComponent {
  envName = environment.production ? 'Production' : 'Development';
  constructor() {}

}
