import {Component, Input, signal, ViewChild} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormGroup, FormGroupName,} from "@angular/forms";
import {JsonPipe, KeyValuePipe, NgIf, NgStyle, NgTemplateOutlet, UpperCasePipe} from "@angular/common";
import {ModalService} from "../../components/modal/modal.service";
import {ModalTypes} from "../../components/modal/modal-types";
import {CellColor} from "../../components/wi-table/wi-table.component";
import {LogDataComponent} from "../log-data/log-data.component";

@Component({
  selector: 'app-logs-modal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgTemplateOutlet,
    LogDataComponent,
    UpperCasePipe
  ],
  templateUrl: './logs-modal.component.html',
  styleUrl: './logs-modal.component.scss'
})
export class LogsModalComponent {
  @Input() data?: any = null;
  @ViewChild(FormGroupName) formGroupNameDirective!: FormGroupName;
  public tabActive = 'All';
  currentID = signal(null);
  oldParentID = null; // need for back if we wanna change parent
  isParentChosen: any = false;

  constructor(
      private fb: FormBuilder,
      private modal: ModalService,
  ) {}

  close() {
    this.modal.closeModal();
  };

  ngOnInit() {
    if (!this.data) {
      return
    }
  }
}
