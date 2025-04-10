import {Component, Input, output, OutputEmitterRef} from '@angular/core';
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {DropdownMultiComponent} from "../../components/dropdown-multi/dropdown-multi.component";
import {map, Observable} from "rxjs";
import {UsersService} from "../../services/users.service";
import {userLocaleList, userStatusList} from "../users-modal/users-modal.component";

@Component({
  selector: 'app-users-filter',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DropdownMultiComponent,
  ],
  templateUrl: './users-filter.component.html',
  styleUrl: './users-filter.component.scss'
})
export class UsersFilterComponent {
  @Input() set userRoleList(value: {_id: string, name: string}[]) {
    this.userRoles = value.map(({_id, name}, index)=>{
      return {id: index+1, name: name};
    });
  }

  appliedFilter:OutputEmitterRef<any> = output();
  isFilterApplied = false;

  userStatuses = userStatusList;
  userRoles: {id: number; name: string}[] = [];
  userLocales = userLocaleList;

  usersList$!: Observable<{ id: string; name: string; }[]>;
  form = this.fb.group({
    name: [''],
    surname: [''],
    email: [''],
    role: [''], // dropdown
    status: [''], // dropdown
    locale: [''], // dropdown
  });

  constructor(
      public fb: FormBuilder,
      private usersService: UsersService,) {
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
    this.appliedFilter.emit(this.form.getRawValue());
  }
}
