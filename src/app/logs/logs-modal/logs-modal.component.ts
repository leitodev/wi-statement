import {Component, Input, signal, ViewChild} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormGroup, FormGroupName,} from "@angular/forms";
import {JsonPipe, KeyValuePipe, NgClass, NgIf, NgStyle, NgTemplateOutlet, UpperCasePipe} from "@angular/common";
import {ModalService} from "../../components/modal/modal.service";
import {ModalTypes} from "../../components/modal/modal-types";
import {CellColor} from "../../components/wi-table/wi-table.component";
import {LogDataComponent} from "../log-data/log-data.component";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";

@Component({
  selector: 'app-logs-modal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgTemplateOutlet,
    LogDataComponent,
    JsonPipe,
    NgClass,
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
  currentID = signal(null);
  oldParentID = null; // need for back if we wanna change parent
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
    console.log(this.logsTree);
  }
}