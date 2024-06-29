import {Component, TemplateRef} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {ModalService} from "../components/modal/modal.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [ModalService]
})
export class HomeComponent {
  constructor(private modalService: ModalService) {}

  openModal(modalTemplate: TemplateRef<any>) {
    this.modalService
        .open(modalTemplate, { size: 'lg', title: 'Foo' })
        .subscribe((action: any) => {
          console.log('modalAction', action);
        });
  }
}
