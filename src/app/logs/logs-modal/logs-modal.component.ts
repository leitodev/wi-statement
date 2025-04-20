import {Component, Input} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgTemplateOutlet} from "@angular/common";
import {ModalService} from "../../components/modal/modal.service";
import {LogDataComponent} from "../log-data/log-data.component";

@Component({
  selector: 'app-logs-modal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgTemplateOutlet,
    LogDataComponent,
  ],
  templateUrl: './logs-modal.component.html',
  styleUrl: './logs-modal.component.scss'
})
export class LogsModalComponent {
  @Input() logsTree: { before: Array<any>, after: Array<any>, afterDiff: Array<any>, beforeDiff: Array<any> } = {
    before: [],
    after: [],
    afterDiff: [],
    beforeDiff: []
  };
  @Input() data: any;
  public tabActive = 'All';
  isParentChosen: any = false;

  constructor(
      private modal: ModalService,
  ) {}

  close() {
    this.modal.closeModal();
  };

  ngOnInit() {
    if (!this.logsTree) {
      return
    }
  }
}