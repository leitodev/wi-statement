import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule, NgIf} from "@angular/common";
import {ConfigStorageService} from "../../services/config-storage.service";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'wi-table',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './wi-table.component.html',
  styleUrl: './wi-table.component.scss'
})
export class WiTableComponent implements OnInit {
  currentPage = 1;
  totalPages = 10;
  limit = 10;
  tablePages: any[] = [];

  isTableSettingActive = false;

  @Input('tableConfigData') tableConfig: any = null;
  @Input() data: any = null;
  @Output() tableEvent = new EventEmitter();

  constructor(private configStorageService: ConfigStorageService) {}

  ngOnInit() {
    this.totalPages = this.tableConfig.paginator.totalPages
    this.currentPage = this.tableConfig.paginator.currentPage;
    this.limit = this.tableConfig.limit;
    this.tablePages = Array.from({ length: this.totalPages }, (_, i) => ({ id: i + 1, value: i + 1 }));
    const settings = this.configStorageService.getTableSettings(this.tableConfig.tableName);

    if (settings) {
      this.tableConfig = settings;
    }
  }

  tableRowCLick(rowItem: any){
    this.tableEvent.emit({eventName:'tableRowCLick', data: rowItem });
  };

  tableRowEditBtn(rowItem: any, event: Event){
    event.stopPropagation();
    this.tableEvent.emit({eventName:'tableRowEditBtn', data: rowItem });
  };

  toggleSettings() {
    this.isTableSettingActive = !this.isTableSettingActive;
  }

  changeCellVisibility(cell: any) {
    cell.visible = !cell.visible;
  }

  saveSettings() {
    this.isTableSettingActive = false;
    this.configStorageService.setTableSettings(this.tableConfig);
  }

  resetSettings() {
    this.isTableSettingActive = false;
    this.configStorageService.resetTableSettings(this.tableConfig.tableName);
  }
  prevPage() {
    if (this.currentPage && this.currentPage != 1) {
      this.changePage(this.currentPage - 1);
    }
  }
  nextPage() {
    if (this.currentPage < this.totalPages) {
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

}
