import {Component, output, OutputEmitterRef} from '@angular/core';
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {DropdownMultiComponent} from "../../components/dropdown-multi/dropdown-multi.component";
import {AsyncPipe, NgIf} from "@angular/common";
import {complianceStatus, materialStatus} from "../../config/status-config";
import {map, Observable} from "rxjs";
import {SupplierService} from "../../services/supplier.service";
import {ToastrService} from "ngx-toastr";
import {MaterialService} from "../../services/material.service";
import {UsersService} from "../../services/users.service";
import {User} from "../../services/users.service";
import {dropDownComponentListFromEnum, userRoleList, userLocaleList, userStatusList, userTimeZoneList} from "../users-modal/users-modal.component";

@Component({
  selector: 'app-users-filter',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DropdownMultiComponent,
    AsyncPipe,
    NgIf
  ],
  templateUrl: './users-filter.component.html',
  styleUrl: './users-filter.component.scss'
})
export class UsersFilterComponent {
  appliedFilter:OutputEmitterRef<any> = output();
  isFilterApplied = false;

  userStatuses = userStatusList;
  userRoles = userRoleList;
  userLocales = userLocaleList;
  userTimeZones = userTimeZoneList;

  usersList$!: Observable<{ id: string; name: string; }[]>;
  form = this.fb.group({
    name: [''],
    surname: [''],
    email: [''],
    role: [''], // dropdown
    status: [''], // dropdown
    locale: [''], // dropdown
    // lastLoginAt: [''],
  });

  constructor(
      public fb: FormBuilder,
      private supplierService: SupplierService,
      private toastr: ToastrService,
      private materialService: MaterialService,
      private usersService: UsersService,) {
  }

  IsUsersValid() {
    const regulatoryCompliance = this.form.get('regulatoryCompliance')?.value;

    if (regulatoryCompliance) {
      return false;
    }
    return true;
  }

  ngOnInit() {
    this.usersList$ = this.usersService.getAll({}).pipe(
        map(result => result.data.users.map(item => ({
          id: item._id,
          name: item.name
        })))
    );
  }

  reset() {
    this.appliedFilter.emit(null);
    this.isFilterApplied = false;
    this.form.reset();
  }

  applyFilter() {
    this.isFilterApplied = true;
    if (this.IsUsersValid()) {
      this.appliedFilter.emit(this.form.getRawValue());
    } else {
      this.toastr.error('Fields "regulatoryCompliance" and "complianceStatus" can be used only in pairs!')
    }

  }
}
