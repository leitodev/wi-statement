import {
  Component, effect, ElementRef,
  EventEmitter, HostListener,
  input,
  Input,
  OnInit,
  Output, ViewChild, ViewContainerRef,
} from '@angular/core';
import {CommonModule, NgIf} from "@angular/common";
import {ConfigStorageService} from "../../services/config-storage.service";
import {DDPortalManagerService} from "../../services/dd-portal-manager.service";

export interface IFieldSortData {
  sortBy: string;
  sortOrder: string;
}
export enum CellColor {
  delete = '#FFC7C2', // red
  update = '#F4F3CD', // yellow
  create = '#CDF4D3', // green
}

@Component({
  selector: 'wi-table',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './wi-table.component.html',
  styleUrl: './wi-table.component.scss'
})
export class WiTableComponent implements OnInit {
  currentPage = 1;
  tablePages: Array<{ id: number, value: number }> = [];
  data: any[] = []; // why? because have problem with type of tableData signal input
  isTableSettingActive = false;
  fieldSort: IFieldSortData = {
    sortBy: '',
    sortOrder: 'asc'
  };

  defaultTableConfig: any;
  tableConfig : any;
  @Input('tableConfigData') set tableConfigData(value: object) {
    this.tableConfig = value;
    this.defaultTableConfig = structuredClone(value);
  }

  tableData = input.required();
  totalPages = input(1);
  @Output() tableEvent = new EventEmitter();
  @ViewChild('trigger') trigger!: ElementRef;
  @ViewChild('dropdownTemplate') dropdownTemplate!: any;

  constructor(
    private ddPortalManagerService: DDPortalManagerService, private viewContainerRef: ViewContainerRef,
    private configStorageService: ConfigStorageService) {
    effect(() => {
      this.data = this.tableData() as any[];
      // re-generate pagination
      this.tablePages = Array.from({ length: this.totalPages() }, (_, i) => ({ id: i + 1, value: i + 1 }));
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Close dropdown if clicked outside
    if (!this.isTableSettingActive) {
      return;
    }

    const target = event.target as HTMLElement;
    if (!target.closest('.settingsDropdown') && !target.closest('.settingsTrigger')) {
      this.isTableSettingActive = false;
      this.closeOverlay();
    }
  }

  closeOverlay() {
    this.ddPortalManagerService.detach();
  }

  ngOnInit() {
    const settings = this.configStorageService.getTableSettings(this.tableConfig.tableName);
    this.applyTableSettings(settings);
  }

  applyTableSettings(settings: any) {
    // TODO need better implementation for store table settings
    if (settings) {
      for (let i = 0; i < settings.cells.length; i++) {
        for (let j = 0; j < this.tableConfig.cells.length; j++) {
          if (this.tableConfig.cells[j].name === settings.cells[i].name) {
            this.tableConfig.cells[j].visible = settings.cells[i].visible;
            break;
          }
        }
      }
    }

  }

  sortByField(field: any){

    if (!field.sort) {
      return;
    }

    if (this.fieldSort && this.fieldSort.sortBy === field.value) {
      this.fieldSort.sortOrder = this.fieldSort.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.fieldSort = {
        sortBy: field.value,
        sortOrder: 'asc'
      }
    }

    this.tableEvent.emit({eventName:'applySort', data: this.fieldSort });
  };

  tableRowCLick(rowItem: any){
    //this.tableEvent.emit({eventName:'tableRowCLick', data: rowItem });
  };

  fieldClick(fieldName: string, cellValue: string, cellData: any) {
    this.tableEvent.emit({
      eventName:'tableFieldClick',
      fieldName: fieldName,
      cellValue,
      cellData
    });
  }

  tableRowEditBtn(rowItem: any, event: Event){
    event.stopPropagation();
    this.tableEvent.emit({eventName:'tableRowEditBtn', data: rowItem });
  };

  toggleSettings() {
    this.isTableSettingActive = !this.isTableSettingActive;
    this.ddPortalManagerService.managePortal(this.trigger, this.dropdownTemplate, this.viewContainerRef);
  }

  changeCellVisibility(cell: any) {
    cell.visible = !cell.visible;
  }

  saveSettings() {
    this.isTableSettingActive = false;
    this.configStorageService.setTableSettings(this.tableConfig);
    this.ddPortalManagerService.detach();
  }

  resetSettings() {
    this.isTableSettingActive = false;
    this.configStorageService.resetTableSettings(this.tableConfig.tableName);
    this.applyTableSettings(this.defaultTableConfig)
    this.ddPortalManagerService.detach();
  }
  prevPage() {
    if (this.currentPage && this.currentPage != 1) {
      this.changePage(this.currentPage - 1);
    }
  }
  nextPage() {
    if (this.currentPage < this.totalPages()) {
      this.changePage(this.currentPage + 1);
    }
  }
  changePage(value: number){
    this.currentPage = value;
    this.tableEvent.emit({eventName:'changePage',  data: this.currentPage });
  }

  trackByFn(index: number, item: any): any {
    return item.parentID + '-' + index;  // Combines parentID with index to ensure uniqueness
  }

  getCellColor(type: string): string {
    if (type in CellColor) {
      return CellColor[type as keyof typeof CellColor];
    }
    return 'transparent';
  }

  protected readonly console = console;
  protected readonly CellColor = CellColor;
}
