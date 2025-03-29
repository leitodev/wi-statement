import {Component, OnInit} from '@angular/core';
import {Supplier, SupplierService} from "../../services/supplier.service";
import {map} from "rxjs";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  suppliers = this.supplierService.get({limit: 9999999999}).pipe(map(res => res.data.suppliers
  ));

  constructor(private supplierService: SupplierService) {
  }

  ngOnInit() {
    this.suppliers.subscribe(data => {
      console.log('data', data)
    })
  }
}
