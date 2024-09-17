import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigStorageService {

  constructor() { }

  setToken(token: string = '') {
    localStorage.setItem('token', token);
  }

  setTableSettings(tableSettings: any) {
    localStorage.setItem(tableSettings.tableName, JSON.stringify(tableSettings));
  }

  getTableSettings(tableName: string) {
    let config = localStorage.getItem(tableName);
    return config ? JSON.parse(config) : null;
  }

  resetTableSettings(tableName: string) {
    localStorage.removeItem(tableName);
  }
}
