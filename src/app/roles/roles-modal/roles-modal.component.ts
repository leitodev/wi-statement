import {Component, Input, signal} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormGroup, AbstractControl, FormControl} from "@angular/forms";
import {NgIf, NgTemplateOutlet} from "@angular/common";
import {ModalService} from "../../components/modal/modal.service";
import {ModalTypes} from "../../components/modal/modal-types";
import {GlobalPermissions} from "../enums/global-permissions";
import {PageModules} from "../enums/page-modules";
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

  GlobalPermissionsArray = Object.values(GlobalPermissions); // Глобальні дозволи
  PageModulesArray = Object.values(PageModules); // Сторінки
  DefaultPremissionsArray = ["view", "create", "update", "delete"]; // Дозволи на сторінці

  constructor(
      private fb: FormBuilder,
      private modal: ModalService,
      private rolesService: RolesService,
  ) {}

  close() {
    this.modal.closeModal();
  };

  deleteRole(id: string){
    let result = confirm('DELETE ROLE ' + id +'?');
    if(result) this.rolesService.delete(id).subscribe();
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
    this.PageModulesArray.forEach(pageModule => {
      (this.rolesForm.get('permissions') as FormGroup).addControl(pageModule, this.fb.group({
        view: [false],
        create: [false],
        update: [false],
        delete: [false]
      }));
    });

    if (!this.data) {
      return
    }
    this.initForm(this.data);
  }
  ngOnDestroy() {}
  // setStatus(status: any) {
  //   return this.userStatuses.find(data => data.name === status);
  // }
  // selectStatus(data: any) {
  //   this.rolesForm.patchValue({status: data.name})
  // };
}
