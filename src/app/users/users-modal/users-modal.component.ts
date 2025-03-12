import {Component, Input, OnDestroy, OnInit, signal} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {ModalService} from "../../components/modal/modal.service";
import {DropdownComponent} from "../../components/dropdown/dropdown.component";
import {ModalTypes} from "../../components/modal/modal-types";
import {UserStatuses} from "../enums/user-statuses";
import {UserLocales} from "../enums/user-locales";
import {UserTimeZones} from "../enums/user-timezones";
import {dropDownComponentListFromEnum} from "../../utils/utils";

export const userStatusList = dropDownComponentListFromEnum(UserStatuses);
export const userLocaleList = dropDownComponentListFromEnum(UserLocales);
export const userTimeZoneList = dropDownComponentListFromEnum(UserTimeZones);

@Component({
    selector: 'app-users-modal',
    standalone: true,
    imports: [ReactiveFormsModule, FormsModule, CommonModule, DropdownComponent,],
    templateUrl: './users-modal.component.html',
    styleUrl: './users-modal.component.scss'
})

export class UsersModalComponent implements OnInit, OnDestroy {
    @Input() data?: any = null;
    @Input() rolesList: {_id: string, name: string}[] = [];
    public tabActive = 'General';
    currentID = signal(null);
    oldParentID = null; // need for back if we wanna change parent
    parentSearch = '';
    isParentChosen: any = false;
    usersForm = this.fb.group({
        password: ['', [Validators.required]],
        email: ['', [Validators.required]],
        name: ['', [Validators.required]],
        surname: ['', [Validators.required]],
        locale: [UserLocales.en],
        timezone: [UserTimeZones.UTC],
        avatarUrl: [null],
        status: [''],
        role: [this.rolesList[0] ? this.rolesList[0] : ''],
    });

    userStatuses = userStatusList;
    userRoles:{id: number, name: string}[] = [];
    userLocales = userLocaleList;
    userTimeZones = userTimeZoneList;

    constructor(
        private fb: FormBuilder,
        private modal: ModalService,
    ) {}

    close() {
        this.modal.closeModal();
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
            form: this.usersForm.getRawValue()
        }, modalEvent);
        this.usersForm.markAllAsTouched();
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
            this.usersForm.patchValue({
                password: data.password,
                email: data.email,
                name: data.name,
                surname: data.surname,
                locale: data.locale,
                timezone: data.timezone,
                avatarUrl: data.profile.avatarUrl,
                status: data.status,
                role: data.role,
            });
        }
    };
    ngOnInit() {
        this.userRoles = this.rolesList.map(({_id ,name}, index) => {
            return {id: index+1, name: name};
        });

        if (!this.data) {
            return
        }
        this.initForm(this.data);
    }
    ngOnDestroy() {}
    setStatus(status: any) {
        return this.userStatuses.find(data => data.name === status);
    }
    selectStatus(data: any) {
        this.usersForm.patchValue({status: data.name})
    };
    setRole(role: any) {
        return this.userRoles.find(data => data.name === role);
    }
    selectRole(data: any) {
        this.usersForm.patchValue({role: data.name})
    };
    setLocale(locale: any) {
        return this.userLocales.find(data => data.name === locale);
    }
    selectLocale(data: any) {
        this.usersForm.patchValue({locale: data.name})
    };
    setTimeZone(timezone: any) {
        return this.userTimeZones.find(data => data.name === timezone);
    }
    // todo: add changing timeZone
    selectTimeZone(data: any) {
        this.usersForm.patchValue({timezone: data.name})
    };
}