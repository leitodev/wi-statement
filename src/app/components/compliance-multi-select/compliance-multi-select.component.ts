import {Component, Input} from '@angular/core';
import {complianceStatus} from "../../config/status-config";
import {DropdownComponent} from "../dropdown/dropdown.component";
import {FormsModule} from "@angular/forms";
import {ScrollDispatcher} from "@angular/cdk/scrolling";

export interface IComplianceInputData {
    id: string | number,
    title: string,
    status: {
        name: string,
        id: number
    },
}

interface IComplianceMultiSelectOptions {
    id: string,
    title: string,
    status: {
        name: string,
        id: number
    },
    visible: boolean,
    selected: boolean,
}

@Component({
  selector: 'app-compliance-multi-select',
  standalone: true,
    imports: [
        DropdownComponent,
        FormsModule
    ],
  templateUrl: './compliance-multi-select.component.html',
  styleUrl: './compliance-multi-select.component.scss'
})
export class ComplianceMultiSelectComponent {

    protected readonly statuses = complianceStatus;
    complianceMultiData: IComplianceMultiSelectOptions[] = [];
    searchedCompliance = '';
    isSearchModeActive = true;

    @Input() set complianceData(value: IComplianceInputData[]) {
        this.complianceMultiData = value.map((item: any) => {
            return {
                id: item.id,
                title: item.title,
                status: item.status,
                visible: true,
                selected: item.selected ? true : false,
            }
        });
    }

    constructor() {}

    getComplianceMultiData() {
        return [...this.complianceMultiData];
    }

    selectStatus(status: any, idx: number) {
        this.complianceMultiData[idx].status = status;
    }

    clearComplianceSearch() {
        this.isSearchModeActive = true;
        this.searchedCompliance = '';
        this.complianceMultiData.forEach((item: any) => {
            item.visible = true;
        })
    }
    searchCompliance(search: string) {
        if (!search) {
            return
        }

        this.isSearchModeActive = false;
        this.complianceMultiData.forEach((compliance: any) => {
            compliance.visible = false;
            if (compliance.title.includes(search) || compliance.title.toLowerCase().includes(search.toLowerCase())) {
                compliance.visible = true;
            }
        });
    }

    toggleCompliance(e: Event, idx: any) {
        this.complianceMultiData[idx].selected = (e.target as HTMLInputElement).checked;
    }

    onScroll(event: Event): void {
        console.log('scrollEvent MULTI', event);
    }
}
