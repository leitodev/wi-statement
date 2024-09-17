import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule, NgIf} from "@angular/common";
import {ConfigStorageService} from "../../services/config-storage.service";

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
    const settings = this.configStorageService.getTableSettings(this.tableConfig.tableName);
    if (settings) {
      this.tableConfig = settings;
    }

    this.currentPage = this.tableConfig.paginator.currentPage;
    this.totalPages = this.tableConfig.paginator.totalPages;
    this.limit = this.tableConfig.paginator.limit;
    this.tablePages = Array.from({ length: this.totalPages }, (_, i) => ({ id: i + 1, value: i + 1 }));
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

}
