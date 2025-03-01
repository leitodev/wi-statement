import {Component, Input, signal, ViewChild} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormGroup, FormGroupName,} from "@angular/forms";
import {NgIf, NgTemplateOutlet} from "@angular/common";
import {ModalService} from "../../components/modal/modal.service";
import {ModalTypes} from "../../components/modal/modal-types";
import {GlobalPermissions} from "../enums/global-permissions";
import {PageModules} from "../enums/page-modules";
import {RolesService} from "../../services/roles.service";
import {DefaultPermissions} from "../enums/default-permissions";

@Component({
  selector: 'app-roles-modal',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgTemplateOutlet,
    ReactiveFormsModule
  ],
  templateUrl: './roles-modal.component.html',
  styleUrl: './roles-modal.component.scss'
})
export class RolesModalComponent {
  @Input() data?: any = null;
  @ViewChild(FormGroupName) formGroupNameDirective!: FormGroupName;
  public tabActive = 'General';
  currentID = signal(null);
  oldParentID = null; // need for back if we wanna change parent
  parentSearch = '';
  isParentChosen: any = false;

  rolesForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    description: [''],
    globalPermissions: this.fb.group({
      canChangeUserRoles: [false],
      canViewReports: [false],
      canExport: [false],
      canEditOwnProfile: [false]
    }),
    permissions: this.fb.group({})  // Пустий об'єкт для дозволів кожного модуля
  });
  consoleLogFormData(){
    console.log(this.rolesForm.value);
  }

  // Глобальні дозволи
  GlobalPermissionsKeys = Object.keys(GlobalPermissions);
  GlobalPermissionsValues = Object.values(GlobalPermissions);
  // Сторінки
  PageModulesKeys = Object.keys(PageModules);
  PageModulesValues = Object.values(PageModules);
  // Дозволи на сторінці (модуля)
  DefaultPermissionsKeys = Object.keys(DefaultPermissions);
  DefaultPermissionsValues = Object.values(DefaultPermissions);

  constructor(
      private fb: FormBuilder,
      private modal: ModalService,
      private rolesService: RolesService,
  ) {}

  checkAllInGroupName(groupName: string, subGroupName?: string) {
    let group: FormGroup | null = null;
    if(subGroupName){
      group = this.rolesForm.get(`permissions.${subGroupName}`) as FormGroup;
    }
    else {
      group = this.rolesForm.get(groupName) as FormGroup;
    }
    if(group){
      let groupValues = group.value;
      let isGroupIncludesFalse = Object.values(groupValues).includes(false);
      Object.keys(groupValues).forEach(key => {
        group?.get(key)?.setValue(isGroupIncludesFalse);
      })
    }
  }

  close() {
    this.modal.closeModal();
  };

  deleteRole(){
    let modalEvent = ModalTypes.DELETE;
    // Tab General Data
    this.modal.submitModal({
      isParentChosen: this.isParentChosen,
      oldParentID: this.oldParentID,
      id: this.data?._id ? this.data._id : null,
      form: this.rolesForm.getRawValue()
    }, modalEvent);
  };

  submitModal() {
    let modalEvent = ModalTypes.NEW;

    if(this.currentID()) {
      modalEvent = ModalTypes.UPDATE;
    }
    // Tab General Data
    this.modal.submitModal({
      isParentChosen: this.isParentChosen,
      oldParentID: this.oldParentID,
      id: this.data?._id ? this.data._id : null,
      form: this.rolesForm.getRawValue()
    }, modalEvent);
    this.rolesForm.markAllAsTouched();
  };

  changeModalComponent(componentData: any, event: Event) {
    event.stopPropagation();
    this.rerenderAllData(componentData);
  };

  rerenderAllData(data: any) {
    this.parentSearch = '';
    this.initForm(data);
    this.data = data;
    this.tabActive = 'General';
  };

  initForm(data: any) {
    this.currentID.set(data._id);

    if (data) {
      this.rolesForm.patchValue({
        name: data.name,
        description: data.description,
        globalPermissions: data.globalPermissions,
        permissions: data.permissions,
      });
    }
  };
  ngOnInit() {
    // Додаємо динамічно дозволи для кожного модуля
    this.PageModulesKeys.forEach(pageModule => {
      (this.rolesForm.get('permissions') as FormGroup).addControl(pageModule, this.fb.group(Object.fromEntries(
          this.DefaultPermissionsKeys.map(key => [key, [false]])
      )));
    });

    if (!this.data) {
      return
    }
    this.initForm(this.data);
  }
  ngOnDestroy() {}
}
