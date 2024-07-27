import {Component, TemplateRef} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {ModalService} from "../components/modal/modal.service";
import {ProductModalComponent} from "../statements/part-management/product-modal/product-modal.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ProductModalComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [ModalService]
})
export class HomeComponent {
  constructor(private modalService: ModalService) {}

    showComp1 = false;

  openModal(modalTemplate: TemplateRef<any>) {
    this.modalService
        .open(modalTemplate, {
          data: {
            name: "Leito Hardy"
          },
          size: 'lg',
          title: 'Foo'
        })
        .subscribe((action: any) => {
          console.log('modalAction', action);
        });
  }

    toggleShowComponent() {
        this.showComp1 = !this.showComp1;
    }
}
