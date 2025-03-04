import {Component, Input, signal, ViewChild} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormGroup, FormGroupName,} from "@angular/forms";
import {NgIf, NgTemplateOutlet} from "@angular/common";
import {ModalService} from "../../components/modal/modal.service";
import {ModalTypes} from "../../components/modal/modal-types";
import {RolesService} from "../../services/roles.service";

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

  // Глобальні дозволи
  private globalPermissions = [
    { key: 'canChangeUserRoles',  value: 'Can change user roles', },
    { key: 'canViewReports',  value: 'Can view reports', },
    { key: 'canExport',  value: 'Can export data', },
    { key: 'canEditOwnProfile',  value: 'Can edit own profile', },
  ];
  globalPermissionsKeys: string[] = [];
  globalPermissionsValues: string[] = [];

  // Сторінки
  private pageModules = [
    { key: "Dashboard", value: "Dashboard" },
    { key: "Supplier",  value: "Supplier" },
    { key: "PartManagement",  value: "Part Management" },
    { key: "Users",  value: "Users" },
  ];
  pageModulesKeys: string[] = [];
  pageModulesValues: string[] = [];
  // Дозволи на сторінці (модуля)
  private defaultPermissions = [
    { key: "view",  value: "view", },
    { key: "create",  value: "create", },
    { key: "update",  value: "update", },
    { key: "delete",  value: "delete", }
  ];
  defaultPermissionsKeys: string[] = [];
  defaultPermissionsValues: string[] = [];

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
    this.defaultPermissions.forEach((data)=>{
          this.defaultPermissionsKeys.push(data.key);
          this.defaultPermissionsValues.push(data.value);
        }
    );
    this.globalPermissions.forEach((data)=>{
          this.globalPermissionsKeys.push(data.key);
          this.globalPermissionsValues.push(data.value);
        }
    );
    this.pageModules.forEach((data)=>{
          this.pageModulesKeys.push(data.key);
          this.pageModulesValues.push(data.value);
        }
    );
    // Додаємо динамічно дозволи для кожного модуля
    this.pageModulesKeys.forEach(pageModule => {
      (this.rolesForm.get('permissions') as FormGroup).addControl(pageModule, this.fb.group(Object.fromEntries(
          this.defaultPermissionsKeys.map(key => [key, [false]])
      )));
    });

    if (!this.data) {
      return
    }
    this.initForm(this.data);
  }
  ngOnDestroy() {}
}
